export const SITE_URL = "https://www.retrobit.ge";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/retrobit.png`;
export const DEFAULT_TITLE =
  "RetroBit.ge — რეტრო კონსოლები და თამაშები თბილისში";
export const CONTACT = {
  name: "RetroBit",
  phoneDisplay: "+995 595 95 00 39",
  phoneE164: "+995595950039",
  email: "retrobit.support@gmail.com",
  hoursKa: "ორშ–კვი 10:00–22:00",
  opens: "10:00",
  closes: "22:00",
  city: "Tbilisi",
  cityKa: "თბილისი, საქართველო",
  country: "GE",
};
export const DEFAULT_DESCRIPTION =
  "მეორადი რეტრო კონსოლები და თამაშები თბილისში: Nintendo, PlayStation, Sega, Xbox და R36S. კონტაქტი: +995 595 95 00 39, retrobit.support@gmail.com. მიწოდება საქართველოში — retrobit.ge";

export function collectSameAs(settings?: {
  socialInstagram?: string;
  socialFacebook?: string;
  socialTiktok?: string;
  socialYoutube?: string;
  socialX?: string;
} | null) {
  return [
    settings?.socialInstagram,
    settings?.socialFacebook,
    settings?.socialTiktok,
    settings?.socialYoutube,
    settings?.socialX,
  ]
    .map((url) => String(url || "").trim())
    .filter((url) => /^https?:\/\//i.test(url));
}

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

export function jsonLdGraph(nodes: unknown[] = [], sameAs: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationGraph(sameAs), websiteGraph(), ...nodes],
  };
}
