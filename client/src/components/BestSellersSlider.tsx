import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { IProduct } from "../types";
import { formatGel, getSalePrice, isBannerProduct } from "../utils/pricing";
import HoloCard from "./HoloCard";
import { useLang } from "../i18n/LanguageContext";

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
  const { t } = useLang();

  const regularProducts = products.filter((p) => {
    if (isBannerProduct(p)) return false;

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
    <div className="section-gutter" style={{ overflow: "visible" }}>
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
          className="section-title ny-title"
          style={{
            color: "var(--text-h)",
            fontWeight: "900",
            letterSpacing: "1.5px",
            fontFamily: "'Noto Serif Georgian', serif",
          }}
        >
          {searchQuery
            ? `🔍 ${t("searchResult")}: "${searchQuery}"`
            : selectedCategory
              ? `📂 ${selectedCategory}`
              : t("bestsellers")}
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
          {t("seeAll")}
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
          {t("loading")}
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
            {t("noProducts")}
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
            {(regularProducts.some((p) => p.isBestSeller)
              ? regularProducts.filter((p) => p.isBestSeller)
              : regularProducts
            ).map((product) => {
              const sale = getSalePrice(product);
              return (
              <HoloCard
                key={product._id}
                className="product-card glass-card slider-card"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {(product.stock ?? 0) <= 0 && (
                  <span className="sold-badge">SOLD</span>
                )}
                {(product.stock ?? 0) > 0 && product.stock <= 3 && (
                  <span className="left-badge">დარჩა {product.stock}</span>
                )}
                {sale.discount > 0 && (product.stock ?? 0) > 0 && (
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
                  -{sale.discount}%
                </span>
                )}

                <div className="card-photo">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
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
                      {formatGel(sale.final)}
                    </span>
                    {sale.discount > 0 && (
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text)",
                        textDecoration: "line-through",
                      }}
                    >
                      {formatGel(sale.original)}
                    </span>
                    )}
                  </div>
                </div>
              </HoloCard>
            );
            })}
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
