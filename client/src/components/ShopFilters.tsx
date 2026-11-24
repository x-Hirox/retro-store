import type { IPlatformCard } from "../types";
import { KIND_OPTIONS, type ProductKind } from "../utils/productKind";

type Props = {
  priceMin: number;
  priceMax: number;
  boundMin: number;
  boundMax: number;
  onPriceMin: (n: number) => void;
  onPriceMax: (n: number) => void;
  brands: { name: string; count: number }[];
  selectedBrands: string[];
  onToggleBrand: (name: string) => void;
  platforms: IPlatformCard[];
  selectedPlatforms: string[];
  onTogglePlatform: (name: string) => void;
  showKind: boolean;
  selectedKinds: ProductKind[];
  onToggleKind: (kind: ProductKind) => void;
  genres: string[];
  selectedGenres: string[];
  onToggleGenre: (name: string) => void;
  onClear: () => void;
  canClear: boolean;
};

function clamp(n: number, lo: number, hi: number) {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, Math.round(n)));
}

export default function ShopFilters({
  priceMin,
  priceMax,
  boundMin,
  boundMax,
  onPriceMin,
  onPriceMax,
  brands,
  selectedBrands,
  onToggleBrand,
  platforms,
  selectedPlatforms,
  onTogglePlatform,
  showKind,
  selectedKinds,
  onToggleKind,
  genres,
  selectedGenres,
  onToggleGenre,
  onClear,
  canClear,
}: Props) {
  const span = Math.max(1, boundMax - boundMin);
  const fillLeft = ((priceMin - boundMin) / span) * 100;
  const fillRight = ((priceMax - boundMin) / span) * 100;

  return (
    <aside className="filter-sidebar">
      <div className="filter-head">
        <strong>ფილტრი</strong>
        <button
          type="button"
          className="filter-clear"
          disabled={!canClear}
          onClick={onClear}
        >
          გასუფთავება
        </button>
      </div>

      <details className="filter-group" open>
        <summary className="filter-title">ფასი</summary>
        <div className="price-range">
          <div className="price-range-track" />
          <div
            className="price-range-fill"
            style={{ left: `${fillLeft}%`, width: `${fillRight - fillLeft}%` }}
          />
          <input
            type="range"
            min={boundMin}
            max={boundMax}
            value={priceMin}
            aria-label="მინიმალური ფასი"
            onChange={(e) => {
              const next = clamp(Number(e.target.value), boundMin, priceMax);
              onPriceMin(next);
            }}
          />
          <input
            type="range"
            min={boundMin}
            max={boundMax}
            value={priceMax}
            aria-label="მაქსიმალური ფასი"
            onChange={(e) => {
              const next = clamp(Number(e.target.value), priceMin, boundMax);
              onPriceMax(next);
            }}
          />
        </div>
        <div className="price-fields">
          <label>
            MIN
            <span>
              <input
                type="number"
                min={boundMin}
                max={priceMax}
                value={priceMin}
                onChange={(e) =>
                  onPriceMin(clamp(Number(e.target.value), boundMin, priceMax))
                }
              />
              ₾
            </span>
          </label>
          <label>
            MAX
            <span>
              <input
                type="number"
                min={priceMin}
                max={boundMax}
                value={priceMax}
                onChange={(e) =>
                  onPriceMax(clamp(Number(e.target.value), priceMin, boundMax))
                }
              />
              ₾
            </span>
          </label>
        </div>
      </details>

      {brands.length > 0 && (
        <details className="filter-group" open>
          <summary className="filter-title">ბრენდი</summary>
          {brands.map((item) => (
            <label key={item.name} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedBrands.includes(item.name)}
                onChange={() => onToggleBrand(item.name)}
              />
              {item.name}
              <em>{item.count}</em>
            </label>
          ))}
        </details>
      )}

      {showKind && (
        <details className="filter-group" open>
          <summary className="filter-title">ტიპი</summary>
          {KIND_OPTIONS.map((item) => (
            <label key={item.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedKinds.includes(item.value)}
                onChange={() => onToggleKind(item.value)}
              />
              {item.label}
            </label>
          ))}
        </details>
      )}

      {platforms.length > 0 && (
        <details className="filter-group" open>
          <summary className="filter-title">პლატფორმა</summary>
          {platforms.map((item) => (
            <label key={item.slug} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(item.name)}
                onChange={() => onTogglePlatform(item.name)}
              />
              {item.name}
            </label>
          ))}
        </details>
      )}

      {genres.length > 0 && (
        <details className="filter-group">
          <summary className="filter-title">ჟანრი</summary>
          {genres.map((genre) => (
            <label key={genre} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => onToggleGenre(genre)}
              />
              {genre}
            </label>
          ))}
        </details>
      )}
    </aside>
  );
}
