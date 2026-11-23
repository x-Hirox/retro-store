const KA: Record<string, string> = {
  ა: "a",
  ბ: "b",
  გ: "g",
  დ: "d",
  ე: "e",
  ვ: "v",
  ზ: "z",
  თ: "t",
  ი: "i",
  კ: "k",
  ლ: "l",
  მ: "m",
  ნ: "n",
  ო: "o",
  პ: "p",
  ჟ: "zh",
  რ: "r",
  ს: "s",
  ტ: "t",
  უ: "u",
  ფ: "f",
  ქ: "k",
  ღ: "gh",
  ყ: "q",
  შ: "sh",
  ჩ: "ch",
  ც: "ts",
  ძ: "dz",
  წ: "ts",
  ჭ: "ch",
  ხ: "kh",
  ჯ: "j",
  ჰ: "h",
};

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;
const LEGACY_ID_RE = /^(.*)-([a-f0-9]{24})$/i;
const SHORT_ID_RE = /^(.*)-([a-f0-9]{4})$/i;
const SHORT_ID_LEN = 4;
const SLUG_WORDS = 4;

const STOP = new Set([
  "portable",
  "handheld",
  "console",
  "and",
  "the",
  "with",
  "for",
  "new",
  "used",
  "box",
  "boxed",
  "original",
  "ori",
  "tamashi",
  "akhali",
  "qutit",
  "saqartvelo",
  "tbilisi",
  "retrobit",
  "plus",
  "more",
  "enjoy",
  "games",
  "game",
  "anywhere",
  "anytime",
  "official",
  "complete",
  "set",
  "pack",
  "bundle",
]);

export type ParsedProductParam = {
  id?: string;
  prefix?: string;
  slug: string;
};

export function slugifyProductTitle(title: string): string {
  let value = String(title || "").trim().toLowerCase();
  value = value.split("|")[0] || value;
  value = value.replace(/\([^)]*\)/g, " ");
  value = value.replace(/[ა-ჰ]/g, (ch) => KA[ch] || "");
  value = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  value = value.replace(/(\d)[, ](?=\d)/g, "$1");
  const tokens = value
    .replace(/[^a-z0-9]+/g, "-")
    .split("-")
    .filter(Boolean)
    .filter((token) => !STOP.has(token))
    .filter((token) => !(token.length > 4 && /^\d+$/.test(token)));
  return tokens.slice(0, SLUG_WORDS).join("-") || "product";
}

export function idHex(id: unknown): string {
  if (id && typeof id === "object" && "toHexString" in id) {
    const fn = (id as { toHexString?: () => string }).toHexString;
    if (typeof fn === "function") return fn.call(id).toLowerCase();
  }
  return String(id || "").toLowerCase();
}

export function shortProductId(id: unknown): string {
  return idHex(id).slice(0, SHORT_ID_LEN);
}

export function productPath(product: { _id: unknown; title?: string }): string {
  const id = String(product._id || "");
  const slug = slugifyProductTitle(product.title || "");
  const short = shortProductId(id);
  return short ? `/product/${slug}-${short}` : `/product/${slug}`;
}

export function parseProductParam(param: string): ParsedProductParam | null {
  let raw = String(param || "").trim();
  try {
    raw = decodeURIComponent(raw);
  } catch {
    /* keep raw */
  }
  if (!raw) return null;
  if (OBJECT_ID_RE.test(raw)) return { id: raw, slug: "" };
  const legacy = raw.match(LEGACY_ID_RE);
  if (legacy?.[2]) return { id: legacy[2], slug: legacy[1] || "" };
  const short = raw.match(SHORT_ID_RE);
  if (short?.[2]) return { prefix: short[2].toLowerCase(), slug: short[1] || "" };
  return { slug: raw };
}

export function matchProduct<T extends { _id: unknown; title?: string }>(
  products: T[],
  param: string,
): T | undefined {
  const parsed = parseProductParam(param);
  if (!parsed) return undefined;
  const canonical = `/product/${String(param || "").replace(/^\/product\//, "")}`;
  const byPath = products.find((item) => productPath(item) === canonical);
  if (byPath) return byPath;
  if (parsed.id && parsed.id.length === 24) {
    const want = parsed.id.toLowerCase();
    return products.find((item) => idHex(item._id) === want);
  }
  if (parsed.prefix) {
    const hits = products.filter((item) =>
      idHex(item._id).startsWith(parsed.prefix || ""),
    );
    if (hits.length === 1) return hits[0];
    return (
      hits.find((item) => slugifyProductTitle(item.title || "") === parsed.slug) ||
      hits[0]
    );
  }
  if (parsed.slug) {
    return products.find(
      (item) => slugifyProductTitle(item.title || "") === parsed.slug,
    );
  }
  return undefined;
}

export function requestProductPath(pathname: string): string {
  return String(pathname || "")
    .replace(/^\/seo(?=\/|$)/, "")
    .replace(/\/+$/, "");
}
