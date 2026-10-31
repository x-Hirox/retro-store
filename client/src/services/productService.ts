import API from "./api";
import type { IProduct } from "../types";

export const getProducts = async (): Promise<IProduct[]> => {
  const response = await API.get("/products");
  return response.data;
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  productData: Omit<IProduct, "_id">,
): Promise<IProduct> => {
  const response = await API.post("/products", productData);
  return response.data;
};

export const updateProduct = async (
  id: string,
  productData: Partial<IProduct>,
): Promise<IProduct> => {
  const response = await API.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await API.delete(`/products/${id}`);
};
