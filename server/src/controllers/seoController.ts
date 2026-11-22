import type { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import PlatformCard from "../models/PlatformCard.js";
import SiteSettings from "../models/SiteSettings.js";
import {
  CATEGORY_BRANDS,
  CONTACT,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_URL,
  STATIC_PAGES,
  absUrl,
  collectSameAs,
  escapeHtml,
  escapeXml,
  sitePath,
} from "../seo/config.js";
import { productKeywords } from "../utils/tags.js";
import {
  breadcrumbGraph,
  crawlerDocument,
  jsonLdGraph,
} from "../seo/html.js";

function isBanner(product: {
  isHeroBanner?: boolean;
  category?: string;
}) {
  return (
    !!product.isHeroBanner ||
    product.category === "banner-hero" ||
    product.category === "banner-middle" ||
    product.category === "banner-bottom"
  );
}

function salePrice(product: { price?: number; discount?: number }) {
  const original = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const final = discount > 0 ? original * (1 - discount / 100) : original;
  return Number(final.toFixed(2));
}

async function loadSameAs() {
  try {
    const settings = await SiteSettings.findOne()
      .select(
        "socialInstagram socialFacebook socialTiktok socialYoutube socialX",
      )
      .lean();
    return collectSameAs(settings);
  } catch {
    return [];
  }
}

function isoDay(date?: Date | string) {
  const value = date ? new Date(date) : new Date();
  if (Number.isNaN(value.getTime())) return new Date().toISOString().slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export async function sitemapXml(_req: Request, res: Response) {
  const [products, cards] = await Promise.all([
    Product.find({
      isHeroBanner: { $ne: true },
      category: { $nin: ["banner-hero", "banner-middle", "banner-bottom"] },
    })
      .select("title imageUrl createdAt category")
      .lean(),
    PlatformCard.find().select("brand slug name").lean(),
  ]);

  const urls: {
    loc: string;
    lastmod?: string;
    changefreq: string;
    priority: string;
    image?: { loc: string; title: string };
  }[] = [];

  for (const page of STATIC_PAGES) {
    urls.push({
      loc: sitePath(page.path),
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: isoDay(),
    });
  }

  const brands = new Set(CATEGORY_BRANDS);
  for (const card of cards) {
    if (card.brand) brands.add(card.brand);
  }
  for (const brand of brands) {
    urls.push({
      loc: sitePath(`/category/${encodeURIComponent(brand)}`),
      changefreq: "weekly",
      priority: "0.8",
    });
  }
  for (const card of cards) {
    if (!card.brand || !card.slug) continue;
    urls.push({
      loc: sitePath(
        `/category/${encodeURIComponent(card.brand)}/${encodeURIComponent(card.slug)}`,
      ),
      changefreq: "weekly",
      priority: "0.7",
    });
  }

  for (const product of products) {
    if (isBanner(product)) continue;
    const loc = sitePath(`/product/${product._id}`);
    urls.push({
      loc,
      lastmod: isoDay(product.createdAt),
      changefreq: "weekly",
      priority: "0.8",
      image: product.imageUrl
        ? { loc: absUrl(product.imageUrl), title: product.title }
        : undefined,
    });
  }

  const seen = new Set<string>();
  const body = urls
    .filter((item) => {
      if (seen.has(item.loc)) return false;
      seen.add(item.loc);
      return true;
    })
    .map((item) => {
      const image = item.image
        ? `<image:image><image:loc>${escapeXml(item.image.loc)}</image:loc><image:title>${escapeXml(item.image.title)}</image:title></image:image>`
        : "";
      return `<url><loc>${escapeXml(item.loc)}</loc>${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ""}<changefreq>${item.changefreq}</changefreq><priority>${item.priority}</priority>${image}</url>`;
    })
    .join("");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=1800");
  res.send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${body}</urlset>`,
  );
}

export function robotsTxt(_req: Request, res: Response) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /checkout\nDisallow: /cart\nDisallow: /profile\nDisallow: /login\nDisallow: /register\nDisallow: /forgot-password\nDisallow: /reset-password\nDisallow: /verify-email\nDisallow: /order-success\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  );
}

export async function productCrawlerHtml(id: string, res: Response) {
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).type("html").send(
      crawlerDocument({
        title: "პროდუქტი ვერ მოიძებნა",
        description: DEFAULT_DESCRIPTION,
        path: `/product/${id}`,
        jsonLd: jsonLdGraph([]),
        h1: "პროდუქტი ვერ მოიძებნა",
        bodyHtml: "<p>ეს პროდუქტი აღარ არის RetroBit-ზე.</p>",
        noindex: true,
      }),
    );
    return;
  }
  const product = await Product.findById(id).lean();
  if (!product || isBanner(product)) {
    res.status(404).type("html").send(
      crawlerDocument({
        title: "პროდუქტი ვერ მოიძებნა",
        description: DEFAULT_DESCRIPTION,
        path: `/product/${id}`,
        jsonLd: jsonLdGraph([]),
        h1: "პროდუქტი ვერ მოიძებნა",
        bodyHtml: "<p>ეს პროდუქტი აღარ არის RetroBit-ზე.</p>",
        noindex: true,
      }),
    );
    return;
  }
  const price = salePrice(product);
  const inStock = (product.stock ?? 0) > 0;
  const path = `/product/${product._id}`;
  const description = String(product.description || DEFAULT_DESCRIPTION).slice(
    0,
    300,
  );
  const crumbs = [
    { name: "მთავარი", path: "/" },
    {
      name: product.category || "კატეგორია",
      path: `/category/${encodeURIComponent(product.category || "Nintendo")}`,
    },
    { name: product.title, path },
  ];
  const keywords = productKeywords(product);
  const jsonLd = jsonLdGraph(
    [
      breadcrumbGraph(crumbs),
      {
        "@type": "Product",
        name: product.title,
        description,
        image: [absUrl(product.imageUrl), ...(product.images || []).map(absUrl)],
        brand: {
          "@type": "Brand",
          name: product.platform || product.category || "RetroBit",
        },
        category: product.category,
        keywords,
        offers: {
          "@type": "Offer",
          url: sitePath(path),
          priceCurrency: "GEL",
          price: price.toFixed(2),
          availability: inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/UsedCondition",
          seller: { "@id": `${SITE_URL}/#organization` },
        },
      },
    ],
    await loadSameAs(),
  );
  res.type("html").send(
    crawlerDocument({
      title: product.title,
      description,
      path,
      image: product.imageUrl,
      jsonLd,
      h1: product.title,
      type: "product",
      keywords,
      bodyHtml: `<p>${escapeHtml(description)}</p><p>ფასი: ${price} GEL. ${inStock ? "მარაგშია" : "ამოიწურა"}.</p><p><img src="${escapeHtml(absUrl(product.imageUrl))}" alt="${escapeHtml(product.title)}" /></p>`,
    }),
  );
}

export async function categoryCrawlerHtml(
  platform: string,
  sub: string | undefined,
  res: Response,
) {
  const brand = decodeURIComponent(platform || "");
  const subName = sub ? decodeURIComponent(sub) : "";
  const h1 = subName ? `${brand} — ${subName}` : brand || "კატეგორია";
  const path = sub
    ? `/category/${encodeURIComponent(brand)}/${encodeURIComponent(subName)}`
    : `/category/${encodeURIComponent(brand)}`;
  const description = `${h1} — მეორადი რეტრო კონსოლები და თამაშები RetroBit-ზე. მიწოდება საქართველოში.`;
  const crumbs = [
    { name: "მთავარი", path: "/" },
    { name: brand, path: `/category/${encodeURIComponent(brand)}` },
  ];
  if (subName) crumbs.push({ name: subName, path });
  res.type("html").send(
    crawlerDocument({
      title: h1,
      description,
      path,
      jsonLd: jsonLdGraph([breadcrumbGraph(crumbs)], await loadSameAs()),
      h1,
      bodyHtml: `<p>${escapeHtml(description)}</p>`,
    }),
  );
}

export async function giftsCrawlerHtml(res: Response) {
  const path = "/gifts";
  const h1 = "საჩუქრები";
  const description =
    "რეტრო საჩუქრები თბილისიდან: კონსოლის ბუნდლები, Nintendo, PlayStation და კომპლექტები RetroBit-ზე.";
  res.type("html").send(
    crawlerDocument({
      title: h1,
      description,
      path,
      jsonLd: jsonLdGraph(
        [
          breadcrumbGraph([
            { name: "მთავარი", path: "/" },
            { name: h1, path },
          ]),
        ],
        await loadSameAs(),
      ),
      h1,
      bodyHtml: `<p>${escapeHtml(description)}</p>`,
    }),
  );
}

export async function homeCrawlerHtml(res: Response) {
  res.type("html").send(
    crawlerDocument({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      path: "/",
      image: DEFAULT_OG_IMAGE,
      jsonLd: jsonLdGraph([], await loadSameAs()),
      h1: DEFAULT_TITLE,
      bodyHtml: `<p>${escapeHtml(DEFAULT_DESCRIPTION)}</p>
<p>ტელეფონი: <a href="tel:${CONTACT.phoneE164}">${escapeHtml(CONTACT.phoneDisplay)}</a></p>
<p>ელფოსტა: <a href="mailto:${CONTACT.email}">${escapeHtml(CONTACT.email)}</a></p>
<p>${escapeHtml(CONTACT.cityKa)} · ${escapeHtml(CONTACT.hoursKa)}</p>
<p>RetroBit არის თბილისის რეტრო მაღაზია და არ არის დაკავშირებული Retro-Bit (retro-bit.com) ბრენდთან.</p>
<p><a href="${SITE_URL}/gifts">საჩუქრები</a> · <a href="${SITE_URL}/category/Nintendo">Nintendo</a> · <a href="${SITE_URL}/category/PlayStation">PlayStation</a></p>`,
    }),
  );
}
