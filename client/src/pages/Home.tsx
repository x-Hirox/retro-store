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

  const heroBanner = products.find(
    (p) => p.category === "banner-hero" || p.isHeroBanner === true,
  );
  const middleBanner = products.find((p) => p.category === "banner-middle");

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
      }}
    >
      {/* 1. მთავარი ბანერი */}
      {heroBanner && heroBanner.imageUrl && !searchQuery && (
        <div
          onClick={() => navigate("/category/playstation")}
          style={{ width: "100%", cursor: "pointer", overflow: "hidden" }}
        >
          <img
            src={heroBanner.imageUrl}
            alt={heroBanner.title || "Banner"}
            style={{
              width: "100%",
              maxHeight: "480px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* 2. SHOP BY POPULAR BRANDS (სწორად გასწორებული ლოგოები და ტექსტები) */}
      {!searchQuery && (
        <div
          style={{
            backgroundColor: "#0a0a0c",
            padding: "35px 20px",
            borderTop: "1px solid #222",
            borderBottom: "1px solid #222",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "25px",
              color: "#fff",
              fontSize: "1.2rem",
              letterSpacing: "1.5px",
              fontFamily: "var(--heading)",
            }}
          >
            SHOP BY POPULAR BRANDS
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
              flexWrap: "wrap",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            <div
              onClick={() => navigate("/category/nintendo")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/512px-Nintendo.svg.png"
                alt="Nintendo"
                style={{
                  height: "24px",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <span
                style={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
              >
                Nintendo
              </span>
            </div>

            <div
              onClick={() => navigate("/category/playstation")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/2560px-PlayStation_logo.svg.png"
                alt="PlayStation"
                style={{
                  height: "22px",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <span
                style={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
              >
                PlayStation
              </span>
            </div>

            <div
              onClick={() => navigate("/category/xbox")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/1024px-Xbox_one_logo.svg.png"
                alt="Xbox"
                style={{
                  height: "26px",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <span
                style={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
              >
                Xbox
              </span>
            </div>

            <div
              onClick={() => navigate("/category/sega")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/SEGA_logo.svg/1280px-SEGA_logo.svg.png"
                alt="Sega"
                style={{
                  height: "20px",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <span
                style={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
              >
                Sega
              </span>
            </div>

            <div
              onClick={() => navigate("/category/atari")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Atari-Logo.svg/1200px-Atari-Logo.svg.png"
                alt="Atari"
                style={{
                  height: "24px",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <span
                style={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
              >
                Atari
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. საუკეთესო გაყიდვები (BEST SELLERS) */}
      <div
        style={{ width: "100%", padding: "0 40px", boxSizing: "border-box" }}
      >
        <div
          style={{
            marginBottom: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
                : "BEST SELLERS"}
          </h2>
          <span
            onClick={() => navigate("/category/playstation")}
            style={{
              color: "var(--text)",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            VIEW MORE &gt;
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {regularProducts.map((product) => (
              <div
                key={product._id}
                style={{
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
                }}
                onClick={() => navigate(`/product/${product._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 25px rgba(147, 40, 230, 0.2)";
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
                        objectFit: "contain",
                        padding: "10px",
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
        )}
      </div>

      {/* 4. კატეგორიები (SHOP BY CATEGORIES) */}
      {!searchQuery && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "60px auto 0",
            padding: "0 20px",
          }}
        >
          <h2
            style={{
              color: "var(--text-h)",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "1.8rem",
              fontFamily: "var(--heading)",
            }}
          >
            SHOP BY CATEGORIES
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            <div
              onClick={() => navigate("/category/playstation")}
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
                borderRadius: "16px",
                padding: "30px",
                cursor: "pointer",
                color: "#fff",
                minHeight: "200px",
                boxShadow: "0 10px 25px rgba(30, 58, 138, 0.3)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "900",
                  marginBottom: "10px",
                }}
              >
                HOME CONSOLES
              </h3>
              <p style={{ fontSize: "0.9rem", opacity: "0.85" }}>
                Power up your setup with legendary consoles. Expertly
                refurbished.
              </p>
            </div>

            <div
              onClick={() => navigate("/category/nintendo")}
              style={{
                background: "linear-gradient(135deg, #581c87 0%, #7e22ce 100%)",
                borderRadius: "16px",
                padding: "30px",
                cursor: "pointer",
                color: "#fff",
                minHeight: "200px",
                boxShadow: "0 10px 25px rgba(88, 28, 135, 0.3)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "900",
                  marginBottom: "10px",
                }}
              >
                HANDHELD CONSOLES
              </h3>
              <p style={{ fontSize: "0.9rem", opacity: "0.85" }}>
                Take your favourite games on the go. Tested and reliable.
              </p>
            </div>

            <div
              onClick={() => navigate("/category/sega")}
              style={{
                background: "linear-gradient(135deg, #065f46 0%, #059669 100%)",
                borderRadius: "16px",
                padding: "30px",
                cursor: "pointer",
                color: "#fff",
                minHeight: "200px",
                boxShadow: "0 10px 25px rgba(6, 95, 70, 0.3)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "900",
                  marginBottom: "10px",
                }}
              >
                GAMES
              </h3>
              <p style={{ fontSize: "0.9rem", opacity: "0.85" }}>
                From timeless classics to hidden gems. Cleaned and tested.
              </p>
            </div>
          </div>
        </div>
      )}

      {middleBanner && middleBanner.imageUrl && !searchQuery && (
        <div
          style={{ width: "100%", marginTop: "50px", cursor: "pointer" }}
          onClick={() => navigate("/category/playstation")}
        >
          <img
            src={middleBanner.imageUrl}
            alt="Banner"
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
