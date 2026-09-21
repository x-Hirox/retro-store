import type { Response } from "express";
import Order from "../models/order.js";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

// @desc    ახალი შეკვეთის შექმნა
// @route   POST /api/orders
// @access  Private (მხოლოდ ავტორიზებული მომხმარებლისთვის)
export const addOrderItems = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: "შეკვეთაში პროდუქტები არ არის" });
      return;
    }

    const order = new Order({
      user: req.user?.id, // მომხმარებლის ID ვარდება ავტორიზებული ტოკენიდან
      orderItems,
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "სერვერის შეცდომა" });
  }
};

// @desc    მომხმარებლის საკუთარი შეკვეთების ნახვა
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "სერვერის შეცდომა" });
  }
};

// @desc    ყველა შეკვეთის ნახვა (მხოლოდ ადმინისტრატორისთვის - კურიერისთვის/მართვისთვის)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "სერვერის შეცდომა" });
  }
};

// @desc    შეკვეთის სტატუსის განახლება (მაგ: Delivered)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: "შეკვეთა ვერ მოიძებნა" });
      return;
    }

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "სერვერის შეცდომა" });
  }
};
