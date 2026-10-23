import { Router } from "express";
import type { Request, Response } from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js"; // შემოვიტანეთ ჩვენი მიდლვარები

const router = Router();

// ყველა პროდუქტის წამოღება (GET) - ღიაა ყველასთვის
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

// პროდუქტების ძებნა (SEARCH) - ღიაა ყველასთვის
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.json([]);
    }
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    res.json(products);
  } catch (error) {
    console.error("შეცდომა ძებნისას:", error);
    res.status(500).json({ message: "სერვერის შეცდომა ძებნისას" });
  }
});

// კონკრეტული პროდუქტის წამოღება ID-ით (GET) - ღიაა ყველასთვის
router.get("/:id", async (req: Request, res: Response) => {
  try {
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

// ==========================================
// დაცული მარშრუტები (მხოლოდ ადმინისთვის!)
// ==========================================

// ახალი პროდუქტის დამატება (POST)
router.post("/", protect, adminOnly, async (req: Request, res: Response) => {
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

// პროდუქტის განახლება / რედაქტირება (PUT)
router.put("/:id", protect, adminOnly, async (req: Request, res: Response) => {
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
router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req: Request, res: Response) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "პროდუქტი ვერ მოიძებნა" });
      }
      res.json({ message: "პროდუქტი წარმატებით წაიშალა" });
    } catch (error) {
      res.status(500).json({ message: "სერვერის შეცდომა წაშლისას" });
    }
  },
);

export default router;
