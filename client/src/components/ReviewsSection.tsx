import { useEffect, useState } from "react";
import { getReviews } from "../services/contentService";
import type { IReview } from "../types";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<IReview[]>([]);

  useEffect(() => {
    getReviews()
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  if (!reviews.length) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--code-bg)",
        padding: "50px 20px",
        marginTop: "50px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "10px",
            color: "var(--text-h)",
            textTransform: "none",
          }}
        >
          რას ამბობენ ჩვენი მომხმარებლები
        </h2>
        <p style={{ color: "var(--text)", marginBottom: "30px" }}>
          ათასობით კმაყოფილი გეიმერი საქართველოში
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            textAlign: "left",
          }}
        >
          {reviews.map((item) => (
            <div
              key={item._id}
              style={{
                backgroundColor: "var(--bg)",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "1.8rem", color: "var(--text)", marginBottom: 8 }}>
                “
              </div>
              <p style={{ fontSize: "0.95rem", marginBottom: "15px", color: "var(--text)" }}>
                {item.text}
              </p>
              <div style={{ color: "#f59e0b", marginBottom: "12px" }}>
                {"★".repeat(item.stars || 5)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {item.avatarUrl ? (
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#334155",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <strong style={{ color: "var(--text-h)" }}>{item.name}</strong>
                  {item.verified && (
                    <div style={{ fontSize: "0.75rem", color: "var(--text)" }}>
                      დადასტურებული მყიდველი
                    </div>
                  )}
                </div>
                {item.productImageUrl && (
                  <img
                    src={item.productImageUrl}
                    alt=""
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginLeft: "auto",
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
