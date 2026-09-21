import mongoose, { Schema, Document } from "mongoose";

// ინტერფეისი შეკვეთის პროდუქტისთვის
interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

// მთავარი ინტერფეისი შეკვეთისთვის
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  totalPrice: number;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  createdAt: Date;
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
      },
    ],
    shippingAddress: {
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
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // ავტომატურად უმატებს შექმნის და განახლების თარიღებს
  },
);

export default mongoose.model<IOrder>("Order", orderSchema);
