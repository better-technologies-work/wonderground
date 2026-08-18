import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Play,
  X,
  Zap,
  MapPin,
  Ticket,
  Send,
  Radio,
  ChevronRight,
  Globe,
} from "lucide-react";

import heroImage from "@/assets/hero.jpg";
import { AudioWaves, MiniVisualizer } from "@/components/wonderground/AudioWaves";
import { getExpeditions, getReplays, type Replay } from "@/components/wonderground/data";
import { useWgContent } from "@/lib/useWgContent";
import { ContentCard } from "@/components/wonderground/ContentCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WonderGround Ecuador — 12 Years Was Just The Beginning" },
      {
        name: "description",
        content:
          "The apex of electronic music culture in Ecuador. Confirmed expeditions in Quito, Cuenca and Guayaquil — Symphon-E, Korolova, Padre Guilherme.",
      },
      { property: "og:title", content: "WonderGround Ecuador — Sovereign Electronic Network" },
      {
        property: "og:description",
        content:
          "High-fidelity audio, international scale, zero compromise. Secure access to Ecuador's apex electronic expeditions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
      <span className="text-primary">{index}</span>
      <span className="text-hairline">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function Landing() {
  const [openReplay, setOpenReplay] = useState<Replay | null>(null);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  const languages = ["es", "en", "it", "fr", "de", "pt"] as const;
  const expeditions = getExpeditions(t);
  const replays = getReplays(t);
  const { items: feedCultoItems } = useWgContent("feed-culto");
  const { items: expedicionesItems } = useWgContent("expediciones-confirmadas");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-8">
          <a href="#top" className="flex min-w-0 items-center">
            <img
              src="/logo.png"
              alt="WonderGround Ecuador"
              className="h-10 w-auto shrink-0 object-contain sm:h-12"
            />
          </a>
          <nav className="flex shrink-0 items-center gap-6 font-mono text-[11px] text-muted-foreground">
            <a href="#archive" className="hidden transition-colors hover:text-foreground sm:block">
              {t("nav.archive")}
            </a>
            <a
              href="#expeditions"
              className="hidden transition-colors hover:text-foreground sm:block"
            >
              {t("nav.expeditions")}
            </a>
            <a
              href="#circle"
              className="border border-primary/50 bg-primary/10 px-3 py-1.5 text-primary transition-all duration-300 hover:glow-cta"
            >
              {t("nav.innerCircle")}
            </a>
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 border border-border/60 px-2 py-1.5 transition-colors hover:text-foreground"
                aria-label={t("aria.changeLanguage")}
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="uppercase">{i18n.language.slice(0, 2)}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] border border-border bg-background/95 backdrop-blur-md">
                  {languages.map((lng) => (
                    <button
                      key={lng}
                      onClick={() => {
                        i18n.changeLanguage(lng);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-2 font-mono text-[11px] transition-colors hover:bg-accent hover:text-foreground ${
                        i18n.language.startsWith(lng) ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {t(`lang.${lng}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        id="top"
        className="noise-veil relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pt-28 pb-16 sm:px-8"
      >
        <img
          src={heroImage}
          alt={t("hero.alt")}
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 grid-etch opacity-60" />
        <div className="absolute inset-0 fade-bottom" />
        <AudioWaves />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="relative mx-auto w-full max-w-[1400px]"
        >
          <motion.div variants={fadeUp} className="mb-10">
            <span className="inline-flex items-center gap-3 border border-border bg-background/70 px-4 py-2 font-mono text-[10px] tracking-[0.18em] backdrop-blur-md sm:text-[11px]">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-primary" />
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[clamp(2.6rem,10.5vw,9.5rem)] leading-[0.86] font-black tracking-[-0.045em] uppercase"
          >
            {t("hero.title1")}
            <br />
            {t("hero.title2")}
            <br />
            <span className="text-primary">{t("hero.title3")}</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#expeditions"
              className="glow-cta group inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 font-mono text-[12px] font-bold tracking-[0.16em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              {t("hero.cta1")}
              <Zap className="h-3.5 w-3.5 fill-current" />]
            </a>
            <a
              href="#archive"
              className="inline-flex items-center justify-center gap-2 border border-border px-7 py-4 font-mono text-[12px] tracking-[0.16em] text-foreground transition-colors duration-300 hover:border-primary hover:text-primary"
            >
              {t("hero.cta2")}
            </a>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-16 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-8 font-mono sm:grid-cols-4"
          >
            {[
              ["12", t("hero.stats.years")],
              ["03", t("hero.stats.provinces")],
              ["180K+", t("hero.stats.attendees")],
              ["03", t("hero.stats.shows")],
            ].map(([v, k]) => (
              <div key={k} className="min-w-0">
                <dt className="text-2xl font-bold sm:text-3xl">{v}</dt>
                <dd className="mt-1 truncate text-[10px] tracking-[0.2em] text-muted-foreground">
                  {k}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-border bg-card/40 py-3">
        <div className="marquee-track flex w-max gap-10 font-mono text-[11px] tracking-[0.3em] whitespace-nowrap text-muted-foreground">
          {Array.from({ length: 2 }).map((_, dup) => (
            <span key={dup} className="flex gap-10">
              {(t("marquee.items", { returnObjects: true }) as string[]).map((w) => (
                <span key={w} className="flex items-center gap-10">
                  {w} <span className="text-primary">/</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ARCHIVE */}
      <section id="archive" className="mx-auto max-w-[1400px] px-4 py-24 sm:px-8 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionLabel index="01">{t("archive.label")}</SectionLabel>
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.9] font-black tracking-[-0.04em] uppercase">
            {t("archive.title")}
          </h2>
          <p className="mt-5 max-w-lg text-sm text-muted-foreground">
            {t("archive.description")}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {replays.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="group relative aspect-[9/14] overflow-hidden border border-border bg-card transition-colors duration-500 hover:border-primary/70"
            >
              <img
                src={r.image}
                alt={`${r.event} aftermovie still`}
                loading="lazy"
                width={1024}
                height={1280}
                className="absolute inset-0 h-full w-full object-cover opacity-65 transition-all duration-700 group-hover:scale-[1.06] group-hover:opacity-90"
              />
              <div className="absolute inset-0 fade-bottom" />

              <div className="absolute inset-x-0 top-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 font-mono text-[10px]">
                <span className="min-w-0 truncate border border-border bg-background/70 px-2 py-1 backdrop-blur-sm">
                  {r.year}
                </span>
                <span className="shrink-0 text-primary">{r.duration}</span>
              </div>

              <button
                onClick={() => setOpenReplay(r)}
                aria-label={t("aria.playAftermovie", { event: r.event })}
                className="absolute inset-0 grid place-items-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full border border-primary/70 bg-background/40 backdrop-blur-md transition-all duration-500 group-hover:glow-cta group-hover:bg-primary">
                  <Play className="h-5 w-5 fill-current text-primary transition-colors group-hover:text-primary-foreground" />
                </span>
              </button>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-2xl leading-none font-black tracking-tight uppercase">
                  {r.event}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0 text-primary" />
                  <span className="truncate">{r.location}</span>
                </p>
                <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                  {r.lineup}
                </p>
                <button
                  onClick={() => setOpenReplay(r)}
                  className="mt-4 flex w-full items-center justify-between border border-border bg-background/60 px-3 py-2.5 font-mono text-[10px] tracking-[0.16em] backdrop-blur-sm transition-colors duration-300 hover:border-primary hover:text-primary"
                >
                  [ {r.action} ]
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.article>
          ))}
          {feedCultoItems.map((item, i) => (
            <ContentCard key={item.id} item={item} index={replays.length + i} variant="archive" />
          ))}
        </div>
      </section>

      {/* EXPEDITIONS */}
      <section
        id="expeditions"
        className="border-t border-border bg-card/25 px-4 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <SectionLabel index="02">{t("expeditions.label")}</SectionLabel>
            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
              <h2 className="min-w-0 font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.9] font-black tracking-[-0.04em] uppercase whitespace-pre-line">
                {t("expeditions.title")}
              </h2>
              <span className="shrink-0 border border-primary/50 bg-primary/10 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-primary">
                <span className="live-dot mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
                {t("expeditions.lives", { count: expeditions.length })}
              </span>
            </div>
          </motion.div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {expeditions.map((e, i) => (
              <motion.article
                key={e.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease, delay: i * 0.08 }}
                className="group flex flex-col border border-border bg-background transition-all duration-500 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[var(--glow-soft)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={e.image}
                    alt={`${e.title} key visual`}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85"
                  />
                  <div className="absolute inset-0 fade-bottom" />
                  <div className="absolute inset-x-0 top-0 grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-4 font-mono text-[10px]">
                    <span className="min-w-0 truncate text-muted-foreground">{e.code}</span>
                    <span className="shrink-0 text-primary">{e.status}</span>
                  </div>
                  <p className="absolute bottom-4 left-4 font-display text-4xl leading-none font-black tracking-tight">
                    {e.date}
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl leading-tight font-black tracking-tight uppercase">
                    {e.title}
                  </h3>
                  <p className="mt-3 flex items-start gap-1.5 font-mono text-[10px] text-muted-foreground">
                    <MapPin className="mt-px h-3 w-3 shrink-0 text-primary" />
                    <span className="min-w-0">{e.venue}</span>
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {e.description}
                  </p>
                  <span className="mt-6 self-start border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-primary">
                    [ {e.tag} ]
                  </span>
                  <button className="mt-auto flex items-center justify-between gap-3 border border-border px-4 py-3.5 pt-3.5 font-mono text-[11px] tracking-[0.16em] transition-all duration-300 hover:glow-cta hover:bg-primary hover:text-primary-foreground">
                    <span className="flex items-center gap-2">
                      <Ticket className="h-3.5 w-3.5" />[ {e.cta} ]
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            ))}
            {expedicionesItems.map((item, i) => (
              <ContentCard key={item.id} item={item} index={expeditions.length + i} variant="expedition" />
            ))}
          </div>
        </div>
      </section>

      {/* INNER CIRCLE */}
      <section id="circle" className="noise-veil relative overflow-hidden px-4 py-24 sm:px-8 sm:py-32">
        <div className="absolute inset-0 grid-etch opacity-40" />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="relative mx-auto max-w-3xl border border-border bg-card/60 p-6 backdrop-blur-md sm:p-12"
        >
          <SectionLabel index="03">{t("circle.label")}</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(1.8rem,5vw,3.5rem)] leading-[0.92] font-black tracking-[-0.04em] uppercase">
            {t("circle.titleAccess")}<span className="text-primary">{t("circle.titleGranted")}</span>{t("circle.titleNever")}
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {t("circle.description")}
          </p>

          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              setJoined(true);
            }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder={t("circle.emailPlaceholder")}
              aria-label={t("aria.emailAddress")}
              className="min-w-0 flex-1 border border-input bg-background px-4 py-4 font-mono text-[12px] text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="submit"
              className="glow-cta inline-flex shrink-0 items-center justify-center gap-2 bg-primary px-6 py-4 font-mono text-[12px] font-bold tracking-[0.16em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              {t("circle.cta")} <Send className="h-3.5 w-3.5" /> ]
            </button>
          </form>

          <p
            className="mt-4 flex items-center gap-2 font-mono text-[10px] text-muted-foreground"
            aria-live="polite"
          >
            <Radio className="h-3 w-3 text-primary" />
            {joined ? t("circle.statusGranted") : t("circle.statusDefault")}
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-4 py-12 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <img
              src="/logo.png"
              alt="WonderGround Ecuador"
              className="h-10 w-auto object-contain sm:h-12"
            />
            <p className="mt-3 max-w-md font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted-foreground">
              {t("footer.copy")}
            </p>
          </div>
          <nav className="flex shrink-0 gap-6 font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
            <a href="#archive" className="transition-colors hover:text-primary">
              {t("footer.archive")}
            </a>
            <a href="#expeditions" className="transition-colors hover:text-primary">
              {t("footer.expeditions")}
            </a>
            <a href="#circle" className="transition-colors hover:text-primary">
              {t("footer.vip")}
            </a>
          </nav>
        </div>
      </footer>

      {/* REPLAY MODAL */}
      <AnimatePresence>
        {openReplay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/90 p-4 backdrop-blur-md"
            onClick={() => setOpenReplay(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${openReplay.event} replay`}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              onClick={(ev) => ev.stopPropagation()}
              className="relative w-full max-w-md border border-primary/40 bg-card"
            >
              <button
                onClick={() => setOpenReplay(null)}
                aria-label={t("aria.closeReplay")}
                className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center border border-border bg-background/70 transition-colors hover:border-primary hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative aspect-[9/14] overflow-hidden">
                <img
                  src={openReplay.image}
                  alt={`${openReplay.event} replay frame`}
                  className="absolute inset-0 h-full w-full object-cover opacity-75"
                />
                <div className="absolute inset-0 fade-bottom" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <MiniVisualizer active />
                  <h3 className="mt-3 font-display text-3xl leading-none font-black uppercase">
                    {openReplay.event}
                  </h3>
                  <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                    {openReplay.location} // {openReplay.lineup}
                  </p>
                  <button className="glow-cta mt-5 w-full bg-primary py-3 font-mono text-[11px] font-bold tracking-[0.16em] text-primary-foreground">
                    [ {openReplay.action} ]
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
