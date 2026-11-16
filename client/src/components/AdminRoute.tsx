import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

function storedIsAdmin(): boolean {
  try {
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    return Boolean(localStorage.getItem("token") && user?.role === "admin");
  } catch {
    return false;
  }
}

export default function AdminRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "admin" | "deny">("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("deny");
      return;
    }

    authService
      .me()
      .then((data) => {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setStatus(data.user?.role === "admin" ? "admin" : "deny");
      })
      .catch(() => setStatus(storedIsAdmin() ? "admin" : "deny"));
  }, []);

  if (status === "loading") return null;
  if (status !== "admin") return <Navigate to="/login" replace />;
  return <>{children}</>;
}
