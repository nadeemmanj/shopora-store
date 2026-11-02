"use client";
import { useEffect, useState } from "react";

export default function AdminAccount() {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ]).then(([s, st]) => setInfo({ settings: s.settings, stats: st }));
  }, []);

  if (!info) return <p className="font-semibold">Loading...</p>;

  const st = info.stats || {};
  const se = info.settings || {};

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-extrabold mb-5">My Account</h2>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-brand-violet to-brand-orange text-white flex items-center justify-center text-2xl font-extrabold">
            {(se.storeName || "S").charAt(0)}
          </div>
          <div>
            <p className="text-xl font-extrabold">{se.storeName || "Shopora"}</p>
            <p className="text-sm text-slate-500">Store Administrator</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p><span className="text-slate-500">Email:</span> <b>{se.supportEmail || "not set"}</b></p>
          <p><span className="text-slate-500">Phone:</span> <b>{se.supportPhone || "not set"}</b></p>
          <p><span className="text-slate-500">Address:</span> <b>{se.address || "not set"}</b></p>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-2xl font-extrabold">{st.products ?? "-"}</p><p className="text-xs text-slate-500">Products</p></div>
          <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-2xl font-extrabold">{st.orders ?? "-"}</p><p className="text-xs text-slate-500">Orders</p></div>
          <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-2xl font-extrabold">${Number(st.revenue || 0).toFixed(0)}</p><p className="text-xs text-slate-500">Revenue</p></div>
        </div>
        <p className="text-xs text-slate-500 mt-6 bg-amber-50 border border-amber-200 rounded-xl p-3">
          Note: admin login is not set up yet. Anyone with the /admin link can open it on this computer.
          A proper login will be added before the store goes live on the internet.
        </p>
      </div>
    </div>
  );
}
