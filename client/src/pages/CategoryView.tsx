import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import {
  getCollectionPage,
  getPlatformCards,
} from "../services/contentService";
import type { ICollectionPage, IPlatformCard, IProduct } from "../types";
import { getSalePrice, isBannerProduct } from "../utils/pricing";
import ProductCard from "../components/ProductCard";
import ShopFilters from "../components/ShopFilters";
import ReviewsSection from "../components/ReviewsSection";
import FaqSection from "../components/FaqSection";
import RecentlyViewed from "../components/RecentlyViewed";
import NewsletterSignup from "../components/NewsletterSignup";
import BestSellersSlider from "../components/BestSellersSlider";
import PlatformCarousel from "../components/PlatformCarousel";
import GameCovers from "../components/GameCovers";
import { brandKey, matchesBrand } from "../utils/brandMatch";
import { platformArtUrl } from "../utils/platformArt";
import {
  KIND_ROUTES,
  productKind,
  type ProductKind,
} from "../utils/productKind";
import SeoHead from "../components/SeoHead";
import { breadcrumbGraph, jsonLdGraph } from "../seo/site";

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
    {
      name: "Nintendo DS Lite",
      slug: "dsl",
      image: platformArtUrl("dsl"),
      year: "2006",
    },
    {
      name: "Nintendo DSi",
      slug: "ndsi",
      image: platformArtUrl("ndsi"),
      year: "2008",
    },
    { name: "Nintendo 3DS", slug: "3ds", image: platformArtUrl("3ds"), year: "2011" },
    { name: "Nintendo DS", slug: "nds", image: platformArtUrl("nds"), year: "2004" },
    {
      name: "Game Boy Advance",
      slug: "gba",
      image: platformArtUrl("gba"),
      year: "2001",
    },
    {
      name: "Nintendo Switch",
      slug: "switch",
      image: platformArtUrl("switch"),
      year: "2017",
    },
    { name: "Nintendo NES", slug: "nes", image: platformArtUrl("nes"), year: "1985" },
    {
      name: "Super Nintendo (SNES)",
      slug: "snes",
      image: platformArtUrl("snes"),
      year: "1991",
    },
    { name: "Nintendo 64", slug: "n64", image: platformArtUrl("n64"), year: "1996" },
    {
      name: "Nintendo GameCube",
      slug: "gamecube",
      image: platformArtUrl("gamecube"),
      year: "2001",
    },
    { name: "Nintendo Wii", slug: "wii", image: platformArtUrl("wii"), year: "2006" },
    {
      name: "Nintendo Wii U",
      slug: "wii-u",
      image: platformArtUrl("wii-u"),
      year: "2012",
    },
  ],
  xbox: [
    { name: "Xbox", slug: "xbox", image: "/xbox.svg" },
    { name: "Xbox 360", slug: "xbox360", image: "/xbox360.svg" },
    { name: "Xbox One", slug: "xboxone", image: "/xboxone.svg" },
  ],
  sega: [{ name: "Sega Genesis", slug: "sega-genesis", image: "/sega.svg" }],
  "chinese consoles": [
    { name: "R36S", slug: "r36s", image: platformArtUrl("r36s"), year: "2023" },
    { name: "M15 Pro", slug: "m15-pro", image: platformArtUrl("m15-pro"), year: "2024" },
    { name: "SUP", slug: "sup", image: platformArtUrl("sup"), year: "2018" },
    { name: "Anbernic", slug: "anbernic", image: platformArtUrl("anbernic") },
    { name: "Miyoo Mini", slug: "miyoo-mini", image: platformArtUrl("miyoo-mini") },
    { name: "Powkiddy", slug: "powkiddy", image: platformArtUrl("powkiddy") },
    { name: "Retroid Pocket", slug: "retroid-pocket", image: platformArtUrl("retroid-pocket") },
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
  accessories: "#dc2626",
  games: "#059669",
};

const PAGE_SIZE = 8;

function normalize(value?: string) {
  return decodeURIComponent(value || "")
    .toLowerCase()
    .trim();
}

function matchesPlatformCard(
  product: IProduct,
  card?: IPlatformCard,
  raw?: string,
) {
  const slug = normalize(card?.slug || raw);
  const name = normalize(card?.name || raw);
  const platform = normalize(product.platform);
  const hay = `${product.title} ${product.platform || ""}`.toLowerCase();
  const isOriginalDs = slug === "nds" || name === "nintendo ds";
  const isDsLite = slug === "dsl" || name === "nintendo ds lite";
  const isDsi = slug === "ndsi" || name === "nintendo dsi";
  if (isOriginalDs) {
    return (
      (platform === "nds" ||
        platform === "nintendo ds" ||
        /\bnintendo ds\b/i.test(hay) ||
        /\bnds\b/i.test(hay)) &&
      !/ds lite|\bdsl\b|ndsi|\bdsi\b|\b3ds\b/.test(hay)
    );
  }
  if (isDsLite) {
    return (
      platform === "dsl" ||
      platform === "nintendo ds lite" ||
      /ds lite|\bdsl\b/i.test(hay)
    );
  }
  if (isDsi) {
    return (
      platform === "ndsi" ||
      platform === "nintendo dsi" ||
      /nintendo dsi|\bndsi\b|\bdsi\b/i.test(hay)
    );
  }
  const isM15 =
    slug === "m15-pro" || slug === "m15pro" || name === "m15 pro";
  if (isM15) {
    return (
      platform === "m15 pro" ||
      platform === "m15-pro" ||
      platform === "m15pro" ||
      /m15[\s-]*pro|\bm15pro\b|game\s*stick/i.test(hay)
    );
  }
  const isSup = slug === "sup" || name === "sup";
  if (isSup) {
    return (
      platform === "sup" ||
      /\bsup\b|sup\s*game\s*box|საპ\b/i.test(hay)
    );
  }
  if (platform && (platform === slug || platform === name)) return true;
  if (name && hay.includes(name)) return true;
  if (slug) {
    const safe = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${safe}([^a-z0-9]|$)`, "i").test(hay);
  }
  return false;
}

function artForPlatform(name: string) {
  const want = name.toLowerCase();
  for (const list of Object.values(fallbackCards)) {
    const hit = list.find((item) => item.name.toLowerCase() === want);
    if (hit) return hit.image;
  }
  return platformArtUrl(name.toLowerCase().replace(/\s+/g, "-"));
}

function cardsFromProducts(list: IProduct[], brand: string): IPlatformCard[] {
  const seen = new Set<string>();
  const out: IPlatformCard[] = [];
  for (const product of list) {
    const name = String(product.platform || "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      _id: name,
      brand,
      name,
      slug: name,
      imageUrl: artForPlatform(name),
      order: out.length,
    });
  }
  return out;
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
  return matchesPlatformCard(product, card, s);
}

export default function CategoryView() {
  const { platform, sub } = useParams<{ platform: string; sub?: string }>();
  const brand = brandKey(platform);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [cards, setCards] = useState<IPlatformCard[]>([]);
  const [collection, setCollection] = useState<ICollectionPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(2000);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedKinds, setSelectedKinds] = useState<ProductKind[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const kindRoute = KIND_ROUTES[brand];

  useEffect(() => {
    setLoading(true);
    setVisibleCount(PAGE_SIZE);
    setSelectedKinds([]);
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setSelectedBrands([]);
    Promise.all([
      getProducts(),
      getPlatformCards().catch(() => [] as IPlatformCard[]),
      getCollectionPage(brand).catch(() => null),
    ])
      .then(([data, platformCards, page]) => {
        setProducts(data);
        setCards(
          platformCards.filter(
            (card) => brandKey(card.brand) === brand,
          ),
        );
        setCollection(page);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, [brand]);

  const catalogProducts = products.filter((p) => !isBannerProduct(p));
  const brandProducts = catalogProducts.filter((p) =>
    kindRoute
      ? productKind(p) === kindRoute
      : matchesBrand(p, platform),
  );

  const currentCards: IPlatformCard[] = useMemo(() => {
    if (kindRoute) return cardsFromProducts(brandProducts, brand);
    const fromApi = [...cards].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
    if (fromApi.length) return fromApi;
    return (fallbackCards[brand] || []).map((item, index) => ({
      _id: item.slug,
      brand,
      name: item.name,
      slug: item.slug,
      imageUrl: item.image,
      year: item.year,
      order: index,
    }));
  }, [brand, brandProducts, cards, kindRoute]);

  const genres = useMemo(() => {
    const set = new Set<string>();
    brandProducts.forEach((p) => {
      if (p.genre) set.add(p.genre);
    });
    return Array.from(set);
  }, [brandProducts]);

  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of brandProducts) {
      const name = String(p.category || "").trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [brandProducts]);

  const priceBounds = useMemo(() => {
    const vals = brandProducts.map((p) => getSalePrice(p).final);
    const hi = vals.length ? Math.max(...vals) : 2000;
    return { min: 0, max: Math.max(50, hi) };
  }, [brandProducts]);

  useEffect(() => {
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
  }, [brand, priceBounds.min, priceBounds.max]);

  const filteredProducts = brandProducts.filter((p) => {
    if (!matchesSub(p, sub, currentCards)) return false;
    const price = getSalePrice(p).final;
    if (price < priceMin || price > priceMax) return false;
    if (selectedBrands.length && !selectedBrands.includes(p.category)) {
      return false;
    }
    if (selectedPlatforms.length) {
      const hit = selectedPlatforms.some((item) => {
        const card = currentCards.find(
          (c) =>
            normalize(c.name) === normalize(item) ||
            normalize(c.slug) === normalize(item),
        );
        return matchesPlatformCard(p, card, item);
      });
      if (!hit) return false;
    }
    if (selectedGenres.length && !selectedGenres.includes(p.genre || "")) {
      return false;
    }
    if (
      !kindRoute &&
      selectedKinds.length &&
      !selectedKinds.includes(productKind(p))
    ) {
      return false;
    }
    return true;
  });

  const visible = filteredProducts.slice(0, visibleCount);
  const bannerColor =
    bannerColors[brand] || collection?.bannerColor || "#7c3aed";
  const categoryTitle = kindRoute
    ? kindRoute === "accessory"
      ? "აქსესუარები"
      : "თამაშები"
    : collection?.title || decodeURIComponent(platform || "Nintendo");
  const subCard = currentCards.find(
    (card) =>
      normalize(card.slug) === normalize(sub) ||
      normalize(card.name) === normalize(sub),
  );
  const subLabel = subCard?.name || (sub ? decodeURIComponent(sub) : "");
  const seoTitle = subLabel ? `${categoryTitle} — ${subLabel}` : categoryTitle;
  const seoPath = subCard
    ? `/category/${encodeURIComponent(platform || "")}/${encodeURIComponent(subCard.slug)}`
    : `/category/${encodeURIComponent(platform || "")}`;
  const seoDescription = `${seoTitle} — მეორადი რეტრო კონსოლები და თამაშები RetroBit-ზე. მიწოდება საქართველოში.`;
  const seoCrumbs = [
    { name: "მთავარი", path: "/" },
    {
      name: categoryTitle,
      path: `/category/${encodeURIComponent(platform || "")}`,
    },
  ];
  if (subLabel) seoCrumbs.push({ name: subLabel, path: seoPath });

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

  const toggleKind = (kind: ProductKind) => {
    setSelectedKinds((prev) =>
      prev.includes(kind) ? prev.filter((item) => item !== kind) : [...prev, kind],
    );
    setVisibleCount(PAGE_SIZE);
  };

  const bumpPrice = (min: number, max: number) => {
    setPriceMin(min);
    setPriceMax(max);
    setVisibleCount(PAGE_SIZE);
  };

  const canClear =
    selectedBrands.length > 0 ||
    selectedPlatforms.length > 0 ||
    selectedGenres.length > 0 ||
    selectedKinds.length > 0 ||
    priceMin !== priceBounds.min ||
    priceMax !== priceBounds.max;

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setSelectedKinds([]);
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div
      className="shop-page"
      style={{
        minHeight: "100vh",
        color: "var(--text)",
        paddingBottom: "40px",
        ["--banner" as string]: bannerColor,
      }}
    >
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        path={seoPath}
        jsonLd={jsonLdGraph([breadcrumbGraph(seoCrumbs)])}
      />
      <div
        className="collection-banner"
        style={{ ["--banner" as string]: bannerColor }}
      >
        {currentCards.length > 0 && (
          <PlatformCarousel
            cards={currentCards}
            brandPath={platform || ""}
            activeSub={sub}
          />
        )}
      </div>

      <div className="shop-title-row">
        <span className="ny-orb" aria-hidden />
        <h1 className="collection-title" style={{ color: bannerColor }}>
          {seoTitle}
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
        <ShopFilters
          priceMin={priceMin}
          priceMax={priceMax}
          boundMin={priceBounds.min}
          boundMax={priceBounds.max}
          onPriceMin={(n) => bumpPrice(n, priceMax)}
          onPriceMax={(n) => bumpPrice(priceMin, n)}
          brands={brands}
          selectedBrands={selectedBrands}
          onToggleBrand={(name) =>
            toggleValue(selectedBrands, name, setSelectedBrands)
          }
          platforms={currentCards}
          selectedPlatforms={selectedPlatforms}
          onTogglePlatform={(name) =>
            toggleValue(selectedPlatforms, name, setSelectedPlatforms)
          }
          showKind={!kindRoute}
          selectedKinds={selectedKinds}
          onToggleKind={toggleKind}
          genres={genres}
          selectedGenres={selectedGenres}
          onToggleGenre={(name) =>
            toggleValue(selectedGenres, name, setSelectedGenres)
          }
          onClear={clearFilters}
          canClear={canClear}
        />

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
