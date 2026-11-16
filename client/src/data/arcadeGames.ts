export type ArcadeSystem = "nes" | "segaMD" | "snes" | "web";

export type ArcadeGame = {
  id: string;
  title: string;
  system: ArcadeSystem;
  core?: ArcadeSystem;
  romUrl?: string;
  playUrl?: string;
  coverUrl?: string;
  poster: string;
};

export const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: "bit-kart",
    title: "Bit Kart",
    system: "web",
    playUrl: "/arcade/web/bit-kart.html",
    coverUrl: "/arcade/covers/bit-kart.svg",
    poster: "linear-gradient(160deg, #14532d 0%, #111 70%)",
  },
  {
    id: "star-lance",
    title: "Star Lance",
    system: "web",
    playUrl: "/arcade/web/star-lance.html",
    coverUrl: "/arcade/covers/star-lance.svg",
    poster: "linear-gradient(160deg, #0ea5e9 0%, #0b1220 70%)",
  },
  {
    id: "super-boss-gaiden",
    title: "Super Boss Gaiden",
    system: "snes",
    core: "snes",
    romUrl: "/arcade/roms/super-boss-gaiden.sfc",
    coverUrl: "/arcade/covers/super-boss-gaiden.jpg",
    poster: "linear-gradient(160deg, #dc2626 0%, #111827 70%)",
  },
  {
    id: "abbaye-des-morts",
    title: "L'Abbaye des Morts",
    system: "segaMD",
    core: "segaMD",
    romUrl: "/arcade/roms/abbaye-des-morts.bin",
    coverUrl: "/arcade/covers/abbaye-des-morts.jpg",
    poster: "linear-gradient(160deg, #7f1d1d 0%, #0b0b0b 70%)",
  },
  {
    id: "alter-ego",
    title: "Alter Ego",
    system: "nes",
    core: "nes",
    romUrl: "/arcade/roms/Alter_Ego.nes",
    coverUrl: "/arcade/covers/alter-ego.png",
    poster: "linear-gradient(160deg, #1d4ed8 0%, #0f172a 70%)",
  },
  {
    id: "zooming-secretary",
    title: "Zooming Secretary",
    system: "nes",
    core: "nes",
    romUrl: "/arcade/roms/Zooming_Secretary.nes",
    coverUrl: "/arcade/covers/zooming-secretary.png",
    poster: "linear-gradient(160deg, #db2777 0%, #111 70%)",
  },
  {
    id: "uwol",
    title: "Uwol",
    system: "segaMD",
    core: "segaMD",
    romUrl: "/arcade/roms/Uwol_Quest_For_Money.bin",
    coverUrl: "/arcade/covers/uwol.svg",
    poster: "linear-gradient(160deg, #b45309 0%, #1c1917 70%)",
  },
  {
    id: "lawn-mower",
    title: "Lawn Mower",
    system: "nes",
    core: "nes",
    romUrl: "/arcade/roms/Lawn_Mower.nes",
    coverUrl: "/arcade/covers/lawn-mower.png",
    poster: "linear-gradient(160deg, #15803d 0%, #052e16 70%)",
  },
  {
    id: "lan-master",
    title: "Lan Master",
    system: "nes",
    core: "nes",
    romUrl: "/arcade/roms/Lan_Master.nes",
    coverUrl: "/arcade/covers/lan-master.png",
    poster: "linear-gradient(160deg, #0369a1 0%, #082f49 70%)",
  },
  {
    id: "chase",
    title: "Chase",
    system: "nes",
    core: "nes",
    romUrl: "/arcade/roms/Chase.nes",
    coverUrl: "/arcade/covers/chase.svg",
    poster: "linear-gradient(160deg, #1e3a8a 0%, #020617 70%)",
  },
];
