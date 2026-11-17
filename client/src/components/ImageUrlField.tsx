import { useState } from "react";
import API from "../services/api";

export default function ImageUrlField({
  value,
  onChange,
  placeholder = "სურათის Cloudinary ლინკი",
  required = true,
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
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
      setHint(
        err.response?.data?.message ||
          "ატვირთვა ვერ მოხდა — ჩასვი Cloudinary-ის ლინკი.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="image-url-field">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      <label className="image-file-btn">
        {busy ? "იტვირთება..." : "ფაილის არჩევა"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          disabled={busy}
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
      {value && (
        <img src={value} alt="" className="image-url-preview" />
      )}
      <p className="image-url-hint">
        {hint ||
          "ლაივ საიტისთვის სურათი Cloudinary-ზე უნდა იყოს, არა შენს კომპიუტერში."}
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
      setHint("სურათი Cloudinary-ზე აიტვირთა და ბაზაში ლინკად შეინახება");
    } catch (err: any) {
      setHint(
        err.response?.data?.message ||
          "ატვირთვა ვერ მოხდა — ჩასვი Cloudinary-ის ლინკი.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="image-url-field">
      <p className="image-url-hint">
        დამატებითი სურათები. ფაილი ადის Cloudinary-ზე, საიტი ინახავს მხოლოდ
        ლინკს — კომპიუტერი რომ გაფუჭდეს, სურათები საიტზე რჩება.
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
