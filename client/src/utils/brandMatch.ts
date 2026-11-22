const ALIASES: Record<string, string[]> = {
  playstation: [
    "playstation",
    "play station",
    "ps1",
    "ps2",
    "ps3",
    "ps4",
    "ps5",
    "psp",
    "vita",
  ],
  nintendo: [
    "nintendo",
    "nes",
    "snes",
    "n64",
    "gamecube",
    "game cube",
    "wii",
    "switch",
    "gameboy",
    "game boy",
    "3ds",
    "dsi",
    "nds",
    "ndsi",
    "dsl",
    "gba",
    "game boy advance",
    "nintendo ds",
    "nintendo ds lite",
    "ds lite",
    "nintendo dsi",
    "nintendo 3ds",
  ],
  xbox: ["xbox"],
  sega: ["sega", "genesis", "mega drive", "dreamcast", "saturn", "master system"],
  bundles: ["bundle", "ბუნდლ", "კომპლექტ"],
  accessories: ["accessor", "აქსესუარ", "controller", "ჯოისტიკ", "charger"],
  "chinese consoles": [
    "anbernic",
    "miyoo",
    "powkiddy",
    "retroid",
    "r36s",
    "chinese",
  ],
  "atari & more": ["atari", "coleco", "turbografx", "turbo grafx"],
  atari: ["atari", "coleco", "turbografx"],
};

export function brandKey(platform?: string) {
  return decodeURIComponent(platform || "")
    .toLowerCase()
    .trim();
}

export function matchesBrand(
  product: {
    title?: string;
    category?: string;
    platform?: string;
    description?: string;
  },
  platform?: string,
) {
  const brand = brandKey(platform);
  if (!brand || brand === "all") return true;
  const keys = ALIASES[brand] || [brand];
  const hay =
    `${product.title || ""} ${product.category || ""} ${product.platform || ""} ${product.description || ""}`.toLowerCase();
  return keys.some((k) => hay.includes(k));
}
