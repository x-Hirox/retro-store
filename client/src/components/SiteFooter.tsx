import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getSiteSettings } from "../services/contentService";
import type { ISiteSettings } from "../types";

export default function SiteFooter() {
  const location = useLocation();
  const [settings, setSettings] = useState<ISiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%)",
        color: "#fff",
        padding: "50px 20px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 28,
        }}
      >
        <div>
          <h4 style={{ margin: "0 0 12px", color: "#fff" }}>კოლექციები</h4>
          <FooterLink to="/category/nintendo">Nintendo</FooterLink>
          <FooterLink to="/category/playstation">PlayStation</FooterLink>
          <FooterLink to="/category/sega">Sega</FooterLink>
          <FooterLink to="/category/xbox">Xbox</FooterLink>
        </div>
        <div>
          <h4 style={{ margin: "0 0 12px", color: "#fff" }}>დაწყება</h4>
          <FooterLink to="/">მთავარი</FooterLink>
          <FooterLink to="/category/bundles">კომპლექტები</FooterLink>
        </div>
        <div>
          <h4 style={{ margin: "0 0 12px", color: "#fff" }}>დაგვიკავშირდი</h4>
          <p style={{ margin: "0 0 8px" }}>
            {settings?.footerPhone || "+995 555 00 00 00"}
          </p>
          <p style={{ margin: "0 0 8px" }}>
            {settings?.footerEmail || "help@retrobit.ge"}
          </p>
          <p style={{ margin: "0 0 8px" }}>
            {settings?.footerHours || "ორშ–კვი 10:00–22:00"}
          </p>
          <p style={{ margin: 0 }}>
            {settings?.footerAddress || "თბილისი, საქართველო"}
          </p>
        </div>
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: 32,
          opacity: 0.8,
          fontSize: "0.85rem",
        }}
      >
        © {new Date().getFullYear()} RetroBit. ყველა უფლება დაცულია.
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
