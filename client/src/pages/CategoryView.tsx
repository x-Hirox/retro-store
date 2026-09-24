import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { IProduct } from "../types";

// ქვეკატეგორიების სტრუქტურა პლატფორმების მიხედვით
const subCategoriesMap: Record<
  string,
  { name: string; slug: string; image: string }[]
> = {
  playstation: [
    {
      name: "PlayStation 1",
      slug: "ps1",
      image:
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    },
    {
      name: "PlayStation 2",
      slug: "ps2",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    },
    {
      name: "PlayStation 3",
      slug: "ps3",
      image:
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400",
    },
    {
      name: "PlayStation 4",
      slug: "ps4",
      image:
        "https://images.unsplash.com/photo-1605901309584-818e2596098f?w=400",
    },
    {
      name: "PlayStation 5",
      slug: "ps5",
      image:
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    },
    {
      name: "PlayStation Portable",
      slug: "psp",
      image:
        "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=400",
    },
    {
      name: "PlayStation Vita",
      slug: "psvita",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    },
  ],
  nintendo: [
    {
      name: "Nintendo NES",
      slug: "nes",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    },
    {
      name: "Nintendo 64",
      slug: "n64",
      image:
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    },
    {
      name: "Nintendo Switch",
      slug: "switch",
      image:
        "https://images.unsplash.com/photo-1578303512597-81e6cc155b12?w=400",
    },
  ],
};

// შიდა ქვეკატეგორიები
const productTypes = [
  {
    name: "თამაშები",
    slug: "games",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400",
  },
  {
    name: "კონსოლები",
    slug: "consoles",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
  },
  {
    name: "აქსესუარები",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400",
  },
  {
    name: "კომპლექტები",
    slug: "bundle",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
  },
];

export default function CategoryView() {
  const { platform, sub } = useParams<{ platform: string; sub?: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // ნაგულისხმევად მუქი იასამნისფერი რეტრო ნეონი
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [platform, sub]);

  // რეტრო ნეონის თემების პლალიტრა
  const theme = {
    bg: isDarkMode ? "#0d061a" : "#f8f9fa",
    headerBg: isDarkMode
      ? "linear-gradient(135deg, #1e1b4b 0%, #3b0764 100%)"
      : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    cardBg: isDarkMode ? "#171026" : "#ffffff",
    textColor: isDarkMode ? "#f3e8ff" : "#1e293b",
    subText: isDarkMode ? "#cbd5e1" : "#64748b",
    accentPurple: "#c084fc",
    accentBlue: "#38bdf8",
    accentPink: "#ec4899",
    border: isDarkMode ? "#4c1d95" : "#e2e8f0",
    neonGlow: isDarkMode
      ? "0 0 15px rgba(192, 132, 252, 0.4), inset 0 0 10px rgba(56, 189, 248, 0.2)"
      : "0 4px 6px rgba(0,0,0,0.1)",
    cardHoverGlow: isDarkMode
      ? "0 0 25px rgba(236, 72, 153, 0.7), 0 0 10px rgba(192, 132, 252, 0.8)"
      : "0 10px 20px rgba(0,0,0,0.15)",
  };

  const currentSubCategories = platform
    ? subCategoriesMap[platform.toLowerCase()] || []
    : [];

  const filteredProducts = products.filter((p) => {
    if (platform && p.category?.toLowerCase() !== platform.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.bg,
        color: theme.textColor,
        paddingBottom: "60px",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* ფერის შეცვლის / თემის გადამრთველი ღილაკი ზედა კუთხეში */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 40px",
          backgroundColor: isDarkMode ? "#130926" : "#ffffff",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "transparent",
            color: theme.accentBlue,
            border: `1px solid ${theme.accentBlue}`,
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: isDarkMode ? "0 0 10px rgba(56, 189, 248, 0.4)" : "none",
          }}
        >
          ← მთავარ გვერდზე დაბრუნება
        </button>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            backgroundColor: theme.accentPurple,
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 0 15px rgba(192, 132, 252, 0.6)",
          }}
        >
          {isDarkMode ? "☀️ ღია რეჟიმი" : "🟣 მუქი იასამნისფერი (რეტრო)"}
        </button>
      </div>

      {/* 1. ზედა ნეონური ზონა (პლატფორმების და ქვეკატეგორიების არჩევანი) */}
      <div
        style={{
          background: theme.headerBg,
          padding: "40px 20px",
          textAlign: "center",
          boxShadow: isDarkMode ? "0 10px 30px rgba(15, 5, 30, 0.8)" : "none",
          borderBottom: `2px solid ${theme.accentPurple}`,
        }}
      >
        <h1
          style={{
            color: theme.textColor,
            marginBottom: "30px",
            textTransform: "uppercase",
            fontSize: "2.2rem",
            letterSpacing: "2px",
            textShadow: isDarkMode
              ? "0 0 10px #c084fc, 0 0 20px #38bdf8, 0 0 30px #ec4899"
              : "none",
          }}
        >
          {sub ? `${sub} - ${platform}` : platform}
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* მოდელები (PS1, PS2...) */}
          {!sub &&
            currentSubCategories.map((item) => {
              const isHovered = hoveredCard === item.slug;
              return (
                <div
                  key={item.slug}
                  onMouseEnter={() => setHoveredCard(item.slug)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(`/category/${platform}/${item.slug}`)}
                  style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: "14px",
                    width: "160px",
                    padding: "15px",
                    cursor: "pointer",
                    boxShadow: isHovered ? theme.cardHoverGlow : theme.neonGlow,
                    transform: isHovered
                      ? "translateY(-8px) scale(1.03)"
                      : "translateY(0)",
                    transition: "all 0.3s ease-in-out",
                    textAlign: "center",
                    border: `1px solid ${isHovered ? theme.accentPink : theme.border}`,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: theme.textColor,
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </h4>
                </div>
              );
            })}

          {/* შიდა ტიპები (Games, Consoles...) */}
          {sub &&
            productTypes.map((item) => {
              const isHovered = hoveredCard === item.slug;
              return (
                <div
                  key={item.slug}
                  onMouseEnter={() => setHoveredCard(item.slug)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: "14px",
                    width: "170px",
                    padding: "15px",
                    cursor: "pointer",
                    boxShadow: isHovered ? theme.cardHoverGlow : theme.neonGlow,
                    transform: isHovered
                      ? "translateY(-8px) scale(1.03)"
                      : "translateY(0)",
                    transition: "all 0.3s ease-in-out",
                    textAlign: "center",
                    border: `1px solid ${isHovered ? theme.accentPink : theme.border}`,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: theme.textColor,
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </h4>
                </div>
              );
            })}
        </div>
      </div>

      {/* 2. პროდუქტების სია */}
      <div
        style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}
      >
        <h2
          style={{
            color: theme.textColor,
            marginBottom: "25px",
            fontSize: "1.6rem",
            textShadow: isDarkMode
              ? "0 0 10px rgba(192, 132, 252, 0.6)"
              : "none",
          }}
        >
          📂 პროდუქტების სია ({filteredProducts.length})
        </h2>

        {loading ? (
          <p
            style={{
              textAlign: "center",
              color: theme.subText,
              fontSize: "1.2rem",
            }}
          >
            იტვირთება რეტრო მონაცემები...
          </p>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: theme.cardBg,
              borderRadius: "12px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <p style={{ color: theme.subText, fontSize: "1.1rem" }}>
              ამ კატეგორიაში პროდუქტები არ მოიძებნა.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: "14px",
                  padding: "15px",
                  cursor: "pointer",
                  border: `1px solid ${theme.border}`,
                  boxShadow: isDarkMode
                    ? "0 4px 20px rgba(13, 6, 26, 0.8)"
                    : "0 2px 5px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? "0 0 20px rgba(192, 132, 252, 0.6)"
                    : "0 8px 15px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? "0 4px 20px rgba(13, 6, 26, 0.8)"
                    : "0 2px 5px rgba(0,0,0,0.05)";
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                <h3
                  style={{
                    fontSize: "1.1rem",
                    margin: "12px 0 8px",
                    color: theme.textColor,
                    fontWeight: "bold",
                  }}
                >
                  {product.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: theme.accentPurple,
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      textShadow: isDarkMode
                        ? "0 0 8px rgba(192, 132, 252, 0.5)"
                        : "none",
                    }}
                  >
                    {product.price} ₾
                  </span>
                  <button
                    style={{
                      backgroundColor: theme.accentPink,
                      color: "#ffffff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 0 10px rgba(236, 72, 153, 0.5)",
                    }}
                  >
                    დეტალები
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
