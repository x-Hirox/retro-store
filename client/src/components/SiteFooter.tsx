import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { getSiteSettings } from "../services/contentService";
import type { ISiteSettings } from "../types";
import { useLang } from "../i18n/LanguageContext";
import {
  ClockMark,
  FacebookMark,
  InstagramMark,
  MailMark,
  PhoneMark,
  PinMark,
  TiktokMark,
  YoutubeMark,
} from "./FooterMarks";

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

  const phone = settings?.footerPhone || "+995 595 95 00 39";
  const email = settings?.footerEmail || "retrobit.support@gmail.com";
  const socials = [
    { label: "Facebook", href: settings?.socialFacebook, icon: <FacebookMark /> },
    { label: "Youtube", href: settings?.socialYoutube, icon: <YoutubeMark /> },
    { label: "Instagram", href: settings?.socialInstagram, icon: <InstagramMark /> },
    { label: "Tik Tok", href: settings?.socialTiktok, icon: <TiktokMark /> },
  ];

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
          <div className="footer-rows" aria-label="სოციალური ქსელები">
            {socials.map((item) => (
              <FooterRow
                key={item.label}
                href={httpUrl(item.href)}
                icon={item.icon}
                label={item.label}
                hot
              />
            ))}
          </div>
        </div>
        <div className="footer-contact">
          <h4>კონტაქტი</h4>
          <div className="footer-rows">
            <FooterRow href={`mailto:${email}`} icon={<MailMark />} label={email} />
            <FooterRow
              href={`tel:${phone.replace(/\s|-/g, "")}`}
              icon={<PhoneMark />}
              label={phone}
            />
            <FooterRow icon={<ClockMark />} label={settings?.footerHours || "ორშ–კვი 10:00–22:00"} />
            <FooterRow icon={<PinMark />} label={settings?.footerAddress || "თბილისი, საქართველო"} />
          </div>
        </div>
      </div>

      <div className="footer-pay" aria-label="გადახდის მეთოდები">
        {PAYMENTS.map((label) => (
          <span key={label} className="pay-badge is-hot">
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

function httpUrl(value?: string) {
  return /^https?:\/\//i.test(String(value || "")) ? String(value) : "";
}

function FooterRow({
  href,
  icon,
  label,
  hot,
}: {
  href?: string;
  icon: ReactNode;
  label: string;
  hot?: boolean;
}) {
  const className = `footer-row${href || hot ? " is-hot" : ""}`;
  const inner = (
    <>
      <span className="footer-ico">{icon}</span>
      <span>{label}</span>
    </>
  );
  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        className={className}
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return <span className={className}>{inner}</span>;
}

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="footer-link is-hot">
      {children}
    </Link>
  );
}
