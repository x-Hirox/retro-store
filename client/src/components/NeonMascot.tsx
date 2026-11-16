export default function NeonMascot() {
  return (
    <div className="neon-mascot" aria-hidden>
      <svg viewBox="0 0 160 180">
        <defs>
          <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="168" rx="38" ry="8" fill="#a855f744" />
        <path d="M40 70c8-40 72-48 84-8 8 28-6 50-20 58-18 8-52 6-64-10-8-12-8-28 0-40z" fill="url(#hair)" />
        <ellipse cx="80" cy="88" rx="32" ry="34" fill="#f5d0fe" />
        <ellipse cx="68" cy="86" rx="7" ry="9" fill="#0f172a" />
        <ellipse cx="96" cy="86" rx="7" ry="9" fill="#0f172a" />
        <ellipse cx="70" cy="84" rx="2" ry="3" fill="#fff" />
        <ellipse cx="98" cy="84" rx="2" ry="3" fill="#fff" />
        <path d="M70 104c8 8 16 8 24 0" stroke="#db2777" strokeWidth="3" fill="none" />
        <rect x="46" y="62" width="68" height="10" rx="5" fill="#22d3ee" opacity="0.85" />
        <path d="M48 66c-16 10-18 28-10 40" stroke="#22d3ee" strokeWidth="4" fill="none" />
        <path d="M58 128c8 18 36 22 48 6" fill="#7c3aed" />
        <text x="80" y="24" textAnchor="middle" fill="#e879f9" fontSize="11" fontFamily="Audiowide, sans-serif">
          RETRO
        </text>
      </svg>
    </div>
  );
}
