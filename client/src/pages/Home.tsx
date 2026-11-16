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

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+Georgian:wght@700;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        paddingBottom: "60px",
        overflowX: "hidden",
        overflowY: "hidden",
        fontFamily: "'Noto Serif Georgian', sans-serif",
      }}
    >
      {!searchQuery ? (
        <RetroStage>
          <HeroBanner heroBanner={heroBanner} searchQuery={searchQuery} />
        </RetroStage>
      ) : (
        <HeroBanner heroBanner={heroBanner} searchQuery={searchQuery} />
      )}

      {/* 2. ბესტსელერები */}
      <div style={{ paddingTop: "25px", overflow: "visible" }}>
        <BestSellersSlider
          products={products}
          loading={loading}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* 3. პოპულარული ბრენდები */}
      {!searchQuery && <BrandsSection />}

      {/* 4. კატეგორიები */}
      {!searchQuery && <CategoriesSection />}

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
            alt="Middle Banner"
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
            alt="Bottom Banner"
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
