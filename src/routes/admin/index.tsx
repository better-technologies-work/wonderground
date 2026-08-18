import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase, type WgContent, type MediaItem } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Upload, LogOut, X, Link as LinkIcon, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminPanel,
});

const SECTIONS = [
  { value: "feed-culto", label: "Feed Culto" },
  { value: "expediciones-confirmadas", label: "Expediciones Confirmadas" },
] as const;

function AdminPanel() {
  const navigate = useNavigate();
  const [items, setItems] = useState<WgContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<WgContent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    section: "feed-culto",
    order_index: 0,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("wg-admin") !== "1") {
      navigate({ to: "/admin/login" });
      return;
    }
    loadItems();
  }, [navigate]);

  async function loadItems() {
    setLoading(true);
    const { data } = await supabase
      .from("wg_content")
      .select("*")
      .order("section")
      .order("order_index");
    setItems((data as WgContent[]) ?? []);
    setLoading(false);
  }

  function logout() {
    sessionStorage.removeItem("wg-admin");
    navigate({ to: "/admin/login" });
  }

  function openNew() {
    setEditing(null);
    setForm({ title: "", description: "", section: "feed-culto", order_index: 0 });
    setFiles([]);
    setExistingMedia([]);
    setYoutubeUrl("");
    setShowForm(true);
  }

  function openEdit(item: WgContent) {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description ?? "",
      section: item.section,
      order_index: item.order_index,
    });
    setFiles([]);
    setExistingMedia(item.media ?? []);
    setYoutubeUrl("");
    setShowForm(true);
  }

  function removeExistingMedia(index: number) {
    setExistingMedia((prev) => prev.filter((_, i) => i !== index));
  }

  function addYoutubeLink() {
    const trimmed = youtubeUrl.trim();
    if (!trimmed) return;
    setExistingMedia((prev) => [...prev, { type: "youtube", url: trimmed }]);
    setYoutubeUrl("");
  }

  function getYouTubeEmbed(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  async function uploadFiles(section: string): Promise<MediaItem[]> {
    const uploaded: MediaItem[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${section}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("wonderground-media").upload(path, file);
      if (error) {
        alert("Error subiendo " + file.name + ": " + error.message);
        continue;
      }
      const { data } = supabase.storage.from("wonderground-media").getPublicUrl(path);
      const isVideo = file.type.startsWith("video/");
      uploaded.push({ type: isVideo ? "video" : "image", url: data.publicUrl });
    }
    return uploaded;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const newMedia = await uploadFiles(form.section);
    const allMedia = [...existingMedia, ...newMedia];

    if (allMedia.length === 0) {
      alert("Agregá al menos un archivo o link de YouTube.");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description || null,
      media: allMedia,
      section: form.section,
      order_index: form.order_index,
    };

    if (editing) {
      await supabase.from("wg_content").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("wg_content").insert(payload);
    }

    setShowForm(false);
    loadItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este contenido?")) return;
    await supabase.from("wg_content").delete().eq("id", id);
    loadItems();
  }

  const grouped = SECTIONS.map((s) => ({
    ...s,
    items: items.filter((i) => i.section === s.value),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <h1 className="font-display text-lg font-black tracking-tight uppercase">
            WonderGround<span className="text-primary">.</span> Admin
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-primary px-4 py-2 font-mono text-[11px] font-bold tracking-[0.12em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" /> NUEVO
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 border border-border px-3 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> SALIR
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
        {loading ? (
          <p className="font-mono text-sm text-muted-foreground">Cargando...</p>
        ) : items.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">
            No hay contenido. Presioná "NUEVO" para agregar.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {grouped.map(({ value, label, items: sectionItems }) => (
              <div key={value}>
                <h2 className="mb-4 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
                  {label}
                </h2>
                {sectionItems.length === 0 ? (
                  <p className="font-mono text-[11px] text-muted-foreground">Vacío</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {sectionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border border-border bg-card px-4 py-3"
                      >
                        <MediaPreviewThumb media={item.media} />
                        <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
                          {item.order_index}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-mono text-sm">
                          {item.title}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                          {item.media.length} item{item.media.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="grid h-8 w-8 place-items-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="grid h-8 w-8 place-items-center border border-border text-muted-foreground transition-colors hover:border-red-500 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border bg-card p-6"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-black tracking-tight uppercase">
                {editing ? "Editar" : "Nuevo"} contenido
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                  TÍTULO
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(ev) => setForm({ ...form, title: ev.target.value })}
                  className="w-full border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                  DESCRIPCIÓN
                </label>
                <textarea
                  value={form.description}
                  onChange={(ev) => setForm({ ...form, description: ev.target.value })}
                  rows={3}
                  className="w-full border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                    SECCIÓN
                  </label>
                  <select
                    value={form.section}
                    onChange={(ev) => setForm({ ...form, section: ev.target.value })}
                    className="w-full border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none focus:border-primary"
                  >
                    {SECTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                    ORDEN
                  </label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={(ev) => setForm({ ...form, order_index: Number(ev.target.value) })}
                    className="w-full border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                  ARCHIVOS (imágenes/videos)
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(ev) => setFiles(Array.from(ev.target.files ?? []))}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center gap-2 border border-dashed border-input bg-background px-3 py-3 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {files.length > 0
                    ? `${files.length} archivo${files.length > 1 ? "s" : ""} seleccionado${files.length > 1 ? "s" : ""}`
                    : "Seleccionar archivos..."}
                </button>
                {files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {files.map((f, i) => (
                      <span key={i} className="flex items-center gap-1 border border-border bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground">
                        {f.name}
                        <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                  LINK DE YOUTUBE
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(ev) => setYoutubeUrl(ev.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="min-w-0 flex-1 border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={addYoutubeLink}
                    className="shrink-0 border border-border px-3 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {existingMedia.length > 0 && (
                <div>
                  <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                    MEDIA ACTUAL
                  </label>
                  <div className="flex flex-col gap-2">
                    {existingMedia.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 border border-border bg-background px-3 py-2">
                        {m.type === "youtube" ? (
                          <div className="h-10 w-16 shrink-0 bg-red-500/10 flex items-center justify-center">
                            <span className="font-mono text-[8px] text-red-500">YT</span>
                          </div>
                        ) : (
                          <img src={m.url} alt="" className="h-10 w-16 shrink-0 object-cover" />
                        )}
                        <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-muted-foreground">
                          {m.type} — {m.url.split("/").pop()?.slice(0, 30)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeExistingMedia(i)}
                          className="shrink-0 text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="mt-2 bg-primary px-4 py-3 font-mono text-[12px] font-bold tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {editing ? "GUARDAR CAMBIOS" : "CREAR CONTENIDO"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaPreviewThumb({ media }: { media: MediaItem[] }) {
  const [idx, setIdx] = useState(0);
  const current = media[idx];

  if (!current) return <div className="h-10 w-10 shrink-0 bg-border" />;

  if (current.type === "youtube") {
    const embed = current.url.includes("youtu")
      ? `https://img.youtube.com/vi/${current.url.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? ""}/default.jpg`
      : "";
    return (
      <div className="relative h-10 w-16 shrink-0 overflow-hidden bg-black">
        {embed && <img src={embed} alt="" className="h-full w-full object-cover" />}
        {media.length > 1 && (
          <div className="absolute right-0.5 bottom-0.5 flex gap-0.5">
            <button onClick={() => setIdx((i) => (i - 1 + media.length) % media.length)} className="grid h-4 w-4 place-items-center bg-black/60 text-white"><ChevronLeft className="h-2.5 w-2.5" /></button>
            <button onClick={() => setIdx((i) => (i + 1) % media.length)} className="grid h-4 w-4 place-items-center bg-black/60 text-white"><ChevronRight className="h-2.5 w-2.5" /></button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-10 w-16 shrink-0 overflow-hidden">
      <img src={current.url} alt="" className="h-full w-full object-cover" />
      {media.length > 1 && (
        <div className="absolute right-0.5 bottom-0.5 flex gap-0.5">
          <button onClick={() => setIdx((i) => (i - 1 + media.length) % media.length)} className="grid h-4 w-4 place-items-center bg-black/60 text-white"><ChevronLeft className="h-2.5 w-2.5" /></button>
          <button onClick={() => setIdx((i) => (i + 1) % media.length)} className="grid h-4 w-4 place-items-center bg-black/60 text-white"><ChevronRight className="h-2.5 w-2.5" /></button>
        </div>
      )}
    </div>
  );
}
