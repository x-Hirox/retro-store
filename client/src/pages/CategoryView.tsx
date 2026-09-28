import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import type { IProduct } from "../types";

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
  xbox: [
    {
      name: "Xbox",
      slug: "xbox",
      image:
        "https://images.unsplash.com/photo-1605901309584-818e2596098f?w=400",
    },
  ],
  sega: [
    {
      name: "Sega Genesis",
      slug: "sega-genesis",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    },
  ],
  "chinese consoles": [
    {
      name: "Anbernic",
      slug: "anbernic",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    },
  ],
  bundles: [],
  "atari & more": [],
};

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
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        paddingBottom: "80px",
        transition: "all 0.3s ease",
      }}
    >
      {/* უკან დაბრუნების ღილაკი */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "var(--bg)",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "transparent",
            color: "#a855f7",
            border: "2px solid #a855f7",
            padding: "10px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            letterSpacing: "1px",
            boxShadow: "0 0 15px rgba(168, 85, 247, 0.25)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#a855f7";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.boxShadow =
              "0 0 25px rgba(168, 85, 247, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#a855f7";
            e.currentTarget.style.boxShadow =
              "0 0 15px rgba(168, 85, 247, 0.25)";
          }}
        >
          ← მთავარ გვერდზე დაბრუნება
        </button>
      </div>

      {/* სრულეკრანიანი რეტრო-ფუტურისტული ბანერი (Hero Banner) */}
      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(236, 72, 153, 0.12) 50%, rgba(59, 130, 246, 0.1) 100%)",
          padding: "70px 20px",
          textAlign: "center",
          overflow: "hidden",
          borderBottom: "2px solid rgba(168, 85, 247, 0.3)",
          boxShadow: "inset 0 0 40px rgba(168, 85, 247, 0.1)",
        }}
      >
        {/* ფონური დეკორატიული ელემენტი (რეტრო ბზინვარება) */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(0,0,0,0) 70%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              background: "rgba(168, 85, 247, 0.15)",
              color: "#a855f7",
              borderRadius: "20px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              letterSpacing: "2px",
              marginBottom: "15px",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              textTransform: "uppercase",
            }}
          >
            Retro Universe 🎮
          </span>

          <h1
            style={{
              color: "var(--text-h)",
              marginBottom: "35px",
              textTransform: "uppercase",
              fontSize: "3rem",
              letterSpacing: "4px",
              fontWeight: "900",
              textShadow: "0 0 25px rgba(168, 85, 247, 0.4)",
            }}
          >
            {sub ? `${sub} — ${platform}` : platform}
          </h1>
        </div>

        {/* υπο-категории / ბარათები ბანერის შიგნით */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
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
                    backgroundColor: "var(--bg)",
                    borderRadius: "16px",
                    width: "170px",
                    padding: "16px",
                    cursor: "pointer",
                    boxShadow: isHovered
                      ? "0 15px 35px rgba(168, 85, 247, 0.45), 0 0 20px rgba(236, 72, 153, 0.3)"
                      : "0 6px 20px rgba(0, 0, 0, 0.12)",
                    transform: isHovered
                      ? "translateY(-8px) scale(1.04)"
                      : "translateY(0)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    textAlign: "center",
                    border: isHovered
                      ? "2px solid #a855f7"
                      : "1px solid rgba(168, 85, 247, 0.3)",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "110px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "12px",
                    }}
                  />
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: "var(--text-h)",
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </h4>
                </div>
              );
            })}

          {sub &&
            productTypes.map((item) => {
              const isHovered = hoveredCard === item.slug;
              return (
                <div
                  key={item.slug}
                  onMouseEnter={() => setHoveredCard(item.slug)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    backgroundColor: "var(--bg)",
                    borderRadius: "16px",
                    width: "170px",
                    padding: "16px",
                    cursor: "pointer",
                    boxShadow: isHovered
                      ? "0 15px 35px rgba(168, 85, 247, 0.45), 0 0 20px rgba(236, 72, 153, 0.3)"
                      : "0 6px 20px rgba(0, 0, 0, 0.12)",
                    transform: isHovered
                      ? "translateY(-8px) scale(1.04)"
                      : "translateY(0)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    textAlign: "center",
                    border: isHovered
                      ? "2px solid #a855f7"
                      : "1px solid rgba(168, 85, 247, 0.3)",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "110px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "12px",
                    }}
                  />
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: "var(--text-h)",
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

      {/* პროდუქტების სია */}
      <div
        style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}
      >
        <h2
          style={{
            color: "var(--text-h)",
            marginBottom: "30px",
            fontSize: "1.8rem",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ color: "#a855f7" }}>📂</span> პროდუქტების სია{" "}
          <span style={{ fontSize: "1.2rem", color: "#a855f7" }}>
            ({filteredProducts.length})
          </span>
        </h2>

        {loading ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--text)",
              fontSize: "1.2rem",
              padding: "40px",
            }}
          >
            იტვირთება რეტრო სამყარო... ✨
          </p>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
              backgroundColor: "rgba(168, 85, 247, 0.04)",
              borderRadius: "20px",
              border: "1px dashed rgba(168, 85, 247, 0.3)",
            }}
          >
            <p
              style={{
                color: "var(--text)",
                fontSize: "1.2rem",
                fontWeight: "500",
              }}
            >
              ამ კატეგორიაში პროდუქტები ჯერ არ მოიძებნა.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "28px",
            }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                style={{
                  backgroundColor: "var(--bg)",
                  borderRadius: "18px",
                  padding: "16px",
                  cursor: "pointer",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(168, 85, 247, 0.35), 0 0 20px rgba(236, 72, 153, 0.2)";
                  e.currentTarget.style.borderColor = "#a855f7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.2)";
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  style={{
                    width: "100%",
                    height: "190px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
                <h3
                  style={{
                    fontSize: "1.1rem",
                    margin: "14px 0 10px",
                    color: "var(--text-h)",
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
                      color: "#a855f7",
                      fontWeight: "800",
                      fontSize: "1.35rem",
                      textShadow: "0 0 10px rgba(168, 85, 247, 0.3)",
                    }}
                  >
                    {product.price} ₾
                  </span>
                  <button
                    style={{
                      background:
                        "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(168, 85, 247, 0.4)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.95";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "scale(1)";
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
