import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  reviews,
  faqs,
  chatReplies,
  platformCards,
  collections,
  chatMessages,
  listPlatformCardsByBrand,
  getCollectionByBrand,
  getSettings,
  updateSettings,
  subscribeNewsletter,
  listSubscribers,
  askChat,
} from "../controllers/contentController.js";

const router = Router();

router.get("/reviews", reviews.list);
router.get("/faqs", faqs.list);
router.get("/chat-replies", chatReplies.list);
router.get("/platform-cards", platformCards.list);
router.get("/platform-cards/brand/:brand", listPlatformCardsByBrand);
router.get("/collections", collections.list);
router.get("/collections/brand/:brand", getCollectionByBrand);
router.get("/settings", getSettings);

router.post("/newsletter", subscribeNewsletter);
router.post("/chat/ask", askChat);

router.post("/reviews", protect, adminOnly, reviews.create);
router.put("/reviews/:id", protect, adminOnly, reviews.update);
router.delete("/reviews/:id", protect, adminOnly, reviews.remove);

router.post("/faqs", protect, adminOnly, faqs.create);
router.put("/faqs/:id", protect, adminOnly, faqs.update);
router.delete("/faqs/:id", protect, adminOnly, faqs.remove);

router.post("/chat-replies", protect, adminOnly, chatReplies.create);
router.put("/chat-replies/:id", protect, adminOnly, chatReplies.update);
router.delete("/chat-replies/:id", protect, adminOnly, chatReplies.remove);

router.get("/chat-messages", protect, adminOnly, chatMessages.list);
router.delete("/chat-messages/:id", protect, adminOnly, chatMessages.remove);

router.post("/platform-cards", protect, adminOnly, platformCards.create);
router.put("/platform-cards/:id", protect, adminOnly, platformCards.update);
router.delete("/platform-cards/:id", protect, adminOnly, platformCards.remove);

router.post("/collections", protect, adminOnly, collections.create);
router.put("/collections/:id", protect, adminOnly, collections.update);
router.delete("/collections/:id", protect, adminOnly, collections.remove);

router.put("/settings", protect, adminOnly, updateSettings);
router.get("/newsletter", protect, adminOnly, listSubscribers);

export default router;
