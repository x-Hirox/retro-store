const EXTS = ["png", "jpg", "jpeg", "webp", "svg"] as const;

export function platformArtUrl(slug: string) {
  return `/images/platforms/${slug}.png`;
}

export function nextPlatformArtUrl(slug: string, currentSrc: string) {
  const path = decodeURIComponent(currentSrc.split("?")[0] || "");
  const index = EXTS.findIndex(
    (ext) =>
      path.endsWith(`/images/platforms/${slug}.${ext}`) ||
      path.endsWith(`/${slug}.${ext}`),
  );
  const next = EXTS[index + 1];
  return next ? `/images/platforms/${slug}.${next}` : "";
}
