import { Router } from "express";
import multer from "multer";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (
      /^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.mimetype) ||
      file.originalname?.toLowerCase().endsWith(".svg")
    ) {
      cb(null, true);
      return;
    }
    cb(new Error("მხოლოდ JPG, PNG, WEBP, GIF ან SVG"));
  },
});

const router = Router();
router.post("/", protect, adminOnly, upload.single("image"), uploadImage);
export default router;
