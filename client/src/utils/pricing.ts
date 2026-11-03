import type { IProduct } from "../types";

export function getSalePrice(product: IProduct) {
  const discount = Number(product.discount) || 0;
  const original = Number(product.price) || 0;
  const final = discount > 0 ? original * (1 - discount / 100) : original;
  return {
    original,
    final: Number(final.toFixed(2)),
    discount,
  };
}

export function isBannerProduct(product: IProduct) {
  return (
    product.category === "banner-hero" ||
    product.category === "banner-middle" ||
    product.category === "banner-bottom" ||
    !!product.isHeroBanner
  );
}
