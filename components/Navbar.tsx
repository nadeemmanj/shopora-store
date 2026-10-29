"use client";

import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";

const NavbarIcons = dynamic(() => import("./NavbarIcons"), {
  ssr: false,
  loading: () => <div className="w-16 h-6" />,
});

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Features", href: "/#features" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && hash === "";
    if (href === "/shop") return pathname.startsWith("/shop");
    if (href === "/#features") return pathname === "/" && hash === "#features";
    if (href === "/#contact") return pathname === "/" && hash === "#contact";
    return false;
  };

  const handleHomeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      setHash("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleHashClick = (e: MouseEvent<HTMLAnchorElement>, hashValue: string) => {
    setOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      document.querySelector(hashValue)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", hashValue);
      setHash(hashValue);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/shop?search=${encodeURIComponent(q)}`);
    else router.push("/shop");
    setQuery("");
    setOpen(false);
  };

  const linkClass = (href: string) =>
    `relative group py-2 text-sm font-semibold ${isActive(href) ? "text-brand-violet" : "text-slate-700 hover:text-brand-violet"}`;

  const underlineClass = (href: string) =>
    `absolute -bottom-1.5 left-0 h-0.5 w-full bg-brand-violet origin-left transition-transform duration-300 ${
      isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" onClick={handleHomeClick} className="flex items-center gap-2 shrink-0">
            <span className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-violet to-brand-orange text-white font-extrabold flex items-center justify-center text-xl">
              S
            </span>
            <span className="font-extrabold text-xl">Shopora</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => {
              if (l.href === "/") {
                return (
                  <Link key={l.label} href={l.href} onClick={handleHomeClick} className={linkClass(l.href)}>
                    {l.label}
                    <span className={underlineClass(l.href)} />
                  </Link>
                );
              }
              if (l.href.startsWith("/#")) {
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={(e) => handleHashClick(e, l.href.slice(1))}
                    className={linkClass(l.href)}
                  >
                    {l.label}
                    <span className={underlineClass(l.href)} />
                  </Link>
                );
              }
              return (
                <Link key={l.label} href={l.href} className={linkClass(l.href)}>
                  {l.label}
                  <span className={underlineClass(l.href)} />
                </Link>
              );
            })}
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="border rounded-full px-4 py-2 text-sm w-48 outline-none focus:border-brand-violet"
            />
            <button type="submit" className="bg-brand-violet text-white text-sm font-semibold px-4 py-2 rounded-full">
              Search
            </button>
          </form>

          <div className="flex items-center gap-3">
            <NavbarIcons />
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Menu"
            >
              <span className={`block h-0.5 w-6 bg-slate-800 transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-6 bg-slate-800 transition-all ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-slate-800 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-white shadow-xl p-6 transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-lg">Menu</span>
            <button onClick={() => setOpen(false)} className="text-xl font-bold">
              ✕
            </button>
          </div>

          <nav className="mt-6">
            {links.map((l) => {
              if (l.href === "/") {
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={handleHomeClick}
                    className={`flex justify-between items-center py-3 border-b text-sm font-semibold ${isActive(l.href) ? "text-brand-violet" : "text-slate-700"}`}
                  >
                    {l.label} <span>→</span>
                  </Link>
                );
              }
              if (l.href.startsWith("/#")) {
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={(e) => handleHashClick(e, l.href.slice(1))}
                    className={`flex justify-between items-center py-3 border-b text-sm font-semibold ${isActive(l.href) ? "text-brand-violet" : "text-slate-700"}`}
                  >
                    {l.label} <span>→</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex justify-between items-center py-3 border-b text-sm font-semibold ${isActive(l.href) ? "text-brand-violet" : "text-slate-700"}`}
                >
                  {l.label} <span>→</span>
                </Link>
              );
            })}
          </nav>

          <form onSubmit={handleSearch} className="mt-6 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="border rounded-full px-4 py-2 text-sm flex-1 outline-none focus:border-brand-violet"
            />
            <button type="submit" className="bg-brand-violet text-white text-sm font-semibold px-4 py-2 rounded-full">
              Go
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
