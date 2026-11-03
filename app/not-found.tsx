import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center">
      <p className="text-7xl font-extrabold text-brand-violet">404</p>
      <h1 className="text-3xl font-extrabold mt-4">Page Not Found</h1>
      <p className="text-slate-600 mt-2">The page you are looking for does not exist or was moved.</p>
      <div className="flex justify-center gap-3 mt-8 flex-wrap">
        <Link href="/" className="bg-brand-violet text-white px-8 py-3 rounded-full font-bold">
          Go Home
        </Link>
        <Link href="/shop" className="border px-8 py-3 rounded-full font-bold">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
