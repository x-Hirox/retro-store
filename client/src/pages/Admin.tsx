import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/productService";
import type { IProduct } from "../types";
import AdminContent from "./AdminContent";
import ImageUrlField, { GalleryImagesField } from "../components/ImageUrlField";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminCustomers from "./admin/AdminCustomers";

type Tab = "overview" | "orders" | "products" | "customers" | "content";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [orderFilter, setOrderFilter] = useState("all");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [productQ, setProductQ] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "sold">("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState("PlayStation");
  const [isHeroBanner, setIsHeroBanner] = useState(false);
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);

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
        images: isHeroBanner ? [] : images,
        category: isHeroBanner ? "banner-hero" : category,
        isHeroBanner,
        platform: isHeroBanner ? "" : platform,
        genre: isHeroBanner ? "" : genre,
        isBestSeller: isHeroBanner ? false : isBestSeller,
      };

      if (editingId) {
        await updateProduct(editingId, productData);
      } else {
        await createProduct(productData as Omit<IProduct, "_id">);
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
    setImages(p.images || []);
    setCategory(p.category || "PlayStation");
    setIsHeroBanner(!!p.isHeroBanner);
    setPlatform(p.platform || "");
    setGenre(p.genre || "");
    setIsBestSeller(!!p.isBestSeller);
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
    setImages([]);
    setCategory("PlayStation");
    setIsHeroBanner(false);
    setPlatform("");
    setGenre("");
    setIsBestSeller(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("ნამდვილად გსურთ წაშლა?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => String(p._id) !== String(id)));
    } catch (err) {
      console.error("წაშლის შეცდომა:", err);
    }
  };

  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      const hay = `${p.title} ${p.category} ${p.platform} ${p.genre}`.toLowerCase();
      if (productQ && !hay.includes(productQ.toLowerCase())) return false;
      if (stockFilter === "sold" && (p.isHeroBanner || (p.stock ?? 0) > 0)) return false;
      if (stockFilter === "low" && (p.isHeroBanner || (p.stock ?? 0) > 3 || (p.stock ?? 0) <= 0))
        return false;
      return true;
    });
  }, [products, productQ, stockFilter]);

  const tabs: [Tab, string][] = [
    ["overview", "მიმოხილვა"],
    ["orders", "შეკვეთები"],
    ["products", "პროდუქტები"],
    ["customers", "მომხმარებლები"],
    ["content", "საიტის კონტენტი"],
  ];

  return (
    <div className="admin-shell">
      <header className="admin-head">
        <div>
          <h1>RetroBit ადმინი</h1>
          <p>პროდუქტები, მარაგი, შეკვეთების პროცესი და კლიენტები — ერთი პანელიდან.</p>
        </div>
        <Link to="/" className="admin-btn ghost">
          საიტზე დაბრუნება
        </Link>
      </header>

      <nav className="admin-tabs">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={activeTab === id ? "on" : ""}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" && (
        <AdminDashboard
          onOpenOrders={(status) => {
            setOrderFilter(status || "all");
            setActiveTab("orders");
          }}
        />
      )}

      {activeTab === "orders" && <AdminOrders initialStatus={orderFilter} />}

      {activeTab === "customers" && <AdminCustomers />}

      {activeTab === "content" && <AdminContent />}

      {activeTab === "products" && (
        <>
          <form
            onSubmit={handleSubmit}
            className="admin-form"
            style={{ borderColor: editingId ? "#f59e0b" : "#334155" }}
          >
            <div className="admin-form-head">
              <h3 style={{ color: editingId ? "#f59e0b" : "#38bdf8" }}>
                {editingId
                  ? "პროდუქტის რედაქტირება"
                  : "ახალი პროდუქტი ან მთავარი ბანერი"}
              </h3>
              {editingId && (
                <button type="button" className="admin-btn ghost" onClick={resetForm}>
                  გაუქმება
                </button>
              )}
            </div>

            <div className="admin-form-grid">
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

              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={isHeroBanner}
                  onChange={(e) => setIsHeroBanner(e.target.checked)}
                />
                ეს არის მთავარი საიტის ბანერი (Hero Banner)
              </label>

              {!isHeroBanner && (
                <div className="admin-grid-3">
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
                    placeholder="ფასდაკლება %"
                    min={0}
                    max={90}
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
                    min={0}
                    style={inputStyle}
                  />
                </div>
              )}

              <ImageUrlField
                value={imageUrl}
                onChange={setImageUrl}
                placeholder="მთავარი სურათის Cloudinary ლინკი"
              />
              {!isHeroBanner && (
                <GalleryImagesField images={images} onChange={setImages} />
              )}

              {!isHeroBanner && (
                <>
                  <input
                    type="text"
                    placeholder="კატეგორია (მაგ: Nintendo, Sega, PlayStation)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="პლატფორმა / ქვეკატეგორია (მაგ: PS2, NES, Switch)"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="ჟანრი (მაგ: ექშენი, რბოლა, RPG)"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    style={inputStyle}
                  />
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                    />
                    ბესტსელერებში გამოჩენა
                  </label>
                  <p className="admin-muted">
                    სურათი ატვირთე Cloudinary-ზე ამ ფორმიდან. მარაგი ყიდვისას
                    თავისით იკლებს; გაუქმებისას ბრუნდება.
                  </p>
                </>
              )}

              <button type="submit" className="admin-btn primary">
                {editingId ? "ცვლილებების შენახვა" : "დამატება"}
              </button>
            </div>
          </form>

          <div className="admin-toolbar">
            <h3 style={{ margin: 0 }}>პროდუქტები ({visibleProducts.length})</h3>
            <input
              className="admin-search"
              placeholder="ძებნა სათაურით / პლატფორმით"
              value={productQ}
              onChange={(e) => setProductQ(e.target.value)}
            />
            <div className="admin-pills">
              {(
                [
                  ["all", "ყველა"],
                  ["low", "დაბალი მარაგი"],
                  ["sold", "SOLD"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={stockFilter === id ? "on" : ""}
                  onClick={() => setStockFilter(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="admin-muted">იტვირთება...</p>
          ) : (
            <div className="admin-product-list">
              {visibleProducts.map((p) => (
                <div key={String(p._id)} className="admin-product-row">
                  <div className="admin-product-info">
                    {p.imageUrl && <img src={p.imageUrl} alt="" />}
                    <div>
                      <h4>
                        {p.title} {p.isHeroBanner && " [ბანერი]"}
                      </h4>
                      <p>
                        {p.isHeroBanner
                          ? "სარეკლამო ბანერი"
                          : `${p.price} ₾ ${p.discount ? `(−${p.discount}%)` : ""} · ${
                              (p.stock ?? 0) <= 0
                                ? "SOLD"
                                : `მარაგი ${p.stock}`
                            }${p.platform ? ` · ${p.platform}` : ""}`}
                      </p>
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-btn warn"
                      onClick={() => handleEditClick(p)}
                    >
                      რედაქტირება
                    </button>
                    <button
                      type="button"
                      className="admin-btn danger"
                      onClick={() => handleDelete(String(p._id))}
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
