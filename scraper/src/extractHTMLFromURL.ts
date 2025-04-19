import { WebButlerDriver, URL } from "@gfs-studio/webbutler-js";
import { JSDOM } from "jsdom";
import { generateAltTextAPI } from "./imageAltGenerator";
import { downloadImage, removeDownloadedFile } from "./downloadImg";
import path from "path";
import fs from "fs/promises";

const driver = new WebButlerDriver({
  browserServerURL: "http://localhost:3000/",
});

// Función para limpiar el HTML antes de convertirlo a markdown
async function cleanHtml(html: string): Promise<string> {
  if (!html) return "";

  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Eliminar todos los scripts
    const scripts = document.querySelectorAll("script");
    scripts.forEach((script) => script.parentNode?.removeChild(script));

    // Eliminar todos los estilos
    const styles = document.querySelectorAll("style");
    styles.forEach((style) => style.parentNode?.removeChild(style));

    // Eliminar todos los elementos link (CSS externos)
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => link.parentNode?.removeChild(link));

    // Eliminar etiquetas no deseadas (ajusta según necesites)
    const unwantedTags = ["iframe", "noscript", "svg", "canvas", "form"];
    unwantedTags.forEach((tag) => {
      const elements = document.querySelectorAll(tag);
      elements.forEach((el) => el.parentNode?.removeChild(el));
    });

    // Opcional: eliminar clases e IDs (puede ser útil si quieres un markdown más limpio)
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el) => {
      el.removeAttribute("class");
      el.removeAttribute("id");
      el.removeAttribute("style");
    });

    // Filtrar contenido de estructuras de navegación y footer comunes
    const navigationElements = [
      "nav",
      "header",
      "footer",
      ".nav",
      ".navigation",
      ".menu",
      ".footer",
      "#footer",
      "#nav",
      "#header",
    ];
    navigationElements.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => el.parentNode?.removeChild(el));
      } catch (e) {
        // Ignorar errores en selectores no válidos
      }
    });

    let imgs = Array.from(document.querySelectorAll("img"));
    console.log(`Founded ${imgs.length} images`);

    // Procesar solo imágenes grandes
    for (const imgElem of imgs) {
      try {
        let imgSrc = imgElem.getAttribute("src");
        if (!imgSrc || imgSrc.includes(".svg")) continue;

        if (imgSrc.startsWith("//")) imgSrc = "https:" + imgSrc;
        // const downloadRes = await downloadImage(imgSrc);
        // if (!downloadRes) continue;

        const imgAlt = await generateAltTextAPI(imgSrc);

        // await removeDownloadedFile(downloadRes.localPath);
        if (!imgAlt || imgAlt === "null") continue;

        imgElem.setAttribute("ia-generated-alt", imgAlt);
        console.log("SETTED ia-generated-alt: ", imgAlt);
      } catch (e) {
        console.error("Error generando alt de imagen");
        console.error(e);
      }
    }

    // Devolver el HTML limpio DESPUÉS de que todas las operaciones asíncronas hayan terminado
    return document.body ? document.body.innerHTML : "";
  } catch (error) {
    console.error("Error al limpiar HTML:", error);
    return html; // Devolver el HTML original si hay un error
  }
}

export async function getHTMLFromURL(url: URL, brand: string): Promise<string> {
  await driver.navigate(url);
  await driver.waitForPageLoad(3000);
  await driver.sleep(3000);

  // Extraer el contenido principal en lugar de todo el body
  // Esto intenta extraer solo el contenido principal de la página
  const scriptRes = await driver.executeScript(`
    function getMainContent() {
      // Intenta encontrar el contenido principal usando selectores comunes
      const mainSelectors = [
        'main',
        'article',
        '#content', 
        '.content', 
        '.main-content',
        '.post-content',
        '.article-content',
        '.entry-content'
      ];
      
      // Función para limpiar el contenido eliminando imágenes pequeñas y SVGs
      function limpiarContenido(element) {
        // Crear una copia del elemento para no modificar el original
        const tempElement = element.cloneNode(true);
        
        // Eliminar todos los SVGs
        const svgs = tempElement.querySelectorAll('svg');
        svgs.forEach(svg => svg.remove());
        
        // Eliminar solo imágenes que estamos seguros que son pequeñas
        const imgs = tempElement.querySelectorAll('img');
        imgs.forEach(img => {
          // Verificar el tamaño mediante atributos explícitos
          const width = parseInt(img.getAttribute('width') || '0');
          const height = parseInt(img.getAttribute('height') || '0');
          
          // Verificar el tamaño mediante estilo inline
          const styleWidth = img.style.width ? parseInt(img.style.width) : 0;
          const styleHeight = img.style.height ? parseInt(img.style.height) : 0;
          
          // Verificar clases que pueden indicar que es un ícono
          const classes = img.className.toLowerCase();
          const isIcon = classes.includes('icon') || 
                        classes.includes('logo') || 
                        classes.includes('avatar') ||
                        classes.includes('thumbnail');
          
          // Verificar URLs que sugieren iconos
          const src = img.getAttribute('src') || '';
          const isIconUrl = src.includes('icon') || 
                           src.includes('logo') || 
                           src.includes('avatar');
                           
          // Solo eliminar si estamos seguros de que es una imagen pequeña o un ícono
          if ((width > 0 && width < 100 && height > 0 && height < 100) || 
              (styleWidth > 0 && styleWidth < 100 && styleHeight > 0 && styleHeight < 100) ||
              (isIcon && (width < 150 || styleWidth < 150)) ||
              isIconUrl) {
            img.remove();
          }
        });
        
        return tempElement.outerHTML;
      }
      
      // Busca el primer elemento que exista
      for (const selector of mainSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerHTML.trim().length > 200) {
          return limpiarContenido(element);
        }
      }
      
      // Si no encuentra nada, devuelve el body completo limpio
      return limpiarContenido(document.querySelector('body'));
    }
    
    return getMainContent();
`);

  const htmlString = scriptRes?.data?.return ?? null;

  // Limpiar el HTML antes de convertirlo a markdown
  let cleanedHtml = await cleanHtml(htmlString);

  // Convertir a markdown
  // const markdown = turndownService.turndown(cleanedHtml);

  // Eliminar líneas vacías consecutivas para tener un markdown más limpio
  cleanedHtml = cleanedHtml
    .replace(/\n{3,}/g, "\n\n") // Reemplazar 3 o más saltos de línea con 2
    .replace(/\n+$/g, "") // Eliminar saltos de línea al final
    .replace(/\t/g, "") // Eliminar tabulaciones
    .replace(/  +/g, " ") // Eliminar espacios múltiples
    .replace(/\n/g, " ");

  // console.log(`Markdown from ${url} generated!`);

  // Guardar el markdown en una carpeta con nombre de la marca y npmbre del markdown la url
  const fileName =
    url
      .replace(/\/+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .replace(/^_+|_+$/g, "") || "index";

  const outputDir = path.join(process.cwd(), "output", brand);
  const outputFile = path.join(outputDir, `${fileName}.html`);

  try {
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputFile, cleanedHtml, "utf8");
    console.log(`Markdown saved to ${outputFile}`);
  } catch (error) {
    console.error("Error saving markdown:", error);
  }
  return cleanedHtml;
}
