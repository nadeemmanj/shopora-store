import { Suspense } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Suspense fallback={<div className="hidden lg:block w-64 bg-brand-dark" />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 min-w-0">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-xl font-extrabold">
            Shopora <span className="text-brand-violet">Admin</span>
          </h1>
          <a href="/" className="text-sm font-semibold text-brand-violet hover:underline">
            View Store
          </a>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
