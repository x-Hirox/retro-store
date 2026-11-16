export type ArcadeSystem = "nes" | "segaMD" | "snes" | "gba";

export type ArcadeGame = {
  id: string;
  title: string;
  system: ArcadeSystem;
  core: ArcadeSystem;
  romUrl: string;
  coverUrl?: string;
  author: string;
  license: string;
  year: string;
  description: { ka: string; en: string };
  poster: string;
  sourceUrl: string;
};

export const ARCADE_SYSTEMS: {
  id: ArcadeSystem | "all";
  name: string;
  accept: string;
}[] = [
  { id: "all", name: "ყველა", accept: "" },
  { id: "nes", name: "NES", accept: ".nes" },
  { id: "segaMD", name: "Sega Genesis", accept: ".md,.bin,.gen,.smd" },
  { id: "snes", name: "SNES", accept: ".sfc,.smc" },
  { id: "gba", name: "GBA", accept: ".gba" },
];

export const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: "lan-master",
    title: "Lan Master",
    system: "nes",
    core: "nes",
    romUrl: "/arcade/roms/Lan_Master.nes",
    coverUrl: "/arcade/covers/lan-master.png",
    author: "Shiru",
    license: "Public Domain",
    year: "2011",
    poster: "linear-gradient(160deg, #1d4ed8 0%, #0f172a 70%)",
    description: {
      ka: "ლოგიკური puzzle NES-ზე.",
      en: "A logic puzzle on NES.",
    },
    sourceUrl: "https://shiru.untergrund.net/software.shtml",
  },
  {
    id: "lawn-mower",
    title: "Lawn Mower",
    system: "nes",
    core: "nes",
    romUrl: "/arcade/roms/Lawn_Mower.nes",
    coverUrl: "/arcade/covers/lawn-mower.png",
    author: "Shiru",
    license: "Freeware",
    year: "2011",
    poster: "linear-gradient(160deg, #16a34a 0%, #14532d 70%)",
    description: {
      ka: "კლასიკური arcade გაზონზე.",
      en: "A classic lawn-mower arcade.",
    },
    sourceUrl: "https://shiru.untergrund.net/software.shtml",
  },
  {
    id: "chase",
    title: "Chase",
    system: "nes",
    core: "nes",
    romUrl: "/arcade/roms/Chase.nes",
    author: "Shiru",
    license: "Freeware",
    year: "2012",
    poster: "linear-gradient(160deg, #7c3aed 0%, #1e1b4b 70%)",
    description: {
      ka: "მცირე NES arcade.",
      en: "A short NES arcade game.",
    },
    sourceUrl: "https://shiru.untergrund.net/software.shtml",
  },
  {
    id: "sega-2048",
    title: "2048",
    system: "segaMD",
    core: "segaMD",
    romUrl: "/arcade/roms/sega-2048.bin",
    author: "atamurad",
    license: "MIT",
    year: "2021",
    poster: "linear-gradient(160deg, #f59e0b 0%, #7c2d12 70%)",
    description: {
      ka: "2048 Sega Genesis-ზე.",
      en: "2048 on Sega Genesis.",
    },
    sourceUrl: "https://github.com/atamurad/sega-2048",
  },
  {
    id: "super-boss-gaiden",
    title: "Super Boss Gaiden",
    system: "snes",
    core: "snes",
    romUrl: "/arcade/roms/super-boss-gaiden.sfc",
    coverUrl: "/arcade/covers/super-boss-gaiden.jpg",
    author: "ChronoMoogle & Dieter von Laser",
    license: "Freeware",
    year: "2016",
    poster: "linear-gradient(160deg, #dc2626 0%, #111827 70%)",
    description: {
      ka: "SNES homebrew პლატფორმერი.",
      en: "A SNES homebrew platformer.",
    },
    sourceUrl: "https://superbossgaiden.superfamicom.org/",
  },
];
