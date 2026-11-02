"use client";
import { useEffect, useState } from "react";

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(((d.products || []) as any[]).sort((a, b) => a.stock - b.stock)));
  };
  useEffect(load, []);

  const saveStock = async (id: string) => {
    const v = Number(editing[id]);
    if (isNaN(v) || v < 0) { setMsg("Stock must be 0 or more"); return; }
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: v }),
    });
    setMsg("Stock updated");
    setEditing((e) => { const n = { ...e }; delete n[id]; return n; });
    load();
  };

  const restock = async (id: string, current: number) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: current + 10 }),
    });
    setMsg("Added 10 to stock");
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-5">Inventory</h2>
      {msg && <p className="text-green-600 font-semibold mb-3">{msg}</p>}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-175">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-3">Product</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-center">Update</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className={`border-t ${p.stock <= 5 ? "bg-red-50" : ""}`}>
                <td className="p-3 font-semibold">{p.name}</td>
                <td className={`p-3 text-right font-bold ${p.stock <= 5 ? "text-red-600" : ""}`}>{p.stock}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <input
                      type="number"
                      className="border rounded-lg px-2 py-1 w-20 text-center"
                      placeholder={String(p.stock)}
                      value={editing[p._id] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [p._id]: e.target.value })}
                    />
                    <button onClick={() => saveStock(p._id)} className="bg-brand-violet text-white px-3 py-1 rounded-lg text-xs font-bold">Save</button>
                    <button onClick={() => restock(p._id, p.stock)} className="border px-3 py-1 rounded-lg text-xs font-bold">+10</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
