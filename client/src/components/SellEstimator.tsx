import { useMemo, useState } from "react";
import { formatGel } from "../utils/pricing";

const TYPES = [
  { id: "ps1", label: "PlayStation 1", min: 70, max: 140 },
  { id: "ps2", label: "PlayStation 2", min: 80, max: 160 },
  { id: "ps3", label: "PlayStation 3", min: 90, max: 180 },
  { id: "ps4", label: "PlayStation 4", min: 140, max: 260 },
  { id: "psp", label: "PSP / Vita", min: 50, max: 120 },
  { id: "xbox360", label: "Xbox 360", min: 70, max: 140 },
  { id: "n64", label: "Nintendo 64", min: 90, max: 170 },
  { id: "snes", label: "SNES / NES", min: 100, max: 200 },
  { id: "gb", label: "Game Boy / GBA", min: 40, max: 90 },
  { id: "switch", label: "Switch", min: 180, max: 320 },
];

const COND = [
  { id: "mint", label: "თითქმის ახალი", m: 1.12 },
  { id: "used", label: "კარგი მეორადი", m: 1 },
  { id: "fair", label: "საშუალო / ნაკაწრები", m: 0.78 },
  { id: "broken", label: "გაუმართავი", m: 0.38 },
];

const KITS = [
  { id: "solo", label: "მხოლოდ კონსოლი", m: 1 },
  { id: "pad", label: "კონსოლი + 1 ჯოი", m: 1.1 },
  { id: "full", label: "სრული კომპლექტი", m: 1.22 },
];

export default function SellEstimator() {
  const [type, setType] = useState(TYPES[1].id);
  const [cond, setCond] = useState("used");
  const [kit, setKit] = useState("pad");

  const range = useMemo(() => {
    const t = TYPES.find((x) => x.id === type) || TYPES[1];
    const c = COND.find((x) => x.id === cond)?.m ?? 1;
    const k = KITS.find((x) => x.id === kit)?.m ?? 1;
    const cashMin = Math.round(t.min * c * k);
    const cashMax = Math.round(t.max * c * k);
    return {
      cashMin,
      cashMax,
      credMin: Math.round(cashMin * 1.2),
      credMax: Math.round(cashMax * 1.2),
    };
  }, [type, cond, kit]);

  return (
    <section className="sell-section sell-estimator" id="sell-estimate">
      <h2>სწრაფი შეფასება</h2>
      <p className="sell-lead">
        აირჩიე ტიპი, მდგომარეობა და კომპლექტი — მიიღებ სავარაუდო დიაპაზონს.
        საბოლოო ფასი შემოწმების შემდეგ დგინდება.
      </p>
      <div className="sell-est-grid">
        <label>
          კონსოლის ტიპი
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          მდგომარეობა
          <select value={cond} onChange={(e) => setCond(e.target.value)}>
            {COND.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          კომპლექტაცია
          <select value={kit} onChange={(e) => setKit(e.target.value)}>
            {KITS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="sell-est-out">
        <article>
          <span>ნაღდი</span>
          <strong>
            {formatGel(range.cashMin)} – {formatGel(range.cashMax)}
          </strong>
        </article>
        <article className="is-credit">
          <span>მაღაზიის კრედიტი +20%</span>
          <strong>
            {formatGel(range.credMin)} – {formatGel(range.credMax)}
          </strong>
        </article>
      </div>
    </section>
  );
}
