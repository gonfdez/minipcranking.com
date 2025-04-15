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
  browserServerURL: "http:/localhost:3000",
});

import { TurndownService } from "turndown";

const turndownService = new TurndownService();

// Obtener el html de cada URL
async function getMarkdownFromURL(url: URL): Promise<string> {
  await driver.navigate(url);
  await driver.waitForPageLoad(3000);
  await driver.sleep(1250);
  const scriptRes = await driver.executeScript(
    `return document.querySelector('body').outerHTML;`,
    false
  );
  const htmlString = scriptRes?.data?.return ?? null;
  const markdown = turndownService.turndown(htmlString);
  return markdown;
}

async function extractDataFromMarkdown(
  url: string,
  html: string
): Promise<MiniPcExtractedData> {
  return {
    fromURL: url,
  };
}

async function saveDataToSupabase(data: MiniPcExtractedData): Promise<boolean> {
  return false;
}

async function main() {
  let createdMiniPcsCount = 0;
  for (const url of urls) {
    try {
      const md = await getMarkdownFromURL(url as URL);
      const data = await extractDataFromMarkdown(url, md);
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
