import { lazy, Suspense, type ReactNode } from "react";
import FloatingConsoles from "./FloatingConsoles";
import RetroBackground from "./RetroBackground";
import SkateRider from "./SkateRider";
import { useDesktopGL } from "../hooks/useDesktopGL";

const RetroScene3D = lazy(() => import("./RetroScene3D"));

export default function RetroStage({ children }: { children?: ReactNode }) {
  const useGl = useDesktopGL();

  return (
    <section className="retro-stage">
      {useGl ? (
        <Suspense fallback={<RetroBackground />}>
          <RetroScene3D />
        </Suspense>
      ) : (
        <RetroBackground />
      )}
      <div className="ny-garland" aria-hidden />
      <div className="retro-stage-banner">{children}</div>
      {!useGl && <FloatingConsoles />}
      <SkateRider />

      <svg className="rv-mascot" viewBox="0 0 160 180" aria-hidden>
        <defs>
          <linearGradient id="stage-hair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff007f" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="168" rx="38" ry="8" fill="#ff007f33" />
        <path
          d="M40 70c8-40 72-48 84-8 8 28-6 50-20 58-18 8-52 6-64-10-8-12-8-28 0-40z"
          fill="url(#stage-hair)"
        />
        <ellipse cx="80" cy="88" rx="32" ry="34" fill="#f5d0fe" />
        <g className="rv-blink">
          <ellipse cx="68" cy="86" rx="7" ry="9" fill="#0f172a" />
          <ellipse cx="96" cy="86" rx="7" ry="9" fill="#0f172a" />
          <ellipse cx="70" cy="84" rx="2" ry="3" fill="#fff" />
          <ellipse cx="98" cy="84" rx="2" ry="3" fill="#fff" />
        </g>
        <path d="M70 104c8 8 16 8 24 0" stroke="#ff007f" strokeWidth="3" fill="none" />
        <rect x="46" y="62" width="68" height="10" rx="5" fill="#00f3ff" className="rv-glow" />
        <path d="M48 66c-16 10-18 28-10 40" stroke="#00f3ff" strokeWidth="4" fill="none" />
        <path d="M58 128c8 18 36 22 48 6" fill="#7c3aed" />
      </svg>

      <div className="ny-tree" aria-hidden>
        <svg viewBox="0 0 80 110">
          <polygon points="40,4 70,40 10,40" fill="#166534" />
          <polygon points="40,24 74,62 6,62" fill="#15803d" />
          <polygon points="40,46 78,90 2,90" fill="#166534" />
          <rect x="34" y="88" width="12" height="16" fill="#7c2d12" />
          <circle cx="40" cy="10" r="4" fill="#ffe600" className="rv-glow" />
          <circle cx="28" cy="50" r="3" fill="#ff007f" />
          <circle cx="52" cy="58" r="3" fill="#00f3ff" />
          <circle cx="36" cy="74" r="3" fill="#ffe600" />
        </svg>
      </div>
      <div className="ny-gifts" aria-hidden>
        <span className="gift g1" />
        <span className="gift g2" />
        <span className="gift g3" />
      </div>
      <div className="ny-baubles" aria-hidden>
        <i className="bauble b1" />
        <i className="bauble b2" />
        <i className="bauble b3" />
        <i className="bauble b4" />
      </div>
      <div className="fx-snow in-stage" aria-hidden>
        {Array.from({ length: 36 }, (_, i) => (
          <span key={i} className={`flake n${i % 12}`} />
        ))}
      </div>
    </section>
  );
}
