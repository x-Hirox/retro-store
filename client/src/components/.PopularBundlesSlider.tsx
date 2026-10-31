import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { IProduct } from "../types";

interface Props {
  products: IProduct[];
}

export default function PopularBundlesSlider({ products }: Props) {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

  const bundleProducts = products.filter(
    (p) =>
      p.category === "bundles" ||
      p.category === "bundle" ||
      p.title?.toLowerCase().includes("bundle"),
  );

  if (bundleProducts.length === 0) return null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "40px auto 0 auto",
        padding: "0 20px",
        boxSizing: "border-box",
        overflow: "visible",
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
            fontSize: "1.8rem",
            fontWeight: "900",
            letterSpacing: "1.5px",
            fontFamily: "var(--heading)",
            textTransform: "uppercase",
          }}
        >
          Shop by Popular Bundles
        </h2>
        <span
          style={{
            color: "var(--text)",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.95rem",
          }}
          onClick={() => navigate("/category/bundles")}
        >
          VIEW MORE &gt;
        </span>
      </div>

      <div style={{ position: "relative", overflow: "visible" }}>
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
          {bundleProducts.map((product) => (
            <div
              key={product._id || product._id}
              className="retro-card"
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
              onClick={() => navigate(`/product/${product._id || product._id}`)}
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
                  <span style={{ fontSize: "3rem" }}>📦</span>
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

                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text)",
                    marginBottom: "8px",
                  }}
                >
                  40+ Sold Recently
                </span>

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
                    ${product.price}
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text)",
                      textDecoration: "line-through",
                    }}
                  >
                    ${(product.price * 1.2).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
