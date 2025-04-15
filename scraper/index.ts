import * as dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

// Cargar las variables desde el archivo .env
dotenv.config();

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

import TurndownService from "turndown";

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

import MiniPcExtractedData from "./interface";

function parseJsonData(input: string | object | null ): object | null {
  try {
    // If it's already an object, return it
    if (typeof input === 'object') return input;
    
    // If it's a string with code formatting, extract just the JSON part
    if (typeof input === 'string' && input.includes('```')) {
      // Extract content between backticks, removing the "json" label
      const match = input.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
      if (match && match[1]) {
        return JSON.parse(match[1]);
      }
    }
    
    // Try parsing as regular JSON string
    return JSON.parse(input);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}


function checkResponseContent(
  jsonData: object | null
): boolean {
  // Check if jsonData is null or not an object
  if (jsonData === null || typeof jsonData !== "object") {
    console.error("Invalid JSON data:", jsonData);
    return false;
  }
  // Check if jsonData has the expected properties

  return true;
}

import schema from "./schema.json";
import { ResponseFormatJSONSchema } from "openai/resources/shared";

async function extractDataFromMarkdown(
  url: string,
  md: string
): Promise<MiniPcExtractedData> {
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
  });

  const fileContent = fs.readFileSync(join(__dirname, "prompt.txt"), "utf8");

  /*const response = await client.chat.completions.create({
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
      }
    },
  });


  // parse JsonData on a constant
  const jsonData = parseJsonData(response.choices[0].message.content);

  // Check if the response is valid
  if (!checkResponseContent(jsonData)) {
    throw new Error("Failed to parse JSON data from response.");
  }

  return {
    ...jsonData as MiniPcExtractedData,
    fromURL: url,
    manualCollect: false,
  };*/
  return {
    fromURL: url,
    manualCollect: true,
  } as any;
}

async function saveDataToSupabase(data: MiniPcExtractedData): Promise<boolean> {
  return false;
}

async function main() {
  let createdMiniPcsCount = 0;
  for (const url of urls) {
    try {
      const md = await getMarkdownFromURL(url as URL);
      console.log(md);
      const data = await extractDataFromMarkdown(url, md);
      console.log(data);
      break;
      // const success = await saveDataToSupabase(data);
      // if (!success) throw new Error(`Failed to save data from ${url}.`);
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
