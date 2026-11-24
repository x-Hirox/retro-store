export type ProductCondition = "new" | "used" | "refurbished";

export const CONDITION_OPTIONS: { value: ProductCondition; label: string }[] = [
  { value: "new", label: "ახალი" },
  { value: "used", label: "მეორადი" },
  { value: "refurbished", label: "შეკეთებული" },
];

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

export function conditionLabel(value: ProductCondition) {
  return (
    CONDITION_OPTIONS.find((item) => item.value === value)?.label || "მეორადი"
  );
}
