import { useState, useEffect, type CSSProperties } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/productService";
import type { IProduct } from "../types";
import API from "../services/api";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // რედაქტირებისთვის საჭირო სთეითი
  const [editingId, setEditingId] = useState<string | null>(null);

  // ფორმის სთეითები
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("PlayStation");
  const [isHeroBanner, setIsHeroBanner] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("ვერ მოხერხდა პროდუქტების წამოღება", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("შეკვეთების წამოღება ვერ მოხერხდა", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        title,
        description,
        price: isHeroBanner ? 0 : Number(price),
        discount: isHeroBanner ? 0 : Number(discount) || 0,
        stock: isHeroBanner ? 1 : Number(stock),
        imageUrl,
        category: isHeroBanner ? "banner-hero" : category,
        isHeroBanner,
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        alert("წარმატებით განახლდა! ✏️");
      } else {
        await createProduct(productData as any);
        alert("წარმატებით დაემატა! 🚀");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("ოპერაციის შეცდომა:", err);
      alert("მოქმედება ვერ შესრულდა");
    }
  };

  const handleEditClick = (p: IProduct) => {
    setEditingId(String(p._id || ""));
    setTitle(p.title || "");
    setDescription(p.description || "");
    setPrice(p.price !== undefined && p.price !== null ? String(p.price) : "");
    setDiscount(
      p.discount !== undefined && p.discount !== null ? String(p.discount) : "",
    );
    setStock(p.stock !== undefined && p.stock !== null ? String(p.stock) : "");
    setImageUrl(p.imageUrl || "");
    setCategory(p.category || "PlayStation");
    setIsHeroBanner(!!p.isHeroBanner);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setDiscount("");
    setStock("");
    setImageUrl("");
    setCategory("PlayStation");
    setIsHeroBanner(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("ნამდვილად გსურთ წაშლა?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => String(p._id) !== String(id)));
      } catch (err) {
        console.error("წაშლის შეცდომა:", err);
      }
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        🛡️ RetroBit ადმინ პანელი (CRUD)
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => setActiveTab("products")}
          style={{
            padding: "10px 20px",
            background: activeTab === "products" ? "#10b981" : "#1e293b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📦 პროდუქტები და ბანერი
        </button>
        <button
          onClick={() => {
            setActiveTab("orders");
            if (orders.length === 0) fetchOrders();
          }}
          style={{
            padding: "10px 20px",
            background: activeTab === "orders" ? "#10b981" : "#1e293b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📋 შეკვეთები
        </button>
      </div>

      {activeTab === "products" && (
        <>
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "40px",
              border: editingId ? "2px solid #f59e0b" : "1px solid #334155",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3
                style={{ margin: 0, color: editingId ? "#f59e0b" : "#38bdf8" }}
              >
                {editingId
                  ? "✏️ პროდუქტის რედაქტირება"
                  : "➕ ახალი პროდუქტის ან მთავარი ბანერის დამატება"}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: "#64748b",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  გაუქმება
                </button>
              )}
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              <input
                type="text"
                placeholder="სათაური"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={inputStyle}
              />
              <textarea
                placeholder="აღწერა"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: "#cbd5e1",
                }}
              >
                <input
                  type="checkbox"
                  checked={isHeroBanner}
                  onChange={(e) => setIsHeroBanner(e.target.checked)}
                />
                ⭐ ეს არის მთავარი საიტის ბანერი (Hero Banner)
              </label>

              {!isHeroBanner && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "10px",
                  }}
                >
                  <input
                    type="number"
                    placeholder="ფასი (₾)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    placeholder="ფასდაკლება % (სეილი)"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    placeholder="მარაგი"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
              )}

              <input
                type="text"
                placeholder="სურათის/ვიდეოს URL ლინკი"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                style={inputStyle}
              />

              {!isHeroBanner && (
                <input
                  type="text"
                  placeholder="კატეგორია (მაგ: Nintendo, Sega, PlayStation)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={inputStyle}
                />
              )}

              <button
                type="submit"
                style={{
                  background: editingId ? "#f59e0b" : "#10b981",
                  color: "#fff",
                  border: "none",
                  padding: "12px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                {editingId ? "ცვლილებების შენახვა 💾" : "დამატება 🚀"}
              </button>
            </div>
          </form>

          <h3 style={{ marginBottom: "15px" }}>
            არსებული პროდუქტები ({products.length})
          </h3>
          {loading ? (
            <p>იტვირთება...</p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {products.map((p) => (
                <div
                  key={String(p._id)}
                  style={{
                    background: "#1e293b",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt=""
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                    <div>
                      <h4 style={{ margin: 0 }}>
                        {p.title} {p.isHeroBanner && " ⭐ [მთავარი ბანერი]"}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "#94a3b8",
                        }}
                      >
                        {p.isHeroBanner
                          ? "სარეკლამო ბანერი"
                          : `ფასი: ${p.price} ₾ ${p.discount ? `(სეილი: -${p.discount}%)` : ""} | მარაგი: ${p.stock}`}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEditClick(p)}
                      style={{
                        background: "#f59e0b",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      რედაქტირება
                    </button>
                    <button
                      onClick={() => handleDelete(String(p._id))}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      წაშლა
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "orders" && (
        <div>
          <h3 style={{ marginBottom: "15px" }}>
            შემოსული შეკვეთები ({orders.length})
          </h3>
          {loadingOrders ? (
            <p>იტვირთება...</p>
          ) : orders.length === 0 ? (
            <p>შეკვეთები არ არის.</p>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {orders.map((order, index) => (
                <div
                  key={order._id || index}
                  style={{
                    background: "#1e293b",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ color: "#38bdf8", fontWeight: "bold" }}>
                      შეკვეთის ID: {order._id}
                    </span>
                    <span style={{ color: "#10b981", fontWeight: "bold" }}>
                      სულ თანხა: {order.totalAmount || order.totalPrice || 0} ₾
                    </span>
                  </div>
                  <p style={{ margin: "5px 0", color: "#cbd5e1" }}>
                    <strong>მომხმარებელი:</strong>{" "}
                    {order.fullName ||
                      order.shippingAddress?.fullName ||
                      order.customerName ||
                      order.user?.name ||
                      order.user?.email ||
                      "უცნობი"}
                  </p>
                  <p style={{ margin: "5px 0", color: "#cbd5e1" }}>
                    <strong>ქალაქი / მისამართი:</strong>{" "}
                    {order.shippingAddress?.city || order.city || ""},{" "}
                    {order.shippingAddress?.address || order.address || ""}
                  </p>
                  <p style={{ margin: "5px 0", color: "#cbd5e1" }}>
                    <strong>ტელეფონი:</strong>{" "}
                    {order.shippingAddress?.phone || order.phone || ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#fff",
  width: "100%",
  boxSizing: "border-box",
};
