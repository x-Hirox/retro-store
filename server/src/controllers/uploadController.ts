import type { Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export const uploadImage = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "სურათი არ არის არჩეული" });
      return;
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_URL?.match(/@([^/]+)/)?.[1];
    if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_API_KEY) {
      res.status(501).json({
        message:
          "Cloudinary არ არის გამართული. ჩასვი სურათის ლინკი ან დაამატე CLOUDINARY_URL Render-ზე.",
      });
      return;
    }

    if (process.env.CLOUDINARY_URL) {
      cloudinary.config({ secure: true });
    } else {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
    }

    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: "retrobit",
      resource_type: "image",
    });
    res.json({ url: uploaded.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "სურათის ატვირთვა ვერ მოხერხდა" });
  }
};
