import express from "express";
import {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  googleAuth,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { rateLimit } from "../utils/security.js";

const router = express.Router();
const authLimit = rateLimit(15 * 60 * 1000, 12);

router.post("/register", authLimit, registerUser);
router.post("/verify-email", authLimit, verifyEmail);
router.post("/resend-verification", authLimit, resendVerification);
router.post("/login", authLimit, loginUser);
router.post("/google", authLimit, googleAuth);
router.post("/forgot-password", authLimit, forgotPassword);
router.post("/reset-password", authLimit, resetPassword);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);

export default router;
