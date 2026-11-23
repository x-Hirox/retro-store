import type { Response } from "express";
import Order from "../models/order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { clampText, isAdminEmail } from "../utils/security.js";
import { normalizeGePhone } from "../utils/validate.js";
import {
  bankConfigured,
  createBankPayment,
  type PayMethod,
} from "../utils/payments.js";
import { syncBankPayment } from "./paymentController.js";
import {
  CUSTOMER_CANCELABLE,
  isOrderStatus,
  STATUS_LABEL_KA,
  type OrderStatus,
} from "../utils/orderStatus.js";
import { trySendEmail } from "../utils/sendEmail.js";

async function changeStock(
  productId: unknown,
  qty: number,
  color?: string,
) {
  const abs = Math.abs(qty);
  if (color) {
    const filter =
      qty < 0
        ? {
            _id: productId,
            colors: { $elemMatch: { name: color, stock: { $gte: abs } } },
          }
        : { _id: productId, colors: { $elemMatch: { name: color } } };
    return Product.findOneAndUpdate(
      filter,
      { $inc: { stock: qty, "colors.$.stock": qty } },
      { new: true },
    );
  }
  const filter =
    qty < 0
      ? { _id: productId, stock: { $gte: abs } }
      : { _id: productId };
  return Product.findOneAndUpdate(
    filter,
    { $inc: { stock: qty } },
    { new: true },
  );
}

async function restoreStock(order: {
  status: string;
  orderItems: { product: unknown; quantity: number; color?: string }[];
}) {
  if (order.status === "Cancelled") return;
  for (const item of order.orderItems) {
    await changeStock(item.product, item.quantity, item.color || "");
  }
}

function unitPrice(
  product: {
    price: number;
    discount?: number;
    colors?: { name?: string; price?: number | null; discount?: number | null }[];
  },
  colorName?: string,
): number {
  const color = colorName
    ? product.colors?.find((row) => row.name === colorName)
    : undefined;
  const price =
    color && Number(color.price) > 0 ? Number(color.price) : Number(product.price);
  const discountRaw =
    color && color.discount != null && Number.isFinite(Number(color.discount))
      ? Number(color.discount)
      : Number(product.discount) || 0;
  const discount = Math.min(100, Math.max(0, discountRaw || 0));
  return Math.round(price * (1 - discount / 100));
}

function orderTotal(pricedItems: { product: string; quantity: number; price: number }[]) {
  const subtotal = pricedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const distinct = new Set(pricedItems.map((item) => item.product)).size;
  if (distinct < 2) return subtotal;
  const together = Math.round(subtotal * 0.99);
  return Math.min(together, subtotal - 1);
}

export const addOrderItems = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

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
      phone: normalizeGePhone(shippingAddress?.phone) || "",
    };
    if (!address.address || !address.city || !address.phone) {
      res.status(400).json({ message: "მისამართი ან ტელეფონი არასრულია" });
      return;
    }

    const decremented: { id: string; qty: number; color: string }[] = [];
    const pricedItems: {
      product: string;
      quantity: number;
      title: string;
      price: number;
      imageUrl: string;
      color: string;
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
        const color = clampText(item.color, 40);
        const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
        if (hasColors && !color) {
          throw new Error("stock");
        }
        const updated = await changeStock(
          product._id,
          -qty,
          hasColors ? color : "",
        );
        if (!updated) {
          throw new Error("stock");
        }
        const price = unitPrice(product, hasColors ? color : "");
        const colorMatch = product.colors?.find((row) => row.name === color);
        decremented.push({ id: String(product._id), qty, color: hasColors ? color : "" });
        pricedItems.push({
          product: String(product._id),
          quantity: qty,
          title: product.title,
          price,
          imageUrl: colorMatch?.imageUrl || product.imageUrl,
          color,
        });
        totalPrice += price * qty;
      }
      totalPrice = orderTotal(pricedItems);
    } catch (err) {
      for (const item of decremented) {
        await changeStock(item.id, item.qty, item.color);
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

    const allowedPay = ["card", "cash", "apple_pay", "google_pay"];
    const pay = (allowedPay.includes(String(paymentMethod))
      ? String(paymentMethod)
      : "card") as PayMethod;
    const total = Math.round(totalPrice * 100) / 100;

    const order = new Order({
      user: req.user.id,
      orderItems: pricedItems,
      shippingAddress: address,
      totalPrice: total,
      paymentMethod: pay,
      paymentStatus: pay === "cash" ? "unpaid" : "pending",
      statusHistory: [{ status: "Pending", at: new Date(), note: "შეკვეთა მიღებულია" }],
    });

    const createdOrder = await order.save();

    if (pay === "cash") {
      res.status(201).json({
        ...createdOrder.toObject(),
        paymentRequired: false,
      });
      return;
    }

    if (!bankConfigured()) {
      res.status(201).json({
        ...createdOrder.toObject(),
        paymentRequired: true,
        paymentError:
          "ბანკის გასაღებები ჯერ არ არის ჩაწერილი Render-ზე (TBC ან BOG). შეკვეთა შენახულია.",
      });
      return;
    }

    try {
      const started = await createBankPayment({
        orderId: String(createdOrder._id),
        amount: total,
        method: pay,
        origin: req.headers.origin || undefined,
        items: pricedItems.map((item) => ({
          id: item.product,
          title: item.color ? `${item.title} — ${item.color}` : item.title,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      createdOrder.paymentProvider = started.provider;
      createdOrder.bankPaymentId = started.bankPaymentId;
      createdOrder.paymentStatus = "pending";
      await createdOrder.save();
      res.status(201).json({
        ...createdOrder.toObject(),
        paymentRequired: true,
        redirectUrl: started.redirectUrl,
      });
    } catch (err) {
      console.error("Bank payment start:", err);
      createdOrder.paymentStatus = "failed";
      await createdOrder.save();
      res.status(201).json({
        ...createdOrder.toObject(),
        paymentRequired: true,
        paymentError:
          err instanceof Error
            ? err.message
            : "ბანკის გვერდი ვერ გაიხსნა. სცადე ხელახლა პროფილიდან.",
      });
    }
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

    if (
      order.paymentStatus === "pending" &&
      order.bankPaymentId &&
      order.paymentMethod !== "cash"
    ) {
      await syncBankPayment(order);
    }

    res.status(200).json(order);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const retryOrderPayment = async (
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
    if (order.paymentMethod === "cash") {
      res.status(400).json({ message: "ეს შეკვეთა კურიერთან გადაიხდება" });
      return;
    }
    if (order.paymentStatus === "paid") {
      res.json({ redirectUrl: null, paymentStatus: "paid" });
      return;
    }
    if (!bankConfigured()) {
      res.status(400).json({
        message: "ბანკის გასაღებები არ არის გამართული (TBC_API_KEY / BOG_CLIENT_ID)",
      });
      return;
    }
    const started = await createBankPayment({
      orderId: String(order._id),
      amount: order.totalPrice,
      method: (order.paymentMethod || "card") as PayMethod,
      origin: req.headers.origin || undefined,
      items: order.orderItems.map((item) => ({
        id: String(item.product),
        title: item.color
          ? `${item.title || "item"} — ${item.color}`
          : item.title || "item",
        quantity: item.quantity,
        price: item.price || 0,
      })),
    });
    order.paymentProvider = started.provider;
    order.bankPaymentId = started.bankPaymentId;
    order.paymentStatus = "pending";
    await order.save();
    res.json({ redirectUrl: started.redirectUrl, paymentStatus: "pending" });
  } catch (err) {
    console.error("Retry payment:", err);
    res.status(500).json({
      message:
        err instanceof Error ? err.message : "ბანკის გადახდა ვერ დაიწყო",
    });
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
    const status = String(req.query.status || "");
    const q = clampText(String(req.query.q || ""), 80);
    const filter: Record<string, unknown> = {};
    if (isOrderStatus(status)) filter.status = status;
    const pay = String(req.query.payment || "");
    if (["unpaid", "pending", "paid", "failed"].includes(pay)) {
      filter.paymentStatus = pay;
    }

    let orders = await Order.find(filter)
      .populate({
        path: "user",
        select: "name firstName lastName email phone",
      })
      .sort({ createdAt: -1 })
      .limit(300);

    if (q) {
      const needle = q.toLowerCase();
      orders = orders.filter((order) => {
        const user = order.user as {
          email?: string;
          name?: string;
          firstName?: string;
          lastName?: string;
        } | null;
        const hay = [
          String(order._id),
          order.shippingAddress?.fullName,
          order.shippingAddress?.phone,
          order.shippingAddress?.city,
          order.shippingAddress?.address,
          order.trackingCode,
          user?.email,
          user?.name,
          user?.firstName,
          user?.lastName,
          ...order.orderItems.map((item) => item.title),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(needle);
      });
    }

    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const getOrderStats = async (
  _req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const [grouped, paidAgg, products, recent] = await Promise.all([
      Order.aggregate<{ _id: string; count: number; total: number }>([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            total: { $sum: "$totalPrice" },
          },
        },
      ]),
      Order.aggregate<{ _id: null; paid: number; unpaid: number }>([
        {
          $group: {
            _id: null,
            paid: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalPrice", 0],
              },
            },
            unpaid: {
              $sum: {
                $cond: [
                  { $in: ["$paymentStatus", ["unpaid", "pending", "failed"]] },
                  "$totalPrice",
                  0,
                ],
              },
            },
          },
        },
      ]),
      Product.find({ isHeroBanner: { $ne: true } })
        .select("title stock price imageUrl")
        .sort({ stock: 1 })
        .limit(80),
      Order.find({})
        .populate("user", "email firstName lastName name")
        .sort({ createdAt: -1 })
        .limit(8)
        .select("status totalPrice paymentStatus createdAt shippingAddress"),
    ]);

    const byStatus: Record<string, { count: number; total: number }> = {};
    let allCount = 0;
    for (const row of grouped) {
      byStatus[row._id] = { count: row.count, total: row.total };
      allCount += row.count;
    }

    const lowStock = products.filter((p) => (p.stock ?? 0) <= 3);
    const soldOut = products.filter((p) => (p.stock ?? 0) <= 0);

    res.json({
      byStatus,
      allCount,
      paidRevenue: paidAgg[0]?.paid || 0,
      outstanding: paidAgg[0]?.unpaid || 0,
      lowStock,
      soldOutCount: soldOut.length,
      productCount: products.length,
      recent,
    });
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const status = String(req.body.status || "");
    if (!isOrderStatus(status)) {
      res.status(400).json({ message: "არასწორი სტატუსი" });
      return;
    }

    const order = await Order.findById(req.params.id).populate(
      "user",
      "email firstName lastName name",
    );
    if (!order) {
      res.status(404).json({ message: "შეკვეთა ვერ მოიძებნა" });
      return;
    }

    const prev = order.status;
    if (status === "Cancelled" && prev !== "Cancelled") {
      await restoreStock(order);
      order.cancelledAt = new Date();
    }

    order.status = status;
    if (typeof req.body.trackingCode === "string") {
      order.trackingCode = clampText(req.body.trackingCode, 40);
    }
    if (typeof req.body.courierName === "string") {
      order.courierName = clampText(req.body.courierName, 60);
    }
    if (typeof req.body.adminNote === "string") {
      order.adminNote = clampText(req.body.adminNote, 400);
    }
    const pay = String(req.body.paymentStatus || "");
    if (pay === "unpaid" || pay === "pending" || pay === "paid" || pay === "failed") {
      order.paymentStatus = pay;
      if (pay === "paid" && !order.paidAt) order.paidAt = new Date();
    }
    if (status === "Shipped") order.shippedAt = order.shippedAt || new Date();
    if (status === "Delivered") {
      order.deliveredAt = order.deliveredAt || new Date();
      if (order.paymentMethod === "cash" && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.paidAt = order.paidAt || new Date();
      }
    }

    const note = clampText(req.body.note, 200);
    if (prev !== status) {
      order.statusHistory = [
        ...(order.statusHistory || []),
        { status, at: new Date(), note },
      ];
    }

    const updatedOrder = await order.save();

    const buyer = order.user as {
      email?: string;
      firstName?: string;
      name?: string;
    } | null;
    if (buyer?.email && prev !== status) {
      const label = STATUS_LABEL_KA[status as OrderStatus];
      const track = order.trackingCode
        ? `\nთრექინგი: ${order.trackingCode}`
        : "";
      void trySendEmail({
        email: buyer.email,
        subject: `RetroBit — შეკვეთა ${label}`,
        message: `გამარჯობა ${buyer.firstName || buyer.name || ""}!\n\nშენი შეკვეთა #${String(order._id).slice(-8).toUpperCase()} ახლა: ${label}.${track}\n\nნახე პროფილში: https://retrobit.ge/profile`,
      });
    }

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
    if (!CUSTOMER_CANCELABLE.includes(order.status)) {
      res.status(400).json({
        message: "ამ სტატუსის შეკვეთის გაუქმება აღარ შეიძლება",
      });
      return;
    }

    await restoreStock(order);
    order.status = "Cancelled";
    order.cancelledAt = new Date();
    order.statusHistory = [
      ...(order.statusHistory || []),
      { status: "Cancelled", at: new Date(), note: "მომხმარებელმა გააუქმა" },
    ];
    await order.save();
    res.json({ message: "შეკვეთა გაუქმდა", order });
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};
