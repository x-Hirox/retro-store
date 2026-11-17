import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import {
  getCollectionPage,
  getPlatformCards,
} from "../services/contentService";
import type { ICollectionPage, IPlatformCard, IProduct } from "../types";
import { isBannerProduct } from "../utils/pricing";
import ProductCard from "../components/ProductCard";
import ReviewsSection from "../components/ReviewsSection";
import FaqSection from "../components/FaqSection";
import RecentlyViewed from "../components/RecentlyViewed";
import NewsletterSignup from "../components/NewsletterSignup";
import BestSellersSlider from "../components/BestSellersSlider";
import GameCovers from "../components/GameCovers";
import { brandKey, matchesBrand } from "../utils/brandMatch";

const fallbackCards: Record<
  string,
  { name: string; slug: string; image: string; year?: string }[]
> = {
  playstation: [
    { name: "PlayStation 1", slug: "ps1", image: "/ps1.svg", year: "1995" },
    { name: "PlayStation 2", slug: "ps2", image: "/ps2.svg", year: "2000" },
    { name: "PlayStation 3", slug: "ps3", image: "/ps3.svg", year: "2006" },
    { name: "PlayStation 4", slug: "ps4", image: "/ps4.svg", year: "2013" },
    { name: "PlayStation 5", slug: "ps5", image: "/ps5.svg", year: "2020" },
    {
      name: "PlayStation Portable",
      slug: "psp",
      image: "/psp.svg",
      year: "2005",
    },
    {
      name: "PlayStation Vita",
      slug: "psvita",
      image: "/psvita.svg",
      year: "2012",
    },
  ],
  nintendo: [
    { name: "Nintendo NES", slug: "nes", image: "/nes.svg", year: "1985" },
    {
      name: "Super Nintendo (SNES)",
      slug: "snes",
      image: "/snes.svg",
      year: "1991",
    },
    { name: "Nintendo 64", slug: "n64", image: "/n64.svg", year: "1996" },
    {
      name: "Nintendo GameCube",
      slug: "gamecube",
      image: "/gamecube.svg",
      year: "2001",
    },
    { name: "Nintendo Wii", slug: "wii", image: "/wii.svg", year: "2006" },
    { name: "Nintendo Wii U", slug: "wii-u", image: "/wii.svg", year: "2012" },
    {
      name: "Nintendo Switch",
      slug: "switch",
      image: "/switch.svg",
      year: "2017",
    },
  ],
  xbox: [
    { name: "Xbox", slug: "xbox", image: "/xbox.svg" },
    { name: "Xbox 360", slug: "xbox360", image: "/xbox360.svg" },
    { name: "Xbox One", slug: "xboxone", image: "/xboxone.svg" },
  ],
  sega: [{ name: "Sega Genesis", slug: "sega-genesis", image: "/sega.svg" }],
  "chinese consoles": [
    { name: "Anbernic", slug: "anbernic", image: "/anbernic.svg" },
    { name: "Miyoo Mini", slug: "miyoo-mini", image: "/miyoo.svg" },
    { name: "Powkiddy", slug: "powkiddy", image: "/powkiddy.svg" },
    { name: "Retroid Pocket", slug: "retroid-pocket", image: "/retroid.svg" },
  ],
  bundles: [
    {
      name: "Console + Games Bundle",
      slug: "console-games-bundle",
      image: "/bundle.svg",
    },
    { name: "Starter Pack", slug: "starter-pack", image: "/starter.svg" },
    {
      name: "Collector's Bundle",
      slug: "collectors-bundle",
      image: "/collector.svg",
    },
  ],
  "atari & more": [
    { name: "Atari 2600", slug: "atari-2600", image: "/atari.svg" },
    { name: "ColecoVision", slug: "colecovision", image: "/coleco.svg" },
    { name: "TurboGrafx-16", slug: "turbografx-16", image: "/turbografx.svg" },
  ],
};

const bannerColors: Record<string, string> = {
  nintendo: "#c41e3a",
  playstation: "#003791",
  xbox: "#107c10",
  sega: "#1b365d",
  bundles: "#b45309",
  "atari & more": "#6b21a8",
  "chinese consoles": "#334155",
};

const PAGE_SIZE = 8;

function normalize(value?: string) {
  return decodeURIComponent(value || "")
    .toLowerCase()
    .trim();
}

function matchesSub(
  product: IProduct,
  sub?: string,
  cards: IPlatformCard[] = [],
) {
  if (!sub) return true;
  const s = normalize(sub);
  const card = cards.find(
    (c) => normalize(c.slug) === s || normalize(c.name) === s,
  );
  const aliases = [s, card?.name, card?.slug]
    .filter(Boolean)
    .map((v) => normalize(String(v)));
  const hay =
    `${product.title} ${product.platform || ""} ${product.description}`.toLowerCase();
  return aliases.some((alias) => hay.includes(alias));
}

export default function CategoryView() {
  const { platform, sub } = useParams<{ platform: string; sub?: string }>();
  const navigate = useNavigate();
  const brand = brandKey(platform);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [cards, setCards] = useState<IPlatformCard[]>([]);
  const [collection, setCollection] = useState<ICollectionPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setLoading(true);
    setVisibleCount(PAGE_SIZE);
    Promise.all([
      getProducts(),
      getPlatformCards(brand).catch(() => [] as IPlatformCard[]),
      getCollectionPage(brand).catch(() => null),
    ])
      .then(([data, platformCards, page]) => {
        setProducts(data);
        setCards(platformCards);
        setCollection(page);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, [brand]);

  const currentCards: IPlatformCard[] =
    cards.length > 0
      ? cards
      : (fallbackCards[brand] || []).map((item, index) => ({
          _id: item.slug,
          brand,
          name: item.name,
          slug: item.slug,
          imageUrl: item.image,
          year: item.year,
          order: index,
        }));

  const catalogProducts = products.filter((p) => !isBannerProduct(p));

  const brandProducts = catalogProducts.filter((p) =>
    matchesBrand(p, platform),
  );

  const genres = useMemo(() => {
    const set = new Set<string>();
    brandProducts.forEach((p) => {
      if (p.genre) set.add(p.genre);
    });
    return Array.from(set);
  }, [brandProducts]);

  const filteredProducts = brandProducts.filter((p) => {
    if (!matchesSub(p, sub, currentCards)) return false;
    const price = Number(p.price) || 0;
    if (price > maxPrice) return false;
    if (selectedPlatforms.length) {
      const hay = `${p.platform || ""} ${p.title}`.toLowerCase();
      if (!selectedPlatforms.some((item) => hay.includes(item.toLowerCase()))) {
        return false;
      }
    }
    if (selectedGenres.length && !selectedGenres.includes(p.genre || "")) {
      return false;
    }
    return true;
  });

  const visible = filteredProducts.slice(0, visibleCount);
  const bannerColor =
    collection?.bannerColor || bannerColors[brand] || "#7c3aed";

  const toggleValue = (
    list: string[],
    value: string,
    setter: (v: string[]) => void,
  ) => {
    setter(
      list.includes(value) ? list.filter((x) => x !== value) : [...list, value],
    );
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        paddingBottom: "40px",
      }}
    >
      <div className="collection-banner" style={{ background: bannerColor }}>
        <div className="collection-consoles">
          {currentCards.map((item) => {
            const active =
              normalize(sub) === normalize(item.slug) ||
              normalize(sub) === normalize(item.name);
            return (
              <button
                key={item._id || item.slug}
                type="button"
                className={`collection-console arcade-tab ${active ? "is-active" : ""}`}
                onClick={() =>
                  navigate(
                    `/category/${encodeURIComponent(platform || "")}/${encodeURIComponent(item.slug)}`,
                  )
                }
              >
                <img src={item.imageUrl} alt={item.name} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="shop-title-row">
        <span className="ny-orb" aria-hidden />
        <h1 className="collection-title" style={{ color: bannerColor }}>
          {collection?.title || decodeURIComponent(platform || "")}
        </h1>
        <span className="ny-orb ny-orb-alt" aria-hidden />
      </div>
      {collection?.subtitle && (
        <p style={{ textAlign: "center", marginBottom: 10 }}>
          {collection.subtitle}
        </p>
      )}

      {brand.includes("atari") && <GameCovers mode="play" />}

      <div className="shop-layout" style={{ marginTop: "20px" }}>
        <aside className="filter-sidebar">
          <div className="filter-group">
            <div className="filter-title">
              ფასი <span>⌄</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setVisibleCount(PAGE_SIZE);
              }}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                marginTop: 5,
              }}
            >
              <span>0 ₾</span>
              <span>{maxPrice} ₾</span>
            </div>
          </div>

          {currentCards.length > 0 && (
            <div className="filter-group">
              <div className="filter-title">
                პლატფორმა <span>⌄</span>
              </div>
              {currentCards.map((item) => (
                <label key={item.slug} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(item.name)}
                    onChange={() =>
                      toggleValue(
                        selectedPlatforms,
                        item.name,
                        setSelectedPlatforms,
                      )
                    }
                  />
                  {item.name}
                </label>
              ))}
            </div>
          )}

          {genres.length > 0 && (
            <div className="filter-group">
              <div className="filter-title">
                ჟანრი <span>⌄</span>
              </div>
              {genres.map((genre) => (
                <label key={genre} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() =>
                      toggleValue(selectedGenres, genre, setSelectedGenres)
                    }
                  />
                  {genre}
                </label>
              ))}
            </div>
          )}
        </aside>

        <div style={{ flex: 1, padding: "0 12px" }}>
          <p style={{ marginBottom: 18, color: "var(--text)" }}>
            ნაპოვნია {filteredProducts.length} პროდუქტი
          </p>

          {loading ? (
            <p style={{ textAlign: "center", padding: 40 }}>
              იტვირთება რეტრო სამყარო... ✨
            </p>
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                backgroundColor: "rgba(168, 85, 247, 0.04)",
                borderRadius: "20px",
                border: "1px dashed rgba(168, 85, 247, 0.3)",
              }}
            >
              <p>ამ კატეგორიაში პროდუქტები ჯერ არ მოიძებნა.</p>
            </div>
          ) : (
            <>
              <div className="arcade-grid">
                {visible.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {visibleCount < filteredProducts.length && (
                <div style={{ textAlign: "center", marginTop: 28 }}>
                  <button
                    className="load-more-btn"
                    onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                    style={{
                      background: "transparent",
                      color: "#2563eb",
                      border: "2px solid #2563eb",
                      padding: "10px 28px",
                      borderRadius: 24,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    მეტის ნახვა
                  </button>
                </div>
              )}
            </>
          )}

          {collection?.description && (
            <div style={{ marginTop: 48, maxWidth: 800 }}>
              <h2 style={{ color: "var(--text-h)", textTransform: "none" }}>
                {collection.title} — კონსოლები და თამაშები
              </h2>
              <p style={{ lineHeight: 1.7 }}>{collection.description}</p>
            </div>
          )}
        </div>
      </div>

      <ReviewsSection />
      <BestSellersSlider
        products={catalogProducts}
        loading={loading}
        searchQuery=""
        selectedCategory=""
      />
      <FaqSection />
      <RecentlyViewed />
      <NewsletterSignup />
    </div>
  );
}
