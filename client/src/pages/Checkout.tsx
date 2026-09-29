import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API from "../services/api"; // 🟢 ვიყენებთ უკვე გამართულ API ინსტანსს

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "თბილისი",
    customCity: "", // დამატებულია სხვა რეგიონისთვის
    phone: "",
    paymentMethod: "card",
  });

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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

    try {
      // საბოლოო ქალაქი: თუ არჩეულია "სხვა რეგიონები", ვიღებთ customCity-ს მნიშვნელობას
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
          address: formData.address,
          city: finalCity,
          postalCode: "0100",
          phone: formData.phone,
        },
        totalPrice: totalAmount,
      };

      // 🟢 ვიყენებთ API.post-ს (რომელიც ავტომატურად მიმართავს Render-ის ლაივ სერვერს)
      await API.post("/orders", orderData);

      if (formData.paymentMethod === "card") {
        alert(
          "შეკვეთა შეიქმნა! გადამისამართება TBC / BOG უსაფრთხო გადახდის გვერდზე... 💳",
        );
      } else {
        alert("შეკვეთა წარმატებით გაფორმდა! მადლობა შეძენისთვის. 🎉");
      }

      clearCart();
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.message || "შეცდომა შეკვეთის გაფორმებისას");
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

            <div>
              <label
                style={{
                  display: "block",
                  color: "var(--text)",
                  marginBottom: "5px",
                }}
              >
                გადახდის მეთოდი
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--code-bg)",
                  color: "var(--text-h)",
                  boxSizing: "border-box",
                }}
              >
                <option
                  value="card"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--text-h)",
                  }}
                >
                  ბარათით გადახდა (TBC / BOG) 💳
                </option>
                <option
                  value="cash"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: "var(--text-h)",
                  }}
                >
                  ნაღდი ანგარიშსწორება კურიერთან 💵
                </option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "var(--accent)",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1.1rem",
                marginTop: "15px",
              }}
            >
              შეკვეთის დადასტურება და გადახდა
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
                    {item.price * item.quantity} ₾
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
          </div>
        </div>
      </div>
    </div>
  );
}
