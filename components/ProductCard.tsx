"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import AddToCartButton from "./AddToCartButton";
import { getProductOptions } from "../lib/productOptions";
import type { ProductData } from "../types";

export default function ProductCard({ product }: { product: ProductData }) {
  const { toggleWishlist, isWishlisted, loaded } = useCart();
  const { options } = getProductOptions(product.slug, product.category);
  const wished = loaded && isWishlisted(product.slug);

  return (
    <div className="card-lift bg-white rounded-2xl shadow-sm border overflow-hidden relative">
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-60 object-cover hover:scale-105 transition duration-500" />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </Link>

      <button
        suppressHydrationWarning
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 bg-white rounded-full w-9 h-9 shadow flex items-center justify-center text-lg"
        aria-label="Wishlist"
      >
        {wished ? "♥" : "♡"}
      </button>

      <div className="p-4">
        <p className="text-xs text-slate-500">{product.category}</p>
        <Link href={`/product/${product.slug}`} className="font-bold hover:text-brand-violet">
          {product.name}
        </Link>
        <p className="text-sm text-amber-500 mt-1">★ {product.rating} / 5</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-extrabold text-brand-violet">${product.price}</span>
          {product.oldPrice && <span className="text-slate-400 line-through text-sm">${product.oldPrice}</span>}
        </div>
        <p className={`text-xs mt-1 ${product.stock <= 0 ? "text-red-600" : product.stock <= 5 ? "text-brand-orange" : "text-green-600"}`}>
          {product.stock <= 0 ? "Out of stock" : product.stock <= 5 ? `Hurry! Only ${product.stock} left` : `${product.stock} in stock`}
        </p>
        <div className="flex gap-2 mt-3">
          <AddToCartButton product={product} variant={options[0] || "Standard"} quantity={1} />
          <Link href={`/product/${product.slug}`} className="border px-4 py-2 rounded-full text-sm font-semibold">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
