import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeExtraSections() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "რატომ უნდა შევიძინო RetroStore-ში?",
      a: "ჩვენ გთავაზობთ 100%-ით ორიგინალ, შემოწმებულ და გარანტირებულ რეტრო კონსოლებსა და თამაშებს.",
    },
    {
      q: "არის თუ არა პროდუქცია ორიგინალი?",
      a: "დიახ, ყველა კონსოლი და ქართრიჯი გადის ტექნიკურ შემოწმებას და გაწმენდას გაყიდვამდე.",
    },
    {
      q: "როგორ ხდება მიწოდება?",
      a: "მიწოდება ხორციელდება საქართველოს მასშტაბით 1-2 სამუშაო დღეში.",
    },
    {
      q: "მოქმედებს თუ არა გარანტია?",
      a: "ყველა რეტრო კონსოლზე მოქმედებს 1-წლიანი სრული გარანტია.",
    },
  ];

  return (
    <>
      {/* პროდუქტის პრომო ბანერები (2-იანი ბლოკი) */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#cc0033",
            borderRadius: "16px",
            padding: "30px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "220px",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.8rem", margin: "0 0 10px 0" }}>
              აქსესუარები
            </h3>
            <p style={{ opacity: 0.9 }}>
              გააძლიერეთ თქვენი გეიმინგ სითაფი ლეგენდარული ჯოისტიკებითა და
              კაბელებით.
            </p>
          </div>
          <button
            className="arcade-btn"
            style={{ width: "fit-content", marginTop: "20px" }}
            onClick={() => navigate("/category/playstation")}
          >
            ნახვა
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#b8860b",
            borderRadius: "16px",
            padding: "30px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "220px",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.8rem", margin: "0 0 10px 0" }}>
              სპეციალური ნაკრებები (BUNDLES)
            </h3>
            <p style={{ opacity: 0.9 }}>
              დაზოგეთ მეტი! კონსოლი + თამაშები + ჯოისტიკები ერთ სრულ პაკეტში.
            </p>
          </div>
          <button
            className="arcade-btn"
            style={{ width: "fit-content", marginTop: "20px" }}
            onClick={() => navigate("/category/playstation")}
          >
            ნაკრებების ნახვა
          </button>
        </div>
      </div>

      {/* მომხმარებელთა შეფასებები */}
      <div
        style={{
          backgroundColor: "var(--code-bg)",
          padding: "50px 20px",
          marginTop: "50px",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "10px",
              color: "var(--text-h)",
            }}
          >
            რას ამბობენ ჩვენი მომხმარებლები
          </h2>
          <p style={{ color: "var(--text)", marginBottom: "30px" }}>
            50,000+ კმაყოფილი გეიმერი მთელ საქართველოში
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
              textAlign: "left",
            }}
          >
            {[
              {
                name: "გიორგი მ.",
                text: "PS2 ვიყიდე იდეალურ მდგომარეობაში. შეკვეთა მეორე დღესვე მოვიდა!",
                stars: "★★★★★",
              },
              {
                name: "ნიკა კ.",
                text: "PSP3000 ჩამოვიდა ახალივით. ძალიან კმაყოფილი ვარ სერვისით.",
                stars: "★★★★★",
              },
              {
                name: "დათო წ.",
                text: "ნოსტალგიური განცდაა! ბავშვობა გამახსენდა. მადლობა RetroStore-ს.",
                stars: "★★★★★",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "var(--bg)",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ color: "#f59e0b", marginBottom: "8px" }}>
                  {item.stars}
                </div>
                <p
                  style={{
                    fontSize: "0.95rem",
                    marginBottom: "15px",
                    color: "var(--text)",
                  }}
                >
                  "{item.text}"
                </p>
                <strong style={{ color: "var(--text-h)" }}>{item.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ხშირად დასმული შეკითხვები (FAQ) */}
      <div
        style={{
          maxWidth: "900px",
          margin: "60px auto",
          padding: "0 20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "2rem",
            marginBottom: "30px",
            color: "var(--text-h)",
          }}
        >
          ხშირად დასმული შეკითხვები
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqData.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--code-bg)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "16px 20px",
                cursor: "pointer",
              }}
              onClick={() => toggleFaq(idx)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  color: "var(--text-h)",
                }}
              >
                <span>{item.q}</span>
                <span>{openFaq === idx ? "−" : "+"}</span>
              </div>
              {openFaq === idx && (
                <p
                  style={{
                    marginTop: "10px",
                    color: "var(--text)",
                    fontSize: "0.95rem",
                  }}
                >
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
