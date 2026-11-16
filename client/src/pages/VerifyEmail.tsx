import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ActivationCodeForm from "../components/ActivationCodeForm";
import { authService } from "../services/authService";
import { afterLoginPath, saveAuthSession } from "../lib/authSession";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error" | "code">(
    token ? "loading" : "code",
  );
  const [message, setMessage] = useState("მიმდინარეობს ანგარიშის აქტივაცია...");

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token || !email) {
        setStatus("code");
        setMessage("შეიყვანე მეილზე მიღებული 6-ნიშნა კოდი.");
        return;
      }

      try {
        const response = await authService.verifyEmail({ token, email });
        setStatus("success");
        setMessage(response.message || "ანგარიში წარმატებით გააქტიურდა!");
        if (response.token && response.user) {
          saveAuthSession(response);
          window.setTimeout(() => {
            window.location.href = afterLoginPath(response.user?.role);
          }, 800);
        }
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
              : status === "code"
                ? "აქტივაციის კოდი"
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

        {(status === "code" || status === "error") && email && (
          <ActivationCodeForm email={email} />
        )}

        {status === "success" && (
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
