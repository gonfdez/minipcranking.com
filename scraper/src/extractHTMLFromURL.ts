import { WebButlerDriver, URL } from "@gfs-studio/webbutler-js";
import { JSDOM } from "jsdom";
import { generateAltTextAPI } from "./imageAltGenerator";
import { downloadImage, removeDownloadedFile } from "./downloadImg";
import path from "path";
import fs from "fs/promises";
import fssync from "fs";

const driver = new WebButlerDriver({
  browserServerURL: "http://localhost:3000/",
});

// Función para limpiar el HTML antes de convertirlo a markdown
async function cleanHtml(html: string): Promise<string> {
  if (!html) return "";

  try {
    // Eliminar comentarios HTML antes de crear el DOM
    html = html.replace(/<!--[\s\S]*?-->/g, "");

    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Eliminar etiquetas no deseadas (ajusta según necesites)
    const unwantedElements = [
      "head",
      "iframe",
      "noscript",
      "svg",
      "canvas",
      "form",
      "script",
      "style",
      "link",
      "nav",
      "header",
      "footer",
      ".nav",
      ".navigation",
      ".footer",
      "#footer",
      "#nav",
      "#header",
      "#navigation",
      ".ad",
      "#ad",
      ".advertisement",
      "#advertisement",
      ".popup",
      "#popup",
      ".popup-ad",
      "#popup-ad",
    ];

    // Eliminar elementos no deseados
    unwantedElements.forEach((tag) => {
      const elements = document.querySelectorAll(tag);
      elements.forEach((el) => el.parentNode?.removeChild(el));
    });

    console.log("Unwanted elements removed", document.body.innerHTML.length);

    // Opcional: eliminar clases e IDs (puede ser útil si quieres un markdown más limpio)
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el) => {
      el.removeAttribute("class");
      el.removeAttribute("id");
      el.removeAttribute("style");
    });

    function removeEmptyElements(element: Element) {
      if (!element || !element.children) return;

      // Procesar primero los hijos para evitar eliminar elementos con hijos importantes
      Array.from(element.children).forEach((child) => {
        removeEmptyElements(child);
      });

      // Después de procesar todos los hijos, verificar si el elemento actual está vacío
      if (
        element.children.length === 0 &&
        element.parentNode &&
        element.tagName.toLowerCase() !== "img" &&
        element.tagName.toLowerCase() !== "body" &&
        (!element.textContent || element.textContent === "")
      ) {
        element.parentNode.removeChild(element);
      }
    }

    // Aplicar la limpieza de elementos vacíos
    removeEmptyElements(document.body);

    let imgs = Array.from(document.querySelectorAll("img"));
    console.log("IMGS detected in DOM: ", imgs.length);
    const validImgs = [];
    for (const imgElem of imgs) {
      let imgSrc = imgElem.getAttribute("src");
      if (
        !imgSrc ||
        imgSrc.includes(".svg") ||
        imgSrc.includes(".gif") ||
        imgSrc.includes("data:")
      ) {
        imgElem.parentNode?.removeChild(imgElem);
        continue;
      }

      // Normalizar URL
      if (imgSrc.startsWith("//")) imgSrc = "https:" + imgSrc;

      // Eliminar parámetros de consulta
      const cleanImgSrc = imgSrc.split("?")[0].split("#")[0];

      // Actualizar el atributo src con la URL limpia
      imgElem.setAttribute("src", cleanImgSrc);

      const downloadRes = await downloadImage(cleanImgSrc);
      if (!downloadRes) continue;
      await removeDownloadedFile(downloadRes.localPath);
      if (downloadRes.size.width < 400 && downloadRes.size.height < 400)
        continue;
      validImgs.push({ imgElem, imgSrc: cleanImgSrc });
    }

    // Procesar solo imágenes grandes
    console.log("IMGS to process: ", validImgs.length);
    for (const { imgElem, imgSrc } of validImgs) {
      try {
        const imgAlt = await generateAltTextAPI(imgSrc);

        if (!imgAlt || imgAlt === "null") continue;

        imgElem.setAttribute("ia-generated-alt", imgAlt);
        console.log("SETTED ia-generated-alt: ", imgAlt);
      } catch (e) {
        console.error("Error generando alt de imagen");
        console.error(e);
      }
    }

    // OPTIMIZACIÓN FINAL: Eliminar whitespace excesivo
    const bodyHtml = document.body ? document.body.innerHTML : "";
    // Reemplazar múltiples espacios en blanco por uno solo
    const cleanedHtml = bodyHtml
      .replace(/\s{2,}/g, " ")
      .replace(/>\s+</g, "><")
      .trim();

    // Eliminar cualquier comentario HTML que pudiera haber quedado en el resultado final
    const noCommentsHtml = cleanedHtml.replace(/<!--[\s\S]*?-->/g, "");

    return noCommentsHtml;
  } catch (error) {
    console.error("Error al limpiar HTML:", error);
    return html; // Devolver el HTML original si hay un error
  }
}

export function checkIfAlreadyProcessed(url: URL, brand: string): boolean {
  // Checkquear que no lo hemos procesado ya
  const fileName =
    url
      .replace(/\/+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .replace(/^_+|_+$/g, "") || "index";
  const outputDir = path.join(process.cwd(), "output", brand);
  const outputFile = path.join(outputDir, `${fileName}.html`);
  if (fssync.existsSync(outputFile)) {
    return true;
  }
  return false;
}

export async function getHTMLFromURL(url: URL, brand: string): Promise<string> {
  await driver.navigate(url);

  // Esperar a que el DOM esté completamente cargado
  await driver.sleep(5000);

  // Ejecutar un script para obtener el HTML completo
  const scriptRes = await driver.executeScript(
    `return document.querySelector('body').outerHTML;`
  );

  const htmlString = scriptRes?.data?.return ?? null;

  // Limpiar el HTML antes de convertirlo a markdown
  let cleanedHtml = await cleanHtml(htmlString);

  // Eliminar líneas vacías consecutivas para tener un markdown más limpio
  cleanedHtml = cleanedHtml
    .replace(/\n{3,}/g, "\n\n") // Reemplazar 3 o más saltos de línea con 2
    .replace(/\n+$/g, "") // Eliminar saltos de línea al final
    .replace(/\t/g, "") // Eliminar tabulaciones
    .replace(/  +/g, " ") // Eliminar espacios múltiples
    .replace(/\n/g, " ");

  // Guardar el html en una carpeta con nombre de la marca y npmbre del markdown la url
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
    console.log(
      `Markdown saved to ${outputFile}\nCharacters: ${cleanedHtml.length}`
    );
  } catch (error) {
    console.error("Error saving markdown:", error);
  }
  return cleanedHtml;
}
