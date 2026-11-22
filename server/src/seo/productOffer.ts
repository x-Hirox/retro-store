import { productKeywords } from "../utils/tags.js";
import { SITE_URL, absUrl, sitePath } from "./config.js";
import { breadcrumbGraph, jsonLdGraph } from "./html.js";
import { productPath } from "./productUrl.js";

export type LeanProduct = {
  _id: unknown;
  title: string;
  description?: string;
  price?: number;
  discount?: number;
  category?: string;
  imageUrl?: string;
  images?: string[];
  colors?: {
    name?: string;
    hex?: string;
    imageUrl?: string;
    stock?: number;
    price?: number | null;
    discount?: number | null;
  }[];
  stock?: number;
  platform?: string;
  genre?: string;
  tags?: string[];
};

function colorsOf(product: LeanProduct) {
  return (product.colors || []).filter((item) =>
    String(item?.name || "").trim(),
  );
}

function colorStock(item?: { stock?: number }) {
  return Math.max(0, Math.floor(Number(item?.stock) || 0));
}

export function totalStock(product: LeanProduct) {
  const colors = colorsOf(product);
  if (colors.length > 0) {
    return colors.reduce((sum, item) => sum + colorStock(item), 0);
  }
  return Math.max(0, Math.floor(Number(product.stock) || 0));
}

type LeanColor = NonNullable<LeanProduct["colors"]>[number];

function variantPrice(product: LeanProduct, color?: LeanColor) {
  const n = Number(color?.price);
  if (Number.isFinite(n) && n > 0) return n;
  return Number(product.price) || 0;
}

function variantDiscount(product: LeanProduct, color?: LeanColor) {
  if (color && color.discount != null && Number.isFinite(Number(color.discount))) {
    return Math.min(90, Math.max(0, Number(color.discount)));
  }
  return Math.min(90, Math.max(0, Number(product.discount) || 0));
}

function saleOf(original: number, discount: number) {
  const final = discount > 0 ? original * (1 - discount / 100) : original;
  return Number(final.toFixed(2));
}

function saleRange(product: LeanProduct) {
  const colors = colorsOf(product);
  if (colors.length === 0) {
    const final = saleOf(Number(product.price) || 0, Number(product.discount) || 0);
    return { min: final, max: final };
  }
  const finals = colors.map((item) =>
    saleOf(variantPrice(product, item), variantDiscount(product, item)),
  );
  return { min: Math.min(...finals), max: Math.max(...finals) };
}

export function productPhotos(product: LeanProduct) {
  const colors = colorsOf(product);
  const urls = [
    product.imageUrl,
    ...(product.images || []),
    ...colors.map((item) => item.imageUrl),
  ];
  const unique: string[] = [];
  for (const url of urls) {
    const clean = String(url || "").trim();
    if (clean && !unique.includes(clean)) unique.push(clean);
  }
  return unique;
}

function productOffers(product: LeanProduct, url: string) {
  const inStock = totalStock(product) > 0;
  const availability = inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
  const range = saleRange(product);
  const base = {
    priceCurrency: "GEL",
    availability,
    itemCondition: "https://schema.org/UsedCondition",
    seller: { "@id": `${SITE_URL}/#organization` },
    url,
  };
  if (range.min !== range.max) {
    return {
      "@type": "AggregateOffer",
      ...base,
      lowPrice: range.min.toFixed(2),
      highPrice: range.max.toFixed(2),
      offerCount: Math.max(1, colorsOf(product).length),
    };
  }
  return {
    "@type": "Offer",
    ...base,
    price: range.min.toFixed(2),
  };
}

export function productCrawlerPayload(product: LeanProduct, sameAs: string[]) {
  const path = productPath(product);
  const url = sitePath(path);
  const description = String(product.description || product.title).slice(0, 300);
  const photos = productPhotos(product);
  const range = saleRange(product);
  const inStock = totalStock(product) > 0;
  const jsonLd = jsonLdGraph(
    [
      breadcrumbGraph([
        { name: "მთავარი", path: "/" },
        {
          name: product.category || "კატეგორია",
          path: `/category/${encodeURIComponent(product.category || "Nintendo")}`,
        },
        { name: product.title, path },
      ]),
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.title,
        description,
        url,
        sku: String(product._id),
        image: (photos.length ? photos : [product.imageUrl || ""]).map((src) =>
          absUrl(src),
        ),
        brand: {
          "@type": "Brand",
          name: product.platform || product.category || "RetroBit",
        },
        category: product.category,
        keywords: productKeywords(product),
        offers: productOffers(product, url),
      },
    ],
    sameAs,
  );
  return {
    path,
    url,
    description,
    keywords: productKeywords(product),
    photos,
    price: range.min,
    inStock,
    jsonLd,
  };
}
