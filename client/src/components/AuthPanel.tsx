import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActivationCodeForm from "./ActivationCodeForm";
import { authService } from "../services/authService";
import {
  afterLoginPath,
  getGoogleClientId,
  saveAuthSession,
} from "../lib/authSession";
import {
  isValidEmail,
  isValidPersonName,
  normalizeGePhone,
  passwordError,
} from "../utils/validate";
import type { AuthTab } from "../context/AuthModalContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: { theme: string; size: string; width?: number },
          ) => void;
          cancel?: () => void;
        };
      };
    };
  }
}

export default function AuthPanel({
  tab,
  onTab,
}: {
  tab: AuthTab;
  onTab: (tab: AuthTab) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [needActivation, setNeedActivation] = useState(false);

  useEffect(() => {
    setError("");
    setMessage("");
    setNeedActivation(false);
  }, [tab]);

  useEffect(() => {
    const clientId = getGoogleClientId();
    if (!clientId) return;

    const handleGoogleResponse = async (response: { credential: string }) => {
      setError("");
      setLoading(true);
      try {
        const data = await authService.googleAuth({
          credential: response.credential,
        });
        saveAuthSession(data);
        window.location.href = afterLoginPath(data.user);
      } catch (err: any) {
        setError(err.response?.data?.message || "Google ავტორიზაცია ვერ მოხერხდა");
        setLoading(false);
      }
    };

    const mount = () => {
      if (!window.google?.accounts) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
      });
      window.google.accounts.id.cancel?.();
      const node = document.getElementById("google-auth-btn");
      if (node) {
        node.innerHTML = "";
        window.google.accounts.id.renderButton(node, {
          theme: "outline",
          size: "medium",
          width: 320,
        });
      }
    };

    if (!document.getElementById("google-client-script")) {
      const script = document.createElement("script");
      script.id = "google-client-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = mount;
      document.body.appendChild(script);
    } else {
      mount();
    }
  }, [tab]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNeedActivation(false);
    if (!isValidEmail(email)) {
      setError("ელ-ფოსტა უნდა შეიცავდეს @-ს (მაგ: name@gmail.com).");
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      saveAuthSession(data);
      window.location.href = afterLoginPath(data.user);
    } catch (err: any) {
      const msg = err.response?.data?.message || "შეცდომა ავტორიზაციისას";
      setError(msg);
      setNeedActivation(msg.includes("გააქტიურ"));
      setLoading(false);
    }
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!isValidPersonName(name) || !isValidPersonName(lastName)) {
      setError("სახელი და გვარი უნდა იყოს მინიმუმ 2 ასო, ციფრის გარეშე.");
      return;
    }
    if (!normalizeGePhone(phone)) {
      setError("მიუთითე სწორი ქართული მობილური: 599123456");
      return;
    }
    if (!isValidEmail(email)) {
      setError("ელ-ფოსტა უნდა შეიცავდეს @-ს.");
      return;
    }
    if (password !== confirmPassword) {
      setError("პაროლები არ ემთხვევა.");
      return;
    }
    const passErr = passwordError(password);
    if (passErr) {
      setError(passErr);
      return;
    }
    setLoading(true);
    try {
      const response = await authService.register({
        firstName: name,
        lastName,
        phone: normalizeGePhone(phone) || phone,
        name: `${name} ${lastName}`.trim(),
        email,
        password,
      });
      if (response.token && response.user) {
        saveAuthSession(response);
        window.location.href = afterLoginPath(response.user);
        return;
      }
      setMessage(response.message || "რეგისტრაცია წარმატებულია.");
    } catch (err: any) {
      setError(err.response?.data?.message || "რეგისტრაციის შეცდომა.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-panel">
      <div className="auth-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={tab === "login" ? "is-on" : ""}
          onClick={() => onTab("login")}
        >
          ავტორიზაცია
        </button>
        <button
          type="button"
          role="tab"
          className={tab === "register" ? "is-on" : ""}
          onClick={() => onTab("register")}
        >
          რეგისტრაცია
        </button>
      </div>

      {error && <p className="auth-alert is-err">{error}</p>}
      {message && <p className="auth-alert is-ok">{message}</p>}

      {tab === "login" ? (
        <form className="auth-form" onSubmit={login}>
          <label>
            ელ-ფოსტა
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@gmail.com"
            />
          </label>
          <label>
            პაროლი
            <span className="auth-pass">
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </span>
          </label>
          <Link className="auth-forgot" to="/forgot-password">
            დაგავიწყდა პაროლი?
          </Link>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "იგზავნება..." : "შესვლა"}
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={register}>
          <div className="auth-split">
            <label>
              სახელი
              <input
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="ბექა"
              />
            </label>
            <label>
              გვარი
              <input
                className="auth-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="გრძელიშვილი"
              />
            </label>
          </div>
          <label>
            ტელეფონი
            <input
              className="auth-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="599123456"
            />
            <small className="auth-hint">
              SMS კოდი არ მოდის. ნომერს შეკვეთისთვის ვინახავთ. დასტური მეილზე მოგივა.
            </small>
          </label>
          <label>
            ელ-ფოსტა
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@gmail.com"
            />
          </label>
          <div className="auth-split">
            <label>
              პაროლი
              <span className="auth-pass">
                <input
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </span>
            </label>
            <label>
              გამეორება
              <span className="auth-pass">
                <input
                  className="auth-input"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="********"
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}>
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </span>
            </label>
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "რეგისტრაცია..." : "რეგისტრაცია"}
          </button>
        </form>
      )}

      {needActivation && email && (
        <div className="auth-activate">
          <ActivationCodeForm email={email.trim().toLowerCase()} />
        </div>
      )}

      {getGoogleClientId() ? (
        <>
          <div className="auth-or">
            <span>ან</span>
          </div>
          <div id="google-auth-btn" className="auth-google" />
        </>
      ) : null}
    </div>
  );
}
