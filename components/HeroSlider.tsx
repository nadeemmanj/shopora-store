"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    badge: "Up To 50% Off",
    title: "Up To 50% Off Sale",
    text: "Premium headphones, watches and more at half price. Limited time offer, shop before it ends.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
    cta: "Shop Now",
    href: "/shop",
  },
  {
    badge: "New Arrivals",
    title: "New Arrivals Are Here",
    text: "Fresh fashion, electronics and home essentials just landed in Shopora. Be the first to grab them.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    cta: "Explore New Arrivals",
    href: "/shop?category=Fashion",
  },
  {
    badge: "Best Sellers",
    title: "Best Sellers, Loved By Everyone",
    text: "Top rated products our customers buy again and again. Quality you can trust, prices you will love.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
    cta: "Shop Best Sellers",
    href: "/shop?sort=rating",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const go = (dir: number) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full h-130 md:h-132 overflow-hidden bg-slate-900"
    >
      {slides.map((s, i) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-2000 ${
              i === index ? "scale-100" : "scale-105"
            }`}
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/10" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <span className="bg-brand-orange text-white text-sm font-bold px-4 py-1.5 rounded-full w-fit">
              {s.badge}
            </span>
            <h1 className="text-white text-4xl md:text-6xl font-extrabold max-w-2xl mt-4">
              {s.title}
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-xl mt-4">{s.text}</p>
            <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href={s.href}
              className="bg-brand-violet text-white px-8 py-3 rounded-full font-semibold transition hover:scale-105 hover:bg-brand-orange hover:shadow-lg active:scale-95"
            >
              {s.cta}
            </Link>
            <Link
              href="/shop"
              className="bg-white/10 border border-white/40 text-white px-8 py-3 rounded-full font-semibold transition hover:scale-105 hover:bg-white/20 hover:shadow-lg active:scale-95"
            >
              View All Products
            </Link>

            </div>
          </div>
        </div>
      ))}

      {/* <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 w-11 h-11 rounded-full font-bold"
      >
        ‹
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 w-11 h-11 rounded-full font-bold"
      >
        ›
      </button> */}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setIndex(i)}
            className={`h-3 rounded-full transition-all ${
              i === index ? "bg-white w-8" : "bg-white/50 w-3"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
