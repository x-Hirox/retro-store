import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { IProduct } from "../types";

// კომპონენტები
import HeroBanner from "../components/HeroBanner";
import RetroStage from "../components/RetroStage";
import BestSellersSlider from "../components/BestSellersSlider";
import BrandsSection from "../components/BrandsSection";
import CategoriesSection from "../components/CategoriesSection";
import PopularBundlesSlider from "../components/.PopularBundlesSlider"; // 👈 პოპულარული ბუნდლების სლაიდერი
import ReviewsSection from "../components/ReviewsSection";
import FaqSection from "../components/FaqSection";
import RecentlyViewed from "../components/RecentlyViewed";
import NewsletterSignup from "../components/NewsletterSignup";
import ProductCard from "../components/ProductCard";
import SeoHead from "../components/SeoHead";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  jsonLdGraph,
} from "../seo/site";
import { isBannerProduct } from "../utils/pricing";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("პროდუქტების წამოღების შეცდომა:", err);
        setLoading(false);
      });
  }, []);

  const heroBanner = products?.find(
    (p) => p.category === "banner-hero" || p.isHeroBanner === true,
  );
  const middleBanner = products?.find((p) => p.category === "banner-middle");
  const bottomBanner = products?.find((p) => p.category === "banner-bottom");
  const newest = [...(products || [])]
    .filter((item) => !isBannerProduct(item))
    .sort((a, b) => String(b._id).localeCompare(String(a._id)))
    .slice(0, 4);

  const homeTitle = searchQuery
    ? `ძებნა: ${searchQuery}`
    : DEFAULT_TITLE;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: "var(--text)",
        paddingBottom: "60px",
        overflowX: "hidden",
        overflowY: "hidden",
        fontFamily: "'Noto Serif Georgian', sans-serif",
      }}
    >
      <SeoHead
        title={homeTitle}
        description={DEFAULT_DESCRIPTION}
        path={searchQuery ? `/?search=${encodeURIComponent(searchQuery)}` : "/"}
        jsonLd={jsonLdGraph()}
        noindex={Boolean(searchQuery)}
      />
      {!searchQuery ? (
        <RetroStage>
          <HeroBanner heroBanner={heroBanner} searchQuery={searchQuery} />
        </RetroStage>
      ) : (
        <HeroBanner heroBanner={heroBanner} searchQuery={searchQuery} />
      )}
      <h1 className="home-seo-h1">{DEFAULT_TITLE}</h1>

      {/* 2. ყველაზე გაყიდვადი */}
      <div style={{ paddingTop: "25px", overflow: "visible" }}>
        <BestSellersSlider
          products={products}
          loading={loading}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </div>

      {!searchQuery && newest.length > 0 && (
        <div className="section-gutter" style={{ paddingTop: "10px" }}>
          <h2
            className="section-title"
            style={{
              color: "var(--text-h)",
              fontWeight: 900,
              letterSpacing: "1.5px",
              fontFamily: "'Noto Serif Georgian', serif",
              marginBottom: "25px",
            }}
          >
            ახალი დამატებული
          </h2>
          <div className="arcade-grid">
            {newest.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* 3. პოპულარული ბრენდები */}
      {!searchQuery && (
        <BrandsSection />
      )}

      {/* 4. კატეგორიები */}
      {!searchQuery && (
        <CategoriesSection />
      )}

      {/* 6. SHOP BY POPULAR BUNDLES */}
      {!searchQuery && <PopularBundlesSlider products={products} />}

      {/* შუა ბანერი */}
      {middleBanner && middleBanner.imageUrl && !searchQuery && (
        <div
          style={{ width: "100%", marginTop: "50px", cursor: "pointer" }}
          onClick={() => navigate("/category/playstation")}
        >
          <img
            src={middleBanner.imageUrl}
            alt="RetroBit — რეტრო კონსოლების შუა ბანერი"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* ქვედა ბანერი */}
      {bottomBanner && bottomBanner.imageUrl && !searchQuery && (
        <div
          style={{ width: "100%", marginTop: "50px", cursor: "pointer" }}
          onClick={() => navigate("/category/playstation")}
        >
          <img
            src={bottomBanner.imageUrl}
            alt="RetroBit — რეტრო კონსოლების ქვედა ბანერი"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {!searchQuery && (
        <>
          <ReviewsSection />
          <FaqSection />
          <RecentlyViewed />
          <NewsletterSignup />
        </>
      )}
    </div>
  );
}
