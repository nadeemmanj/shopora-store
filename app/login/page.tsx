"use client";

import { Suspense, useState, type FormEvent } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const perks = [
  "Track your orders in real time",
  "Wishlist synced across devices",
  "Faster checkout every time",
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    const session = await getSession();
    const role = (session?.user as any)?.role;
    if (from.startsWith("/admin") && role !== "admin") router.push("/");
    else router.push(from);
    router.refresh();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT: form */}
      <div className="flex flex-col px-6 sm:px-10 py-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <span className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-violet to-brand-orange text-white font-extrabold flex items-center justify-center text-xl">
            S
          </span>
          <span className="font-extrabold text-xl">Shopora</span>
        </Link>
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-md auth-fade-up">
            <h1 className="text-3xl font-extrabold">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Log in to your Shopora account</p>
            <form onSubmit={handleSubmit} className="mt-8">
              {error && (
                <p className="bg-red-50 text-red-600 text-sm font-semibold rounded-xl px-4 py-3 mb-4">
                  {error}
                </p>
              )}
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border rounded-xl px-4 py-2.5 text-sm mb-4 outline-none focus:border-brand-violet"
              />
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full bg-white border rounded-xl px-4 py-2.5 text-sm mb-6 outline-none focus:border-brand-violet"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-violet text-white font-semibold py-3 rounded-full hover:bg-brand-orange transition disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-600 mt-6">
              New to Shopora?{" "}
              <Link href="/signup" className="text-brand-violet font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: image panel */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80&auto=format&fit=crop"
          alt="Inside a Shopora store"
          className="absolute inset-0 w-full h-full object-cover object-center auth-img-zoom"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/95 via-brand-violet/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <p className="text-brand-orange font-bold text-sm tracking-widest uppercase mb-3">
            Shopora
          </p>
          <h2 className="text-white text-4xl font-extrabold leading-tight">
            Shop Smart,
            <br />
            Live Beautiful
          </h2>
          <p className="text-white/75 mt-4 max-w-sm">
            Your account keeps orders, wishlist and checkout — everything in one place.
          </p>
          <ul className="mt-6 space-y-2.5">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-white/90 text-sm">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0">
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
