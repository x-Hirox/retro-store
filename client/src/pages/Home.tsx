import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { IProduct } from "../types";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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

  // სხვადასხვა ბანერების ძებნა ბაზიდან
  const heroBanner = products.find(
    (p) => p.category === "banner-hero" || p.isHeroBanner === true,
  );
  const middleBanner = products.find((p) => p.category === "banner-middle");
  const bottomBanner = products.find((p) => p.category === "banner-bottom");

  // დანარჩენი პროდუქტები (რომლებიც არ არის არცერთი ბანერი)
  const regularProducts = products.filter(
    (p) =>
      p.category !== "banner-hero" &&
      p.category !== "banner-middle" &&
      p.category !== "banner-bottom" &&
      !p.isHeroBanner,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        paddingBottom: "60px",
        overflowX: "hidden",
      }}
    >
      {/* --- 1. მთავარი (Hero) ბანერი თავში --- */}
      {heroBanner ? (
        <div
          style={{
            backgroundImage: heroBanner.imageUrl
              ? `url(${heroBanner.imageUrl})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            background: heroBanner.imageUrl
              ? undefined
              : "linear-gradient(135deg, #111111 0%, #2c3e50 100%)",
            color: "#fff",
            padding: "80px 20px",
            textAlign: "center",
            marginBottom: "40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            position: "relative",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: heroBanner.imageUrl
                ? "rgba(0, 0, 0, 0.65)"
                : "transparent",
              padding: "30px",
              borderRadius: "12px",
              display: "inline-block",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            <h1
              style={{
                fontSize: "2.5rem",
                marginBottom: "15px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {heroBanner.title}
            </h1>
            <p
              style={{
                fontSize: "1.15rem",
                color: "#cbd5e1",
                maxWidth: "600px",
                margin: "0 auto 20px auto",
                lineHeight: "1.5",
              }}
            >
              {heroBanner.description}
            </p>
            <button
              onClick={() => navigate(`/product/${heroBanner._id}`)}
              style={{
                backgroundColor: "#ff6600",
                color: "white",
                border: "none",
                padding: "12px 28px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(255,102,0,0.4)",
              }}
            >
              დეტალურად ნახვა 🎮
            </button>
          </div>
        </div>
      ) : (
        /* სტატიკური დეფოლტ ბანერი */
        <div
          style={{
            background: "linear-gradient(135deg, #111111 0%, #2c3e50 100%)",
            color: "#fff",
            padding: "50px 20px",
            textAlign: "center",
            marginBottom: "40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              fontSize: "2.3rem",
              marginBottom: "15px",
              fontWeight: "bold",
            }}
          >
            დაუბრუნდი ბავშვობის საუკეთესო მომენტებს! 🎮
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#cbd5e1",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            აღმოაჩინე ლეგენდარული რეტრო კონსოლები, ორიგინალური თამაშები და
            აქსესუარები.
          </p>
        </div>
      )}

      {/* მთავარი კონტენტი - სრულ სიგანეზე გაშლილი */}
      <div
        style={{ width: "100%", padding: "0 40px", boxSizing: "border-box" }}
      >
        {/* კატალოგის სათაური */}
        <div style={{ marginBottom: "25px", textAlign: "left" }}>
          <h2
            style={{ color: "#2c3e50", fontSize: "1.8rem", fontWeight: "bold" }}
          >
            🔥 პოპულარული კოლექცია
          </h2>
        </div>

        {/* იტვირთება ინდიკატორი */}
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
          /* Grid ბადე პროდუქტებისთვის */
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.05)";
                }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* სურათი ან ფოლბექი */}
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

                {/* კონტენტი */}
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
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2563eb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#3b82f6")
                      }
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

      {/* --- 2. შუა ბანერი (Middle Banner) - სრულ სიგანეზე --- */}
      {middleBanner && (
        <div
          style={{
            marginTop: "50px",
            backgroundImage: middleBanner.imageUrl
              ? `url(${middleBanner.imageUrl})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            background: middleBanner.imageUrl
              ? undefined
              : "linear-gradient(135deg, #2c3e50 0%, #111 100%)",
            color: "#fff",
            padding: "60px 40px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: middleBanner.imageUrl
                ? "rgba(0,0,0,0.6)"
                : "transparent",
              padding: "20px",
              borderRadius: "8px",
              display: "inline-block",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>
              {middleBanner.title}
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#cbd5e1",
                maxWidth: "600px",
                margin: "0 auto 20px auto",
              }}
            >
              {middleBanner.description}
            </p>
            <button
              onClick={() => navigate(`/product/${middleBanner._id}`)}
              style={{
                backgroundColor: "#ff6600",
                color: "white",
                border: "none",
                padding: "10px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ნახვა
            </button>
          </div>
        </div>
      )}

      {/* --- 3. ქვედა ბანერი (Bottom Banner) - სრულ სიგანეზე --- */}
      {bottomBanner && (
        <div
          style={{
            marginTop: "30px",
            backgroundImage: bottomBanner.imageUrl
              ? `url(${bottomBanner.imageUrl})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            background: bottomBanner.imageUrl
              ? undefined
              : "linear-gradient(135deg, #111 0%, #2c3e50 100%)",
            color: "#fff",
            padding: "60px 40px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: bottomBanner.imageUrl
                ? "rgba(0,0,0,0.6)"
                : "transparent",
              padding: "20px",
              borderRadius: "8px",
              display: "inline-block",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>
              {bottomBanner.title}
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#cbd5e1",
                maxWidth: "600px",
                margin: "0 auto 20px auto",
              }}
            >
              {bottomBanner.description}
            </p>
            <button
              onClick={() => navigate(`/product/${bottomBanner._id}`)}
              style={{
                backgroundColor: "#ff6600",
                color: "white",
                border: "none",
                padding: "10px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              აღმოაჩინე
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
