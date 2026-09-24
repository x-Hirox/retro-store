import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // თუ ბანერია მონიშნული, ფასი და მარაგი ავტომატურად იყოს 0, რომ შევსება არ მოგთხოვოს
      const finalPrice = isHeroBanner ? 0 : Number(price);
      const finalStock = isHeroBanner ? 1 : Number(stock);
      const finalCategory = isHeroBanner ? "banner-hero" : category;

      await createProduct({
        title,
        description,
        price: finalPrice,
        stock: finalStock,
        imageUrl,
        category: finalCategory,
        isHeroBanner,
      });

      // ფორმის გასუფთავება
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("");
      setImageUrl("");
      setCategory("PlayStation");
      setIsHeroBanner(false);

      // სიის განახლება
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

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
      <h1
        style={{ textAlign: "center", color: "#2c3e50", marginBottom: "30px" }}
      >
        🛠️ ადმინ პანელი (CRUD)
      </h1>

      {/* პროდუქტის / ბანერის დამატების ფორმა */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          marginBottom: "40px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h2
          style={{ fontSize: "1.4rem", marginBottom: "20px", color: "#1e293b" }}
        >
          ახალი პროდუქტის ან ბანერის დამატება ➕
        </h2>

        <div style={{ display: "grid", gap: "15px" }}>
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

          {/* თუ ბანერია, ფასი და მარაგი არ არის სავალდებულო */}
          {!isHeroBanner && (
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
                required={!isHeroBanner}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="მარაგი (რაოდენობა)"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required={!isHeroBanner}
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

          {!isHeroBanner && (
            <input
              type="text"
              placeholder="კატეგორია (მაგ: PlayStation, Nintendo...)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={inputStyle}
            />
          )}

          {/* ბანერის ჩექბოქსი */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "5px",
            }}
          >
            <input
              type="checkbox"
              id="heroCheck"
              checked={isHeroBanner}
              onChange={(e) => setIsHeroBanner(e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            <label
              htmlFor="heroCheck"
              style={{ cursor: "pointer", fontWeight: "600", color: "#334155" }}
            >
              ⭐ მონიშვნა როგორც მთავარი ბანერი (Hero Banner)
            </label>
          </div>

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
              transition: "background 0.2s",
            }}
          >
            დამატება 🚀
          </button>
        </div>
      </form>

      {/* არსებული პროდუქტების სია */}
      <h2
        style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#2c3e50" }}
      >
        არსებული პროდუქტები და ბანერები ({products.length})
      </h2>

      {loading ? (
        <p>იტვირთება...</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                backgroundColor: "#fff",
                padding: "15px 20px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                border: "1px solid #e2e8f0",
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
                  <h4 style={{ margin: "0 0 5px 0", color: "#1e293b" }}>
                    {p.title} {p.isHeroBanner && "⭐ [ბანერი]"}
                  </h4>
                  <p
                    style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}
                  >
                    {p.isHeroBanner
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
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "1rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box" as const,
};
