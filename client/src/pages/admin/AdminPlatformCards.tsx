import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import ImageUrlField from "../../components/ImageUrlField";
import {
  createContent,
  deleteContent,
  getPlatformCards,
  updateContent,
} from "../../services/contentService";
import type { IPlatformCard } from "../../types";
import {
  PLATFORM_BRANDS,
  brandLabel,
  slugFromName,
} from "../../utils/platformCatalog";
import { setPlatformImageFallback } from "../../utils/platformPlaceholder";

const inputStyle: CSSProperties = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#fff",
  width: "100%",
  boxSizing: "border-box",
};

type FormState = {
  brand: string;
  name: string;
  slug: string;
  imageUrl: string;
};

const emptyForm: FormState = {
  brand: "playstation",
  name: "",
  slug: "",
  imageUrl: "",
};

export default function AdminPlatformCards() {
  const [items, setItems] = useState<IPlatformCard[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getPlatformCards();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const list =
      filter === "all"
        ? items
        : items.filter((item) => item.brand.toLowerCase() === filter);
    const byBrand = new Map<string, IPlatformCard[]>();
    for (const item of list) {
      const key = item.brand.toLowerCase();
      const bucket = byBrand.get(key) || [];
      bucket.push(item);
      byBrand.set(key, bucket);
    }
    const brandRank = (brand: string) => {
      const index = PLATFORM_BRANDS.findIndex((item) => item.value === brand);
      return index === -1 ? 99 : index;
    };
    return Array.from(byBrand.entries()).sort(
      (a, b) => brandRank(a[0]) - brandRank(b[0]),
    );
  }, [items, filter]);

  const reset = () => {
    setForm(emptyForm);
    setSlugTouched(false);
    setEditingId(null);
    setError("");
    setSaving(false);
  };

  const onName = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : slugFromName(name),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const name = form.name.trim();
    const slug = (form.slug || slugFromName(name)).trim().toLowerCase();
    const brand = form.brand.trim().toLowerCase();
    if (!name) {
      setError("ჩაწერე პლატფორმის დასახელება.");
      return;
    }
    if (!slug) {
      setError("slug აკლია.");
      return;
    }
    if (!form.imageUrl.trim()) {
      setError("ატვირთე სურათი ან ჩასვი Cloudinary ლინკი.");
      return;
    }
    setError("");
    setSaving(true);
    const payload = {
      brand,
      name,
      slug,
      imageUrl: form.imageUrl.trim(),
      order: editingId
        ? items.find((item) => item._id === editingId)?.order ?? items.length
        : items.filter((item) => item.brand.toLowerCase() === brand).length,
    };
    try {
      if (editingId) {
        await updateContent("platform-cards", editingId, payload);
      } else {
        await createContent("platform-cards", payload);
      }
      reset();
      await load();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "შენახვა ვერ მოხერხდა");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: IPlatformCard) => {
    setEditingId(item._id);
    setSlugTouched(true);
    setForm({
      brand: item.brand.toLowerCase(),
      name: item.name,
      slug: item.slug,
      imageUrl: item.imageUrl,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item: IPlatformCard) => {
    if (!window.confirm(`წავშალოთ ${item.name}?`)) return;
    try {
      await deleteContent("platform-cards", item._id);
      if (editingId === item._id) reset();
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="admin-form-grid" noValidate>
        <p className="admin-muted" style={{ margin: 0 }}>
          კატეგორიის ქარდები ჩანს მენიუში, კატეგორიის გვერდზე და ფილტრში.
          URL რჩება /category/PlayStation/{form.slug || "ps4"}.
        </p>
        <select
          value={form.brand}
          onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
          required
          style={inputStyle}
        >
          {PLATFORM_BRANDS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="პლატფორმის დასახელება (მაგ. Nintendo Switch)"
          value={form.name}
          onChange={(e) => onName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="slug, მაგ: switch, ps4, xbox360"
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setForm((prev) => ({ ...prev, slug: e.target.value }));
          }}
          required
          style={inputStyle}
        />
        <ImageUrlField
          value={form.imageUrl}
          onChange={(imageUrl) => setForm((prev) => ({ ...prev, imageUrl }))}
          allowUrl
          hint="PNG, JPG, WebP, SVG ან GIF — ფაილი ადის Cloudinary-ზე, ან ჩასვი ლინკი."
          placeholder="https://res.cloudinary.com/... ან /ps1.svg"
        />
        {error && <p className="admin-form-error">{error}</p>}
        <div className="admin-row-actions">
          <button type="submit" className="admin-btn primary" disabled={saving}>
            {saving
              ? "ინახება..."
              : editingId
                ? "პლატფორმის შენახვა"
                : "პლატფორმის დამატება"}
          </button>
          {editingId && (
            <button type="button" className="admin-btn ghost" onClick={reset}>
              გაუქმება
            </button>
          )}
        </div>
      </form>

      <div className="admin-toolbar" style={{ marginTop: 20 }}>
        <h3 style={{ margin: 0 }}>არსებული პლატფორმები ({items.length})</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ ...inputStyle, width: 220 }}
        >
          <option value="all">ყველა კატეგორია</option>
          {PLATFORM_BRANDS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="admin-muted">იტვირთება...</p>
      ) : (
        grouped.map(([brand, cards]) => (
          <div key={brand} className="admin-platform-group">
            <h4 className="admin-platform-group-title">{brandLabel(brand)}</h4>
            <div className="admin-product-list">
              {cards
                .slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((item) => (
                  <div key={item._id} className="admin-product-row">
                    <div className="admin-product-info">
                      <img
                        src={item.imageUrl}
                        alt=""
                        onError={(event) =>
                          setPlatformImageFallback(event.currentTarget)
                        }
                      />
                      <div>
                        <h4>{item.name}</h4>
                        <p>
                          {brandLabel(item.brand)} · /{item.slug}
                        </p>
                      </div>
                    </div>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn warn"
                        onClick={() => handleEdit(item)}
                      >
                        რედაქტირება
                      </button>
                      <button
                        type="button"
                        className="admin-btn danger"
                        onClick={() => handleDelete(item)}
                      >
                        წაშლა
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
