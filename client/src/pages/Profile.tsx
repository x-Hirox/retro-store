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

  const cleanName = (value: string) => {
    const text = value.trim();
    if (!text || text.includes("@") || /gmail|google/i.test(text)) return "";
    return text;
  };
  const displayName =
    [cleanName(form.firstName), cleanName(form.lastName)]
      .filter(Boolean)
      .join(" ") || t("profile");
  const initialSource = displayName === t("profile") ? "R" : displayName;
  const initials = initialSource
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const savedOk = message === "პროფილი შენახულია";

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">{t("loading")}</div>
      </div>
    );
  }

  return (
    <div className="profile-page nbit-slot">
      <GiftStack />
      <header className="profile-hero">
        <div className="profile-avatar" aria-hidden>
          {initials}
        </div>
        <div className="profile-hero-copy">
          <p className="profile-kicker">RetroBit ID</p>
          <h1>{displayName}</h1>
          <p className="profile-hero-mail">{form.email}</p>
          <div className="profile-chips">
            {verified ? (
              <span className="profile-chip is-ok">დადასტურებული</span>
            ) : (
              <span className="profile-chip">მეილი დასადასტურებელია</span>
            )}
            <span className="profile-chip">
              {orders.length} შეკვეთა
            </span>
          </div>
        </div>
      </header>
      <p className="profile-lead">
        {setup
          ? "დაასრულე პროფილი (გვარი და ტელეფონი) — შემდეგ გადახვალ მთავარ გვერდზე."
          : "შენი მონაცემები და შეკვეთების ისტორია."}
      </p>
      {!verified && (
        <p className="profile-banner">
          დასტურის ბმული გამოგიგზავნეთ მეილზე. ყიდვა შეგიძლია ახლავე — დააკლიკე
          ბმულს როცა მოგივა.
        </p>
      )}

      <div className="profile-grid">
        <form className="profile-card" onSubmit={save} autoComplete="off">
          <h2>პირადი მონაცემები</h2>
          {message && (
            <p className={savedOk ? "profile-msg" : "profile-msg is-err"}>
              {message}
            </p>
          )}
          <div className="profile-fields">
            <label htmlFor="profile-first">
              სახელი
              <input
                id="profile-first"
                name="given-name"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </label>
            <label htmlFor="profile-last">
              გვარი
              <input
                id="profile-last"
                name="family-name"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </label>
            <label htmlFor="profile-email" className="profile-span">
              ელ-ფოსტა
              <input
                id="profile-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                disabled
              />
            </label>
            <label htmlFor="profile-phone">
              ტელეფონი
              <input
                id="profile-phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="599123456"
                required
              />
            </label>
            <label htmlFor="profile-city">
              ქალაქი
              <input
                id="profile-city"
                name="address-level2"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>
            <label htmlFor="profile-address" className="profile-span">
              მისამართი
              <input
                id="profile-address"
                name="street-address"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>
          </div>
          <button type="submit" className="profile-save" disabled={saving}>
            {saving ? "ინახება..." : t("saveProfile")}
          </button>
          <Link to="/" className="profile-home-link">
            მთავარ გვერდზე
          </Link>
        </form>

        <section className="profile-card profile-orders">
          <h2>{t("myOrders")}</h2>
          {orders.length === 0 && (
            <div className="profile-empty">
              <span aria-hidden>🎮</span>
              <p>შეკვეთები ჯერ არ გაქვს.</p>
              <Link to="/" className="profile-empty-link">
                კოლექციაში გადასვლა
              </Link>
            </div>
          )}
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
                  <Link className="order-btn" to={`/order-success/${order._id}`}>
                    {t("invoice")}
                  </Link>
                  {order.paymentMethod !== "cash" &&
                    order.paymentStatus !== "paid" && (
                      <button
                        type="button"
                        className="order-btn"
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
                  <button
                    type="button"
                    className="order-btn is-ghost"
                    onClick={() => printInvoice(order)}
                  >
                    ამობეჭდვა
                  </button>
                  <button
                    type="button"
                    className="order-btn is-ghost"
                    onClick={() => downloadInvoice(order)}
                  >
                    {t("downloadInvoice")}
                  </button>
                  {canCustomerCancel(order.status) && (
                    <button
                      type="button"
                      className="order-btn is-danger"
                      onClick={() => cancelOrder(order._id)}
                    >
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
