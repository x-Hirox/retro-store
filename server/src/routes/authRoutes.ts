import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js"; // იმპორტი

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// პაროლის აღდგენის როუტი
router.post("/forgot-password", async (req, res): Promise<void> => {
  try {
    const { email } = req.body;

    // ვამოწმებთ, არსებობს თუ არა მომხმარებელი ბაზაში
    const user = await User.findOne({ email });

    if (user) {
      const resetLink = `http://localhost:5173/reset-password`;

      // ვუგზავნით რეალურ მეილს Nodemailer-ით
      await sendEmail({
        email: user.email,
        subject: "პაროლის აღდგენა - RetroStore",
        message: `გამარჯობა! მოთხოვნილია პაროლის აღდგენა. გადადი ლინკზე: ${resetLink}`,
      });
    }

    // უსაფრთხოების მიზნით, ვბრუნებთ ზოგად პასუხს მიუხედავად იმისა, მოიძებნა თუ არა მეილი
    res.status(200).json({
      message:
        "თუ აღნიშნული ელ-ფოსტა რეგისტრირებულია, აღდგენის ინსტრუქცია გამოგზავნილია. ✉️",
    });
  } catch (error: any) {
    console.error("Email send error:", error);
    res.status(500).json({
      message: "სერვერის შეცდომა მეილის გაგზავნისას",
      error: error.message,
    });
  }
});

export default router;
