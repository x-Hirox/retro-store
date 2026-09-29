import { useState, useEffect, type CSSProperties } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../services/productService";
import type { IProduct } from "../types";
import API from "../services/api"; // 🟢 ვიყენებთ საერთო გამართულ API ინსტანსს

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
  };
  items: Array<{
    product: { title: string; price: number };
    quantity: number;
  }>;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("PlayStation");
  const [bannerType, setBannerType] = useState<
    "none" | "banner-hero" | "banner-middle" | "banner-bottom"
  >("none");

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("ვერ მოხერხდა პროდუქტების წამოღება", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // 🟢 შეკვეთების წამოღება API ინსტანსის გამოყენებით
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await API.get("/orders");
      setOrders(response.data);
    } catch (err) {
      console.error("შეკვეთების წამოღება ვერ მოხერხდა", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTabChange = (tab: "products" | "orders") => {
    setActiveTab(tab);
    if (tab === "orders" && orders.length === 0) {
      fetchOrders();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isBanner = bannerType !== "none";
      await createProduct({
        title,
        description,
        price: isBanner ? 0 : Number(price),
        stock: isBanner ? 1 : Number(stock),
        imageUrl,
        category: isBanner ? bannerType : category,
        isHeroBanner: bannerType === "banner-hero",
      });

      setTitle("");
      setDescription("");
      setPrice("");
      setStock("");
      setImageUrl("");
      setCategory("PlayStation");
      setBannerType("none");

      fetchProducts();
      alert("წარმატებით დაემატა!");
    } catch (err) {
      console.error("დამატების შეცდომა:", err);
      alert("ვერ მოხერხდა დამატება");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("ნამდვილად გსურთ წაშლა?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        console.error("წაშლის შეცდომა:", err);
      }
    }
  };

  // 🟢 შეკვეთის სტატუსის განახლება API ინსტანსის გამოყენებით
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await API.put(`/orders/${id}/status`, { status: newStatus });
      setOrders(
        orders.map((o) => (o._id === id ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      alert("სტატუსის შეცვლა ვერ მოხერხდა");
    }
  };

  const isBannerSelected = bannerType !== "none";

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "40px 50px",
        backgroundColor: "#0f172a",
        minHeight: "calc(100vh - 130px)",
        color: "#f8fafc",
      }}
    >
      <h1
        style={{ textAlign: "center", color: "#f8fafc", marginBottom: "20px" }}
      >
        🛡️ ადმინისტრატორის პანელი
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => handleTabChange("products")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: activeTab === "products" ? "#10b981" : "#1e293b",
            color: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          📦 პროდუქტები და ბანერები
        </button>
        <button
          onClick={() => handleTabChange("orders")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: activeTab === "orders" ? "#10b981" : "#1e293b",
            color: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          📋 შეკვეთების მართვა
        </button>
      </div>

      {activeTab === "products" && (
        <>
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "#1e293b",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              marginBottom: "40px",
              border: "1px solid #334155",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <h2
              style={{
                fontSize: "1.4rem",
                marginBottom: "20px",
                color: "#f8fafc",
              }}
            >
              ახალი პროდუქტის ან ბანერის დამატება ➕
            </h2>

            <div style={{ display: "grid", gap: "15px", width: "100%" }}>
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
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />

              <div
                style={{
                  background: "#0f172a",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: "bold",
                    color: "#e2e8f0",
                  }}
                >
                  ⭐ ელემენტის ტიპი:
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    color: "#cbd5e1",
                  }}
                >
                  <label
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="radio"
                      name="bannerTypeGroup"
                      checked={bannerType === "none"}
                      onChange={() => setBannerType("none")}
                    />
                    📦 ჩვეულებრივი პროდუქტი
                  </label>
                  <label
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="radio"
                      name="bannerTypeGroup"
                      checked={bannerType === "banner-hero"}
                      onChange={() => setBannerType("banner-hero")}
                    />
                    🚀 მთავარი ბანერი (Hero Banner)
                  </label>
                  <label
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="radio"
                      name="bannerTypeGroup"
                      checked={bannerType === "banner-middle"}
                      onChange={() => setBannerType("banner-middle")}
                    />
                    ⭐ შუა ბანერი (Middle Banner)
                  </label>
                  <label
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="radio"
                      name="bannerTypeGroup"
                      checked={bannerType === "banner-bottom"}
                      onChange={() => setBannerType("banner-bottom")}
                    />
                    🔻 ქვედა ბანერი (Bottom Banner)
                  </label>
                </div>
              </div>

              {!isBannerSelected && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                  }}
                >
                  <input
                    type="number"
                    placeholder="ფასი (₾)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required={!isBannerSelected}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    placeholder="მარაგი (რაოდენობა)"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required={!isBannerSelected}
                    style={inputStyle}
                  />
                </div>
              )}

              <input
                type="text"
                placeholder="სურათის ლინკი (URL)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                style={inputStyle}
              />

              {!isBannerSelected && (
                <input
                  type="text"
                  placeholder="კატეგორია (მაგ: PlayStation, Nintendo...)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required={!isBannerSelected}
                  style={inputStyle}
                />
              )}

              <button
                type="submit"
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  marginTop: "10px",
                }}
              >
                დამატება 🚀
              </button>
            </div>
          </form>

          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "20px",
              color: "#f8fafc",
            }}
          >
            არსებული პროდუქტები და ბანერები ({products.length})
          </h2>

          {loadingProducts ? (
            <p style={{ color: "#cbd5e1" }}>იტვირთება...</p>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {products.map((p) => {
                const isABanner =
                  p.category?.startsWith("banner-") || p.isHeroBanner;
                return (
                  <div
                    key={p._id}
                    style={{
                      backgroundColor: "#1e293b",
                      padding: "15px 20px",
                      borderRadius: "10px",
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
                        gap: "15px",
                      }}
                    >
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      )}
                      <div>
                        <h4 style={{ margin: "0 0 5px 0", color: "#f8fafc" }}>
                          {p.title} {isABanner && `⭐ [${p.category}]`}
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            color: "#94a3b8",
                            fontSize: "0.9rem",
                          }}
                        >
                          {isABanner
                            ? "სარეკლამო ბანერი"
                            : `ფასი: ${p.price} ₾ | მარაგი: ${p.stock}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      წაშლა
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === "orders" && (
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "20px",
              color: "#f8fafc",
            }}
          >
            შემოსული შეკვეთები ({orders.length})
          </h2>

          {loadingOrders ? (
            <p style={{ color: "#cbd5e1" }}>იტვირთება შეკვეთები...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: "#cbd5e1" }}>
              შეკვეთები ჯერ არ არის ფიქსირებული.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#1e293b",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: "1px solid #334155",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#0f172a",
                      textAlign: "left",
                      borderBottom: "1px solid #334155",
                      color: "#94a3b8",
                    }}
                  >
                    <th style={{ padding: "12px" }}>შეკვეთის ID</th>
                    <th style={{ padding: "12px" }}>მომხმარებელი</th>
                    <th style={{ padding: "12px" }}>თანხა</th>
                    <th style={{ padding: "12px" }}>თარიღი</th>
                    <th style={{ padding: "12px" }}>სტატუსი</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      style={{ borderBottom: "1px solid #334155" }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          fontSize: "13px",
                          color: "#cbd5e1",
                        }}
                      >
                        {order._id}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {order.shippingAddress ? (
                          <div>
                            <strong style={{ color: "#f8fafc" }}>
                              {order.shippingAddress.fullName}
                            </strong>
                            <br />
                            <span
                              style={{ fontSize: "12px", color: "#94a3b8" }}
                            >
                              {order.shippingAddress.phone} (
                              {order.shippingAddress.city})
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>
                            მონაცემები არ არის
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: "bold",
                          color: "#10b981",
                        }}
                      >
                        {order.totalAmount} ₾
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          fontSize: "13px",
                          color: "#cbd5e1",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <select
                          value={order.status || "მუშავდება"}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #475569",
                            backgroundColor: "#0f172a",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          <option value="მუშავდება">მუშავდება</option>
                          <option value="გაგზავნილია">გაგზავნილია</option>
                          <option value="დასრულებულია">დასრულებულია</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #475569",
  fontSize: "1rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "#0f172a",
  color: "#ffffff",
};
