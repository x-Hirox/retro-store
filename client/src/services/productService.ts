import API from "./api";
import type { IProduct } from "../types";

// ყველა პროდუქტის წამოღება
export const getProducts = async (): Promise<IProduct[]> => {
  const response = await API.get("/products"); // ვესაუბრებით ჩვენს ბექენდის productRoutes-ს
  return response.data;
};

// ერთი კონკრეტული პროდუქტის წამოღება ID-ით
export const getProductById = async (id: string): Promise<IProduct> => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

// ახალი პროდუქტის ან ბანერის შექმნა (დაამატე ეს)
export const createProduct = async (
  productData: Omit<IProduct, "_id">,
): Promise<IProduct> => {
  const response = await API.post("/products", productData);
  return response.data;
};

// პროდუქტის ან ბანერის წაშლა ID-ით (დაამატე ესეც)
export const deleteProduct = async (id: string): Promise<void> => {
  await API.delete(`/products/${id}`);
};
