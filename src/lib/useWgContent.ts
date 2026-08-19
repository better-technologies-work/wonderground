import { useEffect, useState } from "react";
import { supabase, type WgContent, type MediaItem } from "./supabase";

function parseMedia(raw: unknown): MediaItem[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as MediaItem[];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as MediaItem[];
    } catch { /* ignore */ }
  }
  return [];
}

export function useWgContent(section: string) {
  const [items, setItems] = useState<WgContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchItems() {
      const { data, error } = await supabase
        .from("wg_content")
        .select("*")
        .eq("section", section)
        .order("order_index");
      if (error) console.error("useWgContent error:", error);
      if (!cancelled) {
        const parsed = (data ?? []).map((row: any) => ({
          ...row,
          media: parseMedia(row.media),
        }));
        setItems(parsed as WgContent[]);
        setLoading(false);
      }
    }
    fetchItems();
    return () => { cancelled = true; };
  }, [section]);

  return { items, loading };
}
