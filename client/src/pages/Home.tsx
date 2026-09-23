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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        paddingBottom: "60px",
      }}
    >
      {/* Hero სარეკლამო ბანერი */}
      <div
        style={{
          background: "linear-gradient(135deg, #111111 0%, #2c3e50 100%)",
          color: "#fff",
          padding: "50px 20px",
          textAlign: "center",
          marginBottom: "40px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
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
        ) : products.length === 0 ? (
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
            {products.map((product) => (
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
              >
                {/* სურათი ან ფოლბექი (imageUrl გამოყენებულია) */}
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
                      onClick={() => navigate(`/product/${product._id}`)}
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
    </div>
  );
}
