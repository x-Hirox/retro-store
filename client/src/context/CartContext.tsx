import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { IProduct } from "../types";
import { cartLineKey } from "../utils/productColors";

export interface CartItem extends IProduct {
  quantity: number;
  selectedColor?: string;
  selectedColorHex?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: IProduct & { selectedColor?: string; selectedColorHex?: string },
    qty?: number,
    opts?: { drawer?: boolean },
  ) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  removeFromCart: (lineKey: string) => void;
  clearCart: () => void;
  drawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function lineCap(product: IProduct) {
  return Math.max(0, product.stock ?? 0);
}

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
    product: IProduct & { selectedColor?: string; selectedColorHex?: string },
    qty = 1,
    opts?: { drawer?: boolean },
  ) => {
    if ((product.stock ?? 0) <= 0) return;
    const addBy = Math.max(1, Math.floor(qty));
    const key = cartLineKey(product);
    setCart((prevCart) => {
      const cap = lineCap(product);
      if (cap < 1) return prevCart;
      const existingIndex = prevCart.findIndex(
        (item) => cartLineKey(item) === key,
      );
      if (existingIndex > -1) {
        const current = prevCart[existingIndex];
        const nextQty = Math.min(cap, current.quantity + addBy);
        if (nextQty === current.quantity) return prevCart;
        return prevCart.map((item, index) =>
          index === existingIndex ? { ...item, quantity: nextQty } : item,
        );
      }
      return [
        ...prevCart,
        {
          ...product,
          quantity: Math.min(cap, addBy),
        },
      ];
    });
    if (opts?.drawer !== false) setDrawerOpen(true);
  };

  const updateQuantity = (lineKey: string, quantity: number) => {
    setCart((prevCart) => {
      const current = prevCart.find((item) => cartLineKey(item) === lineKey);
      if (!current) return prevCart;
      if (quantity <= 0) {
        return prevCart.filter((item) => cartLineKey(item) !== lineKey);
      }
      const cap = lineCap(current);
      const nextQty = Math.min(quantity, cap);
      if (nextQty === current.quantity) return prevCart;
      return prevCart.map((item) =>
        cartLineKey(item) === lineKey ? { ...item, quantity: nextQty } : item,
      );
    });
  };

  const removeFromCart = (lineKey: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => cartLineKey(item) !== lineKey),
    );
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
