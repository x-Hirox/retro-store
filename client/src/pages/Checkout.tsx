import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API from "../services/api";
import { authService } from "../services/authService";
import { getSalePrice } from "../utils/pricing";
import PaymentMarks from "../components/PaymentMarks";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "თბილისი",
    customCity: "",
    phone: "",
    paymentMethod: "card",
  });

  const totalAmount = cart.reduce(
    (sum, item) => sum + getSalePrice(item).final * item.quantity,
    0,
  );

  useEffect(() => {
    authService
      .me()
      .then(({ user }) => {
        setFormData((prev) => ({
          ...prev,
          fullName:
            prev.fullName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.name ||
            "",
          phone: prev.phone || user.phone || "",
          address: prev.address || user.address || "",
          city: prev.city || user.city || prev.city,
        }));
      })
      .catch(() => undefined);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("თქვენი კალათა ცარიელია!");
      return;
    }

    // 🟢 ტელეფონის ნომრის ვალიდაცია
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert(
        "გთხოვთ მიუთითოთ ტელეფონის სწორი ნომერი (მაგ: +995599123456 ან 599123456)",
      );
      return;
    }

    // ვამოწმებთ არის თუ არა ტოკენი სანამ მოთხოვნას გავაგზავნით
    const token = localStorage.getItem("token");
    if (!token) {
      alert("გთხოვთ გაიაროთ ავტორიზაცია თავიდან!");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const finalCity =
        formData.city === "სხვა რეგიონები"
          ? formData.customCity
          : formData.city;

      const orderData = {
        orderItems: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: finalCity,
          postalCode: "0100",
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        totalPrice: totalAmount,
      };

      const response = await API.post("/orders", orderData);
      const created = response.data;
      const orderId = created._id || created.order?._id;

      clearCart();

      if (created.redirectUrl) {
        window.location.assign(created.redirectUrl);
        return;
      }
      if (created.paymentError) {
        alert(created.paymentError);
      }
      if (orderId) {
        navigate(`/order-success/${orderId}`);
      } else {
        navigate("/");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "შეცდომა შეკვეთის გაფორმებისას");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        padding: "40px 20px",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "var(--bg)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "var(--shadow)",
        }}
      >
        <h1 style={{ color: "var(--text-h)", marginBottom: "30px" }}>
          შეკვეთის გაფორმება 🚀
        </h1>

        {/* გამოყენებულია details-grid, რომ მობილურზე ავტომატურად ჩამოვიდეს ქვემოთ */}
        <div className="details-grid" style={{ alignItems: "flex-start" }}>
          {/* ფორმა */}
          <form
            onSubmit={handleOrderSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              flex: 1,
              width: "100%",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "var(--text)",
                  marginBottom: "5px",
                }}
              >
                სახელი და გვარი
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
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
                ქალაქი / რეგიონი
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  fontSize: "1rem",
                  color: "var(--text-h)",
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <option
                  value="თბილისი"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--text-h)",
                  }}
                >
                  თბილისი
                </option>
                <option
                  value="ქუთაისი"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--text-h)",
                  }}
                >
                  ქუთაისი
                </option>
                <option
                  value="ბათუმი"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--text-h)",
                  }}
                >
                  ბათუმი
                </option>
                <option
                  value="რუსთავი"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--text-h)",
                  }}
                >
                  რუსთავი
                </option>
                <option
                  value="ზუგდიდი"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--text-h)",
                  }}
                >
                  ზუგდიდი
                </option>
                <option
                  value="სხვა რეგიონები"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--text-h)",
                  }}
                >
                  სხვა რეგიონები
                </option>
              </select>
            </div>

            {/* თუ არჩეულია სხვა რეგიონები, გამოჩნდება ტექსტური ველი */}
            {formData.city === "სხვა რეგიონები" && (
              <div>
                <label
                  style={{
                    display: "block",
                    color: "var(--text)",
                    marginBottom: "5px",
                  }}
                >
                  მიუთითეთ რეგიონი / ქალაქი
                </label>
                <input
                  type="text"
                  name="customCity"
                  value={formData.customCity}
                  onChange={handleChange}
                  required
                  placeholder="მაგ: გორი, ფოთი, თელავი..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--code-bg)",
                    color: "var(--text-h)",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            <div>
              <label
                style={{
                  display: "block",
                  color: "var(--text)",
                  marginBottom: "5px",
                }}
              >
                ზუსტი მისამართი
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="მაგ: რუსთაველის გამზირი 12"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
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
                ტელეფონის ნომერი
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+995 599 XX XX XX"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <fieldset className="pay-methods">
              <legend>გადახდა</legend>
              {(
                [
                  ["card", "ბარათი — Visa / Mastercard"],
                  ["apple_pay", "Apple Pay"],
                  ["google_pay", "Google Pay"],
                  ["cash", "კურიერთან გადახდა"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className={formData.paymentMethod === value ? "on" : ""}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={formData.paymentMethod === value}
                    onChange={handleChange}
                  />
                  {label}
                </label>
              ))}
              <PaymentMarks />
              <p className="cart-ship-note">
                {formData.paymentMethod === "cash"
                  ? "თანხას კურიერს გადაუხდი ჩაბარებისას."
                  : "დადასტურების შემდეგ TBC ან BOG-ის უსაფრთხო გვერდზე გადახვალ. Visa, Mastercard, Apple Pay და Google Pay იქ ირჩევა."}
              </p>
            </fieldset>

            <button
              type="submit"
              disabled={submitting}
              className="pd-buy-now"
              style={{ width: "100%", marginTop: 8 }}
            >
              {submitting ? "იგზავნება..." : "შეკვეთის დადასტურება"}
            </button>
          </form>

          {/* შეკვეთის შეჯამება */}
          <div
            style={{
              backgroundColor: "var(--code-bg)",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              flex: 1,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <h3 style={{ color: "var(--text-h)", marginBottom: "15px" }}>
              თქვენი კალათა 🛒
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxHeight: "250px",
                overflowY: "auto",
                marginBottom: "20px",
              }}
            >
              {cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.95rem",
                    color: "var(--text)",
                  }}
                >
                  <span>
                    {item.title} (x{item.quantity})
                  </span>
                  <span style={{ fontWeight: "bold", color: "var(--text-h)" }}>
                    {(getSalePrice(item).final * item.quantity).toFixed(2)} ₾
                  </span>
                </div>
              ))}
            </div>
            <hr
              style={{
                border: "0",
                borderTop: "1px solid var(--border)",
                marginBottom: "15px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "var(--text-h)",
              }}
            >
              <span>სულ ჯამი:</span>
              <span style={{ color: "var(--accent)" }}>
                {totalAmount.toFixed(2)} ₾
              </span>
            </div>
            <p className="cart-ship-note">მიწოდების პირობები მალე დაემატება.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
