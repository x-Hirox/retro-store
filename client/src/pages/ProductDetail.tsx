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
          color: "var(--accent)",
          marginTop: "100px",
        }}
      >
        იტვირთება პროდუქტის დეტალები...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "100px", padding: "0 20px" }}
      >
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
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "var(--code-bg)",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "var(--shadow)",
          border: "1px solid var(--border)",
          boxSizing: "border-box",
        }}
      >
        {/* უკან დასაბრუნებელი ღილაკი */}
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--text-h)",
            border: "1px solid var(--border)",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          ← უკან
        </button>

        {/* გამოყენებულია details-grid კლასი მობილურზე ავტომატური გასწორებისთვის */}
        <div className="details-grid">
          {/* სურათის დინამიური გამოტანა ბაზიდან */}
          <div
            style={{
              width: "100%",
              height: "350px",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--border)",
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

          {/* პროდუქტის ინფორმაცია */}
          <div style={{ width: "100%" }}>
            <h1
              style={{
                color: "var(--text-h)",
                fontSize: "1.8rem",
                marginBottom: "15px",
                marginTop: "0",
              }}
            >
              {product.title}
            </h1>
            <p
              style={{
                color: "var(--text)",
                fontSize: "1rem",
                lineHeight: "1.6",
                marginBottom: "25px",
                opacity: 0.9,
              }}
            >
              {product.description}
            </p>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#a855f7",
                marginBottom: "30px",
              }}
            >
              {product.price} ₾
            </div>

            <button
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                color: "white",
                border: "none",
                padding: "14px 28px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "bold",
                width: "100%",
                boxShadow: "0 4px 15px rgba(168, 85, 247, 0.4)",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
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
