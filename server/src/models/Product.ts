import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, default: 1 },
  createdAt: { type: Date, default: Date.now },
});
const products = [
  {
    title: "Pixel Paradise Hero Banner",
    description:
      "Retro gaming online store collection banner with classic aesthetics.",
    price: 0,
    category: "Banner",
    imageUrl: "აქ ჩასვი პირველი სურათის (ბანერის) URL ბმული",
    stock: 10,
  },
  {
    title: "Classic Retro Handheld Console",
    description: "Vintage handheld gaming device with glowing vibrant screen.",
    price: 149.99,
    category: "Handhelds",
    imageUrl: "აქ ჩასვი ხელის კონსოლის სურათის URL ბმული",
    stock: 15,
  },
  {
    title: "Vintage Home Video Game Console",
    description:
      "Classic home console in dark matte finish with retro controller.",
    price: 199.99,
    category: "Consoles",
    imageUrl: "აქ ჩასვი სახლის კონსოლის სურათის URL ბმული",
    stock: 8,
  },
  {
    title: "Retro 8-Bit Game Cartridge Set",
    description: "Classic video game cartridge and gaming controller set.",
    price: 49.99,
    category: "Accessories",
    imageUrl: "აქ ჩასვი კარტრიჯის სურათის URL ბმული",
    stock: 25,
  },
];
export default model<IProduct>("Product", ProductSchema);
