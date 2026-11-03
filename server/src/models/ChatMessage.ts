import { Schema, model, Document } from "mongoose";

export interface IChatMessage extends Document {
  visitorName?: string;
  email?: string;
  message: string;
  reply?: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  visitorName: { type: String, default: "სტუმარი" },
  email: { type: String, default: "" },
  message: { type: String, required: true },
  reply: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default model<IChatMessage>("ChatMessage", ChatMessageSchema);
