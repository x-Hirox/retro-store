import type { Response } from "express";
import User from "../models/User.js";
import GameScore from "../models/GameScore.js";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { displayName } from "../utils/publicUser.js";

export const saveScore = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "შესვლა საჭიროა ქულის შესანახად" });
      return;
    }

    const score = Math.max(0, Math.min(50_000_000, Number(req.body.score) || 0));
    const level = Math.max(0, Math.min(9999, Number(req.body.level) || 0));

    const user = await User.findById(userId).select("name firstName lastName email");
    if (!user) {
      res.status(401).json({ message: "მომხმარებელი ვერ მოიძებნა" });
      return;
    }

    const username = displayName(user) || user.email.split("@")[0];
    const avatar = username.slice(0, 1).toUpperCase();

    let doc = await GameScore.findOne({ userId });
    if (!doc) {
      doc = await GameScore.create({
        userId,
        username,
        avatar,
        highScore: score,
        highestLevel: level,
        levelsCleared: level > 0 ? 1 : 0,
      });
    } else {
      doc.username = username;
      doc.avatar = avatar;
      if (score > doc.highScore) doc.highScore = score;
      if (level > doc.highestLevel) doc.highestLevel = level;
      if (level > 0) doc.levelsCleared += 1;
      await doc.save();
    }

    res.json({
      highScore: doc.highScore,
      highestLevel: doc.highestLevel,
    });
  } catch (error) {
    console.error("saveScore", error);
    res.status(500).json({ message: "ქულა ვერ შეინახა" });
  }
};

export const leaderboard = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const rows = await GameScore.find()
      .sort({ highScore: -1, updatedAt: 1 })
      .limit(20)
      .select("userId username avatar highScore highestLevel updatedAt");
    res.json(rows);
  } catch {
    res.status(500).json({ message: "ლიდერბორდი ვერ ჩაიტვირთა" });
  }
};

export const challengeInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = String(req.params.userId || "");
    if (!userId.match(/^[a-f0-9]{24}$/i)) {
      res.status(400).json({ message: "არასწორი გამოწვევა" });
      return;
    }
    const doc = await GameScore.findOne({ userId }).select("username highScore highestLevel");
    if (!doc) {
      res.status(404).json({ message: "მოთამაშე ვერ მოიძებნა" });
      return;
    }
    res.json({
      username: doc.username,
      highScore: doc.highScore,
      highestLevel: doc.highestLevel,
    });
  } catch {
    res.status(500).json({ message: "გამოწვევა ვერ ჩაიტვირთა" });
  }
};

export const myGame = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "შესვლა საჭიროა" });
      return;
    }
    const doc = await GameScore.findOne({ userId });
    res.json({
      highScore: doc?.highScore || 0,
      highestLevel: doc?.highestLevel || 0,
      userId,
    });
  } catch {
    res.status(500).json({ message: "პროფილი ვერ ჩაიტვირთა" });
  }
};
