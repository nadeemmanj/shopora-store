"use client";

import Link from "next/link";
import { useCart } from "../../components/CartProvider";
import AddToCartButton from "../../components/AddToCartButton";
import { getProductOptions } from "../../lib/productOptions";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, loaded } = useCart();

  if (!loaded) {
    return <div className="max-w-7xl mx-auto px-6 py-16 text-center font-semibold">Loading your wishlist...</div>;
   }


  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Your Wishlist is Empty</h1>
        <p className="text-slate-600 mt-2">Tap the heart on any product to save it here.</p>
        <Link href="/shop" className="inline-block mt-6 bg-brand-violet text-white px-8 py-3 rounded-full font-semibold">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold">Your Wishlist</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {wishlist.map((p) => {
          const { options } = getProductOptions(p.slug, p.category);
          return (
            <div key={p.slug} className="card-lift bg-white rounded-2xl shadow-sm border overflow-hidden">
              <Link href={`/product/${p.slug}`}>
                <img src={p.image} alt={p.name} className="w-full h-56 object-cover" />
              </Link>
              <div className="p-4">
                <Link href={`/product/${p.slug}`} className="font-bold hover:text-brand-violet">
                  {p.name}
                </Link>
                <p className="font-bold text-brand-violet mt-1">${p.price}</p>
                <div className="flex gap-2 mt-3">
                  <AddToCartButton product={p} variant={options[0] || "Standard"} quantity={1} />
                  <button onClick={() => toggleWishlist(p)} className="border px-4 py-2 rounded-full text-sm font-semibold">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
