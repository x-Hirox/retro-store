export type ProductKind = "console" | "game" | "accessory";

export function parseKind(value: unknown): ProductKind | "" {
  const v = String(value || "")
    .toLowerCase()
    .trim();
  if (v === "console" || v === "game" || v === "accessory") return v;
  return "";
}

export function productKind(product: {
  kind?: string;
  title?: string;
  category?: string;
  platform?: string;
}): ProductKind {
  const explicit = parseKind(product.kind);
  if (explicit) return explicit;
  const title = `${product.title || ""} ${product.platform || ""}`.toLowerCase();
  const cat = (product.category || "").toLowerCase();
  if (/accessor|აქსესუარ/.test(cat)) return "accessory";
  if (/game|თამაშ|cartridge|კარტრიჯ/.test(cat) && !/console|კონსოლ/.test(cat)) {
    return "game";
  }
  if (/კონსოლ|console|handheld|game stick|game box/.test(title)) return "console";
  if (
    /memory card|memory stick|მეხსიერების ბარათ|controller|charger|დამტენ|cable|კაბელ|adapter|გადამყვან/.test(
      title,
    )
  ) {
    return "accessory";
  }
  if (
    /cartridge|კარტრიჯ|disc|დისკ|\bgame\b|თამაშ/.test(title) &&
    !/console|კონსოლ/.test(title)
  ) {
    return "game";
  }
  return "console";
}
