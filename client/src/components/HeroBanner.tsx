import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { IProduct } from "../types";
import { optimizedImage } from "../utils/optimizedImage";

const HERO_CACHE = "rb-hero-url";

interface Props {
  heroBanner?: IProduct;
  searchQuery: string;
  onReady?: () => void;
}

export default function HeroBanner({ heroBanner, searchQuery, onReady }: Props) {
  const navigate = useNavigate();
  const raw = heroBanner?.imageUrl || readCachedHero();
  const src = raw ? optimizedImage(raw, 1400) : "";

  useEffect(() => {
    if (heroBanner?.imageUrl) {
      localStorage.setItem(HERO_CACHE, heroBanner.imageUrl);
    }
  }, [heroBanner?.imageUrl]);

  if (searchQuery) return null;

  if (!src) {
    return <div className="hero-banner hero-banner-slot" aria-hidden />;
  }

  return (
    <div
      className="hero-banner"
      role="button"
      tabIndex={0}
      onClick={() => navigate("/category/playstation")}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate("/category/playstation");
        }
      }}
    >
      <img
        src={src}
        alt={heroBanner?.title || "RetroBit — რეტრო კონსოლები და თამაშები საქართველოში"}
        onLoad={() => onReady?.()}
        onError={() => onReady?.()}
      />
    </div>
  );
}

function readCachedHero() {
  try {
    return localStorage.getItem(HERO_CACHE);
  } catch {
    return null;
  }
}
