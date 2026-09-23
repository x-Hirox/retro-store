import { useEffect, useState } from "react";
import API from "../services/api";
import type { IProduct } from "../types";

export default function Admin() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("1");
  const [loading, setLoading] = useState(false);

  // რედაქტირებისთვის საჭირო ID
  const [editId, setEditId] = useState<string | null>(null);

  // პროდუქტების წამოღება (Read)
  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("პროდუქტების წამოღების შეცდომა:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // დამატება (Create) ან განახლება (Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // თავიდან იცილებს ორმაგ დაკლიკებას
    setLoading(true);

    try {
      const productData = {
        title,
        description,
        price: Number(price),
        imageUrl,
        category,
        stock: Number(stock),
      };

      if (editId) {
        // თუ editId არსებობს, ვანახლებთ (Update)
        await API.put(`/products/${editId}`, productData);
        alert("პროდუქტი წარმატებით განახლდა!");
        setEditId(null);
      } else {
        // თუ არა, ვამატებთ ახალს (Create)
        await API.post("/products", productData);
        alert("პროდუქტი წარმატებით დაემატა!");
      }

      // ფორმის გასუფთავება
      setTitle("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setCategory("");
      setStock("1");
      fetchProducts();
    } catch (error) {
      console.error("შეცდომა ოპერაციისას:", error);
      alert("მოხდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  // არსებული პროდუქტის მონაცემების ფორმაში ჩატვირთვა რედაქტირებისთვის
  const handleEditClick = (p: IProduct) => {
    setEditId(p._id as string);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(String(p.price));
    setImageUrl(p.imageUrl || "");
    setCategory(p.category || "");
    setStock(String(p.stock ?? 1));
  };

  // პროდუქტის წაშლა (Delete)
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("ნამდვილად გსურთ ამ პროდუქტის წაშლა?")) return;
    try {
      await API.delete(`/products/${id}`);
      alert("პროდუქტი წაიშალა!");
      fetchProducts();
    } catch (error) {
      console.error("წაშლის შეცდომა:", error);
      alert("შეცდომა წაშლისას");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px", color: "#2c3e50" }}>
        🛠️ ადმინ პანელი (CRUD)
      </h1>

      {/* პროდუქტის დამატების/განახლების ფორმა */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "40px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h3>
          {editId ? "პროდუქტის რედაქტირება ✍️" : "ახალი პროდუქტის დამატება ➕"}
        </h3>
        <div style={{ display: "grid", gap: "10px", marginTop: "15px" }}>
          <input
            type="text"
            placeholder="სათაური"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="აღწერა"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="ფასი ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="სურათის ლინკი (URL)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="კატეგორია (მაგ: PlayStation, Nintendo...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="მარაგის რაოდენობა (Stock)"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px",
              background: editId ? "#f39c12" : "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "იგზავნება..." : editId ? "განახლება 💾" : "დამატება 🚀"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setTitle("");
                setDescription("");
                setPrice("");
                setImageUrl("");
                setCategory("");
                setStock("1");
              }}
              style={{
                padding: "8px",
                background: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              გაუქმება ❌
            </button>
          )}
        </div>
      </form>

      {/* არსებული პროდუქტების სია (Read, Update, Delete) */}
      <h3>არსებული პროდუქტები ბაზაში ({products.length})</h3>
      <div style={{ marginTop: "20px", display: "grid", gap: "10px" }}>
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "white",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <strong>{p.title}</strong> —{" "}
              <span style={{ color: "#e74c3c" }}>${p.price}</span> (მარაგში:{" "}
              {p.stock})
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleEditClick(p)}
                style={{
                  background: "#3498db",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                შეცვლა ✏️
              </button>
              <button
                onClick={() => handleDeleteProduct(p._id as string)}
                style={{
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                წაშლა 🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
