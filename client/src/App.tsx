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
import Admin from "./pages/Admin";
import CategoryView from "./pages/CategoryView"; // ახალი იმპორტი კატეგორიების სანახავად

// კატეგორიები და მათი ქვე-კატეგორიები ჩამოსაშლელი მენიუსთვის
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
  const [searchQuery, setSearchQuery] = useState("");

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
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* ინლაინ სტილები ჩამოსაშლელი მენიუს ჰოვერისთვის მობილურზე/დესკტოპზე */}
        <style>
          {`
            .dropdown-parent:hover .dropdown-content {
              display: block !important;
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

        {/* პროფესიონალური ჰედერი - სრულ სიგანეზე */}
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
              padding: "8px 20px",
              textAlign: "center",
              fontWeight: "500",
              width: "100%",
              boxSizing: "border-box",
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
            <div
              className="search-box-wrapper"
              style={{
                flex: 1,
                maxWidth: "550px",
                margin: "0 30px",
                boxSizing: "border-box",
              }}
            >
              <input
                type="text"
                placeholder="მოძებნე თამაშები და კონსოლები..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 18px",
                  borderRadius: "20px",
                  border: "1px solid #ddd",
                  outline: "none",
                  fontSize: "0.95rem",
                  backgroundColor: "#f9f9f9",
                  color: "#000",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* ღილაკები */}
            <div
              className="nav-links-wrapper"
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

          {/* ქვედა კატეგორიების ჰორიზონტალური მენიუ (ჩამოსაშლელი ლოგიკით) */}
          <nav
            className="main-nav-bar"
            style={{
              backgroundColor: "#111",
              padding: "0 40px",
              display: "flex",
              gap: "30px",
              width: "100%",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            {categoriesData.map((cat, index) => (
              <div
                key={index}
                className="dropdown-parent"
                style={{ position: "relative", padding: "12px 0" }}
              >
                <Link
                  to={`/?category=${cat.name === "All" ? "" : cat.name}`}
                  style={{
                    color: "#fff",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontWeight: "500",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  {cat.name} {cat.sub.length > 0 && "▾"}
                </Link>

                {/* თუ ქვე-კატეგორიები არსებობს, ვუზრუნველყოფთ ჩამოშლას */}
                {cat.sub.length > 0 && (
                  <div
                    className="dropdown-content"
                    style={{
                      display: "none",
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      backgroundColor: "#111",
                      minWidth: "220px",
                      boxShadow: "0px 8px 16px rgba(0,0,0,0.4)",
                      zIndex: 100,
                      borderRadius: "4px",
                      overflow: "hidden",
                      border: "1px solid #333",
                    }}
                  >
                    {cat.sub.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={`/?category=${subItem}`}
                        style={{
                          color: "#fff",
                          padding: "10px 15px",
                          textDecoration: "none",
                          display: "block",
                          fontSize: "0.9rem",
                          borderBottom: "1px solid #222",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </header>

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
