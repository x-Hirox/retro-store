import type { Request } from "express";

function publicSiteUrl(raw: string) {
  const trimmed = String(raw || "").replace(/\/+$/, "");
  try {
    const url = new URL(trimmed);
    if (url.hostname === "retrobit.ge") url.hostname = "www.retrobit.ge";
    return url.origin;
  } catch {
    return "https://www.retrobit.ge";
  }
}

export const SITE_URL = publicSiteUrl(
  process.env.SITE_URL || "https://www.retrobit.ge",
);

export const DEFAULT_OG_IMAGE = `${SITE_URL}/retrobit.png`;

export const DEFAULT_TITLE =
  "RetroBit — რეტრო კონსოლები და თამაშები საქართველოში";

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

const CRAWLER_UA =
  /googlebot|google-inspectiontool|bingbot|bingpreview|slurp|duckduckbot|baiduspider|yandex|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|pinterest|discordbot|applebot|semrushbot|ahrefsbot|dotbot|embedly|quora|outbrain|vkshare/i;

export function isCrawler(req: Request) {
  return CRAWLER_UA.test(String(req.headers["user-agent"] || ""));
}

export function escapeXml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function escapeHtml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function absUrl(url?: string | null) {
  const raw = String(url || "").trim();
  if (!raw) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  return `${SITE_URL}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

export function sitePath(path: string) {
  if (!path || path === "/") return SITE_URL + "/";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

export const STATIC_PAGES: {
  path: string;
  priority: string;
  changefreq: string;
}[] = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/gifts", priority: "0.9", changefreq: "weekly" },
  { path: "/sell", priority: "0.6", changefreq: "monthly" },
  { path: "/play", priority: "0.4", changefreq: "monthly" },
];

export const CATEGORY_BRANDS = [
  "Nintendo",
  "PlayStation",
  "Xbox",
  "Sega",
  "Chinese Consoles",
  "Bundles",
  "Atari & More",
  "accessories",
];
