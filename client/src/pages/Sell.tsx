import { useMemo, useState } from "react";
import API from "../services/api";
import { SELL_BRANDS, SELL_FAQS } from "../data/sellCatalog";
import ReviewsSection from "../components/ReviewsSection";
import RecentlyViewed from "../components/RecentlyViewed";
import NewsletterSignup from "../components/NewsletterSignup";

type QuoteItem = {
  id: string;
  brand: string;
  name: string;
  condition: string;
  qty: number;
};

const PHONE = "+995 595 95 00 39";
const MAIL = "retrobit.support@gmail.com";

export default function Sell() {
  const [openBrand, setOpenBrand] = useState<string | null>("nintendo");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [quote, setQuote] = useState<QuoteItem[]>([]);
  const [manual, setManual] = useState("");
  const [step, setStep] = useState<"list" | "form" | "done">("list");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "თბილისი",
    payout: "cash",
    comment: "",
  });

  const totalQty = useMemo(
    () => quote.reduce((sum, item) => sum + item.qty, 0),
    [quote],
  );

  const addItem = (brand: string, name: string) => {
    setQuote((prev) => {
      const found = prev.find((item) => item.brand === brand && item.name === name);
      if (found) {
        return prev.map((item) =>
          item.id === found.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          id: `${brand}-${name}-${Date.now()}`,
          brand,
          name,
          condition: "used",
          qty: 1,
        },
      ];
    });
  };

  const submit = async () => {
    setError("");
    if (!form.name.trim() || !form.phone.trim()) {
      setError("სახელი და ტელეფონი აუცილებელია.");
      return;
    }
    setBusy(true);
    try {
      await API.post("/content/sell-quote", {
        ...form,
        items: quote,
      });
      setStep("done");
    } catch {
      setError("ვერ გაიგზავნა. დაგვირეკე ან მოგვწერე მეილზე.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sell-page">
      <section className="sell-hero">
        <div className="sell-hero-copy">
          <h1>გაყიდე კონსოლი და თამაშები</h1>
          <p>
            სწრაფი შეთავაზება, თბილისში წაყვანა ან გაგზავნა, ნაღდი ან 20%-ით მეტი
            მაღაზიის კრედიტი. კითხვა თუ გაქვს — მოგვწერე:
          </p>
          <p className="sell-hero-contact">
            მეილი: <a href={`mailto:${MAIL}`}>{MAIL}</a>
            <br />
            ტელ: <a href="tel:+995595950039">{PHONE}</a>
          </p>
          <div className="sell-hero-actions">
            <a className="sell-btn sell-btn-blue" href="#what-we-buy">
              შეთავაზების მიღება
            </a>
            <a className="sell-btn sell-btn-orange" href={`mailto:${MAIL}`}>
              დაგვიკავშირდი
            </a>
          </div>
        </div>
        <img className="sell-chest" src="/images/sell-chest.jpg" alt="" />
      </section>

      <section className="sell-section">
        <h2>როგორ მუშაობს</h2>
        <div className="sell-steps">
          {[
            ["1. ააწყვე სია", "დაამატე კონსოლები, თამაშები და აქსესუარები ქვემოთ. ვერ იპოვე — დაამატე ხელით."],
            ["2. მიიღე შეთავაზება", "სიას გადავხედავთ და ფასს გამოგიგზავნით, ჩვეულებრივ 1 სამუშაო დღეში."],
            ["3. გამოგვიგზავნე", "თბილისში ჩამოვიყვანთ ან შენ გამოგზავნი. დეტალებს შეთავაზებასთან ერთად გეტყვი."],
            ["4. შემოწმება", "ნივთს შევამოწმებთ. თუ მდგომარეობა განსხვავდება, ახალ ფასს შემოგთავაზებთ."],
            ["5. ანაზღაურება", "ნაღდი ან 20%-ით მეტი მაღაზიის კრედიტი. გადარიცხვა 3–5 სამუშაო დღეში."],
          ].map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sell-section" id="what-we-buy">
        <h2>რას ვყიდულობთ</h2>
        <p className="sell-lead">
          ვყიდულობთ Nintendo, PlayStation, Xbox, SEGA, Atari კონსოლებს, თამაშებს და
          აქსესუარებს. აირჩიე ბრენდი და დაამატე სიაში.
        </p>
        <div className="sell-brands">
          {SELL_BRANDS.map((brand) => (
            <div key={brand.id} className="sell-brand">
              <button
                type="button"
                className="sell-brand-bar"
                style={{ background: brand.color }}
                onClick={() =>
                  setOpenBrand((id) => (id === brand.id ? null : brand.id))
                }
              >
                <span>{brand.name}</span>
                <span>{openBrand === brand.id ? "▴" : "▾"}</span>
              </button>
              {openBrand === brand.id && (
                <div className="sell-brand-items">
                  {brand.items.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => addItem(brand.name, name)}
                    >
                      + {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sell-manual">
          <p>ვერ იპოვე? დაამატე ხელით.</p>
          <div className="sell-manual-row">
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="ნივთის სახელი + პლატფორმა"
            />
            <button
              type="button"
              className="sell-btn sell-btn-blue"
              onClick={() => {
                if (!manual.trim()) return;
                addItem("სხვა", manual.trim());
                setManual("");
              }}
            >
              სიაში დამატება +
            </button>
          </div>
        </div>

        {quote.length > 0 && (
          <div className="sell-quote">
            <h3>შენი სია ({totalQty})</h3>
            {quote.map((item) => (
              <div key={item.id} className="sell-quote-row">
                <strong>
                  {item.name} · {item.brand}
                </strong>
                <select
                  value={item.condition}
                  onChange={(e) =>
                    setQuote((prev) =>
                      prev.map((row) =>
                        row.id === item.id
                          ? { ...row, condition: e.target.value }
                          : row,
                      ),
                    )
                  }
                >
                  <option value="new">ახალი</option>
                  <option value="used">მეორადი</option>
                  <option value="broken">გაუმართავი</option>
                </select>
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) =>
                    setQuote((prev) =>
                      prev.map((row) =>
                        row.id === item.id
                          ? { ...row, qty: Math.max(1, Number(e.target.value) || 1) }
                          : row,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setQuote((prev) => prev.filter((row) => row.id !== item.id))
                  }
                >
                  წაშლა
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="sell-nav-btns">
          <button
            type="button"
            className="sell-btn sell-btn-orange"
            onClick={() => {
              setQuote([]);
              setStep("list");
            }}
          >
            თავიდან
          </button>
          <button
            type="button"
            className="sell-btn sell-btn-blue"
            disabled={!quote.length}
            onClick={() => setStep("form")}
          >
            შემდეგი
          </button>
        </div>
      </section>

      {step !== "list" && (
        <section className="sell-section sell-form-wrap">
          {step === "done" ? (
            <div className="sell-done">
              <h2>სია მივიღეთ</h2>
              <p>
                შეთავაზებას გამოგიგზავნით. სასწრაფოდ: {PHONE} / {MAIL}
              </p>
            </div>
          ) : (
            <>
              <h2>საკონტაქტო</h2>
              <div className="sell-form">
                <input
                  placeholder="სახელი *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  placeholder="ტელეფონი *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <input
                  placeholder="ელფოსტა"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  placeholder="ქალაქი"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
                <select
                  value={form.payout}
                  onChange={(e) => setForm({ ...form, payout: e.target.value })}
                >
                  <option value="cash">ნაღდი</option>
                  <option value="credit">მაღაზიის კრედიტი +20%</option>
                  <option value="bank">გადარიცხვა</option>
                </select>
                <textarea
                  placeholder="კომენტარი"
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
                {error && <p className="sell-error">{error}</p>}
                <button
                  type="button"
                  className="sell-btn sell-btn-blue"
                  disabled={busy}
                  onClick={submit}
                >
                  {busy ? "იგზავნება..." : "შეთავაზების გაგზავნა"}
                </button>
              </div>
            </>
          )}
        </section>
      )}

      <section className="sell-bulk">
        <div>
          <h2>დიდი კოლექცია გასაყიდი გაქვს?</h2>
          <p>
            50+ ნივთი? დაგვიკავშირდი — ერთად შევთანხმდებით წაყვანაზე და ფასზე.
          </p>
          <p>
            {MAIL}
            <br />
            {PHONE}
          </p>
          <a className="sell-btn sell-btn-blue" href={`mailto:${MAIL}`}>
            დაგვიკავშირდი
          </a>
        </div>
        <img src="/images/sell-gameboy.jpg" alt="" />
      </section>

      <section className="sell-section">
        <h2>ხშირი კითხვები</h2>
        <div className="sell-faq">
          {SELL_FAQS.map((item, index) => (
            <button
              key={item.q}
              type="button"
              className="sell-faq-item"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <span>
                {item.q}
                {openFaq === index && <em>{item.a}</em>}
              </span>
              <b>{openFaq === index ? "▴" : "▾"}</b>
            </button>
          ))}
        </div>
      </section>

      <ReviewsSection />
      <RecentlyViewed />
      <NewsletterSignup />
    </div>
  );
}
