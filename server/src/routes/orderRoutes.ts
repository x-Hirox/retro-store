import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// შეკვეთის შექმნა (მხოლოდ ავტორიზებულისთვის) და ყველა შეკვეთის ნახვა (მხოლოდ ადმინისთვის)
router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, adminOnly, getOrders);

// მომხმარებლის საკუთარი შეკვეთების ნახვა
router.route("/myorders").get(protect, getMyOrders);

// შეკვეთის სტატუსის განახლება (მხოლოდ ადმინისთვის)
router.route("/:id/status").put(protect, adminOnly, updateOrderStatus);

export default router;
