import API from "./api";
import type { IProduct } from "../types";
import { matchProduct } from "../seo/productUrl";

const PRODUCT_STORE = "rb-products-v1";

function readProductStore(): IProduct[] | null {
  try {
    const raw = sessionStorage.getItem(PRODUCT_STORE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeProductStore(list: IProduct[]) {
  try {
    sessionStorage.setItem(PRODUCT_STORE, JSON.stringify(list));
  } catch {
    /* quota */
  }
}

let productCache: IProduct[] | null = readProductStore();
let productInflight: Promise<IProduct[]> | null = null;

export function peekProducts(): IProduct[] | null {
  return productCache;
}

export function invalidateProducts() {
  productCache = null;
  productInflight = null;
  try {
    sessionStorage.removeItem(PRODUCT_STORE);
  } catch {
    /* ignore */
  }
}

export const getProducts = async (): Promise<IProduct[]> => {
  if (productCache) return productCache;
  if (productInflight) return productInflight;
  productInflight = API.get("/products")
    .then((response) => {
      productCache = response.data;
      writeProductStore(productCache!);
      return productCache!;
    })
    .finally(() => {
      productInflight = null;
    });
  return productInflight;
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const cached = productCache && matchProduct(productCache, id);
  if (cached) return cached;
  try {
    const response = await API.get(`/products/${encodeURIComponent(id)}`);
    return response.data;
  } catch (err) {
    const list = await getProducts();
    const hit = matchProduct(list, id);
    if (hit) return hit;
    throw err;
  }
};

export const createProduct = async (
  productData: Omit<IProduct, "_id">,
): Promise<IProduct> => {
  const response = await API.post("/products", productData);
  invalidateProducts();
  return response.data;
};

export const updateProduct = async (
  id: string,
  productData: Partial<IProduct>,
): Promise<IProduct> => {
  const response = await API.put(`/products/${id}`, productData);
  invalidateProducts();
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await API.delete(`/products/${id}`);
  invalidateProducts();
};
