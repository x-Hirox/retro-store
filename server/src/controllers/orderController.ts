import type { Response } from "express";
import Order from "../models/order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { clampText, isAdminEmail } from "../utils/security.js";

function unitPrice(product: { price: number; discount?: number }): number {
  const discount = Math.min(100, Math.max(0, Number(product.discount) || 0));
  return Math.round(Number(product.price) * (1 - discount / 100) * 100) / 100;
}

export const addOrderItems = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!req.user?.id) {
      res.status(401).json({ message: "ტოკენი არ მოიძებნა, წვდომა აკრძალულია" });
      return;
    }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400).json({ message: "შეკვეთაში პროდუქტები არ არის" });
      return;
    }
    if (orderItems.length > 30) {
      res.status(400).json({ message: "შეკვეთაში ძალიან ბევრი პროდუქტია" });
      return;
    }

    const buyer = await User.findById(req.user.id).select(
      "firstName lastName name",
    );
    const address = {
      fullName: clampText(
        shippingAddress?.fullName ||
          `${buyer?.firstName || ""} ${buyer?.lastName || ""}`.trim() ||
          buyer?.name,
        80,
      ),
      address: clampText(shippingAddress?.address, 120),
      city: clampText(shippingAddress?.city, 60),
      postalCode: clampText(shippingAddress?.postalCode, 20),
      phone: clampText(shippingAddress?.phone, 20),
    };
    if (!address.address || !address.city || !address.phone) {
      res.status(400).json({ message: "მისამართი ან ტელეფონი არასრულია" });
      return;
    }

    const decremented: { id: string; qty: number }[] = [];
    const pricedItems: {
      product: string;
      quantity: number;
      title: string;
      price: number;
      imageUrl: string;
    }[] = [];
    let totalPrice = 0;

    try {
      for (const item of orderItems) {
        const qty = Math.floor(Number(item.quantity));
        if (!Number.isFinite(qty) || qty < 1 || qty > 20) {
          throw new Error("bad-qty");
        }
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error("missing");
        }
        const updated = await Product.findOneAndUpdate(
          { _id: product._id, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { new: true },
        );
        if (!updated) {
          throw new Error("stock");
        }
        const price = unitPrice(product);
        decremented.push({ id: String(product._id), qty });
        pricedItems.push({
          product: String(product._id),
          quantity: qty,
          title: product.title,
          price,
          imageUrl: product.imageUrl,
        });
        totalPrice += price * qty;
      }
    } catch (err) {
      for (const item of decremented) {
        await Product.findByIdAndUpdate(item.id, {
          $inc: { stock: item.qty },
        });
      }
      if ((err as Error).message === "stock") {
        res.status(400).json({ message: "პროდუქტი გაიყიდა ან მარაგი არ ჰყოფნის" });
        return;
      }
      if ((err as Error).message === "missing") {
        res.status(400).json({ message: "პროდუქტი ვერ მოიძებნა" });
        return;
      }
      res.status(400).json({ message: "შეკვეთის მონაცემები არასწორია" });
      return;
    }

    const order = new Order({
      user: req.user.id,
      orderItems: pricedItems,
      shippingAddress: address,
      totalPrice: Math.round(totalPrice * 100) / 100,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "orderItems.product",
      "title imageUrl price discount",
    );

    if (!order) {
      res.status(404).json({ message: "შეკვეთა ვერ მოიძებნა" });
      return;
    }

    const ownerId = String(order.user);
    const isOwner = ownerId === req.user?.id;
    const dbUser = await User.findById(req.user?.id).select("email role");
    const isAdmin = Boolean(
      dbUser && (dbUser.role === "admin" || isAdminEmail(dbUser.email)),
    );
    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: "წვდომა აკრძალულია" });
      return;
    }

    res.status(200).json(order);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?.id })
      .populate("orderItems.product", "title imageUrl price")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const getOrders = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "user",
        select: "name fullName email",
      })
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const allowed = ["Pending", "Processing", "Delivered", "Cancelled"];
    const status = String(req.body.status || "");
    if (!allowed.includes(status)) {
      res.status(400).json({ message: "არასწორი სტატუსი" });
      return;
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: "შეკვეთა ვერ მოიძებნა" });
      return;
    }

    order.status = status as typeof order.status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const cancelMyOrder = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: "შეკვეთა ვერ მოიძებნა" });
      return;
    }
    if (String(order.user) !== req.user?.id) {
      res.status(403).json({ message: "წვდომა აკრძალულია" });
      return;
    }
    if (!["Pending", "Processing"].includes(order.status)) {
      res.status(400).json({
        message: "ამ სტატუსის შეკვეთის გაუქმება აღარ შეიძლება",
      });
      return;
    }

    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
    order.status = "Cancelled";
    await order.save();
    res.json({ message: "შეკვეთა გაუქმდა", order });
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};
