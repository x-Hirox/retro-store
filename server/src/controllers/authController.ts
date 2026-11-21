import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  frontendBaseUrl,
  mailConfigured,
  shopMail,
  trySendEmail,
} from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";
import { getJwtSecret, isAdminEmail } from "../utils/security.js";
import { publicUser, displayName } from "../utils/publicUser.js";
import { clampText } from "../utils/security.js";
import {
  isValidEmail,
  isValidPersonName,
  normalizeGePhone,
  passwordError,
} from "../utils/validate.js";

function googleClient() {
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

function resolveRole(email: string, role?: string): "admin" | "customer" {
  if (isAdminEmail(email) || role === "admin") return "admin";
  return "customer";
}

// JWT ტოკენი (7 დღიანი სესია)
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
    const phone = normalizeGePhone(req.body.phone);
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const { password } = req.body;
    const name = displayName({ firstName, lastName }) || firstName;

    if (!isValidPersonName(firstName)) {
      res.status(400).json({
        message: "სახელი უნდა იყოს მინიმუმ 2 ასო, ციფრის გარეშე (მაგ: ბექა)",
      });
      return;
    }
    if (!isValidPersonName(lastName)) {
      res.status(400).json({
        message: "გვარი უნდა იყოს მინიმუმ 2 ასო, ციფრის გარეშე",
      });
      return;
    }
    if (!phone) {
      res.status(400).json({
        message:
          "მიუთითე სწორი ქართული მობილური (მაგ: 599123456 ან +995599123456)",
      });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({
        message: "ელ-ფოსტა უნდა შეიცავდეს @-ს და იყოს სწორი ფორმატის (მაგ: name@gmail.com)",
      });
      return;
    }

    const passErr = passwordError(password);
    if (passErr) {
      res.status(400).json({ message: passErr });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        exists: true,
        message:
          "ეს მეილი უკვე რეგისტრირებულია. შედი ან დააჭირე „დაგავიწყდა პაროლი“.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    const role = resolveRole(user.email, user.role);
    const sessionToken = generateToken(user._id.toString(), role);

    res.status(201).json({
      token: sessionToken,
      user: publicUser(user),
      email: user.email,
      mailConfigured: mailConfigured(),
      message:
        "ანგარიში შეიქმნა. შეგიძლია იყიდო ახლავე — მეილზე გამოგიგზავნით დასტურის ბმულს.",
    });

    void sendActivationEmail(req, user, token, code);
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
    if (!isValidEmail(email)) {
      res.status(400).json({ message: "გთხოვთ მიუთითოთ სწორი ელ-ფოსტა (@)." });
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
    if (!isValidEmail(email)) {
      res.status(400).json({ message: "ელ-ფოსტა უნდა შეიცავდეს @-ს" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "არასწორი მეილი ან პაროლი" });
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
    const firstName = clampText(req.body.firstName, 40);
    const lastName = clampText(req.body.lastName, 40);
    const phone = normalizeGePhone(req.body.phone);
    if (!isValidPersonName(firstName) || !isValidPersonName(lastName)) {
      res.status(400).json({
        message: "სახელი და გვარი უნდა იყოს მინიმუმ 2 ასო, ციფრის გარეშე",
      });
      return;
    }
    if (!phone) {
      res.status(400).json({
        message: "მიუთითე სწორი ქართული მობილური (5XX XXX XXX)",
      });
      return;
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
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
    if (!isValidEmail(email)) {
      res.status(400).json({ message: "გთხოვთ მიუთითოთ სწორი ელ-ფოსტა (@)." });
      return;
    }

    const user = await User.findOne({ email });

    if (user) {
      const now = Date.now();
      const previousToken = user.resetPasswordToken || null;
      const previousExp = user.resetPasswordExpires || null;
      const canReuse =
        Boolean(previousToken) &&
        previousExp instanceof Date &&
        previousExp.getTime() > now;

      const resetToken = canReuse
        ? String(previousToken)
        : crypto.randomBytes(32).toString("hex");

      if (!canReuse) {
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              resetPasswordToken: resetToken,
              resetPasswordExpires: new Date(now + 24 * 60 * 60 * 1000),
            },
          },
        );
      }

      const frontendUrl = frontendBaseUrl(req.headers.origin);
      const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(user.email)}`;

      void trySendEmail({
        email: user.email,
        subject: "პაროლის აღდგენა - RetroBit",
        message: `გამარჯობა!\n\nმოთხოვნილია პაროლის აღდგენა RetroBit-ზე. ბმული ძალაშია 24 საათი:\n\n${resetLink}\n\nთუ ეს მოთხოვნა შენ არ გეკუთვნის, უგულებელყავი ეს წერილი.`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#111">
          <h2>RetroBit — პაროლის აღდგენა</h2>
          <p>ბმული ძალაშია 24 საათი.</p>
          <p><a href="${resetLink}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">პაროლის აღდგენა</a></p>
          <p style="font-size:12px;color:#555">თუ ღილაკი არ იხსნება:<br>${resetLink}</p>
        </div>`,
      }).then((sent) => {
        if (!sent) {
          console.error("Forgot-password mail was not sent for", user.email);
        }
      });
    }

    res.status(200).json({
      message:
        "თუ ეს ელ-ფოსტა რეგისტრირებულია, აღდგენის ლინკი გამოგიგზავნე. შეამოწმე Inbox და Spam.",
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
    const token = String(req.body.token || "").trim();
    let email = String(req.body.email || "").trim();
    try {
      email = decodeURIComponent(email);
    } catch {
      /* keep raw */
    }
    email = email.trim().toLowerCase();
    const { newPassword } = req.body;

    if (!token || !email) {
      res.status(400).json({
        message: "აღდგენის ბმული არასწორია. მოითხოვე ახალი ლინკი.",
      });
      return;
    }

    const passErr = passwordError(newPassword);
    if (passErr) {
      res.status(400).json({ message: passErr });
      return;
    }

    const user =
      (await User.findOne({ email, resetPasswordToken: token })) ||
      (await User.findOne({ resetPasswordToken: token }));

    if (!user) {
      res.status(400).json({
        message:
          "ეს ბმული აღარ მუშაობს. ახალი წერილი ჯერ უნდა მივიდეს Inbox-ში.",
      });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashed,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      },
    );

    res.status(200).json({
      message: "პაროლი წარმატებით შეიცვალა! ახლა შეგიძლია შეხვიდე სისტემაში.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "სერვერის შეცდომა. სცადე ახალი აღდგენის ლინკი." });
  }
};

export const testMail = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const admin = await User.findById(req.user?.id).select("email firstName");
    if (!admin?.email) {
      res.status(401).json({ message: "ადმინი ვერ მოიძებნა" });
      return;
    }
    if (!mailConfigured()) {
      res.status(500).json({
        message:
          "Render-ზე აკლია EMAIL_USER ან EMAIL_PASS. Gmail-ზე ჩართე 2FA და შექმენი App Password.",
      });
      return;
    }
    const sent = await trySendEmail({
      email: admin.email,
      subject: "RetroBit — სატესტო მეილი",
      message: `ეს არის სატესტო წერილი. თუ ეს მიიღე, SMTP გამართულია.\nგამგზავნი: ${shopMail()}`,
    });
    res.json({
      mailConfigured: true,
      mailSent: sent,
      to: admin.email,
      from: shopMail(),
      message: sent
        ? `სატესტო მეილი გაიგზავნა ${admin.email}-ზე. შეამოწმე Inbox/Spam.`
        : "SMTP ვერ გაიგზავნა. Render logs-ში ნახე SMTP all attempts failed.",
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
