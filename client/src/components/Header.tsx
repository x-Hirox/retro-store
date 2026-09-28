import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  categoriesData: Array<{
    name: string;
    sub: string[];
  }>;
  totalItems: number;
  token: string | null;
  onLogout: () => void;
}

export default function Header({
  categoriesData,
  totalItems,
  token,
  onLogout,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // თემის მართვის ლოგიკა: დეფაულტად არის თეთრი, თუ ხელით არ ჩართავ შავს
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    } else {
      window.location.href = "/";
    }
  };

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        transition: "background-color 0.2s ease, color 0.2s ease",
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
            color: "var(--text-h)",
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
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: "flex", position: "relative", width: "100%" }}
          >
            <input
              type="text"
              placeholder="მოძებნე თამაშები და კონსოლები..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 45px 10px 18px",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                outline: "none",
                fontSize: "0.95rem",
                backgroundColor: "var(--code-bg)",
                color: "var(--text)",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              style={{
                position: "absolute",
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
                padding: "5px 10px",
              }}
            >
              🔍
            </button>
          </form>
        </div>

        {/* მარჯვენა იკონები და თემის გადამრთველი ღილაკი */}
        <div
          className="nav-links-wrapper"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {/* თემის გადართვის ღილაკი */}
          <button
            onClick={toggleTheme}
            className="neon-btn"
            style={{
              backgroundColor: "var(--code-bg)",
              color: "var(--text-h)",
              border: "1px solid var(--border)",
              padding: "8px 14px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            {isDark ? "☀️ ღია რეჟიმი" : "🌙 მუქი რეჟიმი"}
          </button>

          {/* კალათა */}
          <Link
            to="/cart"
            className="neon-btn"
            title="კალათა"
            style={{
              backgroundColor: "var(--code-bg)",
              color: "#c084fc",
              border: "1px solid #a855f7",
              padding: "8px 12px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            🛒{" "}
            <span
              style={{
                fontSize: "0.85rem",
                background: "#a855f7",
                color: "#fff",
                padding: "1px 6px",
                borderRadius: "6px",
              }}
            >
              {totalItems}
            </span>
          </Link>

          {token ? (
            <button
              onClick={onLogout}
              className="neon-btn"
              title="გასვლა"
              style={{
                backgroundColor: "var(--code-bg)",
                color: "#ff6b6b",
                border: "1px solid #ff4757",
                padding: "8px 12px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              🚪
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="neon-btn"
                title="შესვლა"
                style={{
                  backgroundColor: "var(--code-bg)",
                  color: "#c084fc",
                  border: "1px solid #a855f7",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "1rem",
                }}
              >
                🔑
              </Link>
              <Link
                to="/register"
                className="neon-btn"
                title="რეგისტრაცია"
                style={{
                  backgroundColor: "#a855f7",
                  color: "#ffffff",
                  border: "1px solid #c084fc",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "1rem",
                }}
              >
                ⚡
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ქვედა კატეგორიების ჰორიზონტალური მენიუ */}
      <nav
        className="main-nav-bar"
        style={{
          backgroundColor: "var(--bg)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
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
              to={
                cat.name === "All"
                  ? "/"
                  : `/category/${encodeURIComponent(cat.name)}`
              }
              style={{
                color: "var(--text)",
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

            {cat.sub.length > 0 && (
              <div
                className="dropdown-content"
                style={{
                  display: "none",
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "var(--bg)",
                  minWidth: "220px",
                  boxShadow: "var(--shadow)",
                  zIndex: 100,
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                {cat.sub.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={`/category/${encodeURIComponent(cat.name)}/${encodeURIComponent(subItem)}`}
                    style={{
                      color: "var(--text)",
                      padding: "10px 15px",
                      textDecoration: "none",
                      display: "block",
                      fontSize: "0.9rem",
                      borderBottom: "1px solid var(--border)",
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
  );
}
