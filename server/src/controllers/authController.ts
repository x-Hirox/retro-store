import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { frontendBaseUrl, trySendEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";
import { getJwtSecret, isAdminEmail } from "../utils/security.js";
import { publicUser, displayName } from "../utils/publicUser.js";
import { clampText } from "../utils/security.js";

function googleClient() {
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

function resolveRole(email: string, role?: string): "admin" | "customer" {
  if (isAdminEmail(email) || role === "admin") return "admin";
  return "customer";
}

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
  return jwt.sign({ id: userId, role }, getJwtSecret(), { expiresIn: "7d" });
};

function makeActivation() {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    code: String(crypto.randomInt(100000, 1000000)),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

async function sendActivationEmail(
  req: Request,
  user: { email: string; firstName?: string; name?: string },
  token: string,
  code: string,
): Promise<boolean> {
  const frontendUrl = frontendBaseUrl(req.headers.origin);
  const link = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`;
  const hello = user.firstName || user.name || "";
  return trySendEmail({
    email: user.email,
    subject: `RetroBit აქტივაციის კოდი: ${code}`,
    message: `გამარჯობა ${hello}!\n\nშენი აქტივაციის კოდია: ${code}\nკოდი ძალაშია 24 საათი.\n\nან გახსენი ეს ბმული:\n${link}\n\nთუ ეს ანგარიში შენ არ შეგიქმნია, უგულებელყავი ეს წერილი.`,
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#111">
        <h2>RetroBit აქტივაცია</h2>
        <p>გამარჯობა ${hello}!</p>
        <p>შენი 6-ნიშნა კოდია:</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:800;color:#7c3aed">${code}</p>
        <p>კოდი ძალაშია 24 საათი.</p>
        <p><a href="${link}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">ანგარიშის აქტივაცია</a></p>
        <p style="font-size:12px;color:#555">თუ ღილაკი არ იხსნება:<br>${link}</p>
      </div>`,
  });
}

// --- CONTROLLERS ---

// A. რეგისტრაცია (Sign Up) - იგზავნება აქტივაციის მეილი
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const firstName = clampText(req.body.firstName || req.body.name, 40);
    const lastName = clampText(req.body.lastName, 40);
    const phone = clampText(req.body.phone, 20);
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const { password } = req.body;
    const name = displayName({ firstName, lastName }) || firstName;

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

    if (!firstName) {
      res.status(400).json({ message: "სახელი აუცილებელია" });
      return;
    }

    const { token, code, expires } = makeActivation();
    const user = await User.create({
      name,
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: token,
      verificationCode: code,
      verificationExpires: expires,
    });

    const mailSent = await sendActivationEmail(req, user, token, code);

    res.status(201).json({
      mailSent,
      email: user.email,
      message: mailSent
        ? "რეგისტრაცია წარმატებულია. მეილზე გამოგიგზავნეთ 6-ნიშნა აქტივაციის კოდი."
        : "ანგარიში შეიქმნა, მაგრამ მეილი ვერ გაიგზავნა. დააჭირე „კოდის ხელახლა გაგზავნა“.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

// B. ელ-ფოსტის დადასტურება (Verify Email)
export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = String(req.body.token || "");
    const code = String(req.body.code || "").replace(/\s/g, "");
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!email || (!token && !code)) {
      res.status(400).json({ message: "არასწორი მოთხოვნა." });
      return;
    }

    const existing = await User.findOne({ email });
    if (!existing) {
      res.status(400).json({ message: "მომხმარებელი ვერ მოიძებნა." });
      return;
    }
    if (existing.isVerified) {
      res.status(200).json({
        already: true,
        message: "ანგარიში უკვე გააქტიურებულია. შეგიძლია შეხვიდე.",
      });
      return;
    }

    const user = token
      ? await User.findOne({ email, verificationToken: token })
      : await User.findOne({ email, verificationCode: code });

    if (!user) {
      res.status(400).json({
        message: "აქტივაციის კოდი ან ბმული არასწორია.",
      });
      return;
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      res.status(400).json({
        message: "კოდს ვადა გაუვიდა. ხელახლა გაგზავნე აქტივაცია.",
      });
      return;
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationCode = null;
    user.verificationExpires = null;
    const role = resolveRole(user.email, user.role);
    user.role = role;
    await user.save();

    res.status(200).json({
      message: "ანგარიში გააქტიურდა. ახლა შეგიძლია შეხვიდე.",
      token: generateToken(user._id.toString(), role),
      user: publicUser(user),
    });
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const resendVerification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    if (!email || !validateEmailFormat(email)) {
      res.status(400).json({ message: "გთხოვთ მიუთითოთ სწორი ელ-ფოსტა." });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(200).json({
        message: "თუ ანგარიში არსებობს, აქტივაციის კოდი გამოგიგზავნით.",
      });
      return;
    }
    if (user.isVerified) {
      res.status(200).json({
        already: true,
        message: "ანგარიში უკვე გააქტიურებულია. შეგიძლია შეხვიდე.",
      });
      return;
    }

    const { token, code, expires } = makeActivation();
    user.verificationToken = token;
    user.verificationCode = code;
    user.verificationExpires = expires;
    await user.save();

    const mailSent = await sendActivationEmail(req, user, token, code);
    res.status(200).json({
      mailSent,
      email: user.email,
      message: mailSent
        ? "ახალი აქტივაციის კოდი გამოგიგზავნეთ მეილზე."
        : "კოდი ვერ გაიგზავნა. სცადე რამდენიმე წამში.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

// C. შესვლა სისტემაში (Login)
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const { password } = req.body;

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

    const role = resolveRole(user.email, user.role);
    if (user.role !== role) {
      user.role = role;
      await user.save();
    }

    const token = generateToken(user._id.toString(), role);

    res.status(200).json({
      message: "წარმატებული ავტორიზაცია",
      token,
      user: publicUser(user),
    });
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
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

    if (!process.env.GOOGLE_CLIENT_ID) {
      res.status(500).json({ message: "Google ავტორიზაცია არ არის გამართული." });
      return;
    }

    const ticket = await googleClient().verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ message: "Google ავტორიზაცია ვერ განხორციელდა." });
      return;
    }

    const { email, name, given_name, family_name } = payload;
    const firstName = clampText(given_name || name, 40);
    const lastName = clampText(family_name, 40);

    let user = await User.findOne({ email });

    const role = resolveRole(email, user?.role);

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(
        crypto.randomBytes(24).toString("hex"),
        salt,
      );

      user = await User.create({
        email,
        name: displayName({ firstName, lastName }) || name || "Google User",
        firstName,
        lastName,
        password: randomPassword,
        isVerified: true,
        role,
      });
    } else {
      let dirty = false;
      if (!user.isVerified) {
        user.isVerified = true;
        dirty = true;
      }
      if (user.role !== role) {
        user.role = role;
        dirty = true;
      }
      if (dirty) await user.save();
    }

    const token = generateToken(user._id.toString(), role);

    res.status(200).json({
      message: "წარმატებული ავტორიზაცია Google-ით",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({
      message: "სერვერის შეცდომა Google ავტორიზაციისას",
    });
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select(
      "name firstName lastName phone address city email role",
    );
    if (!user) {
      res.status(401).json({ message: "მომხმარებელი ვერ მოიძებნა" });
      return;
    }
    const role = resolveRole(user.email, user.role);
    if (user.role !== role) {
      user.role = role;
      await user.save();
    }
    res.json({ user: publicUser(user) });
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(401).json({ message: "მომხმარებელი ვერ მოიძებნა" });
      return;
    }
    user.firstName = clampText(req.body.firstName, 40);
    user.lastName = clampText(req.body.lastName, 40);
    user.phone = clampText(req.body.phone, 20);
    user.address = clampText(req.body.address, 120);
    user.city = clampText(req.body.city, 60);
    user.name = displayName(user);
    await user.save();
    res.json({ message: "პროფილი განახლდა", user: publicUser(user) });
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

// E. პაროლის აღდგენის მოთხოვნა (Forgot Password)
export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    if (!email || !validateEmailFormat(email)) {
      res.status(400).json({ message: "გთხოვთ მიუთითოთ სწორი ელ-ფოსტა." });
      return;
    }

    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      const frontendUrl = frontendBaseUrl(req.headers.origin);
      const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(user.email)}`;

      const mailSent = await trySendEmail({
        email: user.email,
        subject: "პაროლის აღდგენა - RetroBit",
        message: `გამარჯობა!\n\nმოთხოვნილია პაროლის აღდგენა RetroBit-ზე. ბმული ძალაშია 15 წუთი:\n\n${resetLink}\n\nთუ ეს მოთხოვნა შენ არ გეკუთვნის, უგულებელყავი ეს წერილი.`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#111">
          <h2>RetroBit — პაროლის აღდგენა</h2>
          <p>ბმული ძალაშია 15 წუთი.</p>
          <p><a href="${resetLink}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">პაროლის აღდგენა</a></p>
          <p style="font-size:12px;color:#555">თუ ღილაკი არ იხსნება:<br>${resetLink}</p>
        </div>`,
      });
      if (!mailSent) {
        console.error("Forgot-password mail was not sent for", user.email);
      }
    }

    res.status(200).json({
      message:
        "თუ ეს ელ-ფოსტა რეგისტრირებულია, აღდგენის ლინკი გამოგიგზავნე. შეამოწმე Inbox და Spam. ✉️",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "სერვერის შეცდომა. სცადე ხელახლა.",
    });
  }
};

// F. ახალი პაროლის დაყენება (Reset Password)
export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = String(req.body.token || "");
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const { newPassword } = req.body;

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
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};

export const listUsers = async (
  _req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find({})
      .select(
        "name firstName lastName email phone city address role isVerified createdAt",
      )
      .sort({ createdAt: -1 })
      .limit(500);
    res.json(users);
  } catch {
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
};
