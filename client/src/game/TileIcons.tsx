import { useId } from "react";
import type { Kind, Special } from "./types";

export function TileIcon({ kind, special = "none" }: { kind: Kind; special?: Special }) {
  const uid = useId().replace(/:/g, "");
  const overlay =
    special === "laser-h" ? (
      <rect x="6" y="28" width="52" height="8" rx="3" fill="#fff" opacity="0.9" />
    ) : special === "laser-v" ? (
      <rect x="28" y="6" width="8" height="52" rx="3" fill="#fff" opacity="0.9" />
    ) : special === "bomb" ? (
      <circle cx="32" cy="32" r="12" fill="none" stroke="#fff" strokeWidth="3" />
    ) : special === "color" ? (
      <circle cx="32" cy="32" r="8" fill="#fff" />
    ) : null;

  if (kind === 0) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id={`${uid}psp`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <rect x="6" y="18" width="52" height="28" rx="8" fill={`url(#${uid}psp)`} stroke="#f5d0fe" strokeWidth="2" />
        <rect x="12" y="22" width="24" height="16" rx="3" fill="#0f172a" />
        <rect x="14" y="24" width="20" height="12" rx="2" fill="#67e8f9" />
        <circle cx="44" cy="27" r="2.2" fill="#fb7185" />
        <circle cx="50" cy="31" r="2.2" fill="#fde047" />
        <circle cx="44" cy="35" r="2.2" fill="#4ade80" />
        <rect x="16" y="40" width="32" height="3" rx="1" fill="#a78bfa" />
        {overlay}
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id={`${uid}ds`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>
        <path
          d="M10 24h16c2 0 4 2 4 4v12c0 4-3 8-8 8H14c-4 0-8-4-8-9 0-3 2-6 4-7V24zm28 0h16v8c2 1 4 4 4 7 0 5-4 9-8 9h-8c-5 0-8-4-8-8V28c0-2 2-4 4-4z"
          fill={`url(#${uid}ds)`}
          stroke="#e0f2fe"
          strokeWidth="2"
        />
        <circle cx="18" cy="34" r="5" fill="#0f172a" />
        <circle cx="46" cy="34" r="5" fill="#0f172a" />
        <circle cx="47" cy="26" r="2" fill="#fb7185" />
        <circle cx="52" cy="30" r="2" fill="#4ade80" />
        {overlay}
      </svg>
    );
  }
  if (kind === 2) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id={`${uid}gb`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
        </defs>
        <rect x="16" y="6" width="32" height="52" rx="8" fill={`url(#${uid}gb)`} stroke="#bbf7d0" strokeWidth="2" />
        <rect x="20" y="12" width="24" height="18" rx="2" fill="#022c22" />
        <rect x="22" y="14" width="20" height="14" fill="#4ade80" />
        <circle cx="26" cy="42" r="4" fill="#14532d" />
        <rect x="36" y="38" width="7" height="7" fill="#22c55e" />
        {overlay}
      </svg>
    );
  }
  if (kind === 3) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id={`${uid}xb`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="100%" stopColor="#3f6212" />
          </linearGradient>
        </defs>
        <path
          d="M8 28c6-10 14-14 24-14s18 4 24 14c-4 14-14 24-24 24S12 42 8 28z"
          fill={`url(#${uid}xb)`}
          stroke="#ecfccb"
          strokeWidth="2"
        />
        <circle cx="32" cy="32" r="9" fill="#0f172a" stroke="#84cc16" strokeWidth="3" />
        <path d="M26 26l12 12M38 26L26 38" stroke="#a3e635" strokeWidth="3" />
        {overlay}
      </svg>
    );
  }
  if (kind === 4) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id={`${uid}sg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>
        </defs>
        <rect x="14" y="8" width="36" height="48" rx="5" fill={`url(#${uid}sg)`} stroke="#ffedd5" strokeWidth="2" />
        <rect x="18" y="12" width="28" height="12" fill="#fed7aa" />
        <rect x="18" y="28" width="28" height="3" fill="#fb923c" />
        <rect x="18" y="34" width="28" height="3" fill="#fb923c" />
        <rect x="18" y="40" width="18" height="3" fill="#fb923c" />
        {overlay}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden>
      <defs>
          <linearGradient id={`${uid}st`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <polygon
        points="32,6 39,24 58,24 43,36 49,54 32,43 15,54 21,36 6,24 25,24"
        fill={`url(#${uid}st)`}
        stroke="#fff7ed"
        strokeWidth="2"
      />
      {overlay}
    </svg>
  );
}

export function SpecialMark({ special }: { special: Special }) {
  if (special === "none") return null;
  return <span className="mg-special">{special === "bomb" ? "◈" : special === "color" ? "★" : "━"}</span>;
}
