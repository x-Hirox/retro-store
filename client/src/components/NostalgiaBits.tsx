import {
  playCassetteClick,
  playCoin,
  playGameBoyBlip,
  playVhsWhir,
} from "../utils/arcadeBeep";

export function HolidayLights() {
  return (
    <div className="ny-header-lights" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => (
        <i key={i} className={`ny-bulb c${i % 4}`} />
      ))}
    </div>
  );
}

export function SantaHat() {
  return (
    <span className="ny-hat" aria-hidden>
      <svg viewBox="0 0 48 40">
        <path d="M6 28 L24 4 L42 28 Z" fill="#dc2626" />
        <ellipse cx="24" cy="30" rx="20" ry="6" fill="#f8fafc" />
        <circle cx="24" cy="6" r="5" fill="#fff" />
      </svg>
    </span>
  );
}

export function Tamagotchi() {
  return (
    <button
      type="button"
      className="nbit nbit-pos-left"
      title="Tamagotchi"
      onMouseEnter={playGameBoyBlip}
      onClick={playGameBoyBlip}
    >
      <svg viewBox="0 0 64 90">
        <ellipse cx="32" cy="46" rx="26" ry="38" fill="#f472b6" stroke="#9d174d" />
        <rect x="16" y="22" width="32" height="28" rx="4" fill="#86efac" />
        <circle cx="26" cy="34" r="3" fill="#111" />
        <circle cx="38" cy="34" r="3" fill="#111" />
        <path d="M26 42c4 4 8 4 12 0" stroke="#111" fill="none" />
        <circle cx="20" cy="62" r="4" fill="#fef08a" />
        <circle cx="32" cy="66" r="4" fill="#fef08a" />
        <circle cx="44" cy="62" r="4" fill="#fef08a" />
      </svg>
    </button>
  );
}

export function FloppyDisk() {
  return (
    <button
      type="button"
      className="nbit nbit-pos-right"
      title="3.5″ Floppy"
      onMouseEnter={playCassetteClick}
      onClick={playCassetteClick}
    >
      <svg viewBox="0 0 72 72">
        <rect x="6" y="4" width="60" height="64" rx="3" fill="#1d4ed8" stroke="#93c5fd" />
        <rect x="16" y="8" width="40" height="18" fill="#e2e8f0" />
        <rect x="22" y="36" width="28" height="24" fill="#0f172a" />
        <rect x="26" y="40" width="20" height="4" fill="#64748b" />
      </svg>
    </button>
  );
}

export function Polaroid() {
  return (
    <button
      type="button"
      className="nbit nbit-pos-right"
      title="Polaroid"
      onMouseEnter={playVhsWhir}
      onClick={playVhsWhir}
    >
      <svg viewBox="0 0 70 86">
        <rect x="6" y="4" width="58" height="78" fill="#f8fafc" />
        <rect x="12" y="10" width="46" height="46" fill="#7c3aed" />
        <circle cx="24" cy="28" r="8" fill="#fde68a" />
        <path d="M12 52 L28 36 L44 48 L58 32 L58 56 L12 56 Z" fill="#22c55e" />
        <rect x="20" y="64" width="30" height="6" fill="#cbd5e1" />
      </svg>
    </button>
  );
}

export function Boombox() {
  return (
    <button
      type="button"
      className="nbit nbit-pos-left"
      title="Boombox"
      onMouseEnter={playCassetteClick}
      onClick={playCassetteClick}
    >
      <svg viewBox="0 0 120 64">
        <rect x="4" y="16" width="112" height="44" rx="6" fill="#111827" stroke="#f97316" />
        <circle className="nbit-reel" cx="28" cy="38" r="14" fill="#1e1b4b" stroke="#00f3ff" />
        <circle className="nbit-reel" cx="92" cy="38" r="14" fill="#1e1b4b" stroke="#ff007f" />
        <rect x="48" y="26" width="24" height="22" fill="#0f172a" stroke="#ffe600" />
        <rect x="20" y="6" width="8" height="12" fill="#64748b" />
        <rect x="92" y="6" width="8" height="12" fill="#64748b" />
      </svg>
    </button>
  );
}

export function Discman() {
  return (
    <button
      type="button"
      className="nbit nbit-pos-right"
      title="Discman"
      onMouseEnter={playCassetteClick}
      onClick={playCassetteClick}
    >
      <svg viewBox="0 0 80 80">
        <rect x="8" y="10" width="64" height="60" rx="8" fill="#e2e8f0" stroke="#64748b" />
        <circle className="nbit-reel" cx="40" cy="38" r="20" fill="#0ea5e9" />
        <circle cx="40" cy="38" r="6" fill="#0f172a" />
        <rect x="18" y="62" width="44" height="4" fill="#94a3b8" />
      </svg>
    </button>
  );
}

export function Rubik() {
  return (
    <button
      type="button"
      className="nbit nbit-pos-left"
      title="Rubik"
      onMouseEnter={playCoin}
      onClick={playCoin}
    >
      <svg viewBox="0 0 64 64">
        <g stroke="#111" strokeWidth="1.5">
          <rect x="4" y="4" width="18" height="18" fill="#dc2626" />
          <rect x="23" y="4" width="18" height="18" fill="#fff" />
          <rect x="42" y="4" width="18" height="18" fill="#2563eb" />
          <rect x="4" y="23" width="18" height="18" fill="#eab308" />
          <rect x="23" y="23" width="18" height="18" fill="#dc2626" />
          <rect x="42" y="23" width="18" height="18" fill="#16a34a" />
          <rect x="4" y="42" width="18" height="18" fill="#2563eb" />
          <rect x="23" y="42" width="18" height="18" fill="#eab308" />
          <rect x="42" y="42" width="18" height="18" fill="#fff" />
        </g>
      </svg>
    </button>
  );
}

export function VhsTape() {
  return (
    <button
      type="button"
      className="nbit nbit-pos-right"
      title="VHS"
      onMouseEnter={playVhsWhir}
      onClick={playVhsWhir}
    >
      <svg viewBox="0 0 120 70">
        <rect x="4" y="10" width="112" height="50" rx="4" fill="#1a1030" stroke="#ff007f" />
        <rect x="14" y="20" width="92" height="30" rx="2" fill="#0b0714" />
        <circle className="nbit-reel" cx="38" cy="35" r="10" fill="#2a2038" stroke="#00f3ff" />
        <circle className="nbit-reel" cx="82" cy="35" r="10" fill="#2a2038" stroke="#ffe600" />
      </svg>
    </button>
  );
}

export function InsertCoin() {
  return (
    <button
      type="button"
      className="nbit nbit-coin nbit-pos-right"
      title="INSERT COIN"
      onMouseEnter={playCoin}
      onClick={playCoin}
    >
      INSERT COIN
    </button>
  );
}

export function GiftStack() {
  return (
    <div className="ny-gift-stack" aria-hidden>
      <span className="gift g1" />
      <span className="gift g2" />
      <span className="gift g3" />
    </div>
  );
}
