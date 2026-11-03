import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { IProduct } from "../types";
import { getRecentlyViewed } from "../utils/recentlyViewed";
import ProductCard from "./ProductCard";

export default function RecentlyViewed() {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState<IProduct[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, [location.pathname]);

  if (!items.length) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            color: "var(--text-h)",
            fontSize: "1.6rem",
            textTransform: "none",
            margin: 0,
          }}
        >
          ბოლოს ნანახი
        </h2>
        <button
          onClick={() => navigate("/category/playstation")}
          style={{
            background: "none",
            border: "none",
            color: "var(--text)",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          მეტის ნახვა
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {items.slice(0, 5).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
