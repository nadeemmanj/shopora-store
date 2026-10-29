"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import type { ProductData } from "../../types";

const categories = ["All", "Electronics", "Fashion", "Home & Living", "Beauty"];

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [category, setCategory] = useState<string>(searchParams.get("category") || "All");
  const [sort, setSort] = useState<string>("newest");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&sort=${sort}`
      );
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    load();
  }, [search, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold">Shop All Products</h1>
      <p className="text-slate-600 mt-1">Search, filter by category and sort by price or rating.</p>

      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border rounded-xl px-4 py-2 flex-1 outline-none"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl px-3 py-2"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="flex gap-2 flex-wrap mt-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={
              category === c
                ? "bg-brand-violet text-white px-4 py-2 rounded-full text-sm font-semibold"
                : "border px-4 py-2 rounded-full text-sm font-semibold bg-white"
            }
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="mt-10">No products found. Try another search or category.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<p className="max-w-7xl mx-auto px-6 py-10">Loading...</p>}>
      <ShopContent />
    </Suspense>
  );
}
