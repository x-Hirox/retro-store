export interface IProduct {
  _id: string;
  title: string; // name-ის ნაცვლად
  description: string;
  price: number;
  imageUrl?: string; // image-ის ნაცვლად
  category: string;
  stock: number; // countInStock-ის ნაცვლად
}
