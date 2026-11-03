import { useEffect, useState } from "react";
import { getFaqs } from "../services/contentService";
import type { IFaq } from "../types";

export default function FaqSection() {
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    getFaqs()
      .then(setFaqs)
      .catch(() => setFaqs([]));
  }, []);

  if (!faqs.length) return null;

  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "0 20px" }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "2rem",
          marginBottom: "30px",
          color: "var(--text-h)",
          textTransform: "none",
        }}
      >
        ხშირად დასმული კითხვები
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {faqs.map((item) => {
          const open = openFaq === item._id;
          return (
            <div
              key={item._id}
              style={{
                backgroundColor: "var(--code-bg)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px 20px",
                cursor: "pointer",
              }}
              onClick={() => setOpenFaq(open ? null : item._id)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  color: "var(--text-h)",
                  gap: 12,
                }}
              >
                <span>{item.question}</span>
                <span>{open ? "−" : "+"}</span>
              </div>
              {open && (
                <p
                  style={{
                    marginTop: "10px",
                    color: "var(--text)",
                    fontSize: "0.95rem",
                  }}
                >
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
