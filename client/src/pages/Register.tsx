import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან.";
    if (!/[A-Z]/.test(pass))
      return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ ასოს (A-Z).";
    if (!/\d/.test(pass))
      return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს (0-9).";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass))
      return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ სპეციალურ სიმბოლოს.";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("პაროლები არ ემთხვევა ერთმანეთს.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({ name, email, password });
      setMessage(
        response.message ||
          "რეგისტრაცია წარმატებით დასრულდა! გთხოვთ შეამოწმოთ მეილი.",
      );
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || "რეგისტრაციის შეცდომა.");
      setLoading(false);
    }
  };

  // Google OAuth ინიციალიზაცია რეგისტრაციის გვერდზეც
  useEffect(() => {
    const handleGoogleResponse = async (response: { credential: string }) => {
      setError("");
      setLoading(true);
      try {
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
          document.getElementById("google-register-btn"),
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
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--code-bg)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2
          style={{
            color: "var(--text-h)",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          რეგისტრაცია 📝
        </h2>
        <p
          style={{
            color: "var(--text)",
            fontSize: "0.9rem",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          შეიქმენი ანგარიში რეტრო კოლექციების განსათავსებლად და შესაძენად.
        </p>

        {message && (
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              color: "#22c55e",
              padding: "12px",
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
              padding: "12px",
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

        {/* Google რეგისტრაციის ღილაკის კონტეინერი */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div id="google-register-btn" style={{ width: "100%" }}></div>
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
          onSubmit={handleRegister}
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
              სახელი
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="შენი სახელი"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg)",
                color: "var(--text-h)",
                fontSize: "1rem",
                outline: "none",
              }}
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
              ელ-ფოსტა
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@gmail.com"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg)",
                color: "var(--text-h)",
                fontSize: "1rem",
                outline: "none",
              }}
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
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                style={{
                  width: "100%",
                  padding: "12px",
                  paddingRight: "40px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text-h)",
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  userSelect: "none",
                }}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text)",
                display: "block",
                marginTop: "4px",
              }}
            >
              მინ. 8 სიმბოლო, დიდი ასო, ციფრი და სპეც. სიმბოლო.
            </span>
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
              გაიმეორეთ პაროლი
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="********"
                style={{
                  width: "100%",
                  padding: "12px",
                  paddingRight: "40px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text-h)",
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  userSelect: "none",
                }}
              >
                {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "var(--accent)",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              marginTop: "10px",
            }}
          >
            {loading ? "რეგისტრაცია..." : "რეგისტრაცია"}
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
            უკვე გაქვს აკაუნტი? შესვლა →
          </Link>
        </div>
      </div>
    </div>
  );
}
