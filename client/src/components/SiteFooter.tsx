import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getSiteSettings } from "../services/contentService";
import type { ISiteSettings } from "../types";
import { useLang } from "../i18n/LanguageContext";
import { GiftStack } from "./NostalgiaBits";

export default function SiteFooter() {
  const location = useLocation();
  const { t } = useLang();
  const [settings, setSettings] = useState<ISiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="site-footer">
      <div className="ny-header-lights footer-lights" aria-hidden>
        {Array.from({ length: 18 }, (_, i) => (
          <i key={i} className={`ny-bulb c${i % 4}`} />
        ))}
      </div>
      <GiftStack />
      <div className="footer-grid">
        <div>
          <h4>{t("collections")}</h4>
          <FooterLink to="/category/Nintendo">Nintendo</FooterLink>
          <FooterLink to="/category/PlayStation">PlayStation</FooterLink>
          <FooterLink to="/category/Sega">Sega</FooterLink>
          <FooterLink to="/category/Xbox">Xbox</FooterLink>
          <FooterLink to="/category/Atari%20%26%20More">Atari & More</FooterLink>
        </div>
        <div>
          <h4>{t("start")}</h4>
          <FooterLink to="/">{t("home")}</FooterLink>
          <FooterLink to="/play">{t("games")}</FooterLink>
          <FooterLink to="/sell">{t("sellNav")}</FooterLink>
          <FooterLink to="/gifts">{t("gifts")}</FooterLink>
          <FooterLink to="/category/Bundles">{t("bundles")}</FooterLink>
          <FooterLink to="/login">{t("login")}</FooterLink>
        </div>
        <div>
          <h4>პოლიტიკა</h4>
          <FooterLink to="/">{t("home")}</FooterLink>
          <FooterLink to="/profile">{t("profile")}</FooterLink>
          <FooterLink to="/cart">{t("cart")}</FooterLink>
        </div>
        <div>
          <h4>დახმარება</h4>
          <FooterLink to="/profile">{t("myOrders")}</FooterLink>
          <FooterLink to="/checkout">შეკვეთა</FooterLink>
          <FooterLink to="/play">{t("games")}</FooterLink>
        </div>
        <div className="footer-contact">
          <h4>{t("contact")}</h4>
          <p>
            <a href={`tel:${(settings?.footerPhone || "+995 595 95 00 39").replace(/\s|-/g, "")}`}>
              {settings?.footerPhone || "+995 595 95 00 39"}
            </a>
          </p>
          <p>
            <a href={`mailto:${settings?.footerEmail || "retrobit.support@gmail.com"}`}>
              {settings?.footerEmail || "retrobit.support@gmail.com"}
            </a>
          </p>
          <p>{settings?.footerHours || "ორშ–კვი 10:00–22:00"}</p>
          <p>{settings?.footerAddress || "თბილისი, საქართველო"}</p>
          <div className="footer-socials" aria-label="სოციალური ქსელები">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              f
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              ig
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              yt
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">
              tt
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              x
            </a>
          </div>
        </div>
      </div>

      <div className="footer-pay" aria-label="გადახდის მეთოდები">
        <span className="pay-badge">VISA</span>
        <span className="pay-badge">Mastercard</span>
        <span className="pay-badge">Apple Pay</span>
        <span className="pay-badge">Google Pay</span>
        <span className="pay-badge">TBC Pay</span>
        <span className="pay-badge">BOG Pay</span>
        <span className="pay-badge">ნაღდი</span>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} RetroBit. {t("rights")}
      </p>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        color: "#e0e7ff",
        textDecoration: "none",
        marginBottom: 8,
      }}
    >
      {children}
    </Link>
  );
}
