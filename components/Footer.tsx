"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setMessage("Subscribed successfully. Thank you!");
    setEmail("");
  };

  return (
    <footer id="contact" className="bg-brand-dark text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-violet to-brand-orange text-white font-extrabold flex items-center justify-center text-xl">
              S
            </span>
            <span className="font-extrabold text-xl">Shopora</span>
          </div>
          <p className="text-white/70 text-sm mt-4">Shop Smart, Live Beautiful. Quality products, honest prices, and fast delivery.</p>
        </div>

        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
            <li><Link href="/#features" className="hover:text-white">Features</Link></li>
            <li><Link href="/#contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Free Delivery</li>
            <li>7-Day Easy Returns</li>
            <li>Cash on Delivery Available</li>
            <li>Secure Payment</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Newsletter</h3>
          <p className="text-white/70 text-sm mb-3">Get new offers and products first.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm flex-1 outline-none placeholder:text-white/50"
            />
            <button type="submit" className="bg-brand-orange text-white text-sm font-semibold px-4 py-2 rounded-full">
              Subscribe
            </button>
          </form>
          {message && <p className="text-sm mt-3 text-white/80">{message}</p>}
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-white/60">
        © 2026 Shopora. All rights reserved.
      </div>
    </footer>
  );
}
