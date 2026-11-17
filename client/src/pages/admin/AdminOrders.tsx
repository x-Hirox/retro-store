import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import OrderTracker from "../../components/OrderTracker";
import {
  PIPELINE,
  STATUS_COLOR,
  statusLabel,
} from "../../utils/orderStatus";
import { itemPrice, itemTitle, payLabel, payStatusLabel, printInvoice } from "../../utils/invoice";

type AdminOrder = {
  _id: string;
  createdAt?: string;
  status?: string;
  totalPrice?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentProvider?: string;
  trackingCode?: string;
  courierName?: string;
  adminNote?: string;
  statusHistory?: Array<{ status: string; at?: string; note?: string }>;
  user?: {
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    phone?: string;
  };
  orderItems?: Array<{
    title?: string;
    quantity?: number;
    price?: number;
    imageUrl?: string;
    product?: { title?: string; price?: number; imageUrl?: string };
  }>;
};

const FILTERS = ["all", ...PIPELINE, "Cancelled"] as const;

export default function AdminOrders({ initialStatus = "all" }: { initialStatus?: string }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialStatus || "all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async (status = filter, search = q) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (status && status !== "all") params.status = status;
      if (search.trim()) params.q = search.trim();
      const res = await API.get("/orders", { params });
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(initialStatus || "all", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialStatus && initialStatus !== filter) {
      setFilter(initialStatus);
      load(initialStatus, q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStatus]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length };
    for (const order of orders) {
      const key = order.status || "Pending";
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [orders]);

  const save = async (
    id: string,
    body: Record<string, string>,
  ) => {
    setBusy(id);
    try {
      const { data } = await API.put(`/orders/${id}/status`, body);
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...data } : o)));
    } catch {
      alert("სტატუსი ვერ განახლდა");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="ძებნა: სახელი, ტელეფონი, ID, პროდუქტი..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") load(filter, q);
          }}
        />
        <button type="button" className="admin-btn" onClick={() => load(filter, q)}>
          ძებნა
        </button>
        <button type="button" className="admin-btn ghost" onClick={() => load(filter, q)}>
          განახლება
        </button>
      </div>

      <div className="admin-pills">
        {FILTERS.map((id) => (
          <button
            key={id}
            type="button"
            className={filter === id ? "on" : ""}
            onClick={() => {
              setFilter(id);
              load(id, q);
            }}
          >
            {id === "all" ? "ყველა" : statusLabel(id)}
            {filter === "all" && id !== "all" && counts[id] ? ` (${counts[id]})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="admin-muted">იტვირთება...</p>
      ) : orders.length === 0 ? (
        <p className="admin-muted">შეკვეთები არ არის.</p>
      ) : (
        <div className="admin-orders">
          {orders.map((order) => {
            const open = openId === order._id;
            const name =
              order.shippingAddress?.fullName ||
              `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() ||
              order.user?.name ||
              order.user?.email ||
              "უცნობი";
            return (
              <article key={order._id} className="admin-order">
                <header>
                  <div>
                    <strong>#{String(order._id).slice(-8).toUpperCase()}</strong>
                    <p>
                      {name} · {order.shippingAddress?.city || ""} ·{" "}
                      {order.shippingAddress?.phone || order.user?.phone || ""}
                    </p>
                    <small>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("ka-GE")
                        : ""}{" "}
                      · {payLabel(order.paymentMethod)} ·{" "}
                      {payStatusLabel(order.paymentStatus)}
                    </small>
                  </div>
                  <div className="admin-order-money">
                    <b>{Number(order.totalPrice || 0).toFixed(2)} ₾</b>
                    <span
                      className="admin-badge"
                      style={{
                        background: STATUS_COLOR[order.status || "Pending"],
                      }}
                    >
                      {statusLabel(order.status)}
                    </span>
                    <button
                      type="button"
                      className="admin-btn ghost"
                      onClick={() => setOpenId(open ? null : order._id)}
                    >
                      {open ? "დახურვა" : "მართვა"}
                    </button>
                  </div>
                </header>

                <OrderTracker status={order.status} />

                {open && (
                  <div className="admin-order-body">
                    <ul className="admin-items">
                      {(order.orderItems || []).map((item, i) => (
                        <li key={i}>
                          {item.imageUrl || item.product?.imageUrl ? (
                            <img
                              src={item.imageUrl || item.product?.imageUrl}
                              alt=""
                            />
                          ) : null}
                          <span>
                            {itemTitle(item)} × {item.quantity}
                          </span>
                          <b>
                            {(
                              itemPrice(item) * Number(item.quantity || 1)
                            ).toFixed(2)}{" "}
                            ₾
                          </b>
                        </li>
                      ))}
                    </ul>
                    <p className="admin-muted">
                      {order.shippingAddress?.address}
                      {order.user?.email ? ` · ${order.user.email}` : ""}
                    </p>

                    <div className="admin-flow">
                      {PIPELINE.map((step) => (
                        <button
                          key={step}
                          type="button"
                          disabled={busy === order._id}
                          className={order.status === step ? "on" : ""}
                          onClick={() => save(order._id, { status: step })}
                        >
                          {statusLabel(step)}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="danger"
                        disabled={busy === order._id}
                        onClick={() => {
                          if (window.confirm("გაუქმდეს შეკვეთა? მარაგი დაბრუნდება.")) {
                            save(order._id, { status: "Cancelled" });
                          }
                        }}
                      >
                        გაუქმება
                      </button>
                    </div>

                    <div className="admin-grid-2">
                      <label>
                        თრექინგის კოდი
                        <input
                          defaultValue={order.trackingCode || ""}
                          onBlur={(e) => {
                            const value = e.target.value.trim();
                            if (value !== (order.trackingCode || "")) {
                              save(order._id, {
                                status: order.status || "Shipped",
                                trackingCode: value,
                              });
                            }
                          }}
                          placeholder="მაგ: GEO123456"
                        />
                      </label>
                      <label>
                        კურიერი
                        <input
                          defaultValue={order.courierName || ""}
                          onBlur={(e) => {
                            const value = e.target.value.trim();
                            if (value !== (order.courierName || "")) {
                              save(order._id, {
                                status: order.status || "Shipped",
                                courierName: value,
                              });
                            }
                          }}
                          placeholder="მაგ: Wolt / Glovo / საკურიერო"
                        />
                      </label>
                      <label>
                        გადახდა
                        <select
                          value={order.paymentStatus || "unpaid"}
                          onChange={(e) =>
                            save(order._id, {
                              status: order.status || "Pending",
                              paymentStatus: e.target.value,
                            })
                          }
                        >
                          <option value="unpaid">გადაუხდელი</option>
                          <option value="pending">ბანკში მოლოდინში</option>
                          <option value="paid">გადახდილია</option>
                          <option value="failed">ვერ მოხერხდა</option>
                        </select>
                      </label>
                      <label>
                        ადმინის შენიშვნა
                        <input
                          defaultValue={order.adminNote || ""}
                          onBlur={(e) => {
                            const value = e.target.value.trim();
                            if (value !== (order.adminNote || "")) {
                              save(order._id, {
                                status: order.status || "Pending",
                                adminNote: value,
                              });
                            }
                          }}
                          placeholder="მხოლოდ ადმინისთვის"
                        />
                      </label>
                    </div>

                    <div className="admin-actions-row">
                      <button
                        type="button"
                        className="admin-btn ghost"
                        onClick={() => printInvoice(order)}
                      >
                        ინვოისი
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
