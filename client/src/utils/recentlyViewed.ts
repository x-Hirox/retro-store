import type { IProduct } from "../types";

const KEY = "retrobit_recently_viewed";
const MAX = 12;

export function trackRecentlyViewed(product: IProduct) {
  if (!product?._id) return;
  try {
    const current: IProduct[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const next = [
      product,
      ...current.filter((item) => item._id !== product._id),
    ].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    localStorage.setItem(KEY, JSON.stringify([product]));
  }
}

export function getRecentlyViewed(): IProduct[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
