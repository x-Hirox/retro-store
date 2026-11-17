import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { IProduct } from "../types";

export interface CartItem extends IProduct {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: IProduct,
    qty?: number,
    opts?: { drawer?: boolean },
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  drawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: IProduct,
    qty = 1,
    opts?: { drawer?: boolean },
  ) => {
    if ((product.stock ?? 0) <= 0) return;
    const addBy = Math.max(1, Math.floor(qty));
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item._id === product._id,
      );
      if (existingIndex > -1) {
        const current = prevCart[existingIndex];
        const nextQty = Math.min(product.stock, current.quantity + addBy);
        if (nextQty === current.quantity) return prevCart;
        return prevCart.map((item, index) =>
          index === existingIndex ? { ...item, quantity: nextQty } : item,
        );
      }
      return [
        ...prevCart,
        { ...product, quantity: Math.min(product.stock, addBy) },
      ];
    });
    if (opts?.drawer !== false) setDrawerOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => {
      const current = prevCart.find((item) => item._id === id);
      if (!current) return prevCart;
      if (quantity <= 0) return prevCart.filter((item) => item._id !== id);
      const max = current.stock ?? quantity;
      const nextQty = Math.min(quantity, max);
      if (nextQty === current.quantity) return prevCart;
      return prevCart.map((item) =>
        item._id === id ? { ...item, quantity: nextQty } : item,
      );
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        drawerOpen,
        openCartDrawer: () => setDrawerOpen(true),
        closeCartDrawer: () => setDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart უნდა გამოიყენონ CartProvider-ის შიგნით!");
  }
  return context;
}
