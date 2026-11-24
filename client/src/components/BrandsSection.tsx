import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { getBrands } from "../services/contentService";
import type { IBrand } from "../types";
import HoloCard from "./HoloCard";

const FALLBACK_BRANDS: IBrand[] = [
  { _id: "nintendo", name: "Nintendo", slug: "Nintendo", imageUrl: "/nintendo.svg", order: 0 },
  {
    _id: "playstation",
    name: "PlayStation",
    slug: "PlayStation",
    imageUrl: "/playstation.svg",
    order: 1,
  },
  { _id: "xbox", name: "Xbox", slug: "Xbox", imageUrl: "/xbox.svg", order: 2 },
  { _id: "sega", name: "Sega", slug: "Sega", imageUrl: "/sega.svg", order: 3 },
];

function brandPath(slug: string) {
  const value = String(slug || "").trim();
  if (!value) return "/";
  if (value.startsWith("/")) return value;
  return `/category/${encodeURIComponent(value)}`;
}

export default function BrandsSection() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [brands, setBrands] = useState<IBrand[]>(FALLBACK_BRANDS);

  useEffect(() => {
    getBrands()
      .then((data) => {
        if (data?.length) setBrands(data);
      })
      .catch(() => setBrands(FALLBACK_BRANDS));
  }, []);

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at center, #15151c 0%, #070709 100%)",
        padding: "50px 20px",
        borderTop: "2px solid #222",
        borderBottom: "2px solid #222",
        marginTop: "60px",
        marginBottom: "40px",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)",
        overflowX: "hidden",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h2
        className="section-title"
        style={{
          textAlign: "center",
          marginBottom: "35px",
          color: "#fff",
          fontSize: "clamp(1.25rem, 4vw, 2rem)",
          letterSpacing: "2.5px",
          fontWeight: "900",
          fontFamily: "'Noto Serif Georgian', serif",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.7)",
        }}
      >
        {t("shopByBrand")}
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
          maxWidth: "1250px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {brands.map((brand) => (
          <HoloCard
            key={brand._id || brand.slug}
            className="brand-crt"
            onClick={() => navigate(brandPath(brand.slug || brand.name))}
          >
            <img
              src={brand.imageUrl}
              alt={brand.name}
              style={{
                height: 40,
                width: "auto",
                maxWidth: 160,
                objectFit: "contain",
                display: "block",
              }}
            />
          </HoloCard>
        ))}
      </div>
    </div>
  );
}
