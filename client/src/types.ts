export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount?: number; // 🟢 ფასდაკლების პროცენტი
  imageUrl?: string;
  category: string;
  stock: number;
  isHeroBanner?: boolean; // 🟢 მთავარი ბანერი
}
