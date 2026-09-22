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
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
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
        {/* ნავიგაციის ჰედერი */}
        <nav
          className="nav-container"
          style={{
            display: "flex",
            flexDirection: "row", // კომპიუტერზე იქნება მკაცრად ერთ ხაზზე
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 40px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#2c3e50",
              textDecoration: "none",
            }}
          >
            🕹️ RetroStore
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
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
                fontSize: "0.95rem",
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
                  fontSize: "0.95rem",
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
                    fontSize: "0.95rem",
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
                    fontSize: "0.95rem",
                  }}
                >
                  რეგისტრაცია
                </Link>
              </>
            )}
          </div>
        </nav>

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
