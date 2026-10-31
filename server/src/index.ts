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
