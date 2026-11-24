import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getJwtSecret, isAdminEmail } from "../utils/security.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token as string, getJwtSecret()) as {
        id: string;
        role: string;
      };
      req.user = decoded;
      next();
      return;
    } catch {
      res.status(401).json({
        message: "არასწორი ან ვადაგასული ტოკენი, ავტორიზაცია ვერ მოხერხდა",
      });
      return;
    }
  }

  res.status(401).json({ message: "ტოკენი არ მოიძებნა, წვდომა აკრძალულია" });
};

export const adminOnly = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(403).json({
        message: "წვდომა შეზღუდულია: საჭიროა ადმინისტრატორის უფლებები",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("email role");
    if (user && isAdminEmail(user.email)) {
      if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }
      req.user.role = "admin";
      next();
      return;
    }
    if (user && user.role === "admin") {
      user.role = "customer";
      await user.save();
    }

    res.status(403).json({
      message: "წვდომა შეზღუდულია: საჭიროა ადმინისტრატორის უფლებები",
    });
  } catch {
    res.status(403).json({
      message: "წვდომა შეზღუდულია: საჭიროა ადმინისტრატორის უფლებები",
    });
  }
};
