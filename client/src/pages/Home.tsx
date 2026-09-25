import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { IProduct } from "../types";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // ნაგულისხმევად მუქი იასამნისფერი (რეტრო სტილი)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search")?.toLowerCase() || ""; // ძებნის პარამეტრის წაკითხვა

  useEffect(() => {
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

  // ბანერების გამოყოფა
  const heroBanner = products.find(
    (p) => p.category === "banner-hero" || p.isHeroBanner === true,
  );
  const middleBanner = products.find((p) => p.category === "banner-middle");
  const bottomBanner = products.find((p) => p.category === "banner-bottom");

  // ჩვეულებრივი პროდუქტები (გაფილტრული კატეგორიით ან ძებნით)
  const regularProducts = products.filter((p) => {
    const isBanner =
      p.category === "banner-hero" ||
      p.category === "banner-middle" ||
      p.category === "banner-bottom" ||
      p.isHeroBanner;

    if (isBanner) return false;

    // თუ ძებნის სიტყვა გვაქვს
    if (searchQuery) {
      const matchesTitle = p.title?.toLowerCase().includes(searchQuery);
      const matchesDesc = p.description?.toLowerCase().includes(searchQuery);
      const matchesCat = p.category?.toLowerCase().includes(searchQuery);
      return matchesTitle || matchesDesc || matchesCat;
    }

    // თუ კატეგორიაა არჩეული
    if (selectedCategory && selectedCategory !== "All") {
      return p.category === selectedCategory;
    }
    return true;
  });

  // დინამიკური ფერები რეტრო იასამნისფერი / ღია თემისთვის
  const theme = {
    bg: isDarkMode ? "#0d061a" : "#f8f9fa", // მუქი იასამნისფერი რეტრო ფონი
    cardBg: isDarkMode ? "#1a102f" : "#ffffff",
    textColor: isDarkMode ? "#f3e8ff" : "#1e293b",
    subText: isDarkMode ? "#cbd5e1" : "#64748b",
    accent: "#a855f7", // ნათელი იასამნისფერი (Neon Purple)
    border: isDarkMode ? "#3b2064" : "#e2e8f0",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.bg,
        color: theme.textColor,
        paddingBottom: "60px",
        overflowX: "hidden",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* ფერის შეცვლის (Dark/Light Retro) ღილაკი */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "15px 40px",
        }}
      >
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            backgroundColor: theme.accent,
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 0 12px rgba(168, 85, 247, 0.5)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isDarkMode ? "☀️ ღია რეჟიმი" : "🟣 მუქი იასამნისფერი (რეტრო)"}
        </button>
      </div>

      {/* --- 1. მთავარი (Hero) ბანერი - კლიკით გადადის PlayStation კატეგორიაში --- */}
      {heroBanner && heroBanner.imageUrl && !searchQuery && (
        <div
          onClick={() => {
            navigate("/category/playstation");
          }}
          style={{
            width: "100%",
            cursor: "pointer",
            marginBottom: "30px",
            overflow: "hidden",
          }}
        >
          <img
            src={heroBanner.imageUrl}
            alt={heroBanner.title || "Banner"}
            style={{
              width: "100%",
              maxHeight: "450px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* მთავარი კონტენტი */}
      <div
        id="catalog-section"
        style={{ width: "100%", padding: "0 40px", boxSizing: "border-box" }}
      >
        <div style={{ marginBottom: "25px", textAlign: "left" }}>
          <h2
            style={{
              color: theme.textColor,
              fontSize: "1.8rem",
              fontWeight: "bold",
              textShadow: isDarkMode
                ? "0 0 8px rgba(168, 85, 247, 0.6)"
                : "none",
            }}
          >
            {searchQuery
              ? `🔍 ძებნის შედეგი: "${searchQuery}"`
              : selectedCategory
                ? `📂 ${selectedCategory}`
                : "🔥 ALL PRODUCTS"}
          </h2>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: theme.subText,
              marginTop: "50px",
            }}
          >
            იტვირთება რეტრო სამყარო...
          </div>
        ) : regularProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: theme.cardBg,
              borderRadius: "12px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <p style={{ color: theme.subText, fontSize: "1.1rem" }}>
              პროდუქტები ამჟამად არ მოიძებნება.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {regularProducts.map((product) => (
              <div
                key={product._id}
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: "12px",
                  boxShadow: isDarkMode
                    ? "0 4px 20px rgba(13, 6, 26, 0.7)"
                    : "0 4px 15px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  border: `1px solid ${theme.border}`,
                }}
                onClick={() => navigate(`/product/${product._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    height: "190px",
                    backgroundColor: isDarkMode ? "#261642" : "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "3rem" }}>🕹️</span>
                  )}
                </div>

                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 10px 0",
                      color: theme.textColor,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {product.title}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 20px 0",
                      color: theme.subText,
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {product.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                        color: "#c084fc",
                      }}
                    >
                      {product.price} ₾
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product._id}`);
                      }}
                      style={{
                        backgroundColor: theme.accent,
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      დეტალები
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- 2. შუა ბანერი (Middle Banner) --- */}
      {middleBanner && middleBanner.imageUrl && !searchQuery && (
        <div
          style={{
            width: "100%",
            marginTop: "50px",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/category/playstation");
          }}
        >
          <img
            src={middleBanner.imageUrl}
            alt={middleBanner.title || "Middle Banner"}
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* --- 3. ქვედა ბანერი (Bottom Banner) --- */}
      {bottomBanner && bottomBanner.imageUrl && !searchQuery && (
        <div
          style={{
            width: "100%",
            marginTop: "30px",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/category/playstation");
          }}
        >
          <img
            src={bottomBanner.imageUrl}
            alt={bottomBanner.title || "Bottom Banner"}
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
