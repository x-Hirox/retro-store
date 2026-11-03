import { Schema, model, Document } from "mongoose";

export interface IFaq extends Document {
  question: string;
  answer: string;
  order: number;
  collectionSlug?: string;
}

const FaqSchema = new Schema<IFaq>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  collectionSlug: { type: String, default: "" },
});

export default model<IFaq>("Faq", FaqSchema);
