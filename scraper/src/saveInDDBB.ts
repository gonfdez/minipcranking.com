import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import MiniPcExtractedData from "../extractedData";

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

export async function saveDataToSupabase(
  data: MiniPcExtractedData
): Promise<boolean> {
  return false;
}
