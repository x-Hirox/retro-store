import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useCart } from "./context/CartContext";
import { useEffect, useState } from "react";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import CategoryView from "./pages/CategoryView";
import Header from "./components/Header";
import OrderSuccess from "./pages/OrderSuccess";
import { VerifyEmail } from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import CartDrawer from "./components/CartDrawer";
import RetroFX from "./components/RetroFX";
import RetroAnimeBackdrop from "./components/RetroAnimeBackdrop";
import SiteFooter from "./components/SiteFooter";
import Arcade from "./pages/Arcade";
import Sell from "./pages/Sell";
import Gifts from "./pages/Gifts";

const categoriesData = [
  { name: "All", sub: [] },
  {
    name: "Nintendo",
    sub: [
      "Nintendo DS Lite",
      "Nintendo DSi",
      "Nintendo 3DS",
      "Nintendo DS",
      "Game Boy Advance",
      "Nintendo Switch",
      "Nintendo NES - 1985",
      "Super Nintendo - 1991",
      "Nintendo 64 - 1996",
    ],
  },
  {
    name: "PlayStation",
    sub: [
      "PlayStation 1",
      "PlayStation 2",
      "PlayStation 3",
      "PlayStation 4",
      "PlayStation 5",
      "PlayStation Portable",
      "PlayStation Vita",
    ],
  },
  { name: "Xbox", sub: ["Original Xbox", "Xbox 360", "Xbox One"] },
  {
    name: "Sega",
    sub: ["Master System", "Sega Genesis", "Sega Saturn", "Sega Dreamcast"],
  },
  {
    name: "Chinese Consoles",
    sub: ["Anbernic", "Miyoo Mini", "PowKiddy", "Retroid Pocket"],
  },
  {
    name: "Bundles",
    sub: ["Console + Games Bundle", "Starter Pack", "Collector's Bundle"],
  },
  {
    name: "Atari & More",
    sub: ["Atari 2600", "ColecoVision", "TurboGrafx-16"],
  },
];

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

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    alert("თქვენ წარმატებით გამოხვედით სისტემიდან.");
    window.location.href = "/";
  };

  return (
    <Router>
      <div
        className="site-shell"
        style={{
          minHeight: "100vh",
          color: "var(--text)",
          width: "100%",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        <RetroAnimeBackdrop />
        <style>
          {`
            .dropdown-parent:hover .dropdown-content {
              display: block !important;
            }
            .neon-btn {
              transition: all 0.3s ease;
            }
            .neon-btn:hover {
              box-shadow: 0 0 12px #00f3ff88;
              transform: translateY(-1px);
            }
            @media (max-width: 768px) {
              .main-nav-bar {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
              }
            }
          `}
        </style>

        <Header
          categoriesData={categoriesData}
          totalItems={totalItems}
          token={token}
          onLogout={handleLogout}
        />

        <div style={{ width: "100%", boxSizing: "border-box" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Arcade />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            <Route path="/category/:platform/:sub?" element={<CategoryView />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
          </Routes>
        </div>
        <SiteFooter />
        <CartDrawer />
        <RetroFX />
      </div>
    </Router>
  );
}
