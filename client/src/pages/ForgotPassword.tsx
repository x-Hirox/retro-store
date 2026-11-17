import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";
import { isValidEmail } from "../utils/validate";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!isValidEmail(email)) {
      setError("ელ-ფოსტა უნდა შეიცავდეს @-ს.");
      return;
    }
    setLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      setMessage(
        response.message ||
          "თუ ეს ელ-ფოსტა რეგისტრირებულია, აღდგენის ლინკი გამოგიგზავნე. შეამოწმე Inbox და Spam.",
      );
    } catch (err: unknown) {
      const axiosErr = err as {
        code?: string;
        response?: { data?: { message?: string } };
      };
      if (axiosErr.code === "ECONNABORTED") {
        setError("სერვერი დიდხანს პასუხობს. სცადე კიდევ ერთხელ.");
      } else {
        setError(
          axiosErr.response?.data?.message ||
            "შეცდომა მოხდა მოთხოვნის გაგზავნისას.",
        );
      }
    } finally {
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
          პაროლის აღდგენა 🔑
        </h2>
        <p
          style={{
            color: "var(--text)",
            fontSize: "0.9rem",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          შეიყვანე შენი ელ-ფოსტა და ჩვენ გამოგიგზავნით აღდგენის ინსტრუქციას.
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
              border: "1px solid rgba(34, 197, 94, 0.3)",
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
              border: "1px solid rgba(239, 68, 68, 0.3)",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
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
              ელ-ფოსტა
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@gmail.com"
              className="auth-input"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "იგზავნება..." : "აღდგენის მოთხოვნა"}
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
