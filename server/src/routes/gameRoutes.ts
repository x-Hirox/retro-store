import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { rateLimit } from "../utils/security.js";
import {
  challengeInfo,
  leaderboard,
  myGame,
  saveScore,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/leaderboard", leaderboard);
router.get("/challenge/:userId", challengeInfo);
router.get("/me", protect, myGame);
router.post("/score", protect, rateLimit(60 * 1000, 20), saveScore);

export default router;
