import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  googleAuth,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// 1. რეგისტრაცია და მეილის დადასტურება
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);

// 2. ავტორიზაცია (רגულარული და Google)
router.post("/login", loginUser);
router.post("/google", googleAuth);

// 3. პაროლის აღდგენა
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
