import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { IProduct } from "../types";

// შემოგვაქვს ჩვენი ახალი დაყოფილი კომპონენტები
import HeroBanner from "../components/HeroBanner";
import BestSellersSlider from "../components/BestSellersSlider";
import BrandsSection from "../components/BrandsSection";
import CategoriesSection from "../components/CategoriesSection";

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
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("პროდუქტების წამოღების შეცდომა:", err);
        setLoading(false);
      });
  }, []);

  const heroBanner = products.find(
    (p) => p.category === "banner-hero" || p.isHeroBanner === true,
  );
  const middleBanner = products.find((p) => p.category === "banner-middle");
  const bottomBanner = products.find((p) => p.category === "banner-bottom");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        paddingBottom: "60px",
        overflowX: "hidden",
        overflowY: "visible", // 👈 უზრუნველყოფს, რომ ჰოვერზე ზონა არ ჩაიჭრას
        fontFamily: "'Noto Serif Georgian', sans-serif",
      }}
    >
      {/* 1. მთავარი ბანერი */}
      <HeroBanner heroBanner={heroBanner} searchQuery={searchQuery} />

      {/* 2. ბესტსელერები - დავუმატეთ ზედა ზონა (paddingTop), რომ ნეონის ჩარჩო არ მოიჭრას */}
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
