import { Schema, model, Document } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  createdAt: Date;
}

const NewsletterSchema = new Schema<INewsletterSubscriber>({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<INewsletterSubscriber>(
  "NewsletterSubscriber",
  NewsletterSchema,
);
