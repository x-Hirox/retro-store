import {
  DEFAULT_OG_IMAGE,
  SITE_URL,
  absUrl,
  escapeHtml,
  sitePath,
} from "./config.js";

export function crawlerDocument({
  title,
  description,
  path,
  image,
  jsonLd,
  h1,
  bodyHtml,
  noindex,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  jsonLd: unknown;
  h1: string;
  bodyHtml: string;
  noindex?: boolean;
  type?: string;
}) {
  const url = sitePath(path);
  const ogImage = absUrl(image || DEFAULT_OG_IMAGE);
  const robots = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large";
  const fullTitle = title.includes("RetroBit") ? title : `${title} | RetroBit`;
  return `<!doctype html>
<html lang="ka">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta name="robots" content="${robots}" />
<meta name="geo.region" content="GE" />
<meta name="geo.placename" content="Tbilisi" />
<link rel="canonical" href="${escapeHtml(url)}" />
<link rel="alternate" hrefLang="ka" href="${escapeHtml(url)}" />
<link rel="alternate" hrefLang="x-default" href="${escapeHtml(url)}" />
<meta property="og:site_name" content="RetroBit" />
<meta property="og:locale" content="ka_GE" />
<meta property="og:type" content="${escapeHtml(type)}" />
<meta property="og:title" content="${escapeHtml(fullTitle)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${escapeHtml(url)}" />
<meta property="og:image" content="${escapeHtml(ogImage)}" />
<meta property="og:image:alt" content="${escapeHtml(h1)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(ogImage)}" />
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
</head>
<body>
<main>
<h1>${escapeHtml(h1)}</h1>
${bodyHtml}
<p><a href="${escapeHtml(SITE_URL)}/">RetroBit — რეტრო მაღაზია</a></p>
</main>
</body>
</html>`;
}

export function organizationGraph() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "RetroBit",
    alternateName: "RetroStore",
    url: SITE_URL,
    email: "retrobit.support@gmail.com",
    logo: absUrl("/retrobit.png"),
    image: DEFAULT_OG_IMAGE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tbilisi",
      addressCountry: "GE",
    },
    areaServed: { "@type": "Country", name: "Georgia" },
  };
}

export function websiteGraph() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "RetroBit",
    inLanguage: ["ka", "en"],
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbGraph(
  items: { name: string; path: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: sitePath(item.path),
    })),
  };
}

export function jsonLdGraph(nodes: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationGraph(), websiteGraph(), ...nodes],
  };
}
