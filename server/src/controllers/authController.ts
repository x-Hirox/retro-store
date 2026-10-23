import type { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. დამხმარე ფუნქცია ელ-ფოსტის ფორმატის შესამოწმებლად (Regex)
const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// 2. დამხმარე ფუნქცია პაროლის შესამოწმებლად ბექენდზე
const validatePasswordBackend = (password: string): string | null => {
  if (password.length < 8)
    return "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან.";
  if (!/[A-Z]/.test(password))
    return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ ასოს (A-Z).";
  if (!/\d/.test(password))
    return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს (0-9).";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ სპეციალურ სიმბოლოს.";
  return null;
};

// 3. დამხმარე ფუნქცია JWT ტოკენის გენერაციისთვის (7 დღიანი სესია)
const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET || "super_secret_retro_key_123",
    { expiresIn: "7d" },
  );
};

// --- CONTROLLERS ---

// A. რეგისტრაცია (Sign Up) - იგზავნება აქტივაციის მეილი
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!email || !validateEmailFormat(email)) {
      res
        .status(400)
        .json({ message: "გთხოვთ მიუთითოთ სწორი ელ-ფოსტის მისამართი!" });
      return;
    }

    const passwordError = validatePasswordBackend(password);
    if (passwordError) {
      res.status(400).json({ message: passwordError });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "მომხმარებელი ამ მეილით უკვე არსებობს" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });

    const frontendUrl =
      process.env.NODE_ENV === "production"
        ? "https://retrobit.ge"
        : "http://localhost:5173";

    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}&email=${user.email}`;

    await sendEmail({
      email: user.email,
      subject: "ანგარიშის აქტივაცია - RetroStore",
      message: `გამარჯობა! მადლობა RetroStore-ზე დარეგისტრირებისთვის.\n\nგთხოვთ გაააქტიუროთ თქვენი ანგარიში შემდეგ ბმულზე გადასვლით:\n\n${verificationLink}\n\nთუ ეს ანგარიში თქვენ არ შეგიქმნიათ, უბრალოდ უგულებელყავით ეს წერილი.`,
    });

    res.status(201).json({
      message:
        "რეგისტრაცია წარმატებით დასრულდა! გთხოვთ შეამოწმოთ თქვენი ელ-ფოსტა ანგარიშის გასააქტიურებლად. ✉️",
    });
  } catch (error: any) {
    res.status(500).json({ message: "სერვერის შეცდომა", error: error.message });
  }
};

// B. ელ-ფოსტის დადასტურება (Verify Email)
export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      res.status(400).json({ message: "არასწორი მოთხოვნა." });
      return;
    }

    const user = await User.findOne({ email, verificationToken: token });

    if (!user) {
      res
        .status(400)
        .json({ message: "აქტივაციის ბმული არასწორია ან უკვე გამოყენებულია." });
      return;
    }

    user.isVerified = true;
    user.verificationToken = null as any;
    await user.save();

    res.status(200).json({
      message:
        "ანგარიში წარმატებით გააქტიურდა! ახლა შეგიძლიათ შეხვიდეთ სისტემაში.",
    });
  } catch (error: any) {
    res.status(500).json({ message: "სერვერის შეცდომა", error: error.message });
  }
};

// C. შესვლა სისტემაში (Login)
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "არასწორი მეილი ან პაროლი" });
      return;
    }

    if (!user.isVerified) {
      res.status(400).json({
        message:
          "თქვენი ანგარიში ჯერ არ არის გააქტიურებული. გთხოვთ შეამოწმოთ ელ-ფოსტა!",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "არასწორი მეილი ან პაროლი" });
      return;
    }

    const token = generateToken(user._id.toString(), (user as any).role);

    res.status(200).json({
      message: "წარმატებული ავტორიზაცია",
      token,
      user: {
        id: user._id,
        name: (user as any).name,
        email: user.email,
        role: (user as any).role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "სერვერის შეცდომა", error: error.message });
  }
};

// D. Google ავტორიზაცია (Google Auth)
export const googleAuth = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res.status(400).json({ message: "Google ტოკენი ვერ მოიძებნა." });
      return;
    }

    // 🟢 დამატებულია await და as string ტიპიზაცია
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ message: "Google ავტორიზაცია ვერ განხორციელდა." });
      return;
    }

    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36).slice(-10),
        salt,
      );

      user = await User.create({
        email,
        name: name || "Google User",
        password: randomPassword,
        isVerified: true, // Google-ის მეილი უკვე ვერიფიცირებულია
      });
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const token = generateToken(
      user._id.toString(),
      (user as any).role || "user",
    );

    res.status(200).json({
      message: "წარმატებული ავტორიზაცია Google-ით",
      token,
      user: {
        id: user._id,
        name: (user as any).name,
        email: user.email,
        role: (user as any).role || "user",
      },
    });
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    res.status(500).json({
      message: "სერვერის შეცდომა Google ავტორიზაციისას",
      error: error.message,
    });
  }
};

// E. პაროლის აღდგენის მოთხოვნა (Forgot Password)
export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      const frontendUrl =
        process.env.NODE_ENV === "production"
          ? "https://retrobit.ge"
          : "http://localhost:5173";

      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&email=${user.email}`;

      await sendEmail({
        email: user.email,
        subject: "პაროლის აღდგენა - RetroStore",
        message: `გამარჯობა! მოთხოვნილია პაროლის აღდგენა. გადადი შემდეგ ბმულზე (ლინკი ძალაშია 15 წუთი):\n\n${resetLink}\n\nთუ ეს მოთხოვნა შენ არ გეკუთვნის, უბრალოდ იგნორირება გაუკეთე ამ წერილს.`,
      });
    }

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
};

// F. ახალი პაროლის დაყენება (Reset Password)
export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, email, newPassword } = req.body;

    const passwordError = validatePasswordBackend(newPassword);
    if (passwordError) {
      res.status(400).json({ message: passwordError });
      return;
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res
        .status(400)
        .json({ message: "აღდგენის ბმული არასწორია ან ვადა გასულია." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = null as any;
    user.resetPasswordExpires = null as any;
    await user.save();

    res.status(200).json({
      message: "პაროლი წარმატებით შეიცვალა! ახლა შეგიძლია შეხვიდე სისტემაში.",
    });
  } catch (error: any) {
    res.status(500).json({ message: "სერვერის შეცდომა", error: error.message });
  }
};
