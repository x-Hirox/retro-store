import mongoose, { Document, Schema } from "mongoose";

export interface IGameScore extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  avatar: string;
  highScore: number;
  highestLevel: number;
  levelsCleared: number;
  updatedAt: Date;
  createdAt: Date;
}

const gameScoreSchema = new Schema<IGameScore>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    username: { type: String, default: "Player", maxlength: 80 },
    avatar: { type: String, default: "", maxlength: 80 },
    highScore: { type: Number, default: 0, min: 0 },
    highestLevel: { type: Number, default: 0, min: 0 },
    levelsCleared: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

gameScoreSchema.index({ highScore: -1 });

export default mongoose.model<IGameScore>("GameScore", gameScoreSchema);
