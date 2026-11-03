"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/account", label: "My Account" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="p-4 space-y-1">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={() => setOpen(false)}
          className={`block px-4 py-2.5 rounded-lg font-semibold text-sm ${
            pathname === l.href
              ? "bg-brand-violet text-white"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brand-violet text-white text-2xl shadow-lg"
        aria-label="Menu"
      >
        ☰
      </button>
      <aside className="hidden lg:block w-64 shrink-0 bg-brand-dark h-screen sticky top-0 overflow-y-auto">
        <div className="p-5 border-b border-white/10">
          <p className="text-white text-xl font-extrabold">Shopora</p>
          <p className="text-slate-400 text-xs">Admin Panel</p>
        </div>
        {nav}
      </aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-brand-dark overflow-y-auto">
            <div className="p-5 border-b border-white/10 flex justify-between items-center">
              <div>
                <p className="text-white text-xl font-extrabold">Shopora</p>
                <p className="text-slate-400 text-xs">Admin Panel</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white text-2xl" aria-label="Close">
                ×
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
