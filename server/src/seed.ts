import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Product from "./models/Product.js";

// ვუთითებთ, რომ .env ფაილი server საქაღალდეშია
dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });

const products = [
  {
    title: "Pixel Paradise Hero Banner",
    description:
      "Retro gaming online store collection banner with classic aesthetics.",
    price: 0,
    category: "Banner",
    imageUrl:
      "https://res.cloudinary.com/pluirbtv/image/upload/v1790112182/Gemini_Generated_Image_7f67bd7f67bd7f67.jpg",
    stock: 10,
  },
  {
    title: "Classic Retro Handheld Console",
    description: "Vintage handheld gaming device with glowing vibrant screen.",
    price: 149.99,
    category: "Handhelds",
    imageUrl:
      "https://res.cloudinary.com/pluirbtv/image/upload/v1790112181/Gemini_Generated_Image_ysm05xysm05xysm0.jpg",
    stock: 15,
  },
  {
    title: "Vintage Home Video Game Console",
    description:
      "Classic home console in dark matte finish with retro controller.",
    price: 199.99,
    category: "Consoles",
    imageUrl:
      "https://res.cloudinary.com/pluirbtv/image/upload/v1790112181/Gemini_Generated_Image_tgp3s1tgp3s1tgp3.jpg",
    stock: 8,
  },
  {
    title: "Retro 8-Bit Game Cartridge Set",
    description: "Classic video game cartridge and gaming controller set.",
    price: 49.99,
    category: "Accessories",
    imageUrl:
      "https://res.cloudinary.com/pluirbtv/image/upload/v1790112175/Gemini_Generated_Image_f3ht0hf3ht0hf3ht.jpg",
    stock: 25,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("ბაზასთან კავშირი დამყარდა სეედინგისთვის...");

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log("პროდუქტები წარმატებით ჩაიტვირთა ბაზაში!");
    process.exit();
  } catch (error) {
    console.error("შეცდომა სეედინგის დროს:", error);
    process.exit(1);
  }
};

seedDB();
