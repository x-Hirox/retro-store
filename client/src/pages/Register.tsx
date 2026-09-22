import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { validatePassword } from "../utils/validations"; // ვალიდაციის იმპორტი

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // დამატებულია
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. ვამოწმებთ ემთხვევა თუ არა პაროლები ერთმანეთს
    if (password !== confirmPassword) {
      setError("პაროლები არ ემთხვევა ერთმანეთს!");
      return;
    }

    // 2. ვამოწმებთ პაროლის სირთულეს სერვერზე გაგზავნამდე
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      await registerUser({ name, email, password });
      alert("რეგისტრაცია წარმატებით დასრულდა! გთხოვთ გაიაროთ ავტორიზაცია.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "შეცდომა რეგისტრაციისას");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            color: "#2c3e50",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          რეგისტრაცია 📝
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "0.85rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                color: "#7f8c8d",
                marginBottom: "5px",
              }}
            >
              სახელი
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#7f8c8d",
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
                border: "1px solid #ced4da",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#7f8c8d",
                marginBottom: "5px",
              }}
            >
              პაროლი
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
              }}
            />
          </div>

          {/* პაროლის გამეორების ველი */}
          <div>
            <label
              style={{
                display: "block",
                color: "#7f8c8d",
                marginBottom: "5px",
              }}
            >
              გაიმეორეთ პაროლი
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
              }}
            />

            {/* პაროლის მოთხოვნების მითითება */}
            <p
              style={{
                color: "#7f8c8d",
                fontSize: "0.75rem",
                marginTop: "5px",
                lineHeight: "1.3",
              }}
            >
              პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან, შეიცავდეს დიდ ასოს,
              ციფრს და სპეციალურ სიმბოლოს (!@#$%^&*).
            </p>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#3498db",
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
            რეგისტრაცია
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#7f8c8d" }}>
          უკვე გაქვს აკაუნტი?{" "}
          <Link
            to="/login"
            style={{ color: "#3498db", textDecoration: "none" }}
          >
            შესვლა
          </Link>
        </p>
      </div>
    </div>
  );
}
