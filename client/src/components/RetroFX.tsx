import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { arcadeBeep } from "../utils/arcadeBeep";

const SFX =
  ".neon-btn, .sell-btn, .sell-brand-bar, .main-nav-bar a, .brand-crt, .glow-cover, .arcade-tab, .lang-switch";

export default function RetroFX() {
  const { pathname } = useLocation();
  const admin = pathname.startsWith("/admin");

  useEffect(() => {
    document.documentElement.classList.remove("fx-cursor");
  }, []);

  useEffect(() => {
    if (admin) return;
    const onClick = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.(SFX)) arcadeBeep();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [admin]);

  if (admin) return null;

  return <div className="fx-glow" aria-hidden />;
}
