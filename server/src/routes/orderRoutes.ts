import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// შეკვეთის შექმნა და ყველა შეკვეთის ნახვა (ადმინი)
router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, adminOnly, getOrders);

// მომხმარებლის საკუთარი შეკვეთების ნახვა (აუცილებლად უნდა იყოს /:id-მდე!)
router.route("/myorders").get(protect, getMyOrders);

// კონკრეტული შეკვეთის წამოღება ID-ით
router.route("/:id").get(protect, getOrderById);

// შეკვეთის სტატუსის განახლება (მხოლოდ ადმინისთვის)
router.route("/:id/status").put(protect, adminOnly, updateOrderStatus);

export default router;
