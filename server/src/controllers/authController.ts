import type { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// დამხმარე ფუნქცია პაროლის შესამოწმებლად ბექენდზე
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

// დამხმარე ფუნქცია JWT ტოკენის გენერაციისთვის (7 დღიანი სესია)
const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET || "super_secret_retro_key_123",
    { expiresIn: "7d" },
  );
};

// 1. რეგისტრაცია (Sign Up)
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

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

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString(), (user as any).role);

    res.status(201).json({
      message: "რეგისტრაცია წარმატებით დასრულდა",
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

// 2. შესვლა სისტემაში (Login)
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

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
