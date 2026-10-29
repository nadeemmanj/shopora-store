"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, ProductData } from "../types";

type CartContextType = {
  cart: CartItem[];
  wishlist: ProductData[];
  cartCount: number;
  subtotal: number;
  loaded: boolean;
  addToCart: (product: ProductData, variant: string, quantity: number) => void;
  updateQuantity: (slug: string, variant: string, quantity: number) => void;
  removeFromCart: (slug: string, variant: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: ProductData) => void;
  isWishlisted: (slug: string) => boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<ProductData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("shopora-cart");
      const savedWish = localStorage.getItem("shopora-wishlist");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWish) setWishlist(JSON.parse(savedWish));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("shopora-cart", JSON.stringify(cart));
    localStorage.setItem("shopora-wishlist", JSON.stringify(wishlist));
  }, [cart, wishlist, loaded]);

  const addToCart = (product: ProductData, variant: string, quantity: number) => {
    setCart((prev) => {
      const found = prev.find((i) => i.slug === product.slug && i.variant === variant);
      if (found) {
        return prev.map((i) =>
          i.slug === product.slug && i.variant === variant
            ? { ...i, quantity: Math.min(i.stock, i.quantity + quantity) }
            : i
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          variant,
          quantity,
          stock: product.stock,
        },
      ];
    });
  };

  const updateQuantity = (slug: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(slug, variant);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.slug === slug && i.variant === variant ? { ...i, quantity: Math.min(i.stock, quantity) } : i
      )
    );
  };

  const removeFromCart = (slug: string, variant: string) => {
    setCart((prev) => prev.filter((i) => !(i.slug === slug && i.variant === variant)));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: ProductData) => {
    setWishlist((prev) =>
      prev.some((p) => p.slug === product.slug)
        ? prev.filter((p) => p.slug !== product.slug)
        : [...prev, product]
    );
  };

  const isWishlisted = (slug: string) => wishlist.some((p) => p.slug === slug);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, wishlist, cartCount, loaded, subtotal, addToCart, updateQuantity, removeFromCart, clearCart, toggleWishlist, isWishlisted }}
    >
      {children}
    </CartContext.Provider>
  );
}
