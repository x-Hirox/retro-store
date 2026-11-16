import { useState, type FormEvent } from "react";
import { authService } from "../services/authService";
import { afterLoginPath, saveAuthSession } from "../lib/authSession";

export default function ActivationCodeForm({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const activate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await authService.verifyEmail({
        email,
        code: code.trim(),
      });
      if (data.token && data.user) {
        saveAuthSession(data);
        window.location.href = afterLoginPath(data.user?.role);
        return;
      }
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.response?.data?.message || "აქტივაცია ვერ მოხერხდა.");
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError("");
    setInfo("");
    setBusy(true);
    try {
      const data = await authService.resendVerification({ email });
      setInfo(data.message || "კოდი გამოგიგზავნეთ.");
    } catch (err: any) {
      setError(err.response?.data?.message || "გაგზავნა ვერ მოხერხდა.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={activate} style={{ display: "grid", gap: 12 }}>
      <p style={{ margin: 0, color: "var(--text)", lineHeight: 1.5 }}>
        კოდი გავგზავნეთ მეილზე <strong>{email}</strong>. შეიყვანე 6 ციფრი ან
        გახსენი ბმული წერილში.
      </p>
      <input
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="000000"
        required
        style={{
          width: "100%",
          padding: "14px",
          letterSpacing: "0.4em",
          textAlign: "center",
          fontSize: "1.4rem",
          fontWeight: 800,
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--bg)",
          color: "var(--text-h)",
        }}
      />
      {error && <p style={{ color: "#ef4444", margin: 0 }}>{error}</p>}
      {info && <p style={{ color: "#22c55e", margin: 0 }}>{info}</p>}
      <button type="submit" className="auth-button" disabled={busy || code.length < 6}>
        {busy ? "მოწმდება..." : "ანგარიშის აქტივაცია"}
      </button>
      <button
        type="button"
        onClick={resend}
        disabled={busy}
        style={{
          background: "none",
          border: 0,
          color: "var(--accent)",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        კოდი არ მოვიდა? ხელახლა გაგზავნა
      </button>
    </form>
  );
}
