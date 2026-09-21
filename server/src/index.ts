import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import authRouter from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.get("/api/test", (req, res) => {
  res.json({ message: "სერვერი მუშაობს!" });
});
app.use("/api/auth", authRouter);
app.use("/api/orders", orderRoutes);

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("🍃 MongoDB Atlas ბაზასთან კავშირი დამყარებულია!"))
  .catch((err) => console.error("❌ MongoDB კავშირის შეცდომა:", err));

app.listen(PORT, () => {
  console.log(`🚀 სერვერი გაეშვა: http://localhost:${PORT}`);
});
