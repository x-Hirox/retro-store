import { useNavigate } from "react-router-dom";

export default function CategoriesSection() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "სტაციონარული კონსოლები",
      desc: "აიმაღლე თამაშის ხარისხი ლეგენდარული კონსოლებით. პროფესიონალურად განახლებული.",
      path: "/category/playstation",
      // სუფთა, თანაბარი ლურჯი ფონი (მუქი გადასვლების გარეშე)
      background: "#2563eb",
      shadow: "rgba(37, 99, 235, 0.25)",
      hoverShadow: "rgba(37, 99, 235, 0.4)",
      imagePath: "/images/console1.png",
      gridSpan: "span 6",
    },
    {
      title: "ხელის კონსოლები",
      desc: "იქონიე შენი საყვარელი თამაშები თან. შემოწმებული და სანდო.",
      path: "/category/nintendo",
      // სუფთა, თანაბარი იისფერი
      background: "#7c3aed",
      shadow: "rgba(124, 58, 237, 0.25)",
      hoverShadow: "rgba(124, 58, 237, 0.4)",
      imagePath: "/images/console2.png",
      gridSpan: "span 3",
    },
    {
      title: "თამაშები",
      desc: "მარადიული კლასიკიდან იშვიათ მარგალიტებამდე. გაწმენდილი და შემოწმებული.",
      path: "/category/sega",
      // სუფთა, თანაბარი მწვანე
      background: "#059669",
      shadow: "rgba(5, 150, 105, 0.25)",
      hoverShadow: "rgba(5, 150, 105, 0.4)",
      imagePath: "/images/games.png",
      gridSpan: "span 3",
    },
    {
      title: "აქსესუარები",
      desc: "ყველაფერი შენი კონსოლებისთვის – ჯოისტიკები, კაბელები და დამტენები.",
      path: "/category/accessories",
      // სუფთა, თანაბარი წითელი
      background: "#dc2626",
      shadow: "rgba(220, 38, 38, 0.25)",
      hoverShadow: "rgba(220, 38, 38, 0.4)",
      imagePath: "/images/accessories.png",
      gridSpan: "span 4",
    },
    {
      title: "პროდუქტების ბუნდლები",
      desc: "მოიგე მეტი შეფუთული ნაკრებებით: კონსოლები, თამაშები და აქსესუარები ერთად.",
      path: "/category/bundles",
      // სუფთა, თანაბარი ყავისფერი/ოქროსფერი
      background: "#b45309",
      shadow: "rgba(180, 83, 9, 0.25)",
      hoverShadow: "rgba(180, 83, 9, 0.4)",
      imagePath: "/images/bundles.png",
      gridSpan: "span 8",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1400px",
        margin: "50px auto 0",
        padding: "0 30px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          color: "var(--text-h)",
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "2.2rem",
          fontFamily: "'Noto Serif Georgian', serif",
          fontWeight: "900",
          letterSpacing: "1.5px",
        }}
      >
        მოძებნე კატეგორიის მიხედვით
      </h2>

      {/* 12-სვეტიანი ზუსტი ბადე */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "24px",
        }}
      >
        {categories.map((cat, index) => {
          const isWide = index === 0 || index === 4;

          return (
            <div
              key={cat.title}
              onClick={() => navigate(cat.path)}
              style={{
                background: cat.background, // სუფთა ფონი ყოველგვარი მუქი ზოლების და გრადიენტების გარეშე
                borderRadius: "24px",
                padding: "40px",
                cursor: "pointer",
                color: "#fff",
                minHeight: "260px",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 10px 25px ${cat.shadow}`,
                transition: "all 0.3s ease",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gridColumn: cat.gridSpan,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 15px 30px ${cat.hoverShadow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 10px 25px ${cat.shadow}`;
              }}
            >
              {/* ტექსტური ნაწილი მარცხნივ */}
              <div style={{ zIndex: 2, maxWidth: isWide ? "55%" : "50%" }}>
                <h3
                  style={{
                    fontSize: isWide ? "1.9rem" : "1.5rem",
                    fontWeight: "900",
                    marginBottom: "12px",
                    fontFamily: "'Noto Serif Georgian', serif",
                    letterSpacing: "0.5px",
                    lineHeight: "1.2",
                  }}
                >
                  {cat.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.92rem",
                    opacity: "0.92",
                    lineHeight: "1.5",
                    fontWeight: "500",
                  }}
                >
                  {cat.desc}
                </p>
              </div>

              {/* სურათი მარჯვენა მხარეს */}
              {cat.imagePath && (
                <div
                  style={{
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={cat.imagePath}
                    alt={cat.title}
                    style={{
                      maxHeight: isWide ? "180px" : "140px",
                      maxWidth: isWide ? "260px" : "140px",
                      objectFit: "contain",
                      pointerEvents: "none",
                    }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
