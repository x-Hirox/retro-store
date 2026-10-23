import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authService } from "../services/authService";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("მიმდინარეობს ანგარიშის აქტივაცია...");

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token || !email) {
        setStatus("error");
        setMessage("არასწორი აქტივაციის ბმული.");
        return;
      }

      try {
        const response = await authService.verifyEmail({ token, email });
        setStatus("success");
        setMessage(response.message || "ანგარიში წარმატებით გააქტიურდა!");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "აქტივაცია ვერ მოხერხდა.");
      }
    };

    verifyAccount();
  }, [token, email]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h2 style={{ color: "var(--text-h)", marginBottom: "15px" }}>
          {status === "success"
            ? "წარმატება! 🎉"
            : status === "error"
              ? "შეცდომა ❌"
              : "აქტივაცია ⏳"}
        </h2>
        <p
          style={{
            color: "var(--text)",
            marginBottom: "25px",
            fontSize: "1rem",
          }}
        >
          {message}
        </p>

        {status !== "loading" && (
          <Link
            to="/login"
            className="auth-button"
            style={{
              display: "inline-block",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            შესვლის გვერდზე გადასვლა →
          </Link>
        )}
      </div>
    </div>
  );
}
