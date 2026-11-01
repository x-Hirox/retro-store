import express from "express";
import mongoose from "mongoose";
import cors from "cors";

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
