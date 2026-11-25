import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLang } from "../i18n/LanguageContext";
import { useAuthModal } from "../context/AuthModalContext";
import { getPlatformCards } from "../services/contentService";
import { getProducts } from "../services/productService";
import { groupPlatformNav } from "../utils/platformCatalog";

interface HeaderProps {
  categoriesData: Array<{
    name: string;
    sub: string[];
  }>;
  totalItems: number;
  token: string | null;
  onLogout: () => void;
}

function GeorgiaFlag() {
  return (
    <svg viewBox="0 0 60 40" className="lang-flag-svg" aria-hidden>
      <rect width="60" height="40" fill="#fff" />
      <rect x="26" width="8" height="40" fill="#e8112d" />
      <rect y="16" width="60" height="8" fill="#e8112d" />
      {[
        [11, 7],
        [49, 7],
        [11, 33],
        [49, 33],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <rect x="-1.2" y="-5" width="2.4" height="10" fill="#e8112d" />
          <rect x="-5" y="-1.2" width="10" height="2.4" fill="#e8112d" />
        </g>
      ))}
    </svg>
  );
}

function UsFlag() {
  return (
    <svg viewBox="0 0 60 40" className="lang-flag-svg" aria-hidden>
      <rect width="60" height="40" fill="#b22234" />
      {[6, 12, 18, 24, 30, 36].map((y) => (
        <rect key={y} y={y} width="60" height="3" fill="#fff" />
      ))}
      <rect width="24" height="22" fill="#3c3b6e" />
    </svg>
  );
}

function blurNavFocus() {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active.closest(".main-nav-bar")) {
    active.blur();
  }
}

function isCoarsePointer() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

export default function Header({
  categoriesData,
  totalItems,
  token,
  onLogout,
}: HeaderProps) {
  const { t, lang, setLang } = useLang();
  const { openCartDrawer } = useCart();
  const authModal = useAuthModal();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [openNav, setOpenNav] = useState<string | null>(null);
  const [navCats, setNavCats] = useState(() =>
    groupPlatformNav([], categoriesData),
  );

  useEffect(() => {
    getPlatformCards()
      .then((cards) => setNavCats(groupPlatformNav(cards, categoriesData)))
      .catch(() => setNavCats(groupPlatformNav([], categoriesData)));
    getProducts().catch(() => undefined);
  }, [categoriesData]);

  useEffect(() => {
    setOpenNav(null);
    blurNavFocus();
  }, [location.pathname]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest(".dropdown-parent")) return;
      setOpenNav(null);
      blurNavFocus();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenNav(null);
      blurNavFocus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
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
        <span className="top-banner-text">{t("topBanner")}</span>
      </div>

      <div className="nav-container">
        <Link to="/" className="site-logo" aria-label="RetroBit">
          <img src="/retrobit.png" alt="RetroBit" />
        </Link>

        <div className="search-box-wrapper">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              id="site-search"
              name="q"
              type="search"
              autoComplete="off"
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
            <button
              type="button"
              className="neon-btn icon-btn auth-login"
              title={t("login")}
              onClick={() => authModal.show("login")}
            >
              🔑
              <span className="btn-label">{t("login")}</span>
            </button>
          )}

          <div className="lang-switch" role="group" aria-label="Language">
            <span className="lang-flag" aria-hidden>
              {lang === "ka" ? <GeorgiaFlag /> : <UsFlag />}
            </span>
            <div className="lang-codes">
              <button
                type="button"
                className={lang === "ka" ? "on" : ""}
                onClick={() => setLang("ka")}
              >
                GEO
              </button>
              <button
                type="button"
                className={lang === "en" ? "on" : ""}
                onClick={() => setLang("en")}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="main-nav-bar">
        {navCats.map((cat, index) => {
          const isOpen = openNav === cat.name;
          return (
          <div
            key={index}
            className={`dropdown-parent${isOpen ? " is-open" : ""}`}
            onMouseLeave={() => {
              if (isCoarsePointer()) return;
              setOpenNav((current) => (current === cat.name ? null : current));
              blurNavFocus();
            }}
          >
            <Link
              to={
                cat.name === "All"
                  ? "/"
                  : `/category/${encodeURIComponent(cat.name)}`
              }
              aria-expanded={cat.sub.length > 0 ? isOpen : undefined}
              aria-haspopup={cat.sub.length > 0 ? "menu" : undefined}
              onClick={(event) => {
                if (!cat.sub.length) {
                  setOpenNav(null);
                  return;
                }
                if (isCoarsePointer()) {
                  if (!isOpen) {
                    event.preventDefault();
                    setOpenNav(cat.name);
                    return;
                  }
                  setOpenNav(null);
                  return;
                }
                if (isOpen) {
                  event.preventDefault();
                  setOpenNav(null);
                  blurNavFocus();
                  return;
                }
                setOpenNav(null);
                requestAnimationFrame(blurNavFocus);
              }}
              onFocus={(event) => {
                if (
                  cat.sub.length &&
                  event.currentTarget.matches(":focus-visible")
                ) {
                  setOpenNav(cat.name);
                }
              }}
            >
              {cat.name} {cat.sub.length > 0 && "▾"}
            </Link>
            {cat.sub.length > 0 && (
              <div className="dropdown-content">
                {cat.sub.map((subItem) => (
                  <Link
                    key={subItem.slug}
                    to={`/category/${encodeURIComponent(cat.name)}/${encodeURIComponent(subItem.slug)}`}
                    onClick={() => {
                      setOpenNav(null);
                      requestAnimationFrame(blurNavFocus);
                    }}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          );
        })}
        <Link to="/category/games">{t("catGames")}</Link>
        <Link to="/category/accessories">{t("catAcc")}</Link>
        <Link to="/gifts" className="gifts-nav-link">
          {t("gifts")}
        </Link>
        <Link to="/sell" className="sell-nav-link">
          {t("sellNav")}
        </Link>
      </nav>
    </header>
  );
}
