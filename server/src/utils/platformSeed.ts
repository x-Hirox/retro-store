export type PlatformSeed = {
  brand: string;
  name: string;
  slug: string;
  imageUrl: string;
  year?: string;
  order: number;
};

/** Canonical storefront platforms. Slugs keep /category/PlayStation/ps4 URLs. */
export const PLATFORM_SEED: PlatformSeed[] = [
  { brand: "playstation", name: "PlayStation 1", slug: "ps1", imageUrl: "/ps1.svg", year: "1995", order: 0 },
  { brand: "playstation", name: "PlayStation 2", slug: "ps2", imageUrl: "/ps2.svg", year: "2000", order: 1 },
  { brand: "playstation", name: "PlayStation 3", slug: "ps3", imageUrl: "/ps3.svg", year: "2006", order: 2 },
  { brand: "playstation", name: "PlayStation 4", slug: "ps4", imageUrl: "/ps4.svg", year: "2013", order: 3 },
  { brand: "playstation", name: "PlayStation 5", slug: "ps5", imageUrl: "/ps5.svg", year: "2020", order: 4 },
  { brand: "playstation", name: "PlayStation Portable", slug: "psp", imageUrl: "/psp.svg", year: "2005", order: 5 },
  { brand: "playstation", name: "PlayStation Vita", slug: "psvita", imageUrl: "/psvita.svg", year: "2012", order: 6 },

  { brand: "nintendo", name: "Nintendo DS Lite", slug: "dsl", imageUrl: "/images/platforms/dsl.png", year: "2006", order: 0 },
  { brand: "nintendo", name: "Nintendo DSi", slug: "ndsi", imageUrl: "/images/platforms/ndsi.png", year: "2008", order: 1 },
  { brand: "nintendo", name: "Nintendo 3DS", slug: "3ds", imageUrl: "/images/platforms/3ds.png", year: "2011", order: 2 },
  { brand: "nintendo", name: "Nintendo DS", slug: "nds", imageUrl: "/images/platforms/nds.png", year: "2004", order: 3 },
  { brand: "nintendo", name: "Game Boy Advance", slug: "gba", imageUrl: "/images/platforms/gba.png", year: "2001", order: 4 },
  { brand: "nintendo", name: "Nintendo Switch", slug: "switch", imageUrl: "/images/platforms/switch.png", year: "2017", order: 5 },
  { brand: "nintendo", name: "Nintendo NES", slug: "nes", imageUrl: "/images/platforms/nes.png", year: "1985", order: 6 },
  { brand: "nintendo", name: "Super Nintendo (SNES)", slug: "snes", imageUrl: "/images/platforms/snes.png", year: "1991", order: 7 },
  { brand: "nintendo", name: "Nintendo 64", slug: "n64", imageUrl: "/images/platforms/n64.png", year: "1996", order: 8 },
  { brand: "nintendo", name: "Nintendo GameCube", slug: "gamecube", imageUrl: "/images/platforms/gamecube.png", year: "2001", order: 9 },
  { brand: "nintendo", name: "Nintendo Wii", slug: "wii", imageUrl: "/images/platforms/wii.png", year: "2006", order: 10 },
  { brand: "nintendo", name: "Nintendo Wii U", slug: "wii-u", imageUrl: "/images/platforms/wii-u.png", year: "2012", order: 11 },

  { brand: "xbox", name: "Original Xbox", slug: "xbox", imageUrl: "/xbox.svg", year: "2001", order: 0 },
  { brand: "xbox", name: "Xbox 360", slug: "xbox360", imageUrl: "/xbox360.svg", year: "2005", order: 1 },
  { brand: "xbox", name: "Xbox One", slug: "xboxone", imageUrl: "/xboxone.svg", year: "2013", order: 2 },

  { brand: "sega", name: "Master System", slug: "master-system", imageUrl: "/sega.svg", year: "1986", order: 0 },
  { brand: "sega", name: "Sega Genesis", slug: "sega-genesis", imageUrl: "/sega.svg", year: "1988", order: 1 },
  { brand: "sega", name: "Sega Saturn", slug: "sega-saturn", imageUrl: "/sega.svg", year: "1994", order: 2 },
  { brand: "sega", name: "Sega Dreamcast", slug: "sega-dreamcast", imageUrl: "/sega.svg", year: "1998", order: 3 },

  { brand: "chinese consoles", name: "R36S", slug: "r36s", imageUrl: "/images/platforms/r36s.png", year: "2023", order: 0 },
  { brand: "chinese consoles", name: "M15 Pro", slug: "m15-pro", imageUrl: "/images/platforms/m15-pro.png", year: "2024", order: 1 },
  { brand: "chinese consoles", name: "SUP", slug: "sup", imageUrl: "/images/platforms/sup.png", year: "2018", order: 2 },
  { brand: "chinese consoles", name: "Anbernic", slug: "anbernic", imageUrl: "/images/platforms/anbernic.png", order: 3 },
  { brand: "chinese consoles", name: "Miyoo Mini", slug: "miyoo-mini", imageUrl: "/images/platforms/miyoo-mini.png", order: 4 },
  { brand: "chinese consoles", name: "PowKiddy", slug: "powkiddy", imageUrl: "/images/platforms/powkiddy.png", order: 5 },
  { brand: "chinese consoles", name: "Retroid Pocket", slug: "retroid-pocket", imageUrl: "/images/platforms/retroid-pocket.png", order: 6 },
];

/** True when the card still uses the shared brand logo, not a per-platform image. */
export function isGenericBrandLogo(url?: string) {
  const current = String(url || "").trim();
  if (!current) return true;
  if (/cloudinary|res\.cloudinary/i.test(current)) return false;
  return /\/(nintendo|playstation|xbox|sega)\.svg$/i.test(current);
}
