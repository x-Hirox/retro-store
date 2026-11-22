import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatGel, getSalePrice } from "../utils/pricing";
import SeoHead from "../components/SeoHead";
import { productImageAlt } from "../utils/imageAlt";

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const totalAmount = cart.reduce(
    (sum, item) => sum + getSalePrice(item).final * item.quantity,
    0,
  );

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
            <li key={item._id} className="cart-page-item">
              <img src={item.imageUrl || ""} alt={productImageAlt(item)} />
              <div>
                <h3>{item.title}</h3>
                <p>
                  {formatGel(sale.final)} × {item.quantity}
                </p>
                <div className="pd-stepper compact">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <strong>{formatGel(sale.final * item.quantity)}</strong>
              <button type="button" className="cart-remove" onClick={() => removeFromCart(item._id)}>
                წაშლა
              </button>
            </li>
          );
        })}
      </ul>
      <div className="cart-page-foot">
        <h2>
          სულ: <span>{formatGel(totalAmount)}</span>
        </h2>
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
