import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // ჯამური თანხის გამოთვლა
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", padding: "20px" }}>
        <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>
          თქვენი კალათა ცარიელია 🛒
        </h2>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          პროდუქტების დათვალიერება
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ color: "#2c3e50", marginBottom: "30px" }}>
          სავაჭრო კალათა 🛍️
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <div>
                <h3 style={{ color: "#2c3e50", margin: "0 0 5px 0" }}>
                  {item.title}
                </h3>
                <p style={{ color: "#e74c3c", fontWeight: "bold", margin: 0 }}>
                  ${item.price} x {item.quantity}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                წაშლა 🗑️
              </button>
            </div>
          ))}
        </div>

        {/* ქვედა ნაწილი: ჯამი და ღილაკები */}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ color: "#2c3e50", margin: 0 }}>
              სულ ჯამი:{" "}
              <span style={{ color: "#e74c3c" }}>
                ${totalAmount.toFixed(2)}
              </span>
            </h2>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={clearCart}
              style={{
                backgroundColor: "#95a5a6",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              კალათის გასუფთავება
            </button>

            <button
              onClick={() => navigate("/checkout")}
              style={{
                backgroundColor: "#2ecc71",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              შეკვეთის გაფორმება 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
