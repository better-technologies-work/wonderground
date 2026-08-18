import type { TFunction } from "i18next";
import symphone from "@/assets/event-symphone.jpg";
import korolova from "@/assets/event-korolova.jpg";
import padre from "@/assets/event-padre.jpg";

export type Expedition = {
  id: string;
  code: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  tag: string;
  cta: string;
  image: string;
  status: "LIVE" | "PRESALE" | "OPEN";
};

export function getExpeditions(t: TFunction): Expedition[] {
  return [
    {
      id: "symphon-e",
      code: "EXP-001",
      title: "SYMPHON-E CUENCA",
      date: "11 SEPT",
      venue: "Teatro Carlos Cueva Tamariz, Cuenca",
      description: t("expeditions.symphone.description"),
      tag: t("expeditions.symphone.tag"),
      cta: t("expeditions.symphone.cta"),
      image: symphone,
      status: "LIVE",
    },
    {
      id: "korolova",
      code: "EXP-002",
      title: "KOROLOVA — 12TH ANNIVERSARY",
      date: "09 OCTUBRE",
      venue: "Quito",
      description: t("expeditions.korolova.description"),
      tag: t("expeditions.korolova.tag"),
      cta: t("expeditions.korolova.cta"),
      image: korolova,
      status: "PRESALE",
    },
    {
      id: "padre-guilherme",
      code: "EXP-003",
      title: "PADRE GUILHERME — OPEN CALL B2B",
      date: "21 NOVIEMBRE",
      venue: "Ecuador",
      description: t("expeditions.padre.description"),
      tag: t("expeditions.padre.tag"),
      cta: t("expeditions.padre.cta"),
      image: padre,
      status: "OPEN",
    },
  ];
}

export type Replay = {
  id: string;
  event: string;
  location: string;
  lineup: string;
  year: string;
  duration: string;
  image: string;
  action: string;
};

export function getReplays(t: TFunction): Replay[] {
  return [
    {
      id: "symphon-e-archive",
      event: "SYMPHON-E",
      location: "Cuenca • Teatro CCT",
      lineup: "Orquesta Sinfónica × Resident Collective",
      year: "2025",
      duration: "04:12",
      image: symphone,
      action: t("replay.getAction"),
    },
    {
      id: "wroove-hard",
      event: "WROOVE HARD",
      location: "Quito • Warehouse 09",
      lineup: "Hard Techno / 150BPM Division",
      year: "2025",
      duration: "03:48",
      image: padre,
      action: t("replay.replayAction"),
    },
    {
      id: "korolova-archive",
      event: "KOROLOVA",
      location: "Guayaquil • Puerto Norte",
      lineup: "Korolova B2B WG Residents",
      year: "2024",
      duration: "05:02",
      image: korolova,
      action: t("replay.replayAction"),
    },
  ];
}
