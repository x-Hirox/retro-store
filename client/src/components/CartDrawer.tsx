import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/productService";
import type { IProduct } from "../types";
import { cartTotals, formatGel, getSalePrice } from "../utils/pricing";
import { suggestAddons } from "../utils/shopAddons";
import { cartLineKey } from "../utils/productColors";

export default function CartDrawer() {
  const {
    cart,
    drawerOpen,
    closeCartDrawer,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const navigate = useNavigate();
  const [addons, setAddons] = useState<IProduct[]>([]);

  useEffect(() => {
    if (!drawerOpen) return;
    getProducts()
      .then((list) => {
        const main = cart[0] || null;
        setAddons(suggestAddons(main, list, 8));
      })
      .catch(() => setAddons([]));
  }, [drawerOpen, cart]);

  const money = cartTotals(cart);

  if (!drawerOpen) return null;

  return (
    <div className="cart-drawer-root">
      <button
        type="button"
        className="cart-drawer-dim"
        aria-label="დახურვა"
        onClick={closeCartDrawer}
      />
      <aside className="cart-drawer" role="dialog" aria-label="კალათა">
        <header className="cart-drawer-head">
          <h2>შენი კალათა</h2>
          <button type="button" onClick={closeCartDrawer} aria-label="დახურვა">
            ✕
          </button>
        </header>

        {cart.length === 0 ? (
          <p className="cart-drawer-empty">კალათა ცარიელია.</p>
        ) : (
          <ul className="cart-drawer-list">
            {cart.map((item) => {
              const sale = getSalePrice(item);
              return (
                <li key={cartLineKey(item)} className="cart-drawer-item">
                  <img src={item.imageUrl || ""} alt={item.title || "RetroBit"} />
                  <div>
                    <strong>{item.title}</strong>
                    {item.selectedColor && (
                      <span className="cart-color">{item.selectedColor}</span>
                    )}
                    <span>
                      {formatGel(sale.final)} × {item.quantity}
                    </span>
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
        )}

        {addons.length > 0 && (
          <section className="cart-upsell">
            <h3>დაამატე აქსესუარი ან თამაში</h3>
            <div className="cart-upsell-row">
              {addons.map((item) => {
                const sale = getSalePrice(item);
                const inCart = cart.some((c) => c._id === item._id);
                return (
                  <article key={item._id} className="cart-upsell-card">
                    <img src={item.imageUrl || ""} alt={item.title} />
                    <p>{item.title}</p>
                    <strong>{formatGel(sale.final)}</strong>
                    <button
                      type="button"
                      disabled={inCart}
                      onClick={() => addToCart(item)}
                    >
                      {inCart ? "კალათაშია" : "დამატება"}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <footer className="cart-drawer-foot">
          <div className="cart-drawer-total">
            <span>ჯამი</span>
            <strong>{formatGel(money.total)}</strong>
          </div>
          {money.extraOff > 0 ? (
            <p className="pd-together-off">
              ნაკრები −{money.extraPct}%
            </p>
          ) : null}
          <p className="cart-ship-note">მიწოდების პირობები მალე დაემატება.</p>
          <button
            type="button"
            className="cart-checkout-btn"
            disabled={cart.length === 0}
            onClick={() => {
              closeCartDrawer();
              navigate("/checkout");
            }}
          >
            შეკვეთის გაფორმება
          </button>
          <Link to="/cart" onClick={closeCartDrawer} className="cart-full-link">
            სრული კალათა
          </Link>
        </footer>
      </aside>
    </div>
  );
}
