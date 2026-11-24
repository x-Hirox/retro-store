export type PageMediaSeed = {
  key: string;
  title: string;
  imageUrl: string;
  order: number;
};

export const HOME_PAGE_MEDIA_KEYS = [
  "home_consoles",
  "home_handhelds",
  "home_games",
  "home_accessories",
];

export const PAGE_MEDIA_SEED: PageMediaSeed[] = [
  {
    key: "sell_hero",
    title: "Sell — სკივრი",
    imageUrl: "/images/sell-chest.jpg",
    order: 0,
  },
  {
    key: "sell_collection",
    title: "Sell — კოლექცია",
    imageUrl: "/images/sell-gameboy.jpg",
    order: 1,
  },
];
