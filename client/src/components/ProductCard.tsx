import { Link } from "react-router-dom";
import type { IProduct } from "../types";
import { formatGel, getSalePrice, saleRange } from "../utils/pricing";
import HoloCard from "./HoloCard";
import { productImageAlt } from "../utils/imageAlt";
import { colorStock, totalStock } from "../utils/productColors";

export default function ProductCard({ product }: { product: IProduct }) {
  const { original, final, discount } = getSalePrice(product);
  const range = saleRange(product);
  const left = totalStock(product);
  const sold = left <= 0;
  const low = !sold && left <= 3;
  const fromPrice = range.min !== range.max;

  const card = (
    <HoloCard
      className={`product-card glass-card${sold ? " is-sold" : ""}`}
      disabled={sold}
    >
      {sold && <span className="sold-badge">SOLD</span>}
      {low && <span className="left-badge">დარჩა {left}</span>}
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
            draggable={false}
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
              title={`${item.name} — ${colorStock(item)} ცალი`}
            />
          ))}
        </div>
      )}

      <div className="card-price">
        <span className="card-price-now">
          {fromPrice ? `${formatGel(range.min)}-დან` : formatGel(final)}
        </span>
        {discount > 0 && !fromPrice && (
          <span className="card-price-was">{formatGel(original)}</span>
        )}
      </div>
    </HoloCard>
  );

  if (sold) return card;

  return (
    <Link to={`/product/${product._id}`} className="product-card-link" draggable={false}>
      {card}
    </Link>
  );
}
