import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await API.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err: any) {
        setError("შეკვეთის მონაცემები ვერ მოიძებნა.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div
        style={{ textAlign: "center", padding: "80px", color: "var(--text)" }}
      >
        იტვირთება ინვოისი... 🔄
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#e74c3c" }}>
        <h2>{error || "შეცდომა მოხდა"}</h2>
        <Link
          to="/"
          style={{
            color: "var(--accent)",
            marginTop: "20px",
            display: "inline-block",
          }}
        >
          მთავარ გვერდზე დაბრუნება
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          backgroundColor: "var(--code-bg)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "var(--text-h)", marginBottom: "10px" }}>
            შეკვეთა მიღებულია! 🎉
          </h1>
          <p style={{ color: "var(--text)", fontSize: "0.95rem" }}>
            შეკვეთის ნომერი:{" "}
            <strong style={{ color: "var(--accent)" }}>{order._id}</strong>
          </p>
        </div>

        <div
          style={{
            marginBottom: "25px",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "15px",
          }}
        >
          <h3 style={{ color: "var(--text-h)", marginBottom: "10px" }}>
            მიწოდების დეტალები 📦
          </h3>
          <p>
            <strong>სახელი:</strong>{" "}
            {order.shippingAddress?.fullName || "მომხმარებელი"}
          </p>
          <p>
            <strong>ქალაქი / მისამართი:</strong> {order.shippingAddress?.city},{" "}
            {order.shippingAddress?.address}
          </p>
          <p>
            <strong>ტელეფონი:</strong> {order.shippingAddress?.phone}
          </p>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ color: "var(--text-h)", marginBottom: "15px" }}>
            შეძენილი პროდუქტები 🛒
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {order.orderItems?.map((item: any, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1rem",
                  borderBottom: "1px dashed var(--border)",
                  paddingBottom: "8px",
                }}
              >
                <span>
                  {item.product?.title || "პროდუქტი"} (x{item.quantity})
                </span>
                <span style={{ fontWeight: "bold", color: "var(--text-h)" }}>
                  {item.price * item.quantity} ₾
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "var(--text-h)",
            marginBottom: "30px",
            borderTop: "1px solid var(--border)",
            paddingTop: "15px",
          }}
        >
          <span>სულ გადასახდელი:</span>
          <span style={{ color: "var(--accent)" }}>{order.totalPrice} ₾</span>
        </div>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            onClick={() => window.print()}
            style={{
              backgroundColor: "transparent",
              color: "var(--text-h)",
              border: "1px solid var(--border)",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ინვოისის ამობეჭდვა 🖨️
          </button>
          <Link
            to="/"
            style={{
              backgroundColor: "var(--accent)",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            მთავარ გვერდზე დაბრუნება
          </Link>
        </div>
      </div>
    </div>
  );
}
