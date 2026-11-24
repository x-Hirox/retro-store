export type PageMediaSeed = {
  key: string;
  title: string;
  imageUrl: string;
  order: number;
  settingsField?: string;
};

export const PAGE_MEDIA_SEED: PageMediaSeed[] = [
  {
    key: "home_consoles",
    title: "კონსოლები",
    imageUrl: "/images/console-home.png",
    order: 0,
    settingsField: "catImageHome",
  },
  {
    key: "home_handhelds",
    title: "ხელის კონსოლები",
    imageUrl: "/images/handhelds.png",
    order: 1,
    settingsField: "catImageHand",
  },
  {
    key: "home_games",
    title: "თამაშები",
    imageUrl: "/images/games.png",
    order: 2,
    settingsField: "catImageGames",
  },
  {
    key: "home_accessories",
    title: "აქსესუარები",
    imageUrl: "/images/accessories.png",
    order: 3,
    settingsField: "catImageAcc",
  },
  {
    key: "sell_hero",
    title: "Sell — სკივრი",
    imageUrl: "/images/sell-chest.jpg",
    order: 4,
  },
  {
    key: "sell_collection",
    title: "Sell — კოლექცია",
    imageUrl: "/images/sell-gameboy.jpg",
    order: 5,
  },
];

export function isRemotePageImage(url?: string) {
  return /^https?:\/\//i.test(String(url || "").trim());
}
