import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";

// დეკლარაცია Google-ის გლობალური ობიექტისთვის TypeScript-ში
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: { theme: string; size: string; width?: string },
          ) => void;
        };
      };
    };
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      localStorage.setItem("token", data.token);

      setLoading(false);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.response?.data?.message || "შეცდომა ავტორიზაციისას");
      setLoading(false);
    }
  };

  // Google OAuth-ის ინიციალიზაცია
  useEffect(() => {
    const handleGoogleResponse = async (response: { credential: string }) => {
      setError("");
      setLoading(true);
      try {
        // ვუგზავნით Google-ის ტოკენს ჩვენს ბექენდს (/api/auth/google)
        const data = await authService.googleAuth({
          credential: response.credential,
        });
        localStorage.setItem("token", data.token);
        setLoading(false);
        window.location.href = "/";
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Google ავტორიზაცია ვერ მოხერხდა",
        );
        setLoading(false);
      }
    };

    const loadGoogleScript = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login-btn"),
          { theme: "outline", size: "large", width: "100%" },
        );
      }
    };

    if (!document.getElementById("google-client-script")) {
      const script = document.createElement("script");
      script.id = "google-client-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = loadGoogleScript;
      document.body.appendChild(script);
    } else {
      loadGoogleScript();
    }
  }, []);

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
          შესვლა 🔑
        </h2>
        <p
          style={{
            color: "var(--text)",
            fontSize: "0.9rem",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          შეიყვანე შენი მონაცემები ანგარიშში შესასვლელად.
        </p>

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
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            {error}
          </div>
        )}

        {/* Google შესვლის ღილაკის კონტეინერი */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div id="google-login-btn" style={{ width: "100%" }}></div>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <div
            style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }}
          ></div>
          <span
            style={{
              padding: "0 10px",
              color: "var(--text)",
              fontSize: "0.85rem",
            }}
          >
            ან
          </span>
          <div
            style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }}
          ></div>
        </div>

        <form
          onSubmit={handleLogin}
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

          <div>
            <label
              style={{
                display: "block",
                color: "var(--text)",
                marginBottom: "5px",
                fontSize: "0.9rem",
              }}
            >
              პაროლი
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="auth-input"
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>

            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <Link
                to="/forgot-password"
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                დაგავიწყდა პაროლი?
              </Link>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "იგზავნება..." : "შესვლა"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "var(--text)",
            fontSize: "0.9rem",
          }}
        >
          არ გაქვს აკაუნტი?{" "}
          <Link
            to="/register"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            რეგისტრაცია
          </Link>
        </p>
      </div>
    </div>
  );
}
