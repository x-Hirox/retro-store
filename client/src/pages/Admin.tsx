import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/productService";
import type { IProduct, IProductColor } from "../types";
import AdminContent from "./AdminContent";
import ImageUrlField, {
  GalleryImagesField,
  ProductColorsField,
} from "../components/ImageUrlField";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminCustomers from "./admin/AdminCustomers";
import SeoHead from "../components/SeoHead";
import { parseTags, productSearchText } from "../utils/tags";
import { totalStock } from "../utils/productColors";

type Tab = "overview" | "orders" | "products" | "customers" | "content";

const CATEGORY_OPTIONS = [
  "Nintendo",
  "PlayStation",
  "Xbox",
  "Sega",
  "Chinese Consoles",
  "Bundles",
  "Atari & More",
];

const PLATFORM_OPTIONS = [
  "Nintendo DS Lite",
  "Nintendo DSi",
  "Nintendo 3DS",
  "Nintendo DS",
  "Game Boy Advance",
  "Nintendo Switch",
  "Nintendo NES",
  "Super Nintendo (SNES)",
  "Nintendo 64",
  "Nintendo GameCube",
  "Nintendo Wii",
  "Nintendo Wii U",
  "PlayStation 1",
  "PlayStation 2",
  "PlayStation 3",
  "PlayStation 4",
  "PlayStation 5",
  "PlayStation Portable",
  "PlayStation Vita",
  "Original Xbox",
  "Xbox 360",
  "Xbox One",
  "Sega Genesis",
  "Sega Saturn",
  "Sega Dreamcast",
  "R36S",
  "Anbernic",
  "Miyoo Mini",
  "PowKiddy",
  "Retroid Pocket",
];

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
  const [tags, setTags] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [colors, setColors] = useState<IProductColor[]>([]);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

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
    const missing = !title.trim()
      ? "სათაური აკლია."
      : !description.trim()
        ? "აღწერა აკლია."
        : !imageUrl.trim()
          ? "მთავარი ფოტო აკლია — ატვირთე ფაილი ან ჩასვი Cloudinary ლინკი."
          : !isHeroBanner && !platform
            ? "აირჩიე პლატფორმა."
          : !isHeroBanner && !price
            ? "ჩაწერე ფასი."
            : !isHeroBanner &&
                colors.filter((item) => item.name.trim()).length === 0 &&
                stock === ""
              ? "ჩაწერე მარაგი, ან დაამატე ფერები და თითოზე ცალი."
              : "";
    if (missing) {
      setFormError(missing);
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      const namedColors = isHeroBanner
        ? []
        : colors.filter((item) => item.name.trim());
      const stockFromColors = namedColors.reduce(
        (sum, item) => sum + Math.max(0, Number(item.stock) || 0),
        0,
      );
      const productData = {
        title,
        description,
        price: isHeroBanner ? 0 : Number(price),
        discount: isHeroBanner ? 0 : Number(discount) || 0,
        stock: isHeroBanner
          ? 1
          : namedColors.length
            ? stockFromColors
            : Number(stock),
        imageUrl,
        images: isHeroBanner ? [] : images,
        colors: namedColors,
        category: isHeroBanner ? "banner-hero" : category,
        isHeroBanner,
        platform: isHeroBanner ? "" : platform,
        genre: isHeroBanner ? "" : genre,
        tags: isHeroBanner ? [] : parseTags(tags),
        isBestSeller: isHeroBanner ? false : isBestSeller,
      };

      if (editingId) {
        await updateProduct(editingId, productData);
      } else {
        await createProduct(productData as Omit<IProduct, "_id">);
      }

      resetForm();
      fetchProducts();
    } catch (err: unknown) {
      console.error("ოპერაციის შეცდომა:", err);
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setFormError(
        axiosErr.response?.data?.message || "მოქმედება ვერ შესრულდა",
      );
    } finally {
      setSaving(false);
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
    setTags((p.tags || []).join(", "));
    setIsBestSeller(!!p.isBestSeller);
    setColors(p.colors || []);
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
    setTags("");
    setIsBestSeller(false);
    setColors([]);
    setFormError("");
    setSaving(false);
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
      const hay = productSearchText(p);
      if (productQ && !hay.includes(productQ.toLowerCase())) return false;
      const left = totalStock(p);
      if (stockFilter === "sold" && (p.isHeroBanner || left > 0)) return false;
      if (stockFilter === "low" && (p.isHeroBanner || left > 3 || left <= 0))
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
      <SeoHead title="ადმინი" description="RetroBit ადმინი." path="/admin" noindex />
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
            noValidate
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
                  {colors.filter((item) => item.name.trim()).length > 0 ? (
                    <p className="admin-muted" style={{ margin: 0 }}>
                      სულ მარაგი:{" "}
                      {colors
                        .filter((item) => item.name.trim())
                        .reduce(
                          (sum, item) => sum + Math.max(0, Number(item.stock) || 0),
                          0,
                        )}{" "}
                      ცალი — რაოდენობა თითო ფერზე ქვემოთ.
                    </p>
                  ) : (
                    <input
                      type="number"
                      placeholder="მარაგი"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      min={0}
                      style={inputStyle}
                    />
                  )}
                </div>
              )}

              <p className="admin-muted" style={{ margin: 0 }}>
                {isHeroBanner
                  ? "ბანერის სურათი Cloudinary-ზე ადის ამ ფორმიდან — აირჩიე ფაილი."
                  : "მთავარი ფოტო კვადრატული უნდა იყოს (1:1, მაგ. 1200×1200 JPG/WebP). ფართო ბანერი ბარათზე და გვერდზე ცარიელ ადგილს ტოვებს."}
              </p>
              <ImageUrlField
                value={imageUrl}
                onChange={setImageUrl}
                hint="მთავარი ფოტო — კვადრატი 1:1 (1200×1200). ფაილი ადის Cloudinary-ზე."
              />
              {!isHeroBanner && (
                <>
                  <GalleryImagesField images={images} onChange={setImages} />
                  <ProductColorsField colors={colors} onChange={setColors} />
                </>
              )}

              {!isHeroBanner && (
                <>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={inputStyle}
                  >
                    {(CATEGORY_OPTIONS.includes(category)
                      ? CATEGORY_OPTIONS
                      : [category, ...CATEGORY_OPTIONS]
                    ).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    required
                    style={inputStyle}
                  >
                    <option value="">პლატფორმა (DS Lite, DSi, 3DS, PS2...)</option>
                    {(PLATFORM_OPTIONS.includes(platform)
                      ? PLATFORM_OPTIONS
                      : platform
                        ? [platform, ...PLATFORM_OPTIONS]
                        : PLATFORM_OPTIONS
                    ).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="ჟანრი (მაგ: ექშენი, რბოლა, RPG)"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="თეგები: R36S, handheld, საჩუქარი"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    style={inputStyle}
                  />
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                    />
                    ყველაზე გაყიდვადებში გამოჩენა
                  </label>
                </>
              )}

              {formError && <p className="admin-form-error">{formError}</p>}
              <button type="submit" className="admin-btn primary" disabled={saving}>
                {saving
                  ? "ინახება..."
                  : editingId
                    ? "ცვლილებების შენახვა"
                    : "დამატება"}
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
                              totalStock(p) <= 0
                                ? "SOLD"
                                : `მარაგი ${totalStock(p)}`
                            }${p.platform ? ` · ${p.platform}` : ""}${
                              p.colors?.length
                                ? ` · ${p.colors
                                    .map((c) => {
                                      const qty = Number(c.stock) || 0;
                                      const extra =
                                        c.price
                                          ? ` ${c.price}₾`
                                          : c.discount != null
                                            ? ` −${c.discount}%`
                                            : "";
                                      return `${c.name} ${qty}${extra}`;
                                    })
                                    .join(", ")}`
                                : ""
                            }`}
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
