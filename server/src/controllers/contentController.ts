import type { Request, Response } from "express";
import Review from "../models/Review.js";
import Faq from "../models/Faq.js";
import ChatQuickReply from "../models/ChatQuickReply.js";
import PlatformCard from "../models/PlatformCard.js";
import CollectionPage from "../models/CollectionPage.js";
import NewsletterSubscriber from "../models/Newsletter.js";
import SiteSettings from "../models/SiteSettings.js";
import ChatMessage from "../models/ChatMessage.js";
import SellQuote from "../models/SellQuote.js";
import { inboxMail, sendEmail } from "../utils/sendEmail.js";
import PageMedia from "../models/PageMedia.js";
import { ensurePlatformCatalog, ensurePageMedia } from "../utils/seedContent.js";

function duplicateError(error: unknown) {
  return (error as { code?: number }).code === 11000;
}

function crud(Model: any) {
  return {
    list: async (_req: Request, res: Response) => {
      try {
        if (Model.modelName === "PlatformCard") {
          await ensurePlatformCatalog();
        }
        if (Model.modelName === "PageMedia") {
          await ensurePageMedia();
        }
        const sort = Model.schema.path("order") ? { order: 1 } : { createdAt: -1 };
        const items = await Model.find().sort(sort);
        res.json(items);
      } catch {
        res.status(500).json({ message: "სერვერის შეცდომა" });
      }
    },
    create: async (req: Request, res: Response) => {
      try {
        if (Model.modelName === "PlatformCard") {
          const brand = String(req.body?.brand || "").trim().toLowerCase();
          const slug = String(req.body?.slug || "").trim().toLowerCase();
          const exists = await Model.findOne({ brand, slug });
          if (exists) {
            res.status(409).json({
              message: "ეს პლატფორმა უკვე არსებობს ამ კატეგორიაში.",
            });
            return;
          }
          req.body.brand = brand;
          req.body.slug = slug;
        }
        const item = await Model.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        res.status(400).json({
          message: duplicateError(error)
            ? "ეს პლატფორმა უკვე არსებობს ამ კატეგორიაში."
            : "არასწორი მონაცემები",
        });
      }
    },
    update: async (req: Request, res: Response) => {
      try {
        if (Model.modelName === "PlatformCard") {
          if (req.body?.brand != null) {
            req.body.brand = String(req.body.brand).trim().toLowerCase();
          }
          if (req.body?.slug != null) {
            req.body.slug = String(req.body.slug).trim().toLowerCase();
          }
        }
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) return res.status(404).json({ message: "ვერ მოიძებნა" });
        res.json(item);
      } catch (error) {
        res.status(400).json({
          message: duplicateError(error)
            ? "ეს პლატფორმა უკვე არსებობს ამ კატეგორიაში."
            : "განახლება ვერ მოხერხდა",
        });
      }
    },
    remove: async (req: Request, res: Response) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "ვერ მოიძებნა" });
        res.json({ message: "წაიშალა" });
      } catch {
        res.status(500).json({ message: "წაშლა ვერ მოხერხდა" });
      }
    },
  };
}

export const reviews = crud(Review);
export const faqs = crud(Faq);
export const chatReplies = crud(ChatQuickReply);
export const platformCards = crud(PlatformCard);
export const pageMedia = crud(PageMedia);
export const collections = crud(CollectionPage);
export const chatMessages = crud(ChatMessage);

export const listPlatformCardsByBrand = async (req: Request, res: Response) => {
  try {
    await ensurePlatformCatalog();
    const brand = decodeURIComponent(String(req.params.brand || ""))
      .toLowerCase()
      .trim();
    const cards = await PlatformCard.find({ brand }).sort({ order: 1 });
    res.json(cards);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const getCollectionByBrand = async (req: Request, res: Response) => {
  try {
    const brand = decodeURIComponent(String(req.params.brand || ""))
      .toLowerCase()
      .trim();
    const page = await CollectionPage.findOne({ brand });
    res.json(page || null);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const updatePageMedia = async (req: Request, res: Response) => {
  try {
    const imageUrl = String(req.body?.imageUrl || "").trim();
    const item = await PageMedia.findByIdAndUpdate(
      req.params.id,
      { $set: { imageUrl } },
      { new: true, runValidators: true },
    );
    if (!item) {
      res.status(404).json({ message: "ვერ მოიძებნა" });
      return;
    }
    res.json(item);
  } catch {
    res.status(400).json({ message: "სურათი ვერ განახლდა" });
  }
};

export const getSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json(settings);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(settings);
  } catch {
    res.status(400).json({ message: "პარამეტრები ვერ განახლდა" });
  }
};

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "ჩაწერე სწორი ელფოსტა" });
    }
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.json({ message: "ეს ელფოსტა უკვე დარეგისტრირებულია" });
    }
    await NewsletterSubscriber.create({ email });
    res.status(201).json({ message: "გმადლობთ! ფასდაკლება გამოგეგზავნებათ." });
  } catch {
    res.status(500).json({ message: "რეგისტრაცია ვერ მოხერხდა" });
  }
};

export const listSubscribers = async (_req: Request, res: Response) => {
  try {
    const items = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

function scoreMatch(text: string, query: string) {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const hay = text.toLowerCase();
  return words.reduce((sum, w) => sum + (hay.includes(w) ? 1 : 0), 0);
}

export const askChat = async (req: Request, res: Response) => {
  try {
    const message = String(req.body.message || "").trim().slice(0, 400);
    if (!message) {
      return res.status(400).json({ message: "შეტყობინება ცარიელია" });
    }

    const [faqItems, replies] = await Promise.all([
      Faq.find(),
      ChatQuickReply.find(),
    ]);

    let best = { reply: "", score: 0 };

    for (const faq of faqItems) {
      const score =
        scoreMatch(`${faq.question} ${faq.answer}`, message) * 2 +
        (faq.question.toLowerCase().includes(message.toLowerCase()) ? 3 : 0);
      if (score > best.score) best = { reply: faq.answer, score };
    }

    for (const item of replies) {
      const score = scoreMatch(
        `${item.title} ${item.description} ${item.reply}`,
        message,
      );
      if (score > best.score) best = { reply: item.reply, score };
    }

    const autoReply =
      best.score > 0
        ? best.reply
        : "გმადლობთ შეტყობინებისთვის! გუნდი მალე გიპასუხებთ. ამასობაში შეგიძლია FAQ ან კატეგორიები ნახო.";

    const visitorEmail = String(req.body.email || "").trim();
    const visitorName = String(req.body.visitorName || "სტუმარი").trim() || "სტუმარი";

    await ChatMessage.create({
      visitorName,
      email: visitorEmail,
      message,
      reply: autoReply,
    });

    if (req.body.notify !== false) {
      try {
        await sendEmail({
          email: inboxMail(),
          replyTo: visitorEmail || inboxMail(),
          subject: `RetroBit ჩატი — ${visitorName}`,
          message: `სტუმარი: ${visitorName}\nმეილი: ${visitorEmail || "არ არის"}\n\n${message}`,
        });
      } catch (error) {
        console.error("Chat email error:", error);
      }
    }

    res.json({ reply: autoReply });
  } catch {
    res.status(500).json({ message: "ჩატი ამ მომენტში მიუწვდომელია" });
  }
};

export const submitSellQuote = async (req: Request, res: Response) => {
  try {
    const name = String(req.body.name || "").trim();
    const phone = String(req.body.phone || "").trim();
    const items = Array.isArray(req.body.items) ? req.body.items.slice(0, 40) : [];
    if (!name || !phone || !items.length) {
      res.status(400).json({ message: "სახელი, ტელეფონი და ერთი ნივთი მაინც საჭიროა." });
      return;
    }
    const quote = await SellQuote.create({
      name,
      phone,
      email: String(req.body.email || "").trim(),
      city: String(req.body.city || "").trim(),
      payout: String(req.body.payout || "cash"),
      comment: String(req.body.comment || "").slice(0, 1000),
      items: items.map((item: { brand?: string; name?: string; condition?: string; qty?: number }) => ({
        brand: String(item.brand || "").slice(0, 40),
        name: String(item.name || "").slice(0, 120),
        condition: String(item.condition || "used").slice(0, 40),
        qty: Math.max(1, Number(item.qty) || 1),
      })),
    });

    const lines = quote.items
      .map((item) => `• ${item.brand} — ${item.name} (${item.condition}) x${item.qty}`)
      .join("\n");
    try {
      await sendEmail({
        email: inboxMail(),
        replyTo: quote.email || inboxMail(),
        subject: `RetroBit — გაყიდვის შეთავაზება: ${name}`,
        message: `${name}\n${phone}\n${quote.email}\n${quote.city}\nგადახდა: ${quote.payout}\n\n${lines}\n\n${quote.comment}`,
      });
    } catch (error) {
      console.error("Sell quote email error:", error);
    }
    res.status(201).json({ ok: true, id: quote._id });
  } catch {
    res.status(400).json({ message: "შეთავაზება ვერ გაიგზავნა." });
  }
};

export const listSellQuotes = async (_req: Request, res: Response) => {
  try {
    const items = await SellQuote.find().sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};
