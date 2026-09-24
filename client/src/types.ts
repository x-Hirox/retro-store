export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stock: number;
  isHeroBanner?: boolean; // <-- აი ეს ველი დავამატოთ ბანერისთვის
}
