import type { Request, Response, NextFunction } from "express";

export function isAdminEmail(email?: string | null): boolean {
  const fallback = "grdzelishvilibeqa1990@gmail.com";
  const list = (process.env.ADMIN_EMAILS || fallback)
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(email && list.includes(email.toLowerCase().trim()));
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET აკლია");
  }
  return secret;
}

export function securityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.setHeader("X-DNS-Prefetch-Control", "off");
  next();
}

const hits = new Map<string, number[]>();

export function rateLimit(windowMs: number, max: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const forwarded = req.headers["x-forwarded-for"];
    const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const ip = String(
      req.ip || forwardedIp || req.socket?.remoteAddress || "",
    )
      .split(",")[0]
      .trim();
    const key = `${ip}:${req.path}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    const recent = (hits.get(key) || []).filter((t) => t > windowStart);
    if (recent.length >= max) {
      res.status(429).json({
        message: "ძალიან ბევრი მცდელობაა. სცადე ცოტა ხანში.",
      });
      return;
    }
    recent.push(now);
    hits.set(key, recent);
    next();
  };
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function clampText(value: unknown, max: number): string {
  return String(value || "")
    .trim()
    .slice(0, max);
}
