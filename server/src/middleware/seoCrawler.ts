import type { NextFunction, Request, Response } from "express";
import { isCrawler } from "../seo/config.js";
import {
  categoryCrawlerHtml,
  giftsCrawlerHtml,
  homeCrawlerHtml,
  productCrawlerHtml,
} from "../controllers/seoController.js";

const PRODUCT_RE = /^\/(?:seo\/)?product\/([^/]+)\/?$/;
const CATEGORY_RE = /^\/(?:seo\/)?category\/([^/]+)(?:\/([^/]+))?\/?$/;

export async function seoCrawlerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.method !== "GET") {
    next();
    return;
  }
  const path = req.path;
  if (path.startsWith("/api/")) {
    next();
    return;
  }
  const forceSeo = path.startsWith("/seo/");
  if (!forceSeo && !isCrawler(req)) {
    next();
    return;
  }

  try {
    const productMatch = path.match(PRODUCT_RE);
    if (productMatch?.[1]) {
      await productCrawlerHtml(decodeURIComponent(productMatch[1]), res);
      return;
    }
    const categoryMatch = path.match(CATEGORY_RE);
    if (categoryMatch?.[1]) {
      await categoryCrawlerHtml(
        categoryMatch[1],
        categoryMatch[2],
        res,
      );
      return;
    }
    if (path === "/gifts" || path === "/seo/gifts") {
      giftsCrawlerHtml(res);
      return;
    }
    if (forceSeo && (path === "/seo" || path === "/seo/")) {
      homeCrawlerHtml(res);
      return;
    }
  } catch (err) {
    console.error("SEO crawler error:", err);
  }
  next();
}
