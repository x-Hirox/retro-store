import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { IProduct } from "../types";

interface Props {
  products: IProduct[];
  loading: boolean;
  searchQuery: string;
  selectedCategory: string;
}

export default function BestSellersSlider({
  products,
  loading,
  searchQuery,
  selectedCategory,
}: Props) {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

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
        width: "100%",
        padding: "40px 40px 0 40px",
        boxSizing: "border-box",
        overflow: "visible", // 👈 უზრუნველყოფს, რომ შიგთავსი არ ჩაიჭრას
      }}
    >
      <div
        style={{
          marginBottom: "25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          overflow: "visible",
        }}
      >
        <h2
          style={{
            color: "var(--text-h)",
            fontSize: "2rem",
            fontWeight: "900",
            letterSpacing: "1.5px",
            fontFamily: "'Noto Serif Georgian', serif",
          }}
        >
          {searchQuery
            ? `🔍 ძებნის შედეგი: "${searchQuery}"`
            : selectedCategory
              ? `📂 ${selectedCategory}`
              : "ბესტსელერები"}
        </h2>
        <span
          style={{
            color: "var(--text)",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.95rem",
          }}
          onClick={() => navigate("/category/playstation")}
        >
          ყველას ნახვა &gt;
        </span>
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
        <div style={{ position: "relative", overflow: "visible" }}>
          {/* 👈 აქ დავამატეთ paddingTop და overflow: visible, რომ ბარათს ზემოთ ასვლისას ჰქონდეს ადგილი */}
          <div
            ref={sliderRef}
            style={{
              display: "flex",
              gap: "24px",
              overflowX: "auto",
              overflowY: "visible",
              scrollBehavior: "smooth",
              paddingTop: "15px",
              paddingBottom: "15px",
              scrollbarWidth: "none",
            }}
          >
            {regularProducts.map((product) => (
              <div
                key={product._id}
                style={{
                  minWidth: "250px",
                  maxWidth: "250px",
                  backgroundColor: "var(--code-bg)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                  padding: "16px",
                  position: "relative",
                  flexShrink: 0,
                }}
                onClick={() => navigate(`/product/${product._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "var(--neon-pink)";
                  e.currentTarget.style.boxShadow =
                    "-3px 3px 0px var(--neon-pink), 3px -3px 0px var(--neon-cyan)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    backgroundColor: "#0066ff",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    padding: "3px 8px",
                    borderRadius: "10px",
                    zIndex: 2,
                  }}
                >
                  -15%
                </span>

                <div
                  style={{
                    height: "180px",
                    backgroundColor: "var(--bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "10px",
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
                      margin: "0 0 8px 0",
                      color: "var(--text-h)",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.title}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "12px",
                    }}
                  >
                    <span style={{ color: "#f59e0b", fontSize: "0.9rem" }}>
                      ★
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text)" }}>
                      4.8 (399)
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "auto",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "800",
                        color: "var(--text-h)",
                      }}
                    >
                      {product.price} ₾
                    </span>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text)",
                        textDecoration: "line-through",
                      }}
                    >
                      {(product.price * 1.2).toFixed(2)} ₾
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ღილაკები */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() =>
                sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" })
              }
              style={{
                backgroundColor: "#222",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              &lt;
            </button>
            <span
              style={{
                width: "24px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: "#0066ff",
              }}
            ></span>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#555",
              }}
            ></span>
            <button
              onClick={() =>
                sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" })
              }
              style={{
                backgroundColor: "#222",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
