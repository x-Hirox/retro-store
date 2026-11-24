export type BrandSeed = {
  name: string;
  slug: string;
  imageUrl: string;
  order: number;
};

export const BRAND_SEED: BrandSeed[] = [
  { name: "Nintendo", slug: "Nintendo", imageUrl: "/nintendo.svg", order: 0 },
  {
    name: "PlayStation",
    slug: "PlayStation",
    imageUrl: "/playstation.svg",
    order: 1,
  },
  { name: "Xbox", slug: "Xbox", imageUrl: "/xbox.svg", order: 2 },
  { name: "Sega", slug: "Sega", imageUrl: "/sega.svg", order: 3 },
];
