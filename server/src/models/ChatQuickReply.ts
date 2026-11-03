import { Schema, model, Document } from "mongoose";

export interface IChatQuickReply extends Document {
  title: string;
  description: string;
  icon: string;
  reply: string;
  order: number;
}

const ChatQuickReplySchema = new Schema<IChatQuickReply>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  icon: { type: String, default: "💬" },
  reply: { type: String, required: true },
  order: { type: Number, default: 0 },
});

export default model<IChatQuickReply>("ChatQuickReply", ChatQuickReplySchema);
