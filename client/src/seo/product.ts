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

function productOffers(product: IProduct, url: string) {
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
  const description = String(product.description || product.title).slice(0, 300);
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
        keywords: productKeywords(product),
        offers: productOffers(product, url),
      },
    ],
    extraSameAs,
  );
}
