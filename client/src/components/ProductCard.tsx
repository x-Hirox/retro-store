import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { IProduct } from "../types";
import { getSalePrice } from "../utils/pricing";

export default function ProductCard({ product }: { product: IProduct }) {
  const navigate = useNavigate();
  const { original, final, discount } = getSalePrice(product);
  const sold = (product.stock ?? 0) <= 0;
  const low = !sold && product.stock <= 3;

  return (
    <motion.div
      className={`product-card glass-card${sold ? " is-sold" : ""}`}
      onClick={() => navigate(`/product/${product._id}`)}
      whileHover={sold ? undefined : { y: -10, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.55 }}
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
    </motion.div>
  );
}
