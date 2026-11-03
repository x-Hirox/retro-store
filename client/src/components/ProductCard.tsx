import { useNavigate } from "react-router-dom";
import type { IProduct } from "../types";
import { getSalePrice } from "../utils/pricing";

export default function ProductCard({ product }: { product: IProduct }) {
  const navigate = useNavigate();
  const { original, final, discount } = getSalePrice(product);

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
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
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.borderColor = "var(--neon-pink)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      {discount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            backgroundColor: "#2563eb",
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: "bold",
            padding: "3px 8px",
            borderRadius: "10px",
            zIndex: 2,
          }}
        >
          -{discount}%
        </span>
      )}

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
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "3rem" }}>🕹️</span>
        )}
      </div>

      <h3
        style={{
          margin: "14px 0 8px",
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
          gap: "10px",
          marginTop: "auto",
        }}
      >
        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: 800,
            color: "#2563eb",
          }}
        >
          {final} ₾
        </span>
        {discount > 0 && (
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--text)",
              textDecoration: "line-through",
            }}
          >
            {original} ₾
          </span>
        )}
      </div>
    </div>
  );
}
