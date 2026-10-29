"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function NavbarIcons() {
  const { cartCount, wishlist } = useCart();

  return (
    <div className="flex items-center gap-3">
      <Link href="/wishlist" className="relative">
        <span suppressHydrationWarning className="text-xl">
          {wishlist.length > 0 ? "♥" : "♡"}
        </span>
        {wishlist.length > 0 && (
          <span
            suppressHydrationWarning
            className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {wishlist.length}
          </span>
        )}
      </Link>

      <Link href="/cart" className="relative">
        <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
        <span
          suppressHydrationWarning
          className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
        >
          {cartCount}
        </span>
      </Link>
    </div>
  );
}
