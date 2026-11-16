import { Schema, model, Document } from "mongoose";

export interface ISellQuote extends Document {
  name: string;
  phone: string;
  email: string;
  city: string;
  payout: string;
  comment: string;
  items: { brand: string; name: string; condition: string; qty: number }[];
  createdAt: Date;
}

const SellQuoteSchema = new Schema<ISellQuote>({
  name: { type: String, required: true, maxlength: 80 },
  phone: { type: String, required: true, maxlength: 40 },
  email: { type: String, default: "", maxlength: 120 },
  city: { type: String, default: "", maxlength: 80 },
  payout: { type: String, default: "cash", maxlength: 40 },
  comment: { type: String, default: "", maxlength: 1000 },
  items: [
    {
      brand: String,
      name: String,
      condition: String,
      qty: { type: Number, default: 1 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default model<ISellQuote>("SellQuote", SellQuoteSchema);
