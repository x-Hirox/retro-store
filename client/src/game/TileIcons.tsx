import type { Kind, Special } from "./types";

function Glow({ color }: { color: string }) {
  return <rect x="2" y="2" width="44" height="44" rx="10" fill={color} opacity="0.22" />;
}

export function TileIcon({ kind }: { kind: Kind; special?: Special }) {
  if (kind === 0) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <Glow color="#a78bfa" />
        <rect x="7" y="16" width="34" height="18" rx="4" fill="#2e1065" stroke="#c4b5fd" strokeWidth="2" />
        <rect x="10" y="19" width="18" height="11" rx="2" fill="#22d3ee" />
        <circle cx="34" cy="22" r="2" fill="#fb7185" />
        <circle cx="38" cy="26" r="2" fill="#fbbf24" />
        <rect x="14" y="34" width="20" height="3" rx="1.5" fill="#7c3aed" />
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <Glow color="#38bdf8" />
        <path d="M10 20h10v12H12a4 4 0 0 1-2-7.5V20zm18 0h10v4.5A4 4 0 0 1 36 32H28V20z" fill="#0f172a" stroke="#7dd3fc" strokeWidth="2" />
        <rect x="18" y="18" width="12" height="8" rx="2" fill="#1d4ed8" />
        <circle cx="16" cy="26" r="3" fill="#64748b" />
        <circle cx="32" cy="26" r="3" fill="#64748b" />
        <circle cx="33" cy="22" r="1.4" fill="#f87171" />
        <circle cx="36" cy="24" r="1.4" fill="#4ade80" />
      </svg>
    );
  }
  if (kind === 2) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <Glow color="#34d399" />
        <rect x="13" y="8" width="22" height="32" rx="4" fill="#14532d" stroke="#86efac" strokeWidth="2" />
        <rect x="16" y="12" width="16" height="12" rx="1" fill="#bbf7d0" />
        <circle cx="20" cy="32" r="3" fill="#166534" />
        <rect x="27" y="29" width="5" height="5" fill="#22c55e" />
      </svg>
    );
  }
  if (kind === 3) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <Glow color="#a3e635" />
        <rect x="10" y="14" width="28" height="20" rx="4" fill="#14532d" stroke="#bef264" strokeWidth="2" />
        <circle cx="24" cy="24" r="6" fill="#0f172a" stroke="#84cc16" strokeWidth="2" />
        <path d="M22 21h4v6h-4z" fill="#84cc16" />
        <rect x="14" y="18" width="4" height="4" fill="#d9f99d" />
        <rect x="30" y="26" width="4" height="4" fill="#d9f99d" />
      </svg>
    );
  }
  if (kind === 4) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <Glow color="#fb923c" />
        <rect x="12" y="10" width="24" height="28" rx="3" fill="#9a3412" stroke="#fdba74" strokeWidth="2" />
        <rect x="16" y="14" width="16" height="8" fill="#fed7aa" />
        <rect x="15" y="25" width="18" height="2" fill="#fb923c" />
        <rect x="15" y="29" width="18" height="2" fill="#fb923c" />
        <rect x="15" y="33" width="12" height="2" fill="#fb923c" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <Glow color="#fbbf24" />
      <polygon
        points="24,6 28,18 41,18 31,26 35,39 24,31 13,39 17,26 7,18 20,18"
        fill="#f59e0b"
        stroke="#fde68a"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SpecialMark({ special }: { special: Special }) {
  if (special === "none") return null;
  if (special === "laser-h") return <span className="mg-special">━━</span>;
  if (special === "laser-v") return <span className="mg-special">┃</span>;
  if (special === "bomb") return <span className="mg-special">◈</span>;
  return <span className="mg-special">★</span>;
}
