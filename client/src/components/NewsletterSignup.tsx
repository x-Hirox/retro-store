import { useEffect, useState } from "react";
import { getSiteSettings, subscribeNewsletter } from "../services/contentService";
import type { ISiteSettings } from "../types";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [settings, setSettings] = useState<ISiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await subscribeNewsletter(email);
      setStatus(res.message || "გმადლობთ!");
      setEmail("");
    } catch {
      setStatus("რეგისტრაცია ვერ მოხერხდა. სცადე თავიდან.");
    }
  };

  return (
    <div
      style={{
        background: "#111",
        padding: "40px 20px",
        textAlign: "center",
        color: "#fff",
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: "1.4rem",
          marginBottom: 20,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {settings?.newsletterTitle ||
          "დარეგისტრირდი და მიიღე 10% ფასდაკლება პირველ შეკვეთაზე"}
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <input
          type="email"
          required
          placeholder="შეიყვანე ელფოსტა"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            minWidth: 260,
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "#fff",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#ff6600",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: 8,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {settings?.newsletterButton || "10% ფასდაკლება"}
        </button>
      </form>
      {status && <p style={{ marginTop: 12, color: "#86efac" }}>{status}</p>}
    </div>
  );
}
