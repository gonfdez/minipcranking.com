import { WebButlerDriver, URL } from "@gfs-studio/webbutler-js";
import TurndownService from "turndown";
import { JSDOM } from "jsdom";

const driver = new WebButlerDriver({
  browserServerURL: "http://localhost:3000/",
});

// Configurar turndown con opciones personalizadas
const turndownService = new TurndownService({
  headingStyle: "atx", // Use # style headings
  hr: "---", // Use --- for horizontal rules
  bulletListMarker: "-", // Use - for bullet lists
  codeBlockStyle: "fenced", // Use ```lang blocks for code
  emDelimiter: "_", // Use _ for emphasis
  strongDelimiter: "**", // Use ** for strong
});

// Función para limpiar el HTML antes de convertirlo a markdown
function cleanHtml(html: string): string {
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

    // Eliminar atributos de estilo inline
    const elementsWithStyle = document.querySelectorAll("[style]");
    elementsWithStyle.forEach((el) => el.removeAttribute("style"));

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

    // Devolver el HTML limpio
    return document.body ? document.body.innerHTML : "";
  } catch (error) {
    console.error("Error al limpiar HTML:", error);
    return html; // Devolver el HTML original si hay un error
  }
}

export async function getMarkdownFromURL(
  url: URL,
  brand: string
): Promise<string> {
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
      
      // Busca el primer elemento que exista
      for (const selector of mainSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerHTML.trim().length > 200) {
          return element.outerHTML;
        }
      }
      
      // Si no encuentra nada, devuelve el body completo
      return document.querySelector('body').outerHTML;
    }
    
    return getMainContent();
  `);

  const htmlString = scriptRes?.data?.return ?? null;

  // Limpiar el HTML antes de convertirlo a markdown
  let cleanedHtml = cleanHtml(htmlString);

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

  const fs = await import("fs/promises");
  const path = await import("path");

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
