import { useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import HoloCard from "./HoloCard";

export default function BrandsSection() {
  const navigate = useNavigate();
  const { t } = useLang();

  const brands = [
    { name: "Nintendo", src: "/nintendo.svg", height: "46px" },
    { name: "PlayStation", src: "/playstation.svg", height: "40px" },
    { name: "Xbox", src: "/xbox.svg", height: "36px" },
    { name: "Sega", src: "/sega.svg", height: "35px" },
    { name: "Atari & More", src: "/atari.svg", height: "38px" },
  ];

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
        className="ny-title"
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
            key={brand.name}
            className="brand-crt"
            onClick={() =>
              navigate(`/category/${encodeURIComponent(brand.name)}`)
            }
          >
            <img
              src={brand.src}
              alt={brand.name}
              style={{
                height: brand.height,
                width: "auto",
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
