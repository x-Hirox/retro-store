import { useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";

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
          <div
            key={brand.name}
            onClick={() =>
              navigate(`/category/${encodeURIComponent(brand.name)}`)
            }
            style={{
              cursor: "pointer",
              flexShrink: 0,
              transition:
                "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "scale(1.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
            }}
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
          </div>
        ))}
      </div>
    </div>
  );
}
