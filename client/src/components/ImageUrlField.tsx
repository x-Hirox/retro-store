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
