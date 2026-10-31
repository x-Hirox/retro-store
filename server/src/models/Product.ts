import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  discount?: number; // 🟢 ფასდაკლება % (მაგ: 10, 20, 50)
  category: string;
  imageUrl: string;
  stock: number;
  isHeroBanner?: boolean; // 🟢 მთავარი ბანერის იდენტიფიკატორი
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // 🟢 ნაგულისხმევად 0%
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, default: 1 },
  isHeroBanner: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default model<IProduct>("Product", ProductSchema);
