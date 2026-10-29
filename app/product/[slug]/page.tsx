import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import ProductCard from "../../../components/ProductCard";
import ProductOptions from "../../../components/ProductOptions";
import { getProductBySlug, getProducts } from "../../../lib/products";
import { getProductOptions } from "../../../lib/productOptions";

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const all = await getProducts();
  const related = all
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);
  const { label, options } = getProductOptions(product.slug, product.category);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link href="/shop" className="text-brand-violet font-semibold">
        ← Back to Shop
      </Link>
      <div className="product-3d grid md:grid-cols-2 gap-10 mt-6 bg-white rounded-3xl border p-6">
        <div className="product-3d-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="product-3d-img w-full h-105 object-cover rounded-2xl"
          />
        </div>
        <div>
          <p className="text-xs text-brand-violet font-bold uppercase">{product.category}</p>
          <h1 className="text-3xl font-extrabold mt-2">{product.name}</h1>
          <p className="text-yellow-500 mt-2">★ {product.rating}</p>
          <p className="mt-4">
            <span className="font-extrabold text-3xl">${product.price}</span>{" "}
            {product.oldPrice && (
              <span className="line-through text-slate-400">${product.oldPrice}</span>
            )}
          </p>
          <p className="text-slate-600 mt-4">{product.description}</p>
          <ProductOptions product={product} />
        </div>
      </div>

      <div className="mt-10 bg-white rounded-3xl border p-6">
        <h2 className="text-2xl font-extrabold">Product Details</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
          <p><span className="font-semibold">Category: </span>{product.category}</p>
          <p><span className="font-semibold">SKU: </span>{product.slug.toUpperCase()}</p>
          <p><span className="font-semibold">Stock: </span>{product.stock} in stock</p>
          <p><span className="font-semibold">{label}: </span>{options.join(", ")}</p>
          <p><span className="font-semibold">Delivery: </span>Free Delivery, 3-5 working days</p>
          <p><span className="font-semibold">Returns: </span>7-Day Easy Returns</p>
          <p><span className="font-semibold">Payment: </span>Cash on Delivery, Card Test Mode</p>
          <p><span className="font-semibold">Rating: </span>{product.rating} / 5</p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-extrabold">Related Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {related.map((p, i) => (
              <div
                key={p._id}
                className="product-3d"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<p className="max-w-7xl mx-auto px-6 py-10">Loading...</p>}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
