import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { IProduct } from "../types";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

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

    if (searchQuery) {
      const matchesTitle = p.title?.toLowerCase().includes(searchQuery);
      const matchesDesc = p.description?.toLowerCase().includes(searchQuery);
      const matchesCat = p.category?.toLowerCase().includes(searchQuery);
      return matchesTitle || matchesDesc || matchesCat;
    }

    if (selectedCategory && selectedCategory !== "All") {
      return p.category === selectedCategory;
    }
    return true;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        paddingBottom: "60px",
        overflowX: "hidden",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* --- 1. მთავარი (Hero) ბანერი --- */}
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
              color: "var(--text-h)",
              fontSize: "1.8rem",
              fontWeight: "bold",
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
              color: "var(--text)",
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
              backgroundColor: "var(--code-bg)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
            }}
          >
            <p style={{ color: "var(--text)", fontSize: "1.1rem" }}>
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
                  backgroundColor: "var(--code-bg)",
                  borderRadius: "18px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  padding: "16px",
                }}
                onClick={() => navigate(`/product/${product._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(168, 85, 247, 0.35), 0 0 20px rgba(236, 72, 153, 0.2)";
                  e.currentTarget.style.borderColor = "#a855f7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.2)";
                }}
              >
                <div
                  style={{
                    height: "190px",
                    backgroundColor: "var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "12px",
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
                    padding: "14px 0 0 0",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 10px 0",
                      color: "var(--text-h)",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {product.title}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 20px 0",
                      color: "var(--text)",
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      opacity: 0.8,
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
                        fontSize: "1.35rem",
                        fontWeight: "800",
                        color: "#a855f7",
                        textShadow: "0 0 10px rgba(168, 85, 247, 0.3)",
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
                        background:
                          "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        boxShadow: "0 4px 15px rgba(168, 85, 247, 0.4)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.95";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scale(1)";
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
