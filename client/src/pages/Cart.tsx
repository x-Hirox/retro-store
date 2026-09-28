import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h2 style={styles.emptyTitle}>თქვენი კალათა ცარიელია 🛒</h2>
        <button style={styles.primaryBtn} onClick={() => navigate("/")}>
          პროდუქტების დათვალიერება
        </button>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.cartContainer}>
        <h1 style={styles.heading}>სავაჭრო კალათა 🛍️</h1>

        <div style={styles.itemList}>
          {cart.map((item) => (
            <div key={item._id} style={styles.itemRow}>
              <div>
                <h3 style={styles.itemTitle}>{item.title}</h3>
                <p style={styles.itemPrice}>
                  ${item.price} x {item.quantity}
                </p>
              </div>

              <button
                style={styles.deleteBtn}
                onClick={() => removeFromCart(item._id)}
              >
                წაშლა 🗑️
              </button>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <div>
            <h2 style={styles.totalText}>
              სულ ჯამი:{" "}
              <span style={styles.highlightPrice}>
                ${totalAmount.toFixed(2)}
              </span>
            </h2>
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.clearBtn} onClick={clearCart}>
              კალათის გასუფთავება
            </button>

            <button
              style={styles.checkoutBtn}
              onClick={() => navigate("/checkout")}
            >
              შეკვეთის გაფორმება 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "calc(100vh - 130px)",
    backgroundColor: "var(--bg)",
    padding: "40px 20px",
    color: "var(--text)",
    boxSizing: "border-box" as const,
    width: "100%",
    transition: "background-color 0.2s ease, color 0.2s ease",
  },
  cartContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "var(--bg)",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "var(--shadow)",
    border: "1px solid var(--border)",
  },
  heading: {
    color: "var(--text-h)",
    marginBottom: "30px",
    fontSize: "1.8rem",
  },
  itemList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 0",
    borderBottom: "1px solid var(--border)",
  },
  itemTitle: {
    color: "var(--text-h)",
    margin: "0 0 5px 0",
    fontSize: "1.1rem",
  },
  itemPrice: {
    color: "var(--accent)",
    fontWeight: "bold",
    margin: 0,
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  footer: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "20px",
  },
  totalText: {
    color: "var(--text-h)",
    margin: 0,
    fontSize: "1.4rem",
  },
  highlightPrice: {
    color: "var(--accent)",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
  },
  clearBtn: {
    backgroundColor: "#475569",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  checkoutBtn: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  emptyContainer: {
    textAlign: "center" as const,
    marginTop: "100px",
    padding: "20px",
    color: "var(--text)",
    minHeight: "calc(100vh - 130px)",
    backgroundColor: "var(--bg)",
  },
  emptyTitle: {
    marginBottom: "20px",
    color: "var(--text-h)",
  },
  primaryBtn: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
  },
};
