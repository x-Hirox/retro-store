import { useEffect, useState } from "react";
import API from "../../services/api";

type Customer = {
  _id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  address?: string;
  role?: string;
  isVerified?: boolean;
  createdAt?: string;
};

export default function AdminCustomers() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/auth/users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const hay = `${u.email} ${u.name} ${u.firstName} ${u.lastName} ${u.phone} ${u.city}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div>
      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="მომხმარებლის ძებნა..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="admin-muted">{filtered.length} ანგარიში</span>
      </div>
      {loading ? (
        <p className="admin-muted">იტვირთება...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>სახელი</th>
                <th>ელ-ფოსტა</th>
                <th>ტელეფონი</th>
                <th>ქალაქი</th>
                <th>როლი</th>
                <th>რეგისტრაცია</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    {`${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                      u.name ||
                      "—"}
                    {!u.isVerified && (
                      <small className="admin-muted"> · არააქტიური</small>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td>{u.city || "—"}</td>
                  <td>{u.role === "admin" ? "ადმინი" : "კლიენტი"}</td>
                  <td>
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("ka-GE")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
