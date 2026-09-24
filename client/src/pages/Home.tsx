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

  // ჩვეულებრივი პროდუქტები
  const regularProducts = products.filter((p) => {
    const isBanner =
      p.category === "banner-hero" ||
      p.category === "banner-middle" ||
      p.category === "banner-bottom" ||
      p.isHeroBanner;

    if (isBanner) return false;
    if (selectedCategory && selectedCategory !== "All") {
      return p.category === selectedCategory;
    }
    return true;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        paddingBottom: "60px",
        overflowX: "hidden",
      }}
    >
      {/* --- 1. მთავარი (Hero) ბანერი - სრულად გაშლილი სურათი კლიკით --- */}
      {heroBanner && heroBanner.imageUrl && (
        <div
          onClick={() => {
            // ბანერზე დაჭერისას გადადის ყველა პროდუქტის კოლექციაზე
            const element = document.getElementById("catalog-section");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
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
            style={{ color: "#2c3e50", fontSize: "1.8rem", fontWeight: "bold" }}
          >
            {selectedCategory ? `📂 ${selectedCategory}` : "🔥 ALL PRODUCTS"}
          </h2>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#95a5a6",
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
              backgroundColor: "#fff",
              borderRadius: "12px",
            }}
          >
            <p style={{ color: "#7f8c8d", fontSize: "1.1rem" }}>
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
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  border: "1px solid #e2e8f0",
                }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div
                  style={{
                    height: "190px",
                    backgroundColor: "#f1f5f9",
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
                      color: "#1e293b",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {product.title}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 20px 0",
                      color: "#64748b",
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
                        color: "#ff6600",
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
                        backgroundColor: "#3b82f6",
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
      {middleBanner && middleBanner.imageUrl && (
        <div
          style={{
            width: "100%",
            marginTop: "50px",
            cursor: "pointer",
          }}
          onClick={() => {
            window.scrollTo({ top: 500, behavior: "smooth" });
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
      {bottomBanner && bottomBanner.imageUrl && (
        <div
          style={{
            width: "100%",
            marginTop: "30px",
            cursor: "pointer",
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
