import type { Request, Response } from "express";
import Order from "../models/order.js";
import {
  fetchBogStatus,
  fetchTbcStatus,
  shopReturnUrl,
  verifyBogSignature,
} from "../utils/payments.js";
import { frontendBaseUrl } from "../utils/sendEmail.js";

async function markOrder(
  order: InstanceType<typeof Order>,
  status: "paid" | "failed" | "pending",
) {
  if (order.paymentStatus === "paid") return order;
  order.paymentStatus = status;
  if (status === "paid" && order.status === "Pending") {
    order.status = "Processing";
    order.paidAt = new Date();
    order.statusHistory = [
      ...(order.statusHistory || []),
      { status: "Processing", at: new Date(), note: "გადახდა მიღებულია" },
    ];
  }
  await order.save();
  return order;
}

export async function syncBankPayment(order: InstanceType<typeof Order>) {
  if (!order.bankPaymentId || !order.paymentProvider) {
    return order.paymentStatus || "unpaid";
  }
  const status =
    order.paymentProvider === "tbc"
      ? await fetchTbcStatus(order.bankPaymentId)
      : await fetchBogStatus(order.bankPaymentId);
  await markOrder(order, status);
  return status;
}

export const tbcCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const payId = String(req.body?.PaymentId || req.body?.paymentId || "");
    if (!payId) {
      res.status(400).json({ message: "PaymentId აკლია" });
      return;
    }
    const order = await Order.findOne({ bankPaymentId: payId, paymentProvider: "tbc" });
    if (order) await syncBankPayment(order);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("TBC callback:", err);
    res.status(200).json({ ok: false });
  }
};

export const bogCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const raw = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(typeof req.body === "string" ? req.body : JSON.stringify(req.body || {}));
    const signature = String(req.headers["callback-signature"] || "");
    if (signature && !verifyBogSignature(raw, signature)) {
      console.error("BOG callback signature invalid");
    }
    let payload: { body?: { order_id?: string }; order_id?: string } = {};
    try {
      payload = JSON.parse(raw.toString("utf8"));
    } catch {
      payload = {};
    }
    const bankId = String(payload.body?.order_id || payload.order_id || "");
    if (bankId) {
      const order = await Order.findOne({
        bankPaymentId: bankId,
        paymentProvider: "bog",
      });
      if (order) await syncBankPayment(order);
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("BOG callback:", err);
    res.status(200).json({ ok: false });
  }
};

export const paymentReturn = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      res.redirect(`${frontendBaseUrl(req.headers.origin)}/profile?pay=fail`);
      return;
    }
    const status = await syncBankPayment(order);
    const pay = status === "paid" ? "ok" : status === "failed" ? "fail" : "pending";
    res.redirect(shopReturnUrl(String(order._id), req.headers.origin, pay));
  } catch (err) {
    console.error("Payment return:", err);
    res.redirect(shopReturnUrl(String(req.params.orderId), req.headers.origin, "pending"));
  }
};
