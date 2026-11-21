import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SoundToggle from "./SoundToggle";
import { HolidayLights } from "./NostalgiaBits";
import { useCart } from "../context/CartContext";
import { useLang } from "../i18n/LanguageContext";

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
  const { t, lang, setLang } = useLang();
  const { openCartDrawer } = useCart();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    } else {
      window.location.href = "/";
    }
  };

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <header className="site-header">
      <div className="top-banner">
        <span className="top-banner-text arcade-flicker">{t("topBanner")}</span>
        <button
          type="button"
          className="lang-toggle"
          onClick={() => setLang(lang === "ka" ? "en" : "ka")}
          aria-label="Language"
        >
          <span className={lang === "ka" ? "on" : ""}>🇬🇪 ქართ</span>
          <span className="sep">|</span>
          <span className={lang === "en" ? "on" : ""}>🇬🇧 Eng</span>
        </button>
      </div>
      <HolidayLights />

      <div className="nav-container">
        <Link to="/" className="site-logo" aria-label="RetroBit">
          <img src="/retrobit.png" alt="RetroBit" />
        </Link>

        <div className="search-box-wrapper">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label={t("search")}>
              🔍
            </button>
          </form>
        </div>

        <div className="nav-links-wrapper">
          <SoundToggle />

          <Link to="/play" className="neon-btn play-link">
            <span aria-hidden>🎮</span>
            <span className="btn-label">{t("games")}</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="neon-btn icon-btn"
            title={isDark ? t("lightMode") : t("darkMode")}
          >
            {isDark ? "☀️" : "🌙"}
            <span className="btn-label">
              {isDark ? t("lightMode") : t("darkMode")}
            </span>
          </button>

          <button
            type="button"
            className="neon-btn icon-btn"
            title={t("cart")}
            onClick={openCartDrawer}
          >
            🛒
            <span key={totalItems} className="cart-count">
              {totalItems}
            </span>
          </button>

          {token ? (
            <>
              <Link to="/profile" className="neon-btn icon-btn" title={t("profile")}>
                👤
                <span className="btn-label">{t("profile")}</span>
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="neon-btn icon-btn auth-logout"
                title={t("logout")}
              >
                🚪
                <span className="btn-label">{t("logout")}</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="neon-btn icon-btn auth-login"
                title={t("login")}
              >
                🔑
                <span className="btn-label">{t("login")}</span>
              </Link>
              <Link
                to="/register"
                className="neon-btn icon-btn auth-register"
                title={t("register")}
              >
                <span className="btn-label">{t("register")}</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="main-nav-bar">
        {categoriesData.map((cat, index) => (
          <div key={index} className="dropdown-parent">
            <Link
              to={
                cat.name === "All"
                  ? "/"
                  : `/category/${encodeURIComponent(cat.name)}`
              }
            >
              {cat.name} {cat.sub.length > 0 && "▾"}
            </Link>
            {cat.sub.length > 0 && (
              <div className="dropdown-content">
                {cat.name === "Atari & More" && (
                  <Link to="/play">{t("games")}</Link>
                )}
                {cat.sub.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={`/category/${encodeURIComponent(cat.name)}/${encodeURIComponent(subItem)}`}
                  >
                    {subItem}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <Link to="/sell" className="sell-nav-link">
          {t("sellNav")}
        </Link>
      </nav>
    </header>
  );
}
