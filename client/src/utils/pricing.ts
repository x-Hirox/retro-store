import type { IProduct } from "../types";
import { productColors, withSelectedColor } from "./productColors";

/** Extra off when the cart/order has 2+ different products. */
export const BUNDLE_EXTRA_PCT = 1;

export function gelLari(n: number) {
  return Math.round(Number(n) || 0);
}

export function getSalePrice(product: IProduct) {
  const discount = Number(product.discount) || 0;
  const original = Number(product.price) || 0;
  const final = discount > 0 ? original * (1 - discount / 100) : original;
  return {
    original,
    final: gelLari(final),
    discount,
  };
}

/** Storefront GEL: whole lari, no messy 409.18 */
export function formatGel(n: number) {
  return `${gelLari(n)} ₾`;
}

export function bundleTogether(a: number, b: number) {
  const separate = gelLari(a) + gelLari(b);
  const together = gelLari(separate * (1 - BUNDLE_EXTRA_PCT / 100));
  return {
    separate,
    together: Math.min(together, separate - 1),
    extraPct: BUNDLE_EXTRA_PCT,
  };
}

export function cartTotals(cart: Array<IProduct & { quantity: number }>) {
  const subtotal = cart.reduce(
    (sum, item) => sum + getSalePrice(item).final * Math.max(0, item.quantity || 0),
    0,
  );
  const distinct = new Set(cart.map((item) => String(item._id || ""))).size;
  if (distinct < 2) {
    return { subtotal, extraOff: 0, extraPct: 0, total: subtotal };
  }
  const together = gelLari(subtotal * (1 - BUNDLE_EXTRA_PCT / 100));
  const total = Math.min(together, subtotal - 1);
  return {
    subtotal,
    extraOff: subtotal - total,
    extraPct: BUNDLE_EXTRA_PCT,
    total,
  };
}

export function saleRange(product: IProduct) {
  const colors = productColors(product);
  if (colors.length === 0) {
    const sale = getSalePrice(product);
    return { min: sale.final, max: sale.final };
  }
  const finals = colors.map(
    (item) => getSalePrice(withSelectedColor(product, item.name)).final,
  );
  return { min: Math.min(...finals), max: Math.max(...finals) };
}

export function isBannerProduct(product: IProduct) {
  return (
    product.category === "banner-hero" ||
    product.category === "banner-middle" ||
    product.category === "banner-bottom" ||
    !!product.isHeroBanner
  );
}
