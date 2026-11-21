import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { passwordError } from "../utils/validate";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const passErr = passwordError(newPassword);
    if (passErr) {
      setError(passErr);
      return;
    }
    setLoading(true);

    try {
      const response = await authService.resetPassword({
        token,
        email,
        newPassword,
      });
      setMessage(response.message || "პაროლი წარმატებით შეიცვალა!");
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "პაროლის შეცვლისას მოხდა შეცდომა.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2
          style={{
            color: "var(--text-h)",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          ახალი პაროლის დაყენება 🔑
        </h2>
        <p
          style={{
            color: "var(--text)",
            fontSize: "0.9rem",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
            მინიმუმ 8 სიმბოლო: ლათინური დიდი ასო (A–Z), ციფრი და სიმბოლო (მაგ. !).
        </p>

        {message && (
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              color: "#22c55e",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleReset}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                color: "var(--text)",
                marginBottom: "5px",
                fontSize: "0.9rem",
              }}
            >
              ახალი პაროლი
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="********"
                className="auth-input"
                style={{ paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? "დამალვა" : "ჩვენება"}
                aria-label={showPassword ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "იგზავნება..." : "პაროლის შეცვლა"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            to="/login"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            ← უკან შესვლის გვერდზე
          </Link>
        </div>
      </div>
    </div>
  );
}
