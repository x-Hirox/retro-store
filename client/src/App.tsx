import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useCart } from "./context/CartContext";
import { useEffect, useState } from "react";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  const { cart } = useCart();
  const totalItems = cart.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0,
  );
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    alert("თქვენ წარმატებით გამოხვედით სისტემიდან.");
    window.location.href = "/";
  };

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          width: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* პროფესიონალური ჰედერი */}
        <header
          style={{
            width: "100%",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          {/* ზედა თხელი საინფორმაციო ზოლი */}
          <div
            style={{
              backgroundColor: "#ff6600",
              color: "#fff",
              fontSize: "0.85rem",
              padding: "6px 20px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            🔥 უფასო მიწოდება და 1 წლიანი გარანტია ყველა რეტრო კონსოლზე!
          </div>

          {/* მთავარი ნავბარი */}
          <div
            className="nav-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "15px 40px",
              boxSizing: "border-box",
              textAlign: "left",
            }}
          >
            {/* ლოგო */}
            <Link
              to="/"
              style={{
                fontSize: "1.6rem",
                fontWeight: "bold",
                color: "#2c3e50",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🕹️ RetroStore
            </Link>

            {/* ძებნის ველი */}
            <div style={{ flex: 1, maxWidth: "450px", margin: "0 20px" }}>
              <input
                type="text"
                placeholder="მოძებნე თამაშები და კონსოლები..."
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: "20px",
                  border: "1px solid #ddd",
                  outline: "none",
                  fontSize: "0.95rem",
                  backgroundColor: "#f9f9f9",
                }}
              />
            </div>

            {/* ღილაკები */}
            <div
              className="nav-links"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Link
                to="/cart"
                style={{
                  backgroundColor: "#3498db",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                კალათა 🛒 ({totalItems})
              </Link>

              {token ? (
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  გასვლა
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    style={{
                      color: "#2c3e50",
                      textDecoration: "none",
                      fontWeight: "600",
                      padding: "8px 12px",
                      fontSize: "0.9rem",
                    }}
                  >
                    შესვლა
                  </Link>
                  <Link
                    to="/register"
                    style={{
                      backgroundColor: "#2ecc71",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    რეგისტრაცია
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ქვედა კატეგორიების ჰორიზონტალური მენიუ */}
          <nav
            style={{
              backgroundColor: "#111",
              padding: "10px 40px",
              display: "flex",
              gap: "25px",
              overflowX: "auto",
            }}
          >
            {[
              "Nintendo",
              "PlayStation",
              "Xbox",
              "Sega",
              "Atari & More",
              "Bundles",
              "Sell Your Games",
            ].map((cat, index) => (
              <span
                key={index}
                style={{
                  color: "#fff",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontWeight: "500",
                }}
              >
                {cat}
              </span>
            ))}
          </nav>
        </header>

        {/* როუტები */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}
