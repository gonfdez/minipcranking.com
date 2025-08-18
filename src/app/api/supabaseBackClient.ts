import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseBackKey = process.env.NEXT_SUPABASE_SERVICE_KEY!;

export const backendSupabase = createClient(supabaseUrl, supabaseBackKey);
