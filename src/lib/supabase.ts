import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type Article = {
  id: string;
  slug: string;
  title_ru: string;
  title_es: string | null;
  title_en: string | null;
  content_ru: string;
  content_es: string | null;
  content_en: string | null;
  image_urls: string[];
  created_at: string;
  updated_at: string;
};
