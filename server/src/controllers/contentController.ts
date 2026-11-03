import type { Request, Response } from "express";
import Review from "../models/Review.js";
import Faq from "../models/Faq.js";
import ChatQuickReply from "../models/ChatQuickReply.js";
import PlatformCard from "../models/PlatformCard.js";
import CollectionPage from "../models/CollectionPage.js";
import NewsletterSubscriber from "../models/Newsletter.js";
import SiteSettings from "../models/SiteSettings.js";
import ChatMessage from "../models/ChatMessage.js";

function crud(Model: any) {
  return {
    list: async (_req: Request, res: Response) => {
      try {
        const sort = Model.schema.path("order") ? { order: 1 } : { createdAt: -1 };
        const items = await Model.find().sort(sort);
        res.json(items);
      } catch {
        res.status(500).json({ message: "სერვერის შეცდომა" });
      }
    },
    create: async (req: Request, res: Response) => {
      try {
        const item = await Model.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        res.status(400).json({ message: "არასწორი მონაცემები", error });
      }
    },
    update: async (req: Request, res: Response) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) return res.status(404).json({ message: "ვერ მოიძებნა" });
        res.json(item);
      } catch {
        res.status(400).json({ message: "განახლება ვერ მოხერხდა" });
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
export const collections = crud(CollectionPage);
export const chatMessages = crud(ChatMessage);

export const listPlatformCardsByBrand = async (req: Request, res: Response) => {
  try {
    const brand = String(req.params.brand || "").toLowerCase();
    const cards = await PlatformCard.find({
      brand: { $regex: new RegExp(`^${brand}$`, "i") },
    }).sort({ order: 1 });
    res.json(cards);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const getCollectionByBrand = async (req: Request, res: Response) => {
  try {
    const brand = String(req.params.brand || "").toLowerCase();
    const page = await CollectionPage.findOne({
      brand: { $regex: new RegExp(`^${brand}$`, "i") },
    });
    res.json(page || null);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
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
    const message = String(req.body.message || "").trim();
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

    await ChatMessage.create({
      visitorName: req.body.visitorName || "სტუმარი",
      email: req.body.email || "",
      message,
      reply: autoReply,
    });

    res.json({ reply: autoReply });
  } catch {
    res.status(500).json({ message: "ჩატი ამ მომენტში მიუწვდომელია" });
  }
};
