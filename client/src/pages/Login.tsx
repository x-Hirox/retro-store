import { useNavigate } from "react-router-dom";
import AuthPanel from "../components/AuthPanel";
import SeoHead from "../components/SeoHead";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="auth-container">
      <SeoHead
        title="შესვლა"
        description="შედი RetroBit ანგარიშში."
        path="/login"
        noindex
      />
      <div className="auth-card">
        <AuthPanel
          tab="login"
          onTab={(next) => navigate(next === "register" ? "/register" : "/login")}
        />
      </div>
    </div>
  );
}
