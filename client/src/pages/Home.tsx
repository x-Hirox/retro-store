import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { IProduct } from "../types";

// კომპონენტები
import HeroBanner from "../components/HeroBanner";
import BestSellersSlider from "../components/BestSellersSlider";
import BrandsSection from "../components/BrandsSection";
import CategoriesSection from "../components/CategoriesSection";
import PopularBundlesSlider from "../components/.PopularBundlesSlider"; // 👈 პოპულარული ბუნდლების სლაიდერი

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
        overflowY: "visible",
        fontFamily: "'Noto Serif Georgian', sans-serif",
      }}
    >
      {/* 1. მთავარი ბანერი */}
      <HeroBanner heroBanner={heroBanner} searchQuery={searchQuery} />

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

      {/* 5. ორი დიდი ბანერი (Accessories & Product Bundles) */}
      {!searchQuery && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "40px auto 0 auto",
            padding: "0 20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {/* აქსესუარების ბანერი */}
          <div
            style={{
              backgroundColor: "#cc0033",
              borderRadius: "16px",
              padding: "30px",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "220px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/category/playstation")}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.8rem",
                  margin: "0 0 10px 0",
                  fontFamily: "var(--heading)",
                }}
              >
                ACCESSORIES
              </h3>
              <p style={{ opacity: 0.9, fontSize: "0.95rem" }}>
                Power up your setup with legendary consoles. Each one is
                expertly refurbished to bring classic adventures straight to
                your living room.
              </p>
            </div>
          </div>

          {/* ბუნდლების ბანერი */}
          <div
            style={{
              backgroundColor: "#b8860b",
              borderRadius: "16px",
              padding: "30px",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "220px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/category/playstation")}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.8rem",
                  margin: "0 0 10px 0",
                  fontFamily: "var(--heading)",
                }}
              >
                PRODUCT BUNDLES
              </h3>
              <p style={{ opacity: "0.9", fontSize: "0.95rem" }}>
                Score big with curated bundles featuring consoles, games, and
                accessories - everything you need in one epic pack.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. SHOP BY POPULAR BUNDLES (სლაიდერი ბანერების ქვემოთ) */}
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
    </div>
  );
}
