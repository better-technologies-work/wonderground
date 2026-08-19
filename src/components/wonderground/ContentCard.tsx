import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import type { MediaItem } from "@/lib/supabase";

const ease = [0.16, 1, 0.3, 1] as const;

export function MuteButton({ videoRef, className = "" }: { videoRef: React.RefObject<HTMLVideoElement | null>; className?: string }) {
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <button
      onClick={toggle}
      className={`grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 ${className}`}
      aria-label={muted ? "Unmute" : "Mute"}
    >
      {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
    </button>
  );
}

export function VideoWithMute({
  src,
  className = "",
  videoClassName = "",
  autoPlay = true,
}: {
  src: string;
  className?: string;
  videoClassName?: string;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={src}
        className={videoClassName || "h-full w-full object-cover"}
        muted
        loop
        playsInline
        preload="auto"
        {...(autoPlay ? { autoPlay: true } : {})}
      />
      <MuteButton videoRef={videoRef} className="absolute top-14 right-3 z-10" />
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be" || hostname.endsWith(".youtu.be")) {
      const [, id] = parsed.pathname.split("/");
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "music.youtube.com"
    ) {
      const videoId = parsed.searchParams.get("v");
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) return videoId;

      const segments = parsed.pathname.split("/").filter(Boolean);
      const candidate = segments[1] ?? segments[0];
      if (
        candidate &&
        ["embed", "shorts", "live", "watch"].includes(segments[0] ?? "") &&
        /^[a-zA-Z0-9_-]{11}$/.test(candidate)
      ) {
        return candidate;
      }
    }
  } catch {
    // fallback below for malformed URLs
  }

  const patterns = [
    /(?:youtube\.com\/(?:watch\?.*?[?&]v=|embed\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
    /(?:[?&]v=|\/v\/)([a-zA-Z0-9_-]{11})/i,
    /(?:^|[\/\?&])([a-zA-Z0-9_-]{11})(?:[?&]|$)/,
  ];

  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match) return match[1] ?? match[0];
  }

  return null;
}

function getYouTubeEmbed(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

function getYouTubeThumb(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function YouTubeFallback({ url, className = "" }: { url: string; className?: string }) {
  const thumb = getYouTubeThumb(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/yt relative grid place-items-center overflow-hidden ${className}`}
    >
      {thumb && <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-black/50 backdrop-blur-md transition-all group-hover/yt:bg-red-600 group-hover/yt:border-red-600">
        <Play className="h-5 w-5 fill-current text-white ml-0.5" />
      </span>
    </a>
  );
}

export function MediaCarousel({ media, className = "" }: { media: MediaItem[]; className?: string }) {
  const [idx, setIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = media[idx];

  if (!current) return null;

  if (media.length === 1) {
    return <MediaSingle item={current} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {current.type === "youtube" ? (
        <YouTubeEmbed url={current.url} className="absolute inset-0 h-full w-full" />
      ) : current.type === "video" ? (
        <>
          <video
            ref={videoRef}
            src={current.url}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="auto"
            autoPlay
          />
          <MuteButton videoRef={videoRef} className="absolute top-14 right-3 z-10" />
        </>
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
  const videoRef = useRef<HTMLVideoElement>(null);

  if (item.type === "youtube") {
    return (
      <div className={`relative ${className}`}>
        <YouTubeEmbed url={item.url} className="absolute inset-0 h-full w-full" />
      </div>
    );
  }
  if (item.type === "video") {
    return (
      <div className={`relative ${className}`}>
        <video
          ref={videoRef}
          src={item.url}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
          autoPlay
        />
        <MuteButton videoRef={videoRef} className="absolute top-14 right-3 z-10" />
      </div>
    );
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
  if (!embed) return <YouTubeFallback url={url} className={className} />;
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
  onClick,
}: {
  item: { id: string; title: string; description: string | null; media: MediaItem[] };
  index: number;
  variant?: "archive" | "expedition";
  onClick?: () => void;
}) {
  const [playIdx, setPlayIdx] = useState(0);
  const primaryMedia = item.media[0];
  const thumb = primaryMedia?.type === "youtube" ? getYouTubeThumb(primaryMedia.url) : primaryMedia?.url;

  console.log("[ContentCard]", item.title, "media:", JSON.stringify(item.media));

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

      {onClick && (
        <button
          onClick={onClick}
          className="absolute inset-0 z-10 grid place-items-center"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full border border-primary/70 bg-background/40 backdrop-blur-md transition-all duration-500 group-hover:glow-cta group-hover:bg-primary">
            <Play className="h-5 w-5 fill-current text-primary transition-colors group-hover:text-primary-foreground" />
          </span>
        </button>
      )}

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
