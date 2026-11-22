import { useEffect } from "react";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  absUrl,
  canonicalUrl,
} from "../seo/site";

type SeoHeadProps = {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "product";
  jsonLd?: unknown;
  noindex?: boolean;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"][data-seo="1"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute("data-seo", "1");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const hreflang = extra?.hrefLang || "";
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"][data-seo="1"]`
    : `link[rel="${rel}"][data-seo="1"]:not([hreflang])`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute("data-seo", "1");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      el.setAttribute(key, value);
    }
  }
}

export default function SeoHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  type = "website",
  jsonLd,
  noindex,
}: SeoHeadProps) {
  const encodedJson = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    const fullTitle = title.includes("RetroBit") ? title : `${title} | RetroBit`;
    const url = canonicalUrl(path);
    const ogImage = absUrl(image || DEFAULT_OG_IMAGE);
    document.title = fullTitle;
    document.documentElement.lang = "ka";

    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    );
    upsertMeta("name", "geo.region", "GE");
    upsertMeta("name", "geo.placename", "Tbilisi");
    upsertLink("canonical", url);
    upsertLink("alternate", url, { hrefLang: "ka" });
    upsertLink("alternate", url, { hrefLang: "x-default" });
    upsertMeta("property", "og:site_name", "RetroBit");
    upsertMeta("property", "og:locale", "ka_GE");
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:image:alt", title);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);

    let script = document.head.querySelector(
      'script[type="application/ld+json"][data-seo="1"]',
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "1");
      document.head.appendChild(script);
    }
    script.textContent = encodedJson;
  }, [title, description, path, image, type, encodedJson, noindex]);

  return null;
}
