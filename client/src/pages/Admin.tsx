import { useState, useEffect, type CSSProperties } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../services/productService";
import type { IProduct } from "../types";

export default function Admin() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // ფორმის ველები
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("PlayStation");

  // ბანერის ტიპის მართვა რადიო ღილაკებით
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isBanner = bannerType !== "none";
      const finalPrice = isBanner ? 0 : Number(price);
      const finalStock = isBanner ? 1 : Number(stock);
      const finalCategory = isBanner ? bannerType : category;
      const finalIsHero = bannerType === "banner-hero";

      await createProduct({
        title,
        description,
        price: finalPrice,
        stock: finalStock,
        imageUrl,
        category: finalCategory,
        isHeroBanner: finalIsHero,
      });

      // ფორმის გასუფთავება
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

  const isBannerSelected = bannerType !== "none";

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "40px 50px",
        backgroundColor: "#0f172a", // <--- შეცვლილია მუქ ფონზე
        minHeight: "calc(100vh - 130px)",
        color: "#f8fafc",
      }}
    >
      <h1
        style={{ textAlign: "center", color: "#f8fafc", marginBottom: "30px" }}
      >
        🛠️ ადმინ პანელი (CRUD)
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#1e293b", // <--- ფორმის მუქი ფონი
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          marginBottom: "40px",
          border: "1px solid #334155", // <--- მუქი კიდეები (border)
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{ fontSize: "1.4rem", marginBottom: "20px", color: "#f8fafc" }}
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

          {/* ბანერის არჩევის რადიო ღილაკები */}
          <div
            style={{
              background: "#0f172a", // <--- მუქი ფონი შიდა ბლოკისთვის
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #334155",
              width: "100%",
              boxSizing: "border-box",
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
                🚀 მთავარი ბანერი (Hero Banner - თავში)
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
                width: "100%",
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
              width: "100%",
            }}
          >
            დამატება 🚀
          </button>
        </div>
      </form>

      <h2
        style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#f8fafc" }}
      >
        არსებული პროდუქტები და ბანერები ({products.length})
      </h2>

      {loading ? (
        <p style={{ color: "#cbd5e1" }}>იტვირთება...</p>
      ) : (
        <div style={{ display: "grid", gap: "15px", width: "100%" }}>
          {products.map((p) => {
            const isABanner =
              p.category?.startsWith("banner-") || p.isHeroBanner;
            return (
              <div
                key={p._id}
                style={{
                  backgroundColor: "#1e293b", // <--- პროდუქტების სიის ელემენტის მუქი ფონი
                  padding: "15px 20px",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  border: "1px solid #334155",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
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
                        color: "#94a3b8", // <--- შეცვლილი ტექსტის ფერი უკეთესი კითხველობისთვის
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
    </div>
  );
}

// ინპუტების სტილი გადაკეთდა მუქ თემაზე
const inputStyle: CSSProperties = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #475569",
  fontSize: "1rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "#0f172a", // <--- ინპუტების მუქი ფონი
  color: "#ffffff", // <--- აკრეფილი ტექსტი იქნება თეთრი
};
