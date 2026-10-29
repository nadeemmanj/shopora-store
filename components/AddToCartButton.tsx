"use client";

import { useCart } from "./CartProvider";
import { useToast } from "./ToastProvider";
import type { ProductData } from "../types";

export default function AddToCartButton({
  product,
  variant = "Standard",
  quantity = 1,
}: {
  product: ProductData;
  variant?: string;
  quantity?: number;
}) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (product.stock <= 0) {
    return (
      <button disabled className="bg-slate-300 text-white px-4 py-2 rounded-full text-sm font-semibold cursor-not-allowed">
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        addToCart(product, variant, quantity);
        showToast("Added to cart");
      }}
      className="bg-brand-violet text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-orange transition"
    >
      Add to Cart
    </button>
  );
}
