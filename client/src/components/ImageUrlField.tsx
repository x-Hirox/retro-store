import { useState } from "react";
import API from "../services/api";
import type { IProductColor } from "../types";

export default function ImageUrlField({
  value,
  onChange,
  required = true,
  hint: fallbackHint,
  placeholder,
  allowUrl = false,
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  allowUrl?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setHint("");
    try {
      const body = new FormData();
      body.append("image", file);
      const { data } = await API.post("/uploads", body);
      onChange(data.url);
      setHint("სურათი Cloudinary-ზე აიტვირთა");
    } catch (err: any) {
      setHint(err.response?.data?.message || "ატვირთვა ვერ მოხდა. სცადე თავიდან.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="image-url-field">
      {allowUrl && (
        <input
          type="text"
          placeholder={placeholder || "სურათის ლინკი ან /images/platforms/dsl.png"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required && !value}
        />
      )}
      <label className="image-file-btn">
        {busy
          ? "იტვირთება..."
          : value
            ? "სურათის შეცვლა"
            : "ფოტოს ატვირთვა კომპიუტერიდან"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
          hidden
          disabled={busy}
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.currentTarget.value = "";
          }}
        />
      </label>
      {value && (
        <div className="image-url-preview-wrap">
          <img src={value} alt="" className="image-url-preview" />
          <button type="button" className="image-url-clear" onClick={() => onChange("")}>
            წაშლა
          </button>
        </div>
      )}
      {required && !value && (
        <p className="image-url-hint is-warn">საჭიროა ფოტო — ატვირთე ან ჩასვი ლინკი.</p>
      )}
      <details
        className="image-url-more"
        open={allowUrl || (required && !value) || hint.includes("ვერ")}
      >
        <summary>ან Cloudinary ლინკის ჩასმა</summary>
        <input
          type="text"
          placeholder={placeholder || "https://res.cloudinary.com/..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </details>
      <p className={`image-url-hint${hint.includes("ვერ") ? " is-warn" : ""}`}>
        {hint ||
          fallbackHint ||
          "ფაილი ადის Cloudinary-ზე. თუ ატვირთვა ვერ მოხდა, ჩასვი ლინკი."}
      </p>
    </div>
  );
}

export function GalleryImagesField({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");

  const onFile = async (file?: File) => {
    if (!file) return;
    if (images.length >= 8) {
      setHint("მაქსიმუმ 8 დამატებითი სურათი");
      return;
    }
    setBusy(true);
    setHint("");
    try {
      const body = new FormData();
      body.append("image", file);
      const { data } = await API.post("/uploads", body);
      onChange([...images, data.url]);
      setHint("სურათი Cloudinary-ზე აიტვირთა");
    } catch (err: any) {
      setHint(err.response?.data?.message || "ატვირთვა ვერ მოხდა. სცადე თავიდან.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="image-url-field">
      <p className="image-url-hint">
        დამატებითი სურათები (გვერდი, უკანა მხარე, კომპლექტი). ფაილი ადის
        Cloudinary-ზე — პროდუქტის გვერდზე ქვემოთ thumbs-ად გამოჩნდება.
      </p>
      {images.length > 0 && (
        <div className="gallery-admin">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="gallery-admin-item">
              <img src={url} alt="" />
              <button
                type="button"
                onClick={() =>
                  onChange(images.filter((_, item) => item !== index))
                }
              >
                წაშლა
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="image-file-btn">
        {busy ? "იტვირთება..." : "კიდევ სურათის დამატება"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          disabled={busy || images.length >= 8}
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.currentTarget.value = "";
          }}
        />
      </label>
      {hint && <p className="image-url-hint">{hint}</p>}
    </div>
  );
}

const COLOR_PRESETS: IProductColor[] = [
  { name: "შავი", hex: "#111111" },
  { name: "იასამნისფერი", hex: "#7c3aed" },
  { name: "თეთრი", hex: "#f4f4f5" },
  { name: "ლურჯი", hex: "#2563eb" },
  { name: "წითელი", hex: "#dc2626" },
];

export function ProductColorsField({
  colors,
  onChange,
}: {
  colors: IProductColor[];
  onChange: (colors: IProductColor[]) => void;
}) {
  const add = (preset?: IProductColor) => {
    if (colors.length >= 8) return;
    const name = preset?.name || "";
    if (name && colors.some((item) => item.name === name)) return;
    onChange([
      ...colors,
      { name, hex: preset?.hex || "#111111", imageUrl: "" },
    ]);
  };

  const patch = (index: number, next: Partial<IProductColor>) => {
    onChange(
      colors.map((item, i) => (i === index ? { ...item, ...next } : item)),
    );
  };

  return (
    <div className="color-admin">
      <p className="image-url-hint">
        ერთი მოდელი, სხვადასხვა ფერი — ცალკე პროდუქტი არ დადო. მყიდველი გვერდზე
        აირჩევს შავს ან იასამნისფერს.
      </p>
      <div className="color-admin-presets">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            className="color-admin-preset"
            onClick={() => add(preset)}
          >
            <i style={{ background: preset.hex }} />
            {preset.name}
          </button>
        ))}
        <button type="button" className="color-admin-preset" onClick={() => add()}>
          + სხვა ფერი
        </button>
      </div>
      {colors.map((item, index) => (
        <div key={`${item.name}-${index}`} className="color-admin-row">
          <input
            type="color"
            value={/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(item.hex) ? item.hex : "#111111"}
            onChange={(e) => patch(index, { hex: e.target.value })}
            aria-label="ფერი"
          />
          <input
            type="text"
            placeholder="ფერის სახელი (შავი)"
            value={item.name}
            onChange={(e) => patch(index, { name: e.target.value })}
          />
          <ImageUrlField
            value={item.imageUrl || ""}
            onChange={(url) => patch(index, { imageUrl: url })}
            required={false}
            hint="ამ ფერის მთავარი ფოტო. თუ ცარიელია, საიტი მთავარ სურათს გამოიყენებს."
          />
          <button
            type="button"
            className="image-url-clear"
            onClick={() => onChange(colors.filter((_, i) => i !== index))}
          >
            ფერის წაშლა
          </button>
        </div>
      ))}
    </div>
  );
}
