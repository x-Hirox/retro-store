import { Schema, model, Document } from "mongoose";

export interface IProductColor {
  name: string;
  hex: string;
  imageUrl?: string;
  stock?: number;
  price?: number | null;
  discount?: number | null;
}

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  discount?: number; // 🟢 ფასდაკლების პროცენტი
  category: string;
  imageUrl: string;
  images?: string[];
  colors?: IProductColor[];
  stock: number;
  isHeroBanner?: boolean; // 🟢 მთავარი ბანერი
  platform?: string;
  genre?: string;
  tags?: string[];
  condition?: "new" | "used" | "refurbished";
  isBestSeller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  images: { type: [String], default: [] },
  colors: {
    type: [
      new Schema(
        {
          name: { type: String, required: true },
          hex: { type: String, default: "#111111" },
          imageUrl: { type: String, default: "" },
          stock: { type: Number, default: 0, min: 0 },
          price: { type: Number, default: null },
          discount: { type: Number, default: null },
        },
        { _id: false },
      ),
    ],
    default: [],
  },
  stock: { type: Number, required: true, default: 1 },
  isHeroBanner: { type: Boolean, default: false },
  platform: { type: String, default: "" },
  genre: { type: String, default: "" },
  tags: { type: [String], default: [] },
  condition: { type: String, default: "" },
  isBestSeller: { type: Boolean, default: false },
}, { timestamps: true });

export default model<IProduct>("Product", ProductSchema);
