import { useEffect, useState } from "react";
import API from "../../services/api";
import { statusLabel, STATUS_COLOR, PIPELINE } from "../../utils/orderStatus";

type Stats = {
  byStatus: Record<string, { count: number; total: number }>;
  allCount: number;
  paidRevenue: number;
  outstanding: number;
  soldOutCount: number;
  productCount: number;
  lowStock: Array<{
    _id: string;
    title: string;
    stock: number;
    price: number;
    imageUrl?: string;
  }>;
  recent: Array<{
    _id: string;
    status: string;
    totalPrice: number;
    paymentStatus?: string;
    createdAt?: string;
    shippingAddress?: { fullName?: string };
    user?: { email?: string; firstName?: string; name?: string };
  }>;
};

export default function AdminDashboard({
  onOpenOrders,
}: {
  onOpenOrders: (status?: string) => void;
}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/orders/stats")
      .then((res) => setStats(res.data))
      .catch(async () => {
        try {
          const { data } = await API.get("/orders");
          const byStatus: Stats["byStatus"] = {};
          let paidRevenue = 0;
          let outstanding = 0;
          for (const order of data as Stats["recent"]) {
            const key = order.status || "Pending";
            if (!byStatus[key]) byStatus[key] = { count: 0, total: 0 };
            byStatus[key].count += 1;
            byStatus[key].total += Number(order.totalPrice || 0);
            if (order.paymentStatus === "paid") paidRevenue += Number(order.totalPrice || 0);
            else outstanding += Number(order.totalPrice || 0);
          }
          setStats({
            byStatus,
            allCount: data.length,
            paidRevenue,
            outstanding,
            soldOutCount: 0,
            productCount: 0,
            lowStock: [],
            recent: data.slice(0, 8),
          });
        } catch {
          setError("სტატისტიკა ვერ ჩაიტვირთა");
        }
      });
  }, []);

  if (error) return <p className="admin-muted">{error}</p>;
  if (!stats) return <p className="admin-muted">იტვირთება...</p>;

  const kpis = [
    { label: "შეკვეთები", value: String(stats.allCount), sub: "სულ" },
    {
      label: "გადახდილი",
      value: `${Number(stats.paidRevenue).toFixed(0)} ₾`,
      sub: "შემოსავალი",
    },
    {
      label: "გადასახდელი",
      value: `${Number(stats.outstanding).toFixed(0)} ₾`,
      sub: "კურიერი / ბანკი",
    },
    {
      label: "SOLD / დაბალი მარაგი",
      value: `${stats.soldOutCount} / ${stats.lowStock.length}`,
      sub: `${stats.productCount} პროდუქტი`,
    },
  ];

  return (
    <div className="admin-dash">
      <div className="admin-kpis">
        {kpis.map((k) => (
          <article key={k.label} className="admin-kpi">
            <span>{k.label}</span>
            <strong>{k.value}</strong>
            <small>{k.sub}</small>
          </article>
        ))}
      </div>

      <h3>შეკვეთების პროცესი</h3>
      <div className="admin-status-grid">
        {PIPELINE.map((status) => {
          const row = stats.byStatus[status] || { count: 0, total: 0 };
          return (
            <button
              key={status}
              type="button"
              className="admin-status-card"
              style={{ borderColor: STATUS_COLOR[status] }}
              onClick={() => onOpenOrders(status)}
            >
              <b style={{ color: STATUS_COLOR[status] }}>{statusLabel(status)}</b>
              <strong>{row.count}</strong>
              <small>{row.total.toFixed(0)} ₾</small>
            </button>
          );
        })}
        <button
          type="button"
          className="admin-status-card"
          style={{ borderColor: STATUS_COLOR.Cancelled }}
          onClick={() => onOpenOrders("Cancelled")}
        >
          <b style={{ color: STATUS_COLOR.Cancelled }}>გაუქმდა</b>
          <strong>{stats.byStatus.Cancelled?.count || 0}</strong>
        </button>
      </div>

      <div className="admin-split">
        <section>
          <h3>ბოლო შეკვეთები</h3>
          <div className="admin-mini-list">
            {stats.recent.map((order) => (
              <div key={order._id} className="admin-mini">
                <div>
                  <strong>#{String(order._id).slice(-8).toUpperCase()}</strong>
                  <p>
                    {order.shippingAddress?.fullName ||
                      order.user?.firstName ||
                      order.user?.email ||
                      "მყიდველი"}
                  </p>
                </div>
                <div className="admin-mini-right">
                  <span style={{ color: STATUS_COLOR[order.status] }}>
                    {statusLabel(order.status)}
                  </span>
                  <b>{Number(order.totalPrice).toFixed(2)} ₾</b>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3>დაბალი მარაგი</h3>
          <div className="admin-mini-list">
            {stats.lowStock.length === 0 && (
              <p className="admin-muted">მარაგი საკმარისია.</p>
            )}
            {stats.lowStock.slice(0, 10).map((p) => (
              <div key={p._id} className="admin-mini">
                <div>
                  <strong>{p.title}</strong>
                  <p>{p.price} ₾</p>
                </div>
                <b className={p.stock <= 0 ? "sold" : "low"}>
                  {p.stock <= 0 ? "SOLD" : `დარჩა ${p.stock}`}
                </b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
