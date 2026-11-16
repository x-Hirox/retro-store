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
  description: string;
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
    description:
      "ლოგიკური puzzle NES-ზე: მილები დააკავშირე და ქსელი ააწყვე.",
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
    description: "კლასიკური arcade: გაზონი მოაჭერი, ქვებსა და ყვავილებს გაერიდე.",
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
    description: "მცირე NES arcade, ავტორის უფასო სასწავლო მაგალითი.",
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
    description: "ცნობილი 2048 Sega Genesis-ზე. ისრებით თამაში, A — დემო.",
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
    description: "SNES homebrew პლატფორმერი. უფასოდ გამოშვებული ავტორების მიერ.",
    sourceUrl: "https://superbossgaiden.superfamicom.org/",
  },
];
