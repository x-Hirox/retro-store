export const SITE_URL = "https://retrobit.ge";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/retrobit.png`;
export const DEFAULT_TITLE =
  "RetroBit — რეტრო კონსოლები და თამაშები საქართველოში";
export const DEFAULT_DESCRIPTION =
  "მეორადი რეტრო კონსოლები და თამაშები თბილისში: Nintendo DS Lite, DSi, 3DS, PlayStation, Sega, Xbox. შემოწმებული ტექნიკა, მიწოდება საქართველოში — retrobit.ge";

export function canonicalUrl(path: string) {
  if (!path || path === "/") return `${SITE_URL}/`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

export function absUrl(url?: string | null) {
  const raw = String(url || "").trim();
  if (!raw) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  return `${SITE_URL}${raw.startsWith("/") ? raw : `/${raw}`}`;
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

export function breadcrumbGraph(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function jsonLdGraph(nodes: unknown[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationGraph(), websiteGraph(), ...nodes],
  };
}
