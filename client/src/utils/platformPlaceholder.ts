export const PLATFORM_PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
      <rect width="160" height="100" rx="14" fill="#1e293b"/>
      <rect x="36" y="26" width="88" height="48" rx="10" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
      <circle cx="56" cy="50" r="7" fill="#475569"/>
      <circle cx="104" cy="50" r="7" fill="#475569"/>
      <rect x="70" y="44" width="20" height="12" rx="3" fill="#334155"/>
    </svg>`,
  );

export function setPlatformImageFallback(img: HTMLImageElement) {
  if (img.dataset.ph === "1") return;
  img.dataset.ph = "1";
  img.src = PLATFORM_PLACEHOLDER;
}
