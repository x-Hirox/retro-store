import { Schema, model, Document } from "mongoose";

export interface ICollectionPage extends Document {
  brand: string;
  title: string;
  subtitle?: string;
  description: string;
  bannerColor: string;
}

const CollectionPageSchema = new Schema<ICollectionPage>({
  brand: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  description: { type: String, default: "" },
  bannerColor: { type: String, default: "#7c3aed" },
});

export default model<ICollectionPage>("CollectionPage", CollectionPageSchema);
