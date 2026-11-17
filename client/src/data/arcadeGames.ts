export type ArcadeSystem = "nes" | "segaMD" | "snes" | "gba" | "web";

export type ArcadeGame = {
  id: string;
  title: string;
  system: ArcadeSystem;
  core?: ArcadeSystem;
  romUrl?: string;
  playUrl?: string;
  coverUrl?: string;
  poster: string;
  author: string;
  sourceUrl?: string;
  license?: string;
  hint?: string;
  desc: { ka: string; en: string };
};

export const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: "super-boss-gaiden",
    title: "Super Boss Gaiden",
    system: "snes",
    core: "snes",
    romUrl: "/arcade/roms/super-boss-gaiden.sfc",
    coverUrl: "/arcade/covers/super-boss-gaiden.jpg",
    poster: "linear-gradient(165deg, #ff007f 0%, #1a0533 55%, #050508 100%)",
    author: "ChronoMoogle & Dieter von Laser",
    sourceUrl: "https://superbossgaiden.superfamicom.org/",
    license: "Homebrew",
    hint: "ისრები · Z/X",
    desc: {
      ka: "SNES homebrew ბოს-რაში — სწრაფი არკადა, ნეონური პიქსელი, იურიდიულად სუფთა ROM.",
      en: "SNES homebrew boss-rush — fast arcade action and a fully legal ROM.",
    },
  },
  {
    id: "starburst",
    title: "STARBURST",
    system: "web",
    playUrl: "https://html-classic.itch.zone/html/20045735-2385635/index.html?v=1794672019",
    coverUrl: "/arcade/covers/starburst.png",
    poster: "linear-gradient(165deg, #7c3aed 0%, #0b1220 70%)",
    author: "Kiril Petrovski",
    sourceUrl: "https://kirilp.itch.io/starburst",
    license: "MIT · CC BY 4.0",
    hint: "WASD / ისრები · სროლა · თაჩი",
    desc: {
      ka: "თანამედროვე ნეონური bullet hell — ბოსები, აპგრეიდები, Phaser-ზე აწყობილი პიქსელ-არტი.",
      en: "A modern neon bullet hell — bosses, upgrades and authored pixel art in Phaser.",
    },
  },
];
