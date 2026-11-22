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
const SLUG_ID_RE = /^(.*)-([a-f0-9]{24})$/i;
const SLUG_MAX = 70;

export function slugifyProductTitle(title: string): string {
  let value = String(title || "").trim().toLowerCase();
  value = value.replace(/[ა-ჰ]/g, (ch) => KA[ch] || "");
  value = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  value = value.replace(/(\d)[, ](?=\d)/g, "$1");
  value = value.replace(/&/g, " and ");
  value = value.replace(/[^a-z0-9]+/g, "-");
  value = value.replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
  if (value.length > SLUG_MAX) {
    const cut = value.slice(0, SLUG_MAX);
    const lastHyphen = cut.lastIndexOf("-");
    value = (lastHyphen > 24 ? cut.slice(0, lastHyphen) : cut).replace(/-+$/g, "");
  }
  return value || "product";
}

export function productPath(product: { _id: unknown; title?: string }): string {
  const id = String(product._id || "");
  const slug = slugifyProductTitle(product.title || "");
  return `/product/${slug}-${id}`;
}

export function parseProductParam(
  param: string,
): { id: string; slug: string } | null {
  let raw = String(param || "").trim();
  try {
    raw = decodeURIComponent(raw);
  } catch {
    /* keep raw */
  }
  if (!raw) return null;
  if (OBJECT_ID_RE.test(raw)) return { id: raw, slug: "" };
  const match = raw.match(SLUG_ID_RE);
  const id = match?.[2];
  if (id) return { id, slug: match?.[1] || "" };
  return null;
}

export function requestProductPath(pathname: string): string {
  return String(pathname || "")
    .replace(/^\/seo(?=\/|$)/, "")
    .replace(/\/+$/, "");
}
