import { useEffect, useState } from "react";

const BAR_COUNT = 64;

/** Kinetic ambient audio-wave backdrop. Pure CSS transforms, no canvas. */
export function AudioWaves({ bars = BAR_COUNT }: { bars?: number }) {
  const [tick, setTick] = useState(-1);

  useEffect(() => {
    setTick(0);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 140);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 flex h-56 items-end gap-[2px] px-2 opacity-40"
    >
      {tick >= 0 &&
        Array.from({ length: bars }).map((_, i) => {
        const h =
          18 +
          Math.abs(Math.sin((i + tick) * 0.38)) * 46 +
          Math.abs(Math.cos((i * 1.7 + tick) * 0.21)) * 34;
        return (
          <span
            key={i}
            className="flex-1 rounded-[1px] bg-primary/70 transition-all duration-[400ms] ease-out"
            style={{ height: `${h.toFixed(2)}%`, opacity: Number((0.15 + (h / 100) * 0.6).toFixed(3)) }}
          />
        );
      })}
    </div>
  );
}

/** Compact visualizer used inside video cards / player. */
export function MiniVisualizer({ active }: { active: boolean }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 120);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div aria-hidden className="flex h-4 items-end gap-[2px]">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="w-[2px] bg-primary transition-all duration-150"
          style={{
            height: active
              ? `${(25 + Math.abs(Math.sin((i + tick) * 0.7)) * 75).toFixed(2)}%`
              : "22%",
          }}
        />
      ))}
    </div>
  );
}
