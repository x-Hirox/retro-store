import { Schema, model, Document } from "mongoose";

export interface IPlatformCard extends Document {
  brand: string;
  name: string;
  slug: string;
  imageUrl: string;
  year?: string;
  order: number;
}

const PlatformCardSchema = new Schema<IPlatformCard>({
  brand: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

export default model<IPlatformCard>("PlatformCard", PlatformCardSchema);
