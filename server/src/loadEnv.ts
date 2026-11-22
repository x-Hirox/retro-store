import dns from "node:dns";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dns.setDefaultResultOrder("ipv4first");

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, "../.env") });
dotenv.config();

function stripWrappingQuotes(value: string) {
  return value.trim().replace(/^['"]+|['"]+$/g, "").trim();
}

function sanitizeCloudinaryEnv() {
  let raw = stripWrappingQuotes(process.env.CLOUDINARY_URL || "");
  raw = raw.replace(/^CLOUDINARY_URL\s*=\s*/i, "");
  raw = stripWrappingQuotes(raw);
  const match = raw.match(
    /cloudinary:\/\/([^:/\s]+):([^@/\s]+)@([a-z0-9-]+)/i,
  );
  if (match) {
    process.env.CLOUDINARY_URL = `cloudinary://${match[1]}:${match[2]}@${match[3]}`;
    process.env.CLOUDINARY_API_KEY = match[1];
    process.env.CLOUDINARY_API_SECRET = match[2];
    process.env.CLOUDINARY_CLOUD_NAME = match[3];
    return;
  }
  for (const key of [
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_CLOUD_NAME",
  ] as const) {
    if (process.env[key]) {
      process.env[key] = stripWrappingQuotes(process.env[key] || "");
    }
  }
}

sanitizeCloudinaryEnv();
