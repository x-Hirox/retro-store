import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import type { IProduct } from "../types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("პროდუქტის დეტალების წამოღების შეცდომა:", err);
        setError("პროდუქტი ვერ მოიძებნა.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          fontSize: "1.2rem",
          color: "#c084fc",
          marginTop: "100px",
        }}
      >
        იტვირთება პროდუქტის დეტალები...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2 style={{ color: "#ff6b6b" }}>{error || "პროდუქტი არ არსებობს"}</h2>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            backgroundColor: "#a855f7",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          მთავარ გვერდზე დაბრუნება
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a102f", // მუქი რეტრო ფონი
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "#161b22", // ბარათის მუქი ფონი
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          border: "1px solid #332244",
        }}
      >
        {/* უკან დასაბრუნებელი ღილაკი */}
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#2a1b4e",
            color: "#c084fc",
            border: "1px solid #a855f7",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          ← უკან
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* სურათის დინამიური გამოტანა ბაზიდან */}
          <div
            style={{
              height: "350px",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0d061a",
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
              <span style={{ color: "#7f8c8d" }}>სურათი არ არის</span>
            )}
          </div>

          {/* პროდუქტის ინფორმაცია */}
          <div>
            <h1
              style={{
                color: "#ffffff",
                fontSize: "2rem",
                marginBottom: "15px",
              }}
            >
              {product.title}
            </h1>
            <p
              style={{
                color: "#b0b0b0",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                marginBottom: "25px",
              }}
            >
              {product.description}
            </p>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#38ef7d",
                marginBottom: "30px",
              }}
            >
              ${product.price}
            </div>

            <button
              style={{
                backgroundColor: "#a855f7",
                color: "white",
                border: "none",
                padding: "14px 28px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "bold",
                width: "100%",
                boxShadow: "0 0 12px rgba(168, 85, 247, 0.6)",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#9333ea")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#a855f7")
              }
              onClick={() => {
                addToCart(product);
                alert("პროდუქტი წარმატებით დაემატა კალათაში! 🛒");
              }}
            >
              კალათაში დამატება 🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
