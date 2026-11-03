"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const perks = [
  "Faster checkout with saved details",
  "Order tracking and history",
  "Exclusive deals and new arrivals",
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }
    const loginRes = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (loginRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT: image panel */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&auto=format&fit=crop"
          alt="Happy shopping at Shopora"
          className="absolute inset-0 w-full h-full object-cover object-center auth-img-zoom"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/95 via-brand-violet/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <p className="text-brand-orange font-bold text-sm tracking-widest uppercase mb-3">
            Shopora
          </p>
          <h2 className="text-white text-4xl font-extrabold leading-tight">
            Join Shopora
            <br />
            Today
          </h2>
          <p className="text-white/75 mt-4 max-w-sm">
            Create your free account and unlock a smarter way to shop.
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

      {/* RIGHT: form */}
      <div className="flex flex-col px-6 sm:px-10 py-6">
        <Link href="/" className="flex items-center gap-2 w-fit self-end">
          <span className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-violet to-brand-orange text-white font-extrabold flex items-center justify-center text-xl">
            S
          </span>
          <span className="font-extrabold text-xl">Shopora</span>
        </Link>
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-md auth-fade-up">
            <h1 className="text-3xl font-extrabold">Create Account</h1>
            <p className="text-slate-500 mt-2">Join Shopora in seconds</p>
            <form onSubmit={handleSubmit} className="mt-8">
              {error && (
                <p className="bg-red-50 text-red-600 text-sm font-semibold rounded-xl px-4 py-3 mb-4">
                  {error}
                </p>
              )}
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white border rounded-xl px-4 py-2.5 text-sm mb-4 outline-none focus:border-brand-violet"
              />
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-white border rounded-xl px-4 py-2.5 text-sm mb-6 outline-none focus:border-brand-violet"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-violet text-white font-semibold py-3 rounded-full hover:bg-brand-orange transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-600 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-violet font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
