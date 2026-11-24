import { Schema, model, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
  imageUrl: string;
  order: number;
}

const BrandSchema = new Schema<IBrand>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
});

export default model<IBrand>("Brand", BrandSchema);
