import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  discount?: number; // 🟢 ფასდაკლების პროცენტი
  category: string;
  imageUrl: string;
  stock: number;
  isHeroBanner?: boolean; // 🟢 მთავარი ბანერი
  platform?: string;
  genre?: string;
  isBestSeller?: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, default: 1 },
  isHeroBanner: { type: Boolean, default: false },
  platform: { type: String, default: "" },
  genre: { type: String, default: "" },
  isBestSeller: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default model<IProduct>("Product", ProductSchema);
