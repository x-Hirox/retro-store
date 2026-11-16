import { useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";
import type { IProduct } from "../types";
import { getSalePrice } from "../utils/pricing";

export default function ProductCard({ product }: { product: IProduct }) {
  const navigate = useNavigate();
  const { original, final, discount } = getSalePrice(product);
  const sold = (product.stock ?? 0) <= 0;
  const low = !sold && product.stock <= 3;

  const tilt = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translate3d(0,-8px,0) rotateX(${-y * 7}deg) rotateY(${x * 9}deg)`;
  };

  return (
    <div
      className={`product-card${sold ? " is-sold" : ""}`}
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseMove={tilt}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
      }}
    >
      {sold && <span className="sold-badge">SOLD</span>}
      {low && <span className="left-badge">დარჩა {product.stock}</span>}
      {discount > 0 && !sold && (
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
