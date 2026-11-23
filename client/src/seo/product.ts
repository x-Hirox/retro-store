import type { IProduct } from "../types";
import { saleRange } from "../utils/pricing";
import {
  productColors,
  productPhotos,
  totalStock,
} from "../utils/productColors";
import { productKeywords } from "../utils/tags";
import {
  SITE_URL,
  absUrl,
  breadcrumbGraph,
  canonicalUrl,
  jsonLdGraph,
} from "./site";
import { productPath } from "./productUrl";

export { parseProductParam, productPath, slugifyProductTitle } from "./productUrl";

export function isNewProduct(product: {
  title?: string;
  description?: string;
  tags?: string[];
}) {
  const hay = `${product.title || ""} ${product.description || ""} ${(product.tags || []).join(" ")}`.toLowerCase();
  return /ახალი|\bnew\b|sealed|unopened/.test(hay);
}

export function productSeoTitle(product: { title?: string }, price: number) {
  const gel = Math.round(Number(price) || 0);
  return `${product.title || "პროდუქტი"} — ${gel} ₾ ყიდვა თბილისში`;
}

export function productSeoDescription(
  product: { title?: string; description?: string },
  price: number,
) {
  const gel = Math.round(Number(price) || 0);
  const base = String(product.description || product.title || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
  return `${base} ფასი ${gel} GEL. ყიდვა RetroBit-ზე, თბილისი.`;
}

function itemCondition(product: IProduct) {
  return isNewProduct(product)
    ? "https://schema.org/NewCondition"
    : "https://schema.org/UsedCondition";
}

function productOffers(product: IProduct, url: string) {
  const inStock = totalStock(product) > 0;
  const availability = inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
  const range = saleRange(product);
  const base = {
    priceCurrency: "GEL",
    availability,
    itemCondition: itemCondition(product),
    seller: { "@id": `${SITE_URL}/#organization` },
    url,
  };
  if (range.min !== range.max) {
    return {
      "@type": "AggregateOffer",
      ...base,
      lowPrice: range.min.toFixed(2),
      highPrice: range.max.toFixed(2),
      offerCount: Math.max(1, productColors(product).length),
    };
  }
  return {
    "@type": "Offer",
    ...base,
    price: range.min.toFixed(2),
  };
}

export function productJsonLd(product: IProduct, extraSameAs: string[] = []) {
  const path = productPath(product);
  const url = canonicalUrl(path);
  const range = saleRange(product);
  const description = productSeoDescription(product, range.min);
  const photos = productPhotos(product);
  return jsonLdGraph(
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
        itemCondition: itemCondition(product),
        keywords: productKeywords(product),
        offers: productOffers(product, url),
      },
    ],
    extraSameAs,
  );
}
