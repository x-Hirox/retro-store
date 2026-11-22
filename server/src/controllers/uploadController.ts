import { Readable } from "node:stream";
import type { Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

function parseCloudinaryUrl(raw: string) {
  const cleaned = raw
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/^CLOUDINARY_URL\s*=\s*/i, "")
    .trim();
  const match = cleaned.match(
    /cloudinary:\/\/([^:/\s]+):([^@/\s]+)@([a-z0-9-]+)/i,
  );
  if (!match) return null;
  const api_key = decodeURIComponent(match[1] || "");
  const api_secret = decodeURIComponent(match[2] || "");
  const cloud_name = match[3] || "";
  if (
    !api_key ||
    !api_secret ||
    !cloud_name ||
    /your_api|api_key|api_secret|<|>/i.test(`${api_key}${api_secret}`)
  ) {
    return null;
  }
  return { api_key, api_secret, cloud_name };
}

function configureCloudinary(): boolean {
  const fromUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL || "");
  if (fromUrl) {
    cloudinary.config({ ...fromUrl, secure: true });
    return true;
  }
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || "";
  const api_key = process.env.CLOUDINARY_API_KEY || "";
  const api_secret = process.env.CLOUDINARY_API_SECRET || "";
  if (cloud_name && api_key && api_secret) {
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    return true;
  }
  return false;
}

function uploadBuffer(file: { buffer: Buffer }): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "retrobit",
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error("Cloudinary URL არ დაბრუნდა"));
          return;
        }
        resolve(result.secure_url);
      },
    );
    Readable.from(file.buffer).pipe(stream);
  });
}

function publicUploadError(error: unknown): string {
  const err = error as {
    message?: string;
    error?: { message?: string };
    http_code?: number;
  };
  const msg = String(err.error?.message || err.message || "");
  if (/api[_ ]?key|signature|cloud_name|must supply|invalid/i.test(msg)) {
    return "Cloudinary გასაღები არასწორია. Render Environment-ში შეამოწმე CLOUDINARY_URL.";
  }
  if (/timeout|econnreset|enotfound|network/i.test(msg)) {
    return "Cloudinary-სთან კავშირი ვერ დამყარდა. ცოტა ხანში სცადე.";
  }
  return "სურათის ატვირთვა ვერ მოხერხდა. JPG/PNG/WEBP, მაქსიმუმ 10MB.";
}

export const uploadImage = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const file = req.file;
    if (!file?.buffer?.length) {
      res.status(400).json({ message: "სურათი არ არის არჩეული" });
      return;
    }

    if (!configureCloudinary()) {
      res.status(501).json({
        message:
          "Cloudinary არ არის გამართული. Render-ზე ჩაწერე CLOUDINARY_URL (cloudinary://KEY:SECRET@CLOUD_NAME).",
      });
      return;
    }

    const url = await uploadBuffer(file);
    res.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: publicUploadError(error) });
  }
};
