import * as dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

// Cargar las variables desde el archivo .env
dotenv.config();

// Configuración para turndown
import TurndownService from "turndown";
import { JSDOM } from "jsdom";

import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

if (
  process.env.SUPABASE_URL === undefined ||
  process.env.SUPABASE_ANON_KEY === undefined
) {
  throw new Error(
    "Supabase URL or Anon Key is not defined in environment variables."
  );
}

const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

import { readFileSync } from "fs";
import { join } from "path";

const urlsFilePath = join(__dirname, "urls.txt");
const urlsFileContent = readFileSync(urlsFilePath, "utf-8");
const urls = urlsFileContent
  .split("\n")
  .map((url) => url.trim())
  .filter((url) => url !== "");
console.log("URLs to scrape:", urls.length);

import { WebButlerDriver, URL } from "@gfs-studio/webbutler-js";

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

// Obtener el html de cada URL
async function getMarkdownFromURL(url: URL): Promise<string> {
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
  const cleanedHtml = cleanHtml(htmlString);

  // Convertir a markdown
  const markdown = turndownService.turndown(cleanedHtml);

  // Eliminar líneas vacías consecutivas para tener un markdown más limpio
  const cleanMarkdown = markdown
    .replace(/\n{3,}/g, "\n\n") // Reemplazar 3 o más saltos de línea con 2
    .replace(/\n+$/g, ""); // Eliminar saltos de línea al final

  return cleanMarkdown;
}

import MiniPcExtractedData from "./extractedData";

function parseJsonData(input: string | object | null): object | null {
  try {
    // If it's already an object, return it
    if (typeof input === "object") return input;

    // If it's a string with code formatting, extract just the JSON part
    if (typeof input === "string" && input.includes("```")) {
      // Extract content between backticks, removing the "json" label
      const match = input.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
      if (match && match[1]) {
        return JSON.parse(match[1]);
      }
    }

    // Try parsing as regular JSON string
    return JSON.parse(input);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

function checkResponseContent(jsonData: object | null): boolean {
  // Check if jsonData is null or not an object
  if (jsonData === null || typeof jsonData !== "object") {
    console.error("Invalid JSON data:", jsonData);
    return false;
  }
  // Check if jsonData has the expected properties

  return true;
}

import schema from "./schema.json";

async function extractDataFromMarkdown(
  url: string,
  md: string
): Promise<MiniPcExtractedData> {
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey:
      "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",
  });

  const fileContent = fs.readFileSync(join(__dirname, "prompt.txt"), "utf8");

  const response = await client.chat.completions.create({
    model: "qwen/qwen2.5-vl-32b-instruct:free",
    messages: [
      { role: "system", content: fileContent },
      { role: "user", content: md },
    ],
    temperature: 0,
    top_p: 1,
    n: 1,
    stream: false,
    stop: null,
    response_format: {
      type: "json_schema",
      json_schema: {
        ...schema,
        name: "MiniPcExtractedData",
        strict: true,
      },
    },
  });

  // parse JsonData on a constant
  const jsonData = parseJsonData(response.choices[0].message.content);

  // Check if the response is valid
  if (!checkResponseContent(jsonData)) {
    throw new Error("Failed to parse JSON data from response.");
  }

  return {
    ...(jsonData as MiniPcExtractedData),
    fromURL: url,
    manualCollect: false,
  };
}

async function saveDataToSupabase(data: MiniPcExtractedData): Promise<boolean> {
  return false;
}

async function main() {
  let createdMiniPcsCount = 0;
  for (const url of urls) {
    try {
      if (createdMiniPcsCount > 1) break;
      const md = await getMarkdownFromURL(url as URL);
      console.log(md);
      const data = await extractDataFromMarkdown(url, md);
      console.log(data);
      // const success = await saveDataToSupabase(data);
      // if (!success) throw new Error(`Failed to save data from ${url}.`);
      // console.log(`Data from ${url} saved successfully.`);
      createdMiniPcsCount++;
    } catch (error) {
      console.error(`Error processing ${url}:`, error);
    } finally {
      console.log(`Created ${createdMiniPcsCount} Mini Pc's.`);
      break;
    }
  }
}

main()
  .then(() => console.log("Scraping completed."))
  .catch((error) => console.error("Error during scraping:", error));
