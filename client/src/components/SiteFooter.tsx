import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getSiteSettings } from "../services/contentService";
import type { ISiteSettings } from "../types";
import { useLang } from "../i18n/LanguageContext";

const PAYMENTS = [
  "Visa",
  "Mastercard",
  "Apple Pay",
  "Google Pay",
  "TBC Pay",
  "BOG Pay",
  "ნაღდი",
];

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

  const socials = [
    ["Facebook", settings?.socialFacebook],
    ["Instagram", settings?.socialInstagram],
    ["TikTok", settings?.socialTiktok],
    ["YouTube", settings?.socialYoutube],
    ["X", settings?.socialX],
  ].filter(([, url]) => /^https?:\/\//i.test(String(url || "")));

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h4>ნავიგაცია</h4>
          <FooterLink to="/">{t("home")}</FooterLink>
          <FooterLink to="/category/Nintendo">Nintendo</FooterLink>
          <FooterLink to="/category/PlayStation">PlayStation</FooterLink>
          <FooterLink to="/category/Sega">Sega</FooterLink>
          <FooterLink to="/category/Xbox">Xbox</FooterLink>
          <FooterLink to="/play">{t("games")}</FooterLink>
          <FooterLink to="/sell">{t("sellNav")}</FooterLink>
          <FooterLink to="/gifts">{t("gifts")}</FooterLink>
        </div>
        <div>
          <h4>გადახდები</h4>
          <p className="footer-note">Visa, Mastercard, Apple Pay, Google Pay, TBC Pay, BOG Pay და ნაღდი.</p>
          <p className="footer-note">მიწოდება: პირობები მალე დაემატება.</p>
          <p className="footer-note">გარანტია ამ ეტაპზე არ არის.</p>
        </div>
        <div>
          <h4>გამოგვყევი</h4>
          {socials.length > 0 ? (
            <div className="footer-socials" aria-label="სოციალური ქსელები">
              {socials.map(([label, url]) => (
                <a key={label} href={String(url)} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ))}
            </div>
          ) : (
            <p className="footer-note">სოციალური ბმულები მალე დაემატება.</p>
          )}
        </div>
        <div className="footer-contact">
          <h4>კონტაქტები</h4>
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
        </div>
      </div>

      <div className="footer-pay" aria-label="გადახდის მეთოდები">
        {PAYMENTS.map((label) => (
          <span key={label} className="pay-badge">
            {label}
          </span>
        ))}
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} RetroBit. {t("rights")}
      </p>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="footer-link">
      {children}
    </Link>
  );
}
