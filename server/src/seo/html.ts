import {
  CONTACT,
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
  keywords,
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
  keywords?: string;
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
${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : ""}
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

export function organizationGraph(sameAs: string[] = []) {
  return {
    "@type": ["Store", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: "RetroBit",
    alternateName: ["RetroBit Georgia", "retrobit.ge"],
    legalName: "RetroBit",
    url: SITE_URL,
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    image: DEFAULT_OG_IMAGE,
    logo: absUrl("/retrobit.png"),
    priceRange: "GEL",
    address: {
      "@type": "PostalAddress",
      addressLocality: CONTACT.city,
      addressCountry: CONTACT.country,
    },
    areaServed: { "@type": "Country", name: "Georgia" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.phoneE164,
      email: CONTACT.email,
      contactType: "customer support",
      areaServed: "GE",
      availableLanguage: ["ka", "en"],
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: CONTACT.opens,
      closes: CONTACT.closes,
    },
    disambiguatingDescription:
      "Tbilisi retro video game store. Not affiliated with Retro-Bit (retro-bit.com).",
    ...(sameAs.length ? { sameAs } : {}),
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

export function jsonLdGraph(nodes: unknown[] = [], sameAs: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationGraph(sameAs), websiteGraph(), ...nodes],
  };
}
