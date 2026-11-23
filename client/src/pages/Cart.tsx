import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { cartTotals, formatGel, getSalePrice } from "../utils/pricing";
import SeoHead from "../components/SeoHead";
import { productImageAlt } from "../utils/imageAlt";
import { cartLineKey } from "../utils/productColors";

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const money = cartTotals(cart);

  if (cart.length === 0) {
    return (
      <div className="pd-status">
        <SeoHead
          title="კალათა"
          description="შენი RetroBit კალათა."
          path="/cart"
          noindex
        />
        <h1>შენი კალათა ცარიელია</h1>
        <button type="button" className="pd-add-cart" onClick={() => navigate("/")}>
          პროდუქტების დათვალიერება
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <SeoHead
        title="კალათა"
        description="შენი RetroBit კალათა."
        path="/cart"
        noindex
      />
      <h1>სავაჭრო კალათა</h1>
      <ul className="cart-page-list">
        {cart.map((item) => {
          const sale = getSalePrice(item);
          return (
            <li key={cartLineKey(item)} className="cart-page-item">
              <img src={item.imageUrl || ""} alt={productImageAlt(item)} />
              <div>
                <h3>{item.title}</h3>
                {item.selectedColor && (
                  <p className="cart-color">{item.selectedColor}</p>
                )}
                <p>
                  {formatGel(sale.final)} × {item.quantity}
                </p>
                <div className="pd-stepper compact">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(cartLineKey(item), item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(cartLineKey(item), item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <strong>{formatGel(sale.final * item.quantity)}</strong>
              <button
                type="button"
                className="cart-remove"
                onClick={() => removeFromCart(cartLineKey(item))}
              >
                წაშლა
              </button>
            </li>
          );
        })}
      </ul>
      <div className="cart-page-foot">
        <h2>
          სულ: <span>{formatGel(money.total)}</span>
        </h2>
        {money.extraOff > 0 ? (
          <p className="pd-together-off">
            ნაკრები −{money.extraPct}% ({formatGel(money.subtotal)} → {formatGel(money.total)})
          </p>
        ) : null}
        <p className="cart-ship-note">მიწოდების პირობები მალე დაემატება.</p>
        <div className="pd-cta">
          <button type="button" className="pd-ghost" onClick={clearCart}>
            კალათის გასუფთავება
          </button>
          <button type="button" className="pd-buy-now" onClick={() => navigate("/checkout")}>
            შეკვეთის გაფორმება
          </button>
        </div>
      </div>
    </div>
  );
}
