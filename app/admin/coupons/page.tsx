"use client";
import { useEffect, useState } from "react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((d) => setCoupons(d.coupons || []));
  };
  useEffect(load, []);

  const add = async () => {
    setMsg("");
    const r = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, percent }),
    });
    const d = await r.json();
    if (d.error) setMsg(d.error);
    else { setCode(""); setPercent(""); load(); }
  };

  const toggle = async (c: any) => {
    await fetch(`/api/admin/coupons/${c._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-5">Coupons</h2>
      {msg && <p className="text-red-600 font-semibold mb-3">{msg}</p>}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h3 className="font-bold mb-3">Add Coupon</h3>
        <div className="flex gap-2 flex-wrap">
          <input
            className="border rounded-xl px-4 py-2.5 uppercase"
            placeholder="CODE (e.g. SAVE15)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="number"
            className="border rounded-xl px-4 py-2.5 w-32"
            placeholder="% off"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
          />
          <button onClick={add} className="bg-brand-violet text-white px-6 py-2.5 rounded-full font-bold">Add</button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Active coupons work on the checkout page right away.</p>
      </div>
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-125">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-3">Code</th>
              <th className="p-3 text-right">Discount</th>
              <th className="p-3 text-center">Active</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3 font-bold">{c.code}</td>
                <td className="p-3 text-right">{c.percent}%</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => toggle(c)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${c.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {c.active ? "ON" : "OFF"}
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => remove(c._id)} className="text-red-600 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
