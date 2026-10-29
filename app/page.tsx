"use client";

import { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import type { ProductData } from "../types";

const categories = [
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Home & Living",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
  },
];

const features = [
  {
    title: "Free Delivery",
    text: "Fast delivery on your orders.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: "Secure Payment",
    text: "Safe checkout with COD and card test mode.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Easy Returns",
    text: "Simple return process for your peace of mind.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    text: "Help whenever you need it.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
];

export default function Home() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [featIndex, setFeatIndex] = useState(0);
  const [featTransition, setFeatTransition] = useState(true);


  useEffect(() => {
    fetch("/api/products?category=All&sort=newest")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setProducts(d);
      });
  }, []);

  const featured = products.slice(0, 8);
  const slideProducts = [...featured, ...featured];


  // Small screen slider: har 3 second me aik product
      useEffect(() => {
        if (featured.length === 0) return;
        const timer = setInterval(() => {
          setFeatIndex((i) => i + 1);
        }, 3000);
        return () => clearInterval(timer);
      }, [featured.length]);

      // Copy wale hisse par pahunche to bina animation ke wapas pehle par le ao,
      // taake loop me jump nazar na aaye
      useEffect(() => {
        if (featured.length > 0 && featIndex === featured.length) {
          const t = setTimeout(() => {
            setFeatTransition(false);
            setFeatIndex(0);
            setTimeout(() => setFeatTransition(true), 50);
          }, 600);
          return () => clearTimeout(t);
        }
      }, [featIndex, featured.length]);


  return (
    <>
      <HeroSlider />

        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">Featured Products</h2>
            <a href="/shop" className="text-brand-violet font-semibold">
              View All →
            </a>
          </div>

          {/* Small screen: aik waqt me sirf aik product, copy ke saath, koi arrow nahi, sirf center dots */}
          <div className="sm:hidden relative overflow-hidden mt-6">
            <div
              className={`flex ${featTransition ? "transition-transform duration-500" : ""}`}
              style={{ transform: `translateX(-${featIndex * 100}%)` }}
            >
              {slideProducts.map((p, i) => (
                <div key={`${p._id}-${i}`} className="w-full shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {featured.map((p, i) => (
                <button
                  key={p._id}
                  onClick={() => {
                    setFeatTransition(true);
                    setFeatIndex(i);
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    i === (featured.length ? featIndex % featured.length : 0)
                      ? "bg-brand-violet w-6"
                      : "bg-slate-300 w-2.5"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop: wahi smooth marquee, copy ke saath, is me koi change nahi */}
          <div className="hidden sm:block overflow-hidden mt-6 pb-4 pt-4">
            <div className="featured-marquee flex w-max">
              {slideProducts.map((p, i) => (
                <div key={`${p._id}-${i}`} className="min-w-70 shrink-0 mr-5">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <a href="/shop" className="bg-brand-violet text-white px-8 py-3 rounded-full font-semibold">
              View All Products →
            </a>
          </div>
        </section>


      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-extrabold">Shop by Category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.name).length;
            return (
              <a
                key={c.name}
                href={`/shop?category=${encodeURIComponent(c.name)}`}
                className="group relative overflow-hidden rounded-2xl border shadow-sm h-48 block"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="font-bold text-lg text-white">{c.name}</h3>
                  <p className="text-white/80 text-sm">
                    {count} {count === 1 ? "Product" : "Products"}
                  </p>
                  <p className="text-white text-sm font-semibold mt-1">Shop now →</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-20">
        <h2 className="text-2xl font-extrabold">Why Shop With Us</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {features.map((f) => (
            <div key={f.title} className="card-lift bg-white p-6 rounded-2xl shadow-sm border text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-bold mt-4 text-lg">{f.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
