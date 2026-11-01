import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount?: number; // 🟢 ფასდაკლების პროცენტი
  stock: number;
  imageUrl: string;
  category: string;
  isHeroBanner?: boolean;
}

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 როუტერების მიერთება
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas ბაზასთან კავშირი დამყარებულია!");
    app.listen(PORT, () => {
      console.log(`სერვერი გაეშვა პორტზე: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("ბაზასთან დაკავშირების შეცდომა:", err);
  });
