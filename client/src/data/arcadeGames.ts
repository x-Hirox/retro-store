export type ArcadeSystem = "nes" | "segaMD" | "snes" | "gba";

export type ArcadeGame = {
  id: string;
  title: string;
  system: ArcadeSystem;
  core: ArcadeSystem;
  romUrl: string;
  coverUrl?: string;
  poster: string;
  sourceUrl: string;
};

export const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: "abbaye-des-morts",
    title: "L'Abbaye des Morts",
    system: "segaMD",
    core: "segaMD",
    romUrl: "/arcade/roms/abbaye-des-morts.bin",
    coverUrl: "/arcade/covers/abbaye-des-morts.jpg",
    poster: "linear-gradient(160deg, #7f1d1d 0%, #0b0b0b 70%)",
    sourceUrl: "https://www.locomalito.com/abbaye_des_morts.php",
  },
  {
    id: "super-boss-gaiden",
    title: "Super Boss Gaiden",
    system: "snes",
    core: "snes",
    romUrl: "/arcade/roms/super-boss-gaiden.sfc",
    coverUrl: "/arcade/covers/super-boss-gaiden.jpg",
    poster: "linear-gradient(160deg, #dc2626 0%, #111827 70%)",
    sourceUrl: "https://superbossgaiden.superfamicom.org/",
  },
  {
    id: "alter-ego",
    title: "Alter Ego",
    system: "nes",
    core: "nes",
    romUrl: "/arcade/roms/Alter_Ego.nes",
    coverUrl: "/arcade/covers/alter-ego.png",
    poster: "linear-gradient(160deg, #2563eb 0%, #0f172a 70%)",
    sourceUrl: "https://shiru.untergrund.net/software.shtml",
  },
  {
    id: "zooming-secretary",
    title: "Zooming Secretary",
    system: "nes",
    core: "nes",
    romUrl: "/arcade/roms/Zooming_Secretary.nes",
    coverUrl: "/arcade/covers/zooming-secretary.png",
    poster: "linear-gradient(160deg, #db2777 0%, #4a044e 70%)",
    sourceUrl: "https://shiru.untergrund.net/software.shtml",
  },
  {
    id: "uwol",
    title: "Uwol",
    system: "segaMD",
    core: "segaMD",
    romUrl: "/arcade/roms/Uwol_Quest_For_Money.bin",
    poster: "linear-gradient(160deg, #f59e0b 0%, #7c2d12 70%)",
    sourceUrl: "https://shiru.untergrund.net/software.shtml",
  },
];
