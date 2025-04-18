// Cargar las variables desde el archivo .env
import * as dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import fs from "fs";
import { join } from "path";
import MiniPcExtractedData from "./miniPcExtractedData";
import RAW_TARGETS from "../data/targets.json";
import schema from "../data/schema.json";
import { getMarkdownFromURL } from "./extractMdFromURL";
import { URL } from "@gfs-studio/webbutler-js";

function parseJsonData(input: string | object | null): object | null {
  try {
    if (typeof input === "object") return input;
    if (typeof input === "string" && input.includes("```")) {
      // Extract content between backticks, removing the "json" label
      const match = input.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
      if (match && match[1]) {
        return JSON.parse(match[1]);
      }
    }
    return JSON.parse(input);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

function checkResponseContent(jsonData: object | null): boolean {
  if (jsonData === null || typeof jsonData !== "object") {
    console.error("Invalid JSON data:", jsonData);
    return false;
  }
  return true;
}

async function extractDataFromMarkdown(
  url: string,
  brand: string,
  md: string
): Promise<MiniPcExtractedData> {
  const client = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const propmt = fs.readFileSync(
    join(__dirname, "..", "data", "prompt.txt"),
    "utf8"
  );

  const response = await client.chat.completions.create({
    model: "deepseek-reasoner",
    messages: [
      { role: "system", content: propmt },
      { role: "user", content: md },
    ],
    temperature: 0,
    top_p: 1,
    n: 1,
    stream: false,
    stop: null,
    // response_format: {
    //   type: "json_schema",
    //   json_schema: {
    //     ...schema,
    //     name: "MiniPcExtractedDataSchema",
    //     strict: true,
    //   },
    // },
  });

  // parse JsonData on a constant
  const jsonData = parseJsonData(response.choices[0].message.content);

  console.log(`Data extracted from ${url}`);
  // Escribir el resultado en la carpeta de brand en un json con nombre url
  const fileName =
    url
      .replace(/\/+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .replace(/^_+|_+$/g, "") || "index";

  const outputDir = join(process.cwd(), "output", brand);
  const outputFile = join(outputDir, `${fileName}.json`);

  // Ensure the brand directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the JSON data to the file
  fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2), "utf8");

  // Check if the response is valid
  if (!checkResponseContent(jsonData)) {
    throw new Error("Failed to parse JSON data from response.");
  }

  return {
    ...(jsonData as MiniPcExtractedData),
    brand: brand,
    fromURL: url,
    manualCollect: false,
  };
}

async function main() {
  const targets: { url: string; brand: string }[] = Object.entries(
    RAW_TARGETS
  ).flatMap(([brand, urls]) => urls.map((url) => ({ url, brand })));

  let createdMiniPcsCount = 0;
  for (const { url, brand } of targets) {
    try {
      if (createdMiniPcsCount > 1) break;
      const md = await getMarkdownFromURL(url as URL, brand);

      const data = await extractDataFromMarkdown(url, brand, md);

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
