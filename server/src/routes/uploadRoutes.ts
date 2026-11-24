import { Router } from "express";
import multer from "multer";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const type = String(file.mimetype || "").toLowerCase();
    const name = String(file.originalname || "").toLowerCase();
    if (
      type.startsWith("image/") ||
      /\.(jpe?g|png|webp|gif|svg|heic|heif|avif)$/.test(name)
    ) {
      cb(null, true);
      return;
    }
    cb(new Error("მხოლოდ PNG, JPG, JPEG, WebP, SVG ან GIF"));
  },
});

const router = Router();
router.post(
  "/",
  protect,
  adminOnly,
  (req, res, next) => {
    upload.single("image")(req, res, (err: unknown) => {
      if (!err) {
        next();
        return;
      }
      const multerErr = err as { code?: string; message?: string };
      const message =
        multerErr.code === "LIMIT_FILE_SIZE"
          ? "სურათი 10MB-ზე დიდია — შეამცირე ან ჩასვი Cloudinary ლინკი."
          : multerErr.message || "სურათის ატვირთვა ვერ მოხდა";
      res.status(400).json({ message });
    });
  },
  uploadImage,
);
export default router;
