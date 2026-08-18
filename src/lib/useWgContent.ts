import { useEffect, useState } from "react";
import { supabase, type WgContent } from "./supabase";

export function useWgContent(section: string) {
  const [items, setItems] = useState<WgContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      const { data } = await supabase
        .from("wg_content")
        .select("*")
        .eq("section", section)
        .order("order_index");
      if (!cancelled) {
        setItems((data as WgContent[]) ?? []);
        setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [section]);

  return { items, loading };
}
