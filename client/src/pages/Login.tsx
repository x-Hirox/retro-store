import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);

      // 🟢 მყისიერი გადამისამართება ყოველგვარი alert()-ის გარეშე
      window.location.href = "/";
    } catch (err: any) {
      setError(err.response?.data?.message || "შეცდომა ავტორიზაციისას");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--bg)",
          border: "1px solid var(--border)",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "var(--shadow)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            color: "var(--text-h)",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          შესვლა 🔑
        </h2>

        {error && (
          <div
            style={{
              color: "#e74c3c",
              marginBottom: "15px",
              textAlign: "center",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

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
              }}
            >
              ელ-ფოსტა
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--code-bg)",
                color: "var(--text-h)",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "var(--text)",
                marginBottom: "5px",
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
                style={{
                  width: "100%",
                  padding: "10px",
                  paddingRight: "40px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
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

            <div style={{ textAlign: "right", marginTop: "5px" }}>
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

          <button
            type="submit"
            style={{
              backgroundColor: "var(--accent)",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              marginTop: "5px",
            }}
          >
            შესვლა
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "var(--text)",
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
