import type { Request } from "express";

export const SITE_URL = (process.env.SITE_URL || "https://retrobit.ge").replace(
  /\/+$/,
  "",
);

export const DEFAULT_OG_IMAGE = `${SITE_URL}/retrobit.png`;

export const DEFAULT_TITLE =
  "RetroBit — რეტრო კონსოლები და თამაშები საქართველოში";

export const DEFAULT_DESCRIPTION =
  "მეორადი რეტრო კონსოლები და თამაშები თბილისში: Nintendo DS Lite, DSi, 3DS, PlayStation, Sega, Xbox. შემოწმებული ტექნიკა, მიწოდება საქართველოში — retrobit.ge";

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
