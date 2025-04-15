// Inicializa el cliente de Supabase
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

// Obtener lista de URLs del archivo urls.txt
import { readFileSync } from "fs";
import { join } from "path";

const urlsFilePath = join(__dirname, "urls.txt");
const urlsFileContent = readFileSync(urlsFilePath, "utf-8");
const urls = urlsFileContent
  .split("\n")
  .map((url) => url.trim())
  .filter((url) => url !== "");
console.log("URLs to scrape:", urls.length);

// Obtener el html de cada URL
async function getHTMLFromURL(url: string): Promise<string> {
  return "";
}

async function extractDataFromHTML(html: string): Promise<MiniPcExtractedData> {
  // Aquí puedes usar un parser HTML como cheerio o jsdom para extraer los datos
  // Por simplicidad, vamos a devolver un objeto vacío
  return {} as any;
}

async function saveDataToSupabase(data: MiniPcExtractedData): Promise<boolean> {
  return false;
}

async function main() {
  let createdMiniPcsCount = 0;
  for (const url of urls) {
    try {
      const html = await getHTMLFromURL(url);
      const data = await extractDataFromHTML(html);
      const success = await saveDataToSupabase(data);
      if (!success) throw new Error(`Failed to save data from ${url}.`);
      console.log(`Data from ${url} saved successfully.`);
      createdMiniPcsCount++;
    } catch (error) {
      console.error(`Error processing ${url}:`, error);
    } finally {
      console.log(`Created ${createdMiniPcsCount} Mini Pc's.`);
    }
  }
}

main()
  .then(() => console.log("Scraping completed."))
  .catch((error) => console.error("Error during scraping:", error));
