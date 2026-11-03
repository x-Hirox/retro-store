import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import { seedContentIfEmpty } from "./utils/seedContent.js";

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
app.use("/api/content", contentRoutes);

// 🟢 მთავარი მისამართი UptimeRobot-ისთვის და ტესტისთვის
app.get("/", (req, res) => {
  res.status(200).send("Retro-Store API is running successfully!");
});

const PORT = process.env.PORT || 10000;
const MONGO_URI =
  "mongodb+srv://grdzelishvilibeca1990_db_user:12345@cluster0.4vz7unk.mongodb.net/?appName=Cluster0";

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
