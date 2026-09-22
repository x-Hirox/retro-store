import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

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

    // 🟢 აქ დაემატა ტელეფონის ნომრის ვალიდაცია (უშვებს როგორც უცხოურ, ისე ქართულ ნომრებს პლუსით ან მის გარეშე)
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

      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        backgroundColor: "#f8f9fa",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ color: "#2c3e50", marginBottom: "30px" }}>
          შეკვეთის გაფორმება 🚀
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "40px",
          }}
        >
          {/* ფორმა */}
          <form
            onSubmit={handleOrderSubmit}
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
                  border: "1px solid #ced4da",
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
                  border: "1px solid #ced4da",
                  backgroundColor: "white",
                  fontSize: "1rem",
                  color: "#2c3e50",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="თბილისი">თბილისი</option>
                <option value="ქუთაისი">ქუთაისი</option>
                <option value="ბათუმი">ბათუმი</option>
                <option value="რუსთავი">რუსთავი</option>
                <option value="ზუგდიდი">ზუგდიდი</option>
                <option value="სხვა რეგიონები">სხვა რეგიონები</option>
              </select>
            </div>

            {/* თუ არჩეულია სხვა რეგიონები, გამოჩნდება ტექსტური ველი */}
            {formData.city === "სხვა რეგიონები" && (
              <div>
                <label
                  style={{
                    display: "block",
                    color: "#7f8c8d",
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
                    border: "1px solid #ced4da",
                  }}
                />
              </div>
            )}

            <div>
              <label
                style={{
                  display: "block",
                  color: "#7f8c8d",
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
                  border: "1px solid #ced4da",
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
                  border: "1px solid #ced4da",
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
                  border: "1px solid #ced4da",
                  backgroundColor: "white",
                }}
              >
                <option value="card">ბარათით გადახდა (TBC / BOG) 💳</option>
                <option value="cash">ნაღდი ანგარიშსწორება კურიერთან 💵</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "#2ecc71",
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
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>
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
                    color: "#495057",
                  }}
                >
                  <span>
                    {item.title} (x{item.quantity})
                  </span>
                  <span style={{ fontWeight: "bold" }}>
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <hr
              style={{
                border: "0",
                borderTop: "1px solid #dee2e6",
                marginBottom: "15px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#2c3e50",
              }}
            >
              <span>სულ ჯამი:</span>
              <span style={{ color: "#e74c3c" }}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
