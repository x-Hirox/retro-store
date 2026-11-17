import mongoose, { Schema, Document } from "mongoose";
import {
  ORDER_STATUSES,
  type OrderStatus,
} from "../utils/orderStatus.js";

interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  title?: string;
  price?: number;
  imageUrl?: string;
}

export interface IStatusEvent {
  status: OrderStatus;
  at: Date;
  note?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: {
    fullName?: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  totalPrice: number;
  paymentMethod?: string;
  paymentStatus?: "unpaid" | "pending" | "paid" | "failed";
  paymentProvider?: "tbc" | "bog" | null;
  bankPaymentId?: string | null;
  paidAt?: Date | null;
  status: OrderStatus;
  trackingCode?: string;
  courierName?: string;
  adminNote?: string;
  statusHistory: IStatusEvent[];
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  cancelledAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User", // ვუკავშირებთ ჩვენს User მოდელს
    },
    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product", // ვუკავშირებთ Product მოდელს
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        title: { type: String, default: "" },
        price: { type: Number, default: 0 },
        imageUrl: { type: String, default: "" },
      },
    ],
    shippingAddress: {
      fullName: { type: String, default: "" },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash", "apple_pay", "google_pay"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed"],
      default: "unpaid",
    },
    paymentProvider: {
      type: String,
      enum: ["tbc", "bog"],
    },
    bankPaymentId: { type: String, default: null },
    paidAt: { type: Date, default: null },
    status: {
      type: String,
      required: true,
      enum: ORDER_STATUSES,
      default: "Pending",
    },
    trackingCode: { type: String, default: "" },
    courierName: { type: String, default: "" },
    adminNote: { type: String, default: "" },
    statusHistory: [
      {
        status: { type: String, enum: ORDER_STATUSES },
        at: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
    shippedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  {
    timestamps: true, // ავტომატურად უმატებს შექმნის და განახლების თარიღებს
  },
);

export default mongoose.model<IOrder>("Order", orderSchema);
