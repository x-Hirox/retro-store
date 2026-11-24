import { Link } from "react-router-dom";
import type { IProduct } from "../types";
import { productPath } from "../seo/productUrl";
import { formatGel, getSalePrice, saleRange } from "../utils/pricing";
import HoloCard from "./HoloCard";
import { productImageAlt } from "../utils/imageAlt";
import { colorStock, totalStock } from "../utils/productColors";
import { useCart } from "../context/CartContext";

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-1.5 9h-12z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M6 6 5 3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="20" r="1.4" fill="currentColor" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function ProductCard({ product }: { product: IProduct }) {
  const { cart, addToCart } = useCart();
  const { original, final, discount } = getSalePrice(product);
  const range = saleRange(product);
  const left = totalStock(product);
  const sold = left <= 0;
  const low = !sold && left <= 3;
  const fromPrice = range.min !== range.max;
  const added = cart.some((row) => row._id === product._id);

  const body = (
    <>
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
    </>
  );

  return (
    <HoloCard className={`product-card glass-card${sold ? " is-sold" : ""}`}>
      {sold ? (
        body
      ) : (
        <Link to={productPath(product)} className="card-main" draggable={false}>
          {body}
        </Link>
      )}
      {!sold && (
        <button
          type="button"
          className="card-add"
          disabled={added}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({ ...product, stock: left });
          }}
        >
          <CartIcon />
          {added ? "კალათაშია" : "დამატება"}
        </button>
      )}
    </HoloCard>
  );
}
