import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import {
  downloadInvoice,
  itemPrice,
  itemTitle,
  payLabel,
  payStatusLabel,
  printInvoice,
} from "../utils/invoice";
import OrderTracker from "../components/OrderTracker";
import { statusLabel } from "../utils/orderStatus";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const fetchOrder = async () => {
      try {
        const response = await API.get(`/orders/${id}`);
        setOrder(response.data);
        setError("");
        if (response.data?.paymentStatus === "pending") {
          timer = window.setTimeout(fetchOrder, 2500);
        }
      } catch {
        setError("შეკვეთის მონაცემები ვერ მოიძებნა.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [id]);

  const retryPay = async () => {
    if (!id) return;
    setPaying(true);
    try {
      const { data } = await API.post(`/orders/${id}/pay`);
      if (data.redirectUrl) {
        window.location.assign(data.redirectUrl);
        return;
      }
      const again = await API.get(`/orders/${id}`);
      setOrder(again.data);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      alert(ax.response?.data?.message || "გადახდა ვერ დაიწყო");
    } finally {
      setPaying(false);
    }
  };

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
        id="printable-invoice"
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
            {order.paymentStatus === "paid"
              ? "გადახდა მიღებულია"
              : order.paymentStatus === "pending"
                ? "ბანკში გადახდა მიმდინარეობს"
                : order.paymentMethod === "cash"
                  ? "შეკვეთა მიღებულია"
                  : "შეკვეთა მიღებულია"}
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
            {order.shippingAddress?.fullName ||
              order.fullName ||
              "მომხმარებელი"}
          </p>
          <p>
            <strong>ქალაქი / მისამართი:</strong> {order.shippingAddress?.city},{" "}
            {order.shippingAddress?.address}
          </p>
          <p>
            <strong>ტელეფონი:</strong> {order.shippingAddress?.phone}
          </p>
          <p>
            <strong>გადახდა:</strong> {payLabel(order.paymentMethod)}
            {order.paymentProvider
              ? ` · ${String(order.paymentProvider).toUpperCase()}`
              : ""}
          </p>
          <p>
            <strong>გადახდის სტატუსი:</strong>{" "}
            {payStatusLabel(order.paymentStatus)}
          </p>
          <p>
            <strong>შეკვეთის პროცესი:</strong> {statusLabel(order.status)}
          </p>
          {order.trackingCode && (
            <p>
              <strong>თრექინგი:</strong> {order.trackingCode}
              {order.courierName ? ` · ${order.courierName}` : ""}
            </p>
          )}
          <OrderTracker status={order.status} />
          {order.paymentMethod !== "cash" && order.paymentStatus !== "paid" && (
            <button
              type="button"
              className="pd-buy-now"
              style={{ marginTop: 12 }}
              disabled={paying}
              onClick={retryPay}
            >
              {paying ? "იგზავნება..." : "ბანკით გადახდა"}
            </button>
          )}
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ color: "var(--text-h)", marginBottom: "15px" }}>
            შეძენილი პროდუქტები 🛒
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {order.orderItems?.map((item: any, index: number) => {
              const price = itemPrice(item);
              return (
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
                    {itemTitle(item)} (x{item.quantity})
                  </span>
                  <span style={{ fontWeight: "bold", color: "var(--text-h)" }}>
                    {(price * item.quantity).toFixed(2)} ₾
                  </span>
                </div>
              );
            })}
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
          <span style={{ color: "var(--accent)" }}>
            {Number(order.totalPrice || 0).toFixed(2)} ₾
          </span>
        </div>

        <div
          className="no-print"
          style={{ display: "flex", gap: "15px", justifyContent: "center" }}
        >
          <button
            onClick={() => printInvoice(order)}
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
          <button
            onClick={() => downloadInvoice(order)}
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
            ჩამოტვირთვა
          </button>
          <Link
            to="/profile"
            style={{
              backgroundColor: "transparent",
              color: "var(--text-h)",
              border: "1px solid var(--border)",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            ჩემი შეკვეთები
          </Link>
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

      {/* პრინტისთვის განკუთვნილი სტილები */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
