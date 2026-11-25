/** Cloudinary delivery transform: keep original URL if not Cloudinary. */
export function optimizedImage(url: string, width: number) {
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;
  const marker = "/image/upload/";
  const index = url.indexOf(marker);
  if (index === -1) return url;
  const after = url.slice(index + marker.length);
  const first = after.split("/")[0] || "";
  if (
    first.includes(",") ||
    /^(f_|q_|w_|c_|g_|h_|e_)/.test(first)
  ) {
    return url;
  }
  return `${url.slice(0, index + marker.length)}f_auto,q_auto,c_limit,w_${width}/${after}`;
}
