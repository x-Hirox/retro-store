import { Router } from "express";
import type { Request, Response } from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { escapeRegex } from "../utils/security.js";
import { parseTags } from "../utils/tags.js";

const router = Router();

function cleanImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    const url = String(item || "").trim();
    if (!/^https?:\/\//i.test(url) || url.length > 500) continue;
    if (!out.includes(url)) out.push(url);
    if (out.length >= 8) break;
  }
  return out;
}

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
    const query = escapeRegex(String(req.query.q || "").slice(0, 80));
    if (!query) {
      return res.json([]);
    }
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { platform: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).limit(40);
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
    const {
      title,
      description,
      price,
      category,
      imageUrl,
      images,
      stock,
      discount,
      isHeroBanner,
      platform,
      genre,
      tags,
      isBestSeller,
    } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      imageUrl,
      images: cleanImages(images),
      stock,
      discount: discount || 0,
      isHeroBanner: !!isHeroBanner,
      platform: platform || "",
      genre: genre || "",
      tags: parseTags(tags),
      isBestSeller: !!isBestSeller,
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
    const {
      title,
      description,
      price,
      category,
      imageUrl,
      images,
      stock,
      discount,
      isHeroBanner,
      platform,
      genre,
      tags,
      isBestSeller,
    } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        category,
        imageUrl,
        images: cleanImages(images),
        stock,
        discount: discount || 0,
        isHeroBanner: !!isHeroBanner,
        platform: platform || "",
        genre: genre || "",
        tags: parseTags(tags),
        isBestSeller: !!isBestSeller,
      },
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
