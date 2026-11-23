import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import AuthPanel from "./AuthPanel";

export default function AuthModal() {
  const { open, tab, setTab, hide } = useAuthModal();
  const location = useLocation();

  useEffect(() => {
    hide();
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, hide]);

  if (!open) return null;

  return (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-label="შესვლა">
      <button type="button" className="auth-modal-dim" aria-label="დახურვა" onClick={hide} />
      <div className="auth-card is-modal">
        <button type="button" className="auth-modal-close" onClick={hide} aria-label="დახურვა">
          ×
        </button>
        <AuthPanel tab={tab} onTab={setTab} />
      </div>
    </div>
  );
}
