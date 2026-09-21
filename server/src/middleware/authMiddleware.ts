import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

      const JWT_SECRET: string = process.env.JWT_SECRET || "supersecretkey";

      // ვეუბნებით ტაიპსკრიპტს, რომ ტოკენი აქ აუცილებლად სტრიქონია
      const decoded = jwt.verify(token as string, JWT_SECRET) as unknown as {
        id: string;
        role: string;
      };

      req.user = decoded;
      next();
      return;
    } catch (error) {
      res.status(401).json({
        message: "არასწორი ან ვადაგასული ტოკენი, ავტორიზაცია ვერ მოხერხდა",
      });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: "ტოკენი არ მოიძებნა, წვდომა აკრძალულია" });
    return;
  }
};

export const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "წვდომა შეზღუდულია: საჭიროა ადმინისტრატორის უფლებები",
    });
  }
};
