import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  askChat,
  getChatReplies,
  getFaqs,
  getSiteSettings,
} from "../services/contentService";
import type { IChatQuickReply, IFaq, ISiteSettings } from "../types";

export default function ChatWidget() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [replies, setReplies] = useState<IChatQuickReply[]>([]);
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>(
    [],
  );

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch(() => {});
    getChatReplies()
      .then(setReplies)
      .catch(() => {});
    getFaqs()
      .then((data) => setFaqs(data.slice(0, 4)))
      .catch(() => {});
  }, []);

  if (location.pathname.startsWith("/admin")) return null;

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    try {
      const res = await askChat(trimmed);
      setMessages((prev) => [...prev, { from: "bot", text: res.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "ამ წუთას პასუხი ვერ გაიგზავნა. სცადე მოგვიანებით." },
      ]);
    }
  };

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="ჩატი"
        style={{
          position: "fixed",
          right: 22,
          bottom: 22,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          zIndex: 2000,
          boxShadow: "0 8px 24px rgba(37,99,235,0.45)",
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          className="chat-panel"
          style={{
            position: "fixed",
            right: 22,
            bottom: 90,
            width: 360,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "70vh",
            overflowY: "auto",
            background: "var(--bg)",
            borderRadius: 16,
            boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            zIndex: 2000,
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "18px 16px",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <strong>RetroBit</strong>
            <p style={{ margin: "8px 0 0", fontSize: "0.95rem" }}>
              {settings?.chatGreeting || "გამარჯობა, კარგია რომ შემოხვედი! 👋"}
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "0.85rem", opacity: 0.9 }}>
              {settings?.chatSubtitle ||
                "დახმარება გჭირდება თუ უბრალოდ გეიმინგის განწყობა გაქვს?"}
            </p>
          </div>

          <div style={{ padding: 12 }}>
            <p style={{ fontWeight: 700, margin: "0 0 8px", color: "var(--text-h)" }}>
              გჭირდება დახმარება?
            </p>
            {replies.map((item) => (
              <button
                key={item._id}
                onClick={() => send(item.title)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "var(--code-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 8,
                  cursor: "pointer",
                  color: "var(--text-h)",
                }}
              >
                {item.icon} {item.title}
                {item.description && (
                  <div style={{ fontSize: "0.8rem", color: "var(--text)" }}>
                    {item.description}
                  </div>
                )}
              </button>
            ))}

            {faqs.length > 0 && (
              <>
                <p
                  style={{
                    fontWeight: 700,
                    margin: "12px 0 8px",
                    color: "var(--text-h)",
                  }}
                >
                  კითხვები
                </p>
                {faqs.map((faq) => (
                  <button
                    key={faq._id}
                    onClick={() => send(faq.question)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      marginBottom: 8,
                      cursor: "pointer",
                      color: "var(--text)",
                    }}
                  >
                    {faq.question}
                  </button>
                ))}
              </>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 8,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: msg.from === "user" ? "#2563eb" : "var(--code-bg)",
                  color: msg.from === "user" ? "#fff" : "var(--text-h)",
                  marginLeft: msg.from === "user" ? 40 : 0,
                  marginRight: msg.from === "bot" ? 40 : 0,
                }}
              >
                {msg.text}
              </div>
            ))}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              style={{ display: "flex", gap: 8, marginTop: 8 }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="დაწერე შეტყობინება..."
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--code-bg)",
                  color: "var(--text-h)",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "0 12px",
                  cursor: "pointer",
                }}
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
