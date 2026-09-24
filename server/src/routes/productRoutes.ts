import { Router } from "express";
import type { Request, Response } from "express";
import Product from "../models/Product.js";

const router = Router();

// ყველა პროდუქტის წამოღება (GET)
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "სერვერის შეცდომა პროდუქტების წამოღებისას" });
  }
});

// ახალი პროდუქტის დამატება (POST)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, price, category, imageUrl, stock } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      imageUrl,
      stock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "არასწორი მონაცემები პროდუქტის დამატებისას" });
  }
});

// კონკრეტული პროდუქტის წამოღება ID-ით (GET)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    console.log("მოთხოვნილი პროდუქტის ID:", req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "პროდუქტი ვერ მოიძებნა" });
    }
    res.json(product);
  } catch (error) {
    console.error("შეცდომა ძებნისას:", error);
    res.status(500).json({ message: "სერვერის შეცდომა" });
  }
});

// პროდუქტის განახლება / რედაქტირება (PUT)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "პროდუქტი ვერ მოიძებნა" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "არასწორი მონაცემები პროდუქტის განახლებისას" });
  }
});

// პროდუქტის წაშლა (DELETE)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "პროდუქტი ვერ მოიძებნა" });
    }
    res.json({ message: "პროდუქტი წარმატებით წაიშალა" });
  } catch (error) {
    res.status(500).json({ message: "სერვერის შეცდომა წაშლისას" });
  }
});

export default router;
