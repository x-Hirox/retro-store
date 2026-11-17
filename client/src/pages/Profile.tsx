import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import API from "../services/api";
import {
  downloadInvoice,
  itemPrice,
  itemTitle,
  payLabel,
  payStatusLabel,
  printInvoice,
} from "../utils/invoice";
import { useLang } from "../i18n/LanguageContext";
import OrderTracker from "../components/OrderTracker";
import { canCustomerCancel, statusLabel } from "../utils/orderStatus";
import { isValidPersonName, normalizeGePhone } from "../utils/validate";
import { GiftStack } from "../components/NostalgiaBits";

type Order = {
  _id: string;
  createdAt?: string;
  status?: string;
  totalPrice?: number;
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    phone?: string;
  };
  paymentMethod?: string;
  paymentStatus?: string;
  paymentProvider?: string;
  trackingCode?: string;
  courierName?: string;
  orderItems?: Array<{
    title?: string;
    quantity?: number;
    price?: number;
    imageUrl?: string;
    product?: { title?: string; price?: number; imageUrl?: string };
  }>;
};

export default function Profile() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setup = params.get("setup") === "1";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const load = async () => {
    try {
      let user: {
        firstName?: string;
        lastName?: string;
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        isVerified?: boolean;
      } | null = null;
      try {
        const me = await authService.me();
        user = me.user;
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        const stored = localStorage.getItem("user");
        user = stored ? JSON.parse(stored) : null;
      }
      const parts = String(user?.name || "")
        .trim()
        .split(/\s+/);
      setVerified(user?.isVerified !== false);
      setForm({
        firstName: user?.firstName || parts[0] || "",
        lastName: user?.lastName || parts.slice(1).join(" ") || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
      });
      const { data } = await API.get("/orders/myorders");
      setOrders(data || []);
    } catch {
      setMessage("შეკვეთები ვერ ჩაიტვირთა. შესვლა თავიდან სცადე.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const phone = normalizeGePhone(form.phone);
    if (!isValidPersonName(form.firstName) || !isValidPersonName(form.lastName)) {
      setMessage("სახელი და გვარი უნდა იყოს მინიმუმ 2 ასო, ციფრის გარეშე");
      setSaving(false);
      return;
    }
    if (!phone) {
      setMessage("მიუთითე სწორი ქართული მობილური (599123456)");
      setSaving(false);
      return;
    }
    try {
      const data = await authService.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone,
        address: form.address,
        city: form.city,
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("პროფილი შენახულია");
      if (setup) {
        window.setTimeout(() => navigate("/"), 700);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "შენახვა ვერ მოხერხდა");
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async (id: string) => {
    if (!window.confirm("გაუქმდეს ეს შეკვეთა?")) return;
    try {
      await API.put(`/orders/${id}/cancel`);
      await load();
    } catch (err: any) {
      alert(err.response?.data?.message || "გაუქმება ვერ მოხერხდა");
    }
  };

  if (loading) {
    return <div className="profile-page">{t("loading")}</div>;
  }

  return (
    <div className="profile-page nbit-slot">
      <GiftStack />
      <h1 className="ny-title">{t("profile")}</h1>
      <p className="profile-lead">
        {setup
          ? "დაასრულე პროფილი (გვარი და ტელეფონი) — შემდეგ გადახვალ მთავარ გვერდზე."
          : "შენი მონაცემები და შეკვეთების ისტორია."}
      </p>
      {!verified && (
        <p className="profile-lead">
          დასტურის ბმული გამოგიგზავნეთ მეილზე. ყიდვა შეგიძლია ახლავე — დააკლიკე
          ბმულს როცა მოგივა.
        </p>
      )}

      <div className="profile-grid">
        <form className="profile-card" onSubmit={save}>
          <h2>პირადი მონაცემები</h2>
          {message && <p className="profile-msg">{message}</p>}
          <label>
            სახელი
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </label>
          <label>
            გვარი
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </label>
          <label>
            ელ-ფოსტა
            <input value={form.email} disabled />
          </label>
          <label>
            ტელეფონი
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="599123456"
              required
            />
          </label>
          <label>
            ქალაქი
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </label>
          <label>
            მისამართი
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? "ინახება..." : t("saveProfile")}
          </button>
          <Link to="/" className="profile-home-link">
            მთავარ გვერდზე
          </Link>
        </form>

        <section className="profile-card">
          <h2>{t("myOrders")}</h2>
          {orders.length === 0 && <p>შეკვეთები ჯერ არ გაქვს.</p>}
          <div className="order-list">
            {orders.map((order) => (
              <article key={order._id} className="order-card">
                <div className="order-head">
                  <strong>#{String(order._id).slice(-8)}</strong>
                  <span>{statusLabel(order.status)}</span>
                </div>
                <OrderTracker status={order.status} />
                <p>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("ka-GE")
                    : ""}
                </p>
                {order.trackingCode && (
                  <p>
                    თრექინგი: <strong>{order.trackingCode}</strong>
                    {order.courierName ? ` · ${order.courierName}` : ""}
                  </p>
                )}
                <ul>
                  {(order.orderItems || []).map((item, i) => (
                    <li key={i}>
                      {itemTitle(item)} × {item.quantity} —{" "}
                      {(itemPrice(item) * Number(item.quantity || 1)).toFixed(2)}{" "}
                      ₾
                    </li>
                  ))}
                </ul>
                <p className="order-total">
                  სულ {Number(order.totalPrice || 0).toFixed(2)} ₾ ·{" "}
                  {payLabel(order.paymentMethod)} ·{" "}
                  {payStatusLabel(order.paymentStatus)}
                </p>
                <div className="order-actions">
                  <Link to={`/order-success/${order._id}`}>{t("invoice")}</Link>
                  {order.paymentMethod !== "cash" &&
                    order.paymentStatus !== "paid" && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const { data } = await API.post(
                              `/orders/${order._id}/pay`,
                            );
                            if (data.redirectUrl) {
                              window.location.assign(data.redirectUrl);
                            }
                          } catch (err: unknown) {
                            const ax = err as {
                              response?: { data?: { message?: string } };
                            };
                            alert(
                              ax.response?.data?.message ||
                                "ბანკის გადახდა ვერ დაიწყო",
                            );
                          }
                        }}
                      >
                        ბანკით გადახდა
                      </button>
                    )}
                  <button type="button" onClick={() => printInvoice(order)}>
                    ამობეჭდვა
                  </button>
                  <button type="button" onClick={() => downloadInvoice(order)}>
                    {t("downloadInvoice")}
                  </button>
                  {canCustomerCancel(order.status) && (
                    <button type="button" onClick={() => cancelOrder(order._id)}>
                      {t("cancelOrder")}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
