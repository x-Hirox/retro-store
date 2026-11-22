import { useNavigate } from "react-router-dom";
import type { IProduct } from "../types";
import { formatGel, getSalePrice } from "../utils/pricing";
import HoloCard from "./HoloCard";
import { productImageAlt } from "../utils/imageAlt";

export default function ProductCard({ product }: { product: IProduct }) {
  const navigate = useNavigate();
  const { original, final, discount } = getSalePrice(product);
  const sold = (product.stock ?? 0) <= 0;
  const low = !sold && product.stock <= 3;

  return (
    <HoloCard
      className={`product-card glass-card${sold ? " is-sold" : ""}`}
      disabled={sold}
      onClick={() => {
        if (!sold) navigate(`/product/${product._id}`);
      }}
    >
      {sold && <span className="sold-badge">SOLD</span>}
      {low && <span className="left-badge">დარჩა {product.stock}</span>}
      {discount > 0 && !sold && (
        <span className="card-sale">-{discount}%</span>
      )}

      <div className="card-photo">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={productImageAlt(product)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span style={{ fontSize: "3rem" }}>🕹️</span>
        )}
      </div>

      <h3>{product.title}</h3>
      {!!product.colors?.length && (
        <div className="card-colors" aria-label="ფერები">
          {product.colors.slice(0, 5).map((item) => (
            <i
              key={item.name}
              style={{ background: item.hex }}
              title={item.name}
            />
          ))}
        </div>
      )}

      <div className="card-price">
        <span className="card-price-now">{formatGel(final)}</span>
        {discount > 0 && (
          <span className="card-price-was">{formatGel(original)}</span>
        )}
      </div>
    </HoloCard>
  );
}
