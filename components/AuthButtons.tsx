"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AuthButtons({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    if (mobile) return null;
    return <div className="w-28 h-9 rounded-full bg-slate-100 animate-pulse" />;
  }

  // Logged in
  if (session?.user) {
    const role = (session.user as any)?.role;
    const initial = session.user.name?.charAt(0)?.toUpperCase() || "U";

    if (mobile) {
      return (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-brand-violet text-white flex items-center justify-center font-bold shrink-0">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{session.user.name}</p>
              <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {role === "admin" && (
              <Link
                href="/admin"
                onClick={onNavigate}
                className="text-center text-sm font-semibold text-brand-violet border border-brand-violet rounded-full px-4 py-2"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={`text-center text-sm font-semibold text-slate-600 border border-slate-300 rounded-full px-4 py-2 ${
                role !== "admin" ? "col-span-2" : ""
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <Link
            href="/admin"
            className="text-sm font-semibold text-brand-violet hover:underline px-2 py-2"
          >
            Admin
          </Link>
        )}
        <span
          className="w-8 h-8 rounded-full bg-brand-violet text-white flex items-center justify-center text-sm font-bold"
          title={session.user.email || ""}
        >
          {initial}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm font-semibold text-slate-600 hover:text-brand-violet px-2 py-2"
        >
          Logout
        </button>
      </div>
    );
  }

  // Logged out
  if (mobile) {
    return (
      <div className="mt-6 border-t border-slate-200 pt-5 grid grid-cols-2 gap-2">
        <Link
          href="/login"
          onClick={onNavigate}
          className="text-center text-sm font-semibold text-brand-violet border border-brand-violet rounded-full px-4 py-2.5"
        >
          Login
        </Link>
        <Link
          href="/signup"
          onClick={onNavigate}
          className="text-center text-sm font-semibold text-white bg-brand-violet rounded-full px-4 py-2.5"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/login"
        className="text-sm font-semibold text-slate-700 hover:text-brand-violet px-3 py-2"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="text-sm font-semibold text-white bg-brand-violet px-5 py-2 rounded-full hover:bg-brand-orange transition"
      >
        Sign Up
      </Link>
    </div>
  );
}
