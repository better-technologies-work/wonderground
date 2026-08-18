import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("URL:", JSON.stringify(supabaseUrl));
console.log("KEY:", JSON.stringify(supabaseAnonKey));

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MediaItem = {
  type: "image" | "video" | "youtube";
  url: string;
};

export type WgContent = {
  id: string;
  title: string;
  description: string | null;
  media: MediaItem[];
  section: string;
  order_index: number;
  created_at: string;
};