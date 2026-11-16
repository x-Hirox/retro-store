import "./loadEnv.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import { seedContentIfEmpty } from "./utils/seedContent.js";
import { securityHeaders } from "./utils/security.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "https://retrobit.ge,https://www.retrobit.ge,https://retro-store.vercel.app,http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      try {
        if (new URL(origin).hostname.endsWith(".vercel.app")) {
          callback(null, true);
          return;
        }
      } catch {
        /* ignore */
      }
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(securityHeaders);
app.use(express.json({ limit: "80kb" }));

app.use((req, _res, next) => {
  if (
    !req.url.startsWith("/api/") &&
    /^\/(products|content|auth|orders|game)(\/|\?|$)/.test(req.url)
  ) {
    req.url = `/api${req.url}`;
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/game", gameRoutes);

app.get("/", (_req, res) => {
  res.status(200).send("Retro-Store API is running successfully!");
});

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI აკლია. ჩაწერე server/.env ან Render Environment-ში.");
  process.exit(1);
}

mongoose.set("sanitizeFilter", true);

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB Atlas ბაზასთან კავშირი დამყარებულია!");
    await seedContentIfEmpty();
    app.listen(PORT, () => {
      console.log(`სერვერი გაეშვა პორტზე: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("ბაზასთან დაკავშირების შეცდომა:", err);
  });
