export function productImageAlt(
  product: {
    title?: string;
    platform?: string;
    category?: string;
  },
  extra?: string,
) {
  const bits = [product.title, product.platform || product.category, extra]
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return bits.length ? `${bits.join(" — ")} | RetroBit` : "RetroBit";
}
