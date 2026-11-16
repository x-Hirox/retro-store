import { playBootChime } from "../utils/arcadeBeep";

export default function FloatingConsoles() {
  return (
    <div className="float-layer" aria-hidden>
      <button
        type="button"
        className="float-console fc-psp"
        onMouseEnter={playBootChime}
      >
        <svg viewBox="0 0 120 70">
          <rect
            x="6"
            y="16"
            width="108"
            height="40"
            rx="10"
            fill="#1a1030"
            stroke="#00f3ff"
            strokeWidth="2"
          />
          <rect x="16" y="22" width="52" height="26" rx="3" fill="#041016" />
          <rect className="psp-screen" x="18" y="24" width="48" height="22" rx="2" />
          <circle cx="86" cy="30" r="4" fill="#ff007f" />
          <circle cx="98" cy="38" r="4" fill="#ffe600" />
          <circle cx="86" cy="46" r="4" fill="#00f3ff" />
        </svg>
      </button>

      <button
        type="button"
        className="float-console fc-pad"
        onMouseEnter={playBootChime}
      >
        <svg viewBox="0 0 120 70">
          <path
            d="M10 28h36v10c0 12-8 20-18 20H22C12 58 8 48 8 40c0-5 1-9 2-12zm64 0h36c2 3 4 7 4 12 0 8-4 18-14 18h-10c-12 0-18-8-18-20V28z"
            fill="#111218"
            stroke="#00f3ff"
            strokeWidth="2"
          />
          <circle className="led" cx="28" cy="40" r="7" fill="#1a1a24" stroke="#ff007f" />
          <circle className="led" cx="92" cy="40" r="7" fill="#1a1a24" stroke="#ffe600" />
        </svg>
      </button>
    </div>
  );
}
