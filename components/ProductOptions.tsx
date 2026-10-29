"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { getProductOptions } from "../lib/productOptions";
import type { ProductData } from "../types";

export default function ProductOptions({ product }: { product: ProductData }) {
  const { label, options } = getProductOptions(product.slug, product.category);
  const [selected, setSelected] = useState(options[0] || "Standard");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mt-6">
      <p className="font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => setSelected(o)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${
              selected === o ? "bg-brand-violet text-white border-brand-violet" : "bg-white border-slate-300"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <p className="text-sm text-slate-600 mt-2">Selected: {selected}</p>

      <div className="flex items-center gap-3 mt-4">
        <span className="font-semibold">Quantity</span>
        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 border rounded-full font-bold">−</button>
        <span className="font-bold w-6 text-center">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          disabled={product.stock <= 0 || quantity >= product.stock}
          className="w-9 h-9 border rounded-full font-bold disabled:opacity-40"
        >
          +
        </button>
      </div>

      <p className={`text-sm mt-3 ${product.stock <= 0 ? "text-red-600" : product.stock <= 5 ? "text-brand-orange" : "text-green-600"}`}>
        {product.stock <= 0 ? "Out of stock" : product.stock <= 5 ? `Hurry! Only ${product.stock} left in stock` : `${product.stock} in stock`}
      </p>

      <div className="mt-4">
        <AddToCartButton product={product} variant={selected} quantity={quantity} />
      </div>

      <ul className="text-sm text-slate-600 mt-5 space-y-1">
        <li>✓ Free Delivery</li>
        <li>✓ Cash on Delivery Available</li>
        <li>✓ 7-Day Easy Returns</li>
        <li>✓ Secure Payment</li>
      </ul>
    </div>
  );
}
