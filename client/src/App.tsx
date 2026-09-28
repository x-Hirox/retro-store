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
import CategoryView from "./pages/CategoryView";
import Header from "./components/Header";

const categoriesData = [
  { name: "All", sub: [] },
  {
    name: "Nintendo",
    sub: [
      "Nintendo NES - 1985",
      "Super Nintendo - 1991",
      "Nintendo 64 - 1996",
      "Nintendo Switch",
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

  // 🟢 აპლიკაციის ჩატვირთვისას ვამოწმებთ შენახულ თემას
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light"); // დეფაულტად ყოველთვის თეთრი
    }
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
          backgroundColor: "var(--bg)",
          color: "var(--text)",
          width: "100%",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        <style>
          {`
            .dropdown-parent:hover .dropdown-content {
              display: block !important;
            }
            .neon-btn {
              transition: all 0.3s ease;
            }
            .neon-btn:hover {
              box-shadow: 0 0 12px rgba(168, 85, 247, 0.9);
              transform: translateY(-2px);
            }
            @media (max-width: 768px) {
              .nav-container {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 10px 15px !important;
                gap: 12px;
              }
              .search-box-wrapper {
                max-width: 100% !important;
                margin: 0 !important;
                order: 3;
              }
              .nav-links-wrapper {
                justify-content: flex-end;
                width: 100%;
              }
              .main-nav-bar {
                overflow-x: auto;
                padding: 0 15px !important;
                gap: 20px !important;
                white-space: nowrap;
              }
            }
          `}
        </style>

        {/* გამოყოფილი ჰედერის კომპონენტი */}
        <Header
          categoriesData={categoriesData}
          totalItems={totalItems}
          token={token}
          onLogout={handleLogout}
        />

        {/* როუტები / გვერდები */}
        <div style={{ width: "100%", boxSizing: "border-box" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/category/:platform" element={<CategoryView />} />
            <Route path="/category/:platform/:sub" element={<CategoryView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
