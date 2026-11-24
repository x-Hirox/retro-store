import type { IPageMedia } from "../types";

export const PAGE_MEDIA_FALLBACK: Record<string, string> = {
  sell_hero: "/images/sell-chest.jpg",
  sell_collection: "/images/sell-gameboy.jpg",
};

export function pageMediaUrl(items: IPageMedia[], key: string) {
  const hit = items.find((item) => item.key === key);
  return String(hit?.imageUrl || "").trim() || PAGE_MEDIA_FALLBACK[key] || "";
}

export function onPageMediaError(img: HTMLImageElement, key: string) {
  const fallback = PAGE_MEDIA_FALLBACK[key];
  if (!fallback || img.dataset.fb === "1") return;
  img.dataset.fb = "1";
  img.src = fallback;
}
