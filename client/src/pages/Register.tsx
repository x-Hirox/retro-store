import { useNavigate } from "react-router-dom";
import AuthPanel from "../components/AuthPanel";
import SeoHead from "../components/SeoHead";

export default function Register() {
  const navigate = useNavigate();
  return (
    <div className="auth-container">
      <SeoHead
        title="რეგისტრაცია"
        description="შექმენი RetroBit ანგარიში."
        path="/register"
        noindex
      />
      <div className="auth-card">
        <AuthPanel
          tab="register"
          onTab={(next) => navigate(next === "register" ? "/register" : "/login")}
        />
      </div>
    </div>
  );
}
