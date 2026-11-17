import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrders,
  getOrderById,
  getOrderStats,
  updateOrderStatus,
  cancelMyOrder,
  retryOrderPayment,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// შეკვეთის შექმნა და ყველა შეკვეთის ნახვა (ადმინი)
router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, adminOnly, getOrders);

router.route("/myorders").get(protect, getMyOrders);
router.route("/stats").get(protect, adminOnly, getOrderStats);
router.route("/:id").get(protect, getOrderById);

router.route("/:id/pay").post(protect, retryOrderPayment);
router.route("/:id/cancel").put(protect, cancelMyOrder);
router.route("/:id/status").put(protect, adminOnly, updateOrderStatus);

export default router;
