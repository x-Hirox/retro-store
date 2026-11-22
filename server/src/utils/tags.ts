export function parseTags(input: unknown): string[] {
  const raw = Array.isArray(input) ? input.join(",") : String(input || "");
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of raw.split(/[,;#|/]+/)) {
    const tag = part.trim().replace(/\s+/g, " ").slice(0, 40);
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length >= 24) break;
  }
  return tags;
}

export function productKeywords(product: {
  category?: string;
  platform?: string;
  genre?: string;
  tags?: string[];
}) {
  return parseTags([
    ...(product.tags || []),
    product.platform || "",
    product.category || "",
    product.genre || "",
    "რეტრო კონსოლი",
    "თბილისი",
    "retrobit.ge",
  ]).join(", ");
}
