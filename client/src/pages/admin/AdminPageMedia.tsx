import { useEffect, useState } from "react";
import ImageUrlField from "../../components/ImageUrlField";
import { getPageMedia, updateContent } from "../../services/contentService";
import type { IPageMedia } from "../../types";
import { onPageMediaError } from "../../utils/pageMedia";

export default function AdminPageMedia() {
  const [items, setItems] = useState<IPageMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [hint, setHint] = useState("");

  const load = async () => {
    try {
      const data = await getPageMedia();
      setItems(data);
      setError("");
    } catch {
      setItems([]);
      setError(
        "სურათების სია ვერ ჩაიტვირთა. Render-ზე backend უნდა განახლდეს (/api/content/page-media).",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (item: IPageMedia, imageUrl: string) => {
    if (imageUrl === item.imageUrl) return;
    setSavingId(item._id);
    setHint("");
    try {
      await updateContent("page-media", item._id, { imageUrl });
      await load();
      setHint(`${item.title} — შეინახა`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setHint(axiosErr.response?.data?.message || "შენახვა ვერ მოხერხდა");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="admin-form admin-page-media">
      <div className="admin-form-head">
        <h3 style={{ color: "#38bdf8" }}>
          მთავარი გვერდის სექციები და /sell სურათები
        </h3>
      </div>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        აქ იცვლება mosaic ქარდები (კონსოლები, ხელის კონსოლები, თამაშები,
        აქსესუარები) და /sell გვერდის ორი სურათი. PNG, JPG, WebP, SVG ან GIF —
        ატვირთე კომპიუტერიდან ან ჩასვი Cloudinary ლინკი.
      </p>
      {hint && <p className="admin-muted">{hint}</p>}
      {error && <p className="admin-form-error">{error}</p>}
      {loading ? (
        <p className="admin-muted">იტვირთება...</p>
      ) : (
        <div className="admin-product-list">
          {items.map((item) => (
            <div key={item._id} className="admin-product-row admin-page-media-row">
              <div className="admin-product-info">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    onError={(event) =>
                      onPageMediaError(event.currentTarget, item.key)
                    }
                  />
                ) : null}
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.key}</p>
                </div>
              </div>
              <div className="admin-page-media-upload">
                <ImageUrlField
                  required={false}
                  allowUrl
                  value={item.imageUrl}
                  onChange={(imageUrl) => save(item, imageUrl)}
                  hint={
                    savingId === item._id
                      ? "ინახება..."
                      : "ატვირთე ან ჩასვი ლინკი — ავტომატურად შეინახება."
                  }
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
