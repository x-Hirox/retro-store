import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  createContent,
  deleteContent,
  getChatMessages,
  getChatReplies,
  getCollections,
  getFaqs,
  getPlatformCards,
  getReviews,
  getSiteSettings,
  getSubscribers,
  updateContent,
  updateSettings,
} from "../services/contentService";
import ImageUrlField from "../components/ImageUrlField";
import type {
  IChatMessage,
  IChatQuickReply,
  ICollectionPage,
  IFaq,
  INewsletterSubscriber,
  IPlatformCard,
  IReview,
  ISiteSettings,
} from "../types";

type Tab =
  | "reviews"
  | "faqs"
  | "chat"
  | "platforms"
  | "collections"
  | "settings"
  | "inbox"
  | "newsletter";

const inputStyle: CSSProperties = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#fff",
  width: "100%",
  boxSizing: "border-box",
};

export default function AdminContent() {
  const [tab, setTab] = useState<Tab>("reviews");

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {(
          [
            ["reviews", "⭐ შეფასებები"],
            ["faqs", "❓ კითხვები"],
            ["chat", "💬 ჩატის პასუხები"],
            ["inbox", "📥 ჩატის შემოსულები"],
            ["platforms", "🖼️ კონსოლების ბარათები"],
            ["collections", "📂 კოლექციები"],
            ["settings", "⚙️ საიტის ტექსტები"],
            ["newsletter", "✉️ გამოწერები"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: "8px 12px",
              background: tab === id ? "#38bdf8" : "#1e293b",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "reviews" && <ReviewsAdmin />}
      {tab === "faqs" && <FaqsAdmin />}
      {tab === "chat" && <ChatAdmin />}
      {tab === "inbox" && <InboxAdmin />}
      {tab === "platforms" && <PlatformsAdmin />}
      {tab === "collections" && <CollectionsAdmin />}
      {tab === "settings" && <SettingsAdmin />}
      {tab === "newsletter" && <NewsletterAdmin />}
    </div>
  );
}

function ReviewsAdmin() {
  const [items, setItems] = useState<IReview[]>([]);
  const [form, setForm] = useState({
    name: "",
    text: "",
    stars: "5",
    avatarUrl: "",
    productImageUrl: "",
  });

  const load = () => getReviews().then(setItems);
  useEffect(() => {
    load();
  }, []);

  return (
    <CrudBlock
      title="მომხმარებლის შეფასებები"
      onSubmit={async () => {
        await createContent("reviews", {
          ...form,
          stars: Number(form.stars) || 5,
          verified: true,
        });
        setForm({ name: "", text: "", stars: "5", avatarUrl: "", productImageUrl: "" });
        load();
      }}
    >
      <input style={inputStyle} placeholder="სახელი" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <textarea style={inputStyle} placeholder="ტექსტი" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
      <input style={inputStyle} placeholder="ვარსკვლავები 1-5" value={form.stars} onChange={(e) => setForm({ ...form, stars: e.target.value })} />
      <input style={inputStyle} placeholder="ავატარის URL (Cloudinary ან სხვა)" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
      <ImageUrlField
        required={false}
        value={form.productImageUrl}
        onChange={(imageUrl) => setForm({ ...form, productImageUrl: imageUrl })}
        hint="რევიუს პროდუქტის ფოტო — ატვირთე ფაილი."
      />
      <List
        items={items.map((item) => ({
          id: item._id,
          title: `${item.name} — ${item.stars}★`,
          subtitle: item.text,
        }))}
        onDelete={async (id) => {
          await deleteContent("reviews", id);
          load();
        }}
      />
    </CrudBlock>
  );
}

function FaqsAdmin() {
  const [items, setItems] = useState<IFaq[]>([]);
  const [form, setForm] = useState({ question: "", answer: "" });
  const load = () => getFaqs().then(setItems);
  useEffect(() => {
    load();
  }, []);

  return (
    <CrudBlock
      title="ხშირად დასმული კითხვები"
      onSubmit={async () => {
        await createContent("faqs", form);
        setForm({ question: "", answer: "" });
        load();
      }}
    >
      <input style={inputStyle} placeholder="კითხვა" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
      <textarea style={inputStyle} placeholder="პასუხი" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required />
      <List
        items={items.map((item) => ({ id: item._id, title: item.question, subtitle: item.answer }))}
        onDelete={async (id) => {
          await deleteContent("faqs", id);
          load();
        }}
      />
    </CrudBlock>
  );
}

function ChatAdmin() {
  const [items, setItems] = useState<IChatQuickReply[]>([]);
  const [form, setForm] = useState({ title: "", description: "", icon: "💬", reply: "" });
  const load = () => getChatReplies().then(setItems);
  useEffect(() => {
    load();
  }, []);

  return (
    <CrudBlock
      title="ჩატის სწრაფი პასუხები (ეს ჩანს ჩატის ფანჯარაში)"
      onSubmit={async () => {
        await createContent("chat-replies", form);
        setForm({ title: "", description: "", icon: "💬", reply: "" });
        load();
      }}
    >
      <input style={inputStyle} placeholder="სათაური" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <input style={inputStyle} placeholder="მოკლე აღწერა" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input style={inputStyle} placeholder="იკონი (emoji)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
      <textarea style={inputStyle} placeholder="ავტომატური პასუხი" value={form.reply} onChange={(e) => setForm({ ...form, reply: e.target.value })} required />
      <List
        items={items.map((item) => ({ id: item._id, title: item.title, subtitle: item.reply }))}
        onDelete={async (id) => {
          await deleteContent("chat-replies", id);
          load();
        }}
      />
    </CrudBlock>
  );
}

function InboxAdmin() {
  const [items, setItems] = useState<IChatMessage[]>([]);
  useEffect(() => {
    getChatMessages().then(setItems).catch(() => setItems([]));
  }, []);
  return (
    <div>
      <h3>ჩატის შემოსული შეტყობინებები</h3>
      {items.length === 0 && <p>ჯერ შეტყობინება არ არის.</p>}
      {items.map((item) => (
        <div key={item._id} style={{ background: "#1e293b", padding: 12, borderRadius: 8, marginBottom: 8 }}>
          <strong>{item.visitorName || "სტუმარი"}</strong>
          <p>{item.message}</p>
          {item.reply && <p style={{ color: "#86efac" }}>პასუხი: {item.reply}</p>}
        </div>
      ))}
    </div>
  );
}

function PlatformsAdmin() {
  const emptyForm = {
    brand: "nintendo",
    name: "",
    slug: "",
    imageUrl: "",
    year: "",
  };
  const [items, setItems] = useState<IPlatformCard[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const load = () => getPlatformCards().then(setItems);
  useEffect(() => {
    load();
  }, []);

  return (
    <CrudBlock
      title="კონსოლების ბარათები"
      submitLabel={editingId ? "სურათის შენახვა" : "დამატება"}
      onSubmit={async () => {
        if (editingId) {
          await updateContent("platform-cards", editingId, form);
          setEditingId(null);
        } else {
          await createContent("platform-cards", form);
        }
        setForm(emptyForm);
        load();
      }}
    >
      <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
        კონსოლის ბარათის სურათი ჩააგდე აქ: client/public/images/platforms/
        ფაილის სახელი = slug, მაგ. dsl.png, ndsi.png, 3ds.png (ან .jpg / .svg).
        სანამ ფაილი არაა, ბარათზე გატეხილი სურათი ჩანს. ან აქ ატვირთე Cloudinary-ზე.
      </p>
      <input style={inputStyle} placeholder="ბრენდი: nintendo / playstation / xbox" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
      <input style={inputStyle} placeholder="სახელი, მაგ: Nintendo 64" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input style={inputStyle} placeholder="slug, მაგ: n64" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
      <ImageUrlField
        value={form.imageUrl}
        onChange={(imageUrl) => setForm({ ...form, imageUrl })}
        allowUrl
        placeholder="მაგ: /images/platforms/dsl.png ან Cloudinary ლინკი"
        hint="ან ჩააგდე client/public/images/platforms/dsl.png — ან ატვირთე აქ Cloudinary-ზე."
      />
      <input style={inputStyle} placeholder="წელი" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
      {editingId && (
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
          }}
          style={smallBtn("#475569")}
        >
          გაუქმება
        </button>
      )}
      <List
        items={items.map((item) => ({
          id: item._id,
          title: `${item.brand} — ${item.name}`,
          subtitle: item.imageUrl,
          extra: (
            <button
              type="button"
              onClick={() => {
                setEditingId(item._id);
                setForm({
                  brand: item.brand,
                  name: item.name,
                  slug: item.slug,
                  imageUrl: item.imageUrl,
                  year: item.year || "",
                });
              }}
              style={smallBtn("#f59e0b")}
            >
              სურათის შეცვლა
            </button>
          ),
        }))}
        onDelete={async (id) => {
          await deleteContent("platform-cards", id);
          load();
        }}
      />
    </CrudBlock>
  );
}

function CollectionsAdmin() {
  const [items, setItems] = useState<ICollectionPage[]>([]);
  const [form, setForm] = useState({
    brand: "",
    title: "",
    subtitle: "",
    description: "",
    bannerColor: "#c41e3a",
  });
  const load = () => getCollections().then(setItems);
  useEffect(() => {
    load();
  }, []);

  return (
    <CrudBlock
      title="კოლექციის გვერდის ტექსტები"
      onSubmit={async () => {
        await createContent("collections", form);
        setForm({ brand: "", title: "", subtitle: "", description: "", bannerColor: "#c41e3a" });
        load();
      }}
    >
      <input style={inputStyle} placeholder="brand: nintendo" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
      <input style={inputStyle} placeholder="სათაური" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <input style={inputStyle} placeholder="ქვესათაური" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      <input style={inputStyle} placeholder="ბანერის ფერი, მაგ: #c41e3a" value={form.bannerColor} onChange={(e) => setForm({ ...form, bannerColor: e.target.value })} />
      <textarea style={inputStyle} placeholder="აღწერა" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <List
        items={items.map((item) => ({
          id: item._id,
          title: item.title,
          subtitle: item.description,
          extra: (
            <button
              type="button"
              onClick={async () => {
                const description = prompt("ახალი აღწერა", item.description) || item.description;
                await updateContent("collections", item._id, { ...item, description });
                load();
              }}
              style={smallBtn("#f59e0b")}
            >
              აღწერის შეცვლა
            </button>
          ),
        }))}
        onDelete={async (id) => {
          await deleteContent("collections", id);
          load();
        }}
      />
    </CrudBlock>
  );
}

function SettingsAdmin() {
  const [form, setForm] = useState<ISiteSettings>({
    chatGreeting: "",
    chatSubtitle: "",
    newsletterTitle: "",
    newsletterButton: "",
    footerPhone: "",
    footerEmail: "",
    footerHours: "",
    footerAddress: "",
    socialInstagram: "",
    socialFacebook: "",
    socialTiktok: "",
    socialYoutube: "",
    socialX: "",
  });

  useEffect(() => {
    getSiteSettings().then(setForm);
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await updateSettings(form);
        alert("პარამეტრები შენახულია");
      }}
      style={{ display: "grid", gap: 10, background: "#1e293b", padding: 20, borderRadius: 12 }}
    >
      <h3>საიტის ტექსტები (ჩატი, ფუტერი, ნიუსლეთერი)</h3>
      {(
        [
          ["chatGreeting", "ჩატის მისალმება"],
          ["chatSubtitle", "ჩატის ქვეტექსტი"],
          ["newsletterTitle", "ნიუსლეთერის სათაური"],
          ["newsletterButton", "ნიუსლეთერის ღილაკი"],
          ["footerPhone", "ტელეფონი"],
          ["footerEmail", "ელფოსტა"],
          ["footerHours", "სამუშაო საათები"],
          ["footerAddress", "მისამართი"],
        ] as [keyof ISiteSettings, string][]
      ).map(([key, label]) => (
        <input
          key={key}
          style={inputStyle}
          placeholder={label}
          value={String(form[key] || "")}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ))}
      <h3>სოციალური ქსელები (სრული URL)</h3>
      <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
        როცა გვერდს გააკეთებ, ჩასვი ლინკი. ცარიელი რომ დატოვო, ფუტერში არ გამოჩნდება.
      </p>
      {(
        [
          ["socialInstagram", "Instagram — https://instagram.com/..."],
          ["socialFacebook", "Facebook — https://facebook.com/..."],
          ["socialTiktok", "TikTok — https://tiktok.com/@..."],
          ["socialYoutube", "YouTube — https://youtube.com/@..."],
          ["socialX", "X / Twitter — https://x.com/..."],
        ] as [keyof ISiteSettings, string][]
      ).map(([key, label]) => (
        <input
          key={key}
          style={inputStyle}
          placeholder={label}
          value={String(form[key] || "")}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ))}
      <h3>კატეგორიების სურათები (მთავარი mosaic)</h3>
      <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
        PNG cutout ატვირთე Cloudinary-ზე — გამჭვირვალე ფონი, კონსოლები მარჯვნივ.
        ცარიელი რომ დატოვო, ლოკალური სურათი დარჩება.
      </p>
      {(
        [
          ["catImageHome", "სტაციონარული კონსოლები"],
          ["catImageHand", "ხელის კონსოლები"],
          ["catImageGames", "თამაშები (კარტრიჯები)"],
          ["catImageAcc", "აქსესუარები"],
          ["catImageBundles", "ბუნდლები"],
        ] as [keyof ISiteSettings, string][]
      ).map(([key, label]) => (
        <div key={key}>
          <label style={{ fontSize: 13, color: "#cbd5e1" }}>{label}</label>
          <ImageUrlField
            required={false}
            placeholder={`${label} — Cloudinary PNG`}
            value={String(form[key] || "")}
            onChange={(imageUrl) => setForm({ ...form, [key]: imageUrl })}
          />
        </div>
      ))}
      <button type="submit" style={{ ...smallBtn("#10b981"), padding: "12px" }}>
        შენახვა
      </button>
    </form>
  );
}

function NewsletterAdmin() {
  const [items, setItems] = useState<INewsletterSubscriber[]>([]);
  useEffect(() => {
    getSubscribers().then(setItems).catch(() => setItems([]));
  }, []);
  return (
    <div>
      <h3>ნიუსლეთერის გამოწერები ({items.length})</h3>
      {items.map((item) => (
        <div key={item._id} style={{ background: "#1e293b", padding: 10, borderRadius: 8, marginBottom: 6 }}>
          {item.email}
        </div>
      ))}
    </div>
  );
}

function CrudBlock({
  title,
  onSubmit,
  children,
  submitLabel = "დამატება",
}: {
  title: string;
  onSubmit: () => Promise<void>;
  children: ReactNode;
  submitLabel?: string;
}) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit();
      }}
      style={{ display: "grid", gap: 10 }}
    >
      <h3>{title}</h3>
      {children}
      <button type="submit" style={{ ...smallBtn("#10b981"), padding: 12 }}>
        {submitLabel}
      </button>
    </form>
  );
}

function List({
  items,
  onDelete,
}: {
  items: { id: string; title: string; subtitle?: string; extra?: ReactNode }[];
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#1e293b",
            padding: 12,
            borderRadius: 8,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <strong>{item.title}</strong>
            {item.subtitle && (
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>{item.subtitle}</p>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {item.extra}
            <button type="button" onClick={() => onDelete(item.id)} style={smallBtn("#ef4444")}>
              წაშლა
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function smallBtn(bg: string): CSSProperties {
  return {
    background: bg,
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
  };
}
