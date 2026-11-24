import type { IPlatformCard } from "../types";

export const PLATFORM_BRANDS = [
  { label: "PlayStation", value: "playstation" },
  { label: "Nintendo", value: "nintendo" },
  { label: "Xbox", value: "xbox" },
  { label: "Sega", value: "sega" },
  { label: "Chinese Consoles", value: "chinese consoles" },
] as const;

const SLUG_ALIASES: Record<string, string> = {
  "playstation 1": "ps1",
  "playstation 2": "ps2",
  "playstation 3": "ps3",
  "playstation 4": "ps4",
  "playstation 5": "ps5",
  "playstation portable": "psp",
  "playstation vita": "psvita",
  "nintendo ds lite": "dsl",
  "nintendo dsi": "ndsi",
  "nintendo 3ds": "3ds",
  "nintendo ds": "nds",
  "game boy advance": "gba",
  "nintendo switch": "switch",
  "nintendo nes": "nes",
  "super nintendo (snes)": "snes",
  "super nintendo": "snes",
  "nintendo 64": "n64",
  "nintendo gamecube": "gamecube",
  "nintendo wii": "wii",
  "nintendo wii u": "wii-u",
  "original xbox": "xbox",
  xbox: "xbox",
  "xbox 360": "xbox360",
  "xbox one": "xboxone",
  "master system": "master-system",
  "sega genesis": "sega-genesis",
  "sega saturn": "sega-saturn",
  "sega dreamcast": "sega-dreamcast",
  r36s: "r36s",
  "m15 pro": "m15-pro",
  sup: "sup",
};

export function brandLabel(value?: string) {
  const key = String(value || "").toLowerCase();
  return PLATFORM_BRANDS.find((item) => item.value === key)?.label || value || "";
}

export function slugFromName(name: string) {
  const key = name.trim().toLowerCase();
  if (SLUG_ALIASES[key]) return SLUG_ALIASES[key];
  return key
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function groupPlatformNav(
  cards: IPlatformCard[],
  fallback: Array<{ name: string; sub: string[] }>,
) {
  if (!cards.length) {
    return fallback.map((cat) => ({
      name: cat.name,
      sub: cat.sub.map((item) => ({ name: item, slug: item })),
    }));
  }
  return fallback.map((cat) => {
    if (!cat.sub.length) {
      return { name: cat.name, sub: [] as Array<{ name: string; slug: string }> };
    }
    const brand = cat.name.toLowerCase();
    const sub = cards
      .filter((card) => card.brand.toLowerCase() === brand)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((card) => ({ name: card.name, slug: card.slug }));
    return { name: cat.name, sub };
  });
}
