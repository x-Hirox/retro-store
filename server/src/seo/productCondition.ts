export type ProductCondition = "new" | "used" | "refurbished";

export function parseCondition(value: unknown): ProductCondition | "" {
  const v = String(value || "")
    .toLowerCase()
    .trim();
  if (v === "new" || v === "used" || v === "refurbished") return v;
  return "";
}

export function productCondition(product: {
  condition?: string;
  title?: string;
  description?: string;
  tags?: string[];
}): ProductCondition {
  const explicit = parseCondition(product.condition);
  if (explicit) return explicit;
  const hay =
    `${product.title || ""} ${product.description || ""} ${(product.tags || []).join(" ")}`.toLowerCase();
  if (/შეკეთ|refurbished|repaired/.test(hay)) return "refurbished";
  if (/ახალი|\bnew\b/.test(hay)) return "new";
  return "used";
}
