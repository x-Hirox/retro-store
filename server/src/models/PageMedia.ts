import { Schema, model, Document } from "mongoose";

export interface IPageMedia extends Document {
  key: string;
  title: string;
  imageUrl: string;
  order: number;
}

const PageMediaSchema = new Schema<IPageMedia>({
  key: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

export default model<IPageMedia>("PageMedia", PageMediaSchema);
