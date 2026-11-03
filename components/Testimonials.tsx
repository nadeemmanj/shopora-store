"use client";
import { useEffect, useState } from "react";
import { Stars } from "./StarRating";

// Har card ka apna rich theme — violet, orange, dark (rotate hote hain)
const themes = [
  {
    card: "from-violet-600 via-brand-violet to-purple-900",
    avatar: "bg-white/25",
  },
  {
    card: "from-orange-500 via-brand-orange to-orange-800",
    avatar: "bg-white/25",
  },
  {
    card: "from-slate-700 via-slate-800 to-[#0F172A]",
    avatar: "bg-white/25",
  },
];

export default function Testimonials() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => setItems(d.testimonials || []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-extrabold text-center">What Our Customers Say</h2>
      <p className="text-center text-slate-500 mt-2">Scroll down — reviews stack up, one on top of another</p>
      <div className="relative max-w-2xl mx-auto mt-8">
        {items.map((t, i) => {
          const theme = themes[i % themes.length];
          return (
            <div
              key={`${t.name}-${String(t.date)}-${i}`}
              className="sticky mb-6"
              style={{ top: `${88 + i * 28}px` }}
            >
              <div className={`rounded-3xl bg-linear-to-br ${theme.card} shadow-xl ring-1 ring-white/20`}>
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full ${theme.avatar} text-white flex items-center justify-center text-xl font-extrabold shrink-0`}
                      >
                        {t.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{t.name}</p>
                        {t.productName && (
                          <p className="text-xs text-white/70">on {t.productName}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-6xl font-black text-white/25 leading-none select-none">
                      &ldquo;
                    </span>
                  </div>
                  <Stars value={t.rating} className="text-lg mt-4" />
                  <p className="text-white/90 mt-3 leading-relaxed">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
