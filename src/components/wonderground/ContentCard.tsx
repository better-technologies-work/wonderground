import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import type { MediaItem } from "@/lib/supabase";

const ease = [0.16, 1, 0.3, 1] as const;

function getYouTubeEmbed(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getYouTubeThumb(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export function MediaCarousel({ media, className = "" }: { media: MediaItem[]; className?: string }) {
  const [idx, setIdx] = useState(0);
  const current = media[idx];

  if (!current) return null;

  if (media.length === 1) {
    return <MediaSingle item={current} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {current.type === "youtube" ? (
        <YouTubeEmbed url={current.url} className="absolute inset-0 h-full w-full" />
      ) : (
        <img
          src={current.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-2">
        <button
          onClick={() => setIdx((i) => (i - 1 + media.length) % media.length)}
          className="grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-mono text-[10px] text-white/80">
          {idx + 1}/{media.length}
        </span>
        <button
          onClick={() => setIdx((i) => (i + 1) % media.length)}
          className="grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function MediaSingle({ item, className = "" }: { item: MediaItem; className?: string }) {
  if (item.type === "youtube") {
    return <YouTubeEmbed url={item.url} className={className} />;
  }
  return (
    <img
      src={item.url}
      alt=""
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}

function YouTubeEmbed({ url, className = "" }: { url: string; className?: string }) {
  const embed = getYouTubeEmbed(url);
  if (!embed) return null;
  return (
    <iframe
      src={embed}
      className={`border-0 ${className}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  );
}

export function ContentCard({
  item,
  index,
  variant = "archive",
}: {
  item: { id: string; title: string; description: string | null; media: MediaItem[] };
  index: number;
  variant?: "archive" | "expedition";
}) {
  const [playIdx, setPlayIdx] = useState(0);
  const primaryMedia = item.media[0];
  const thumb = primaryMedia?.type === "youtube" ? getYouTubeThumb(primaryMedia.url) : primaryMedia?.url;

  if (variant === "expedition") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease, delay: index * 0.08 }}
        className="group flex flex-col border border-border bg-background transition-all duration-500 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[var(--glow-soft)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <MediaCarousel media={item.media} className="absolute inset-0 h-full w-full opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85" />
          <div className="absolute inset-0 fade-bottom" />
          {item.media.length > 1 && (
            <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPlayIdx((i) => (i - 1 + item.media.length) % item.media.length)}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-mono text-[10px] text-white/80">{playIdx + 1}/{item.media.length}</span>
              <button
                onClick={() => setPlayIdx((i) => (i + 1) % item.media.length)}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl leading-tight font-black tracking-tight uppercase">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease, delay: index * 0.08 }}
      className="group relative aspect-[9/14] overflow-hidden border border-border bg-card transition-colors duration-500 hover:border-primary/70"
    >
      <MediaCarousel media={item.media} className="absolute inset-0 h-full w-full opacity-65 transition-all duration-700 group-hover:scale-[1.06] group-hover:opacity-90" />
      <div className="absolute inset-0 fade-bottom" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-display text-2xl leading-none font-black tracking-tight uppercase">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-2 line-clamp-2 font-mono text-[10px] text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </motion.article>
  );
}
