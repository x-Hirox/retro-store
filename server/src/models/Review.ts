import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  name: string;
  text: string;
  stars: number;
  avatarUrl?: string;
  productImageUrl?: string;
  verified: boolean;
  order: number;
  collectionSlug?: string;
}

const ReviewSchema = new Schema<IReview>({
  name: { type: String, required: true },
  text: { type: String, required: true },
  stars: { type: Number, default: 5, min: 1, max: 5 },
  avatarUrl: { type: String, default: "" },
  productImageUrl: { type: String, default: "" },
  verified: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  collectionSlug: { type: String, default: "" },
});

export default model<IReview>("Review", ReviewSchema);
