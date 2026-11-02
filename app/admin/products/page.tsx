"use client";
import { useEffect, useState } from "react";

const EMPTY = { name: "", slug: "", price: "", oldPrice: "", category: "", image: "", stock: "10", rating: "4.5", badge: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<any>(null);
  const [isNew, setIsNew] = useState(true);
  const [msg, setMsg] = useState("");

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
  };
  useEffect(load, []);

  const openNew = () => { setForm({ ...EMPTY }); setIsNew(true); setMsg(""); };
  const openEdit = (p: any) => {
    setForm({
      _id: p._id, name: p.name, slug: p.slug, price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "", category: p.category,
      image: p.image || "", stock: String(p.stock), rating: String(p.rating ?? 4.5), badge: p.badge || "",
    });
    setIsNew(false);
    setMsg("");
  };

  const save = async () => {
    setMsg("");
    const payload: any = { ...form };
    if (isNew && !payload.slug) {
      payload.slug = payload.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    }
    const url = isNew ? "/api/admin/products" : `/api/admin/products/${form._id}`;
    const r = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const d = await r.json();
    if (d.error) setMsg(d.error);
    else { setForm(null); load(); }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = products.filter((p) =>
    (p.name + " " + p.category + " " + p.slug).toLowerCase().includes(search.toLowerCase())
  );
  const cats = [...new Set(products.map((p) => p.category))];
  const inp = "w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-violet";

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-2xl font-extrabold">Products ({products.length})</h2>
        <div className="flex gap-2">
          <input
            className="border rounded-full px-4 py-2 text-sm w-52"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={openNew} className="bg-brand-violet text-white px-5 py-2 rounded-full font-bold text-sm">
            + Add Product
          </button>
        </div>
      </div>

      {msg && <p className="text-red-600 font-semibold mb-3">{msg}</p>}

      {form && (
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">{isNew ? "Add Product" : "Edit Product"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-semibold">Name</label><input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="text-sm font-semibold">Slug</label><input className={inp} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from name" /></div>
            <div><label className="text-sm font-semibold">Price ($)</label><input type="number" className={inp} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div><label className="text-sm font-semibold">Old Price ($, optional)</label><input type="number" className={inp} value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} /></div>
            <div>
              <label className="text-sm font-semibold">Category</label>
              <input className={inp} list="catlist" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <datalist id="catlist">{cats.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div><label className="text-sm font-semibold">Stock</label><input type="number" className={inp} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="text-sm font-semibold">Image URL</label><input className={inp} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
            <div><label className="text-sm font-semibold">Rating (0-5)</label><input type="number" step="0.1" className={inp} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
            <div><label className="text-sm font-semibold">Badge (e.g. New, -50% OFF)</label><input className={inp} value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} className="bg-brand-violet text-white px-8 py-2.5 rounded-full font-bold">Save</button>
            <button onClick={() => setForm(null)} className="border px-8 py-2.5 rounded-full font-bold">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-200">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />}
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{p.category}</td>
                <td className="p-3 text-right font-bold">${Number(p.price).toFixed(2)}</td>
                <td className={`p-3 text-right font-bold ${p.stock <= 5 ? "text-red-600" : ""}`}>{p.stock}</td>
                <td className="p-3 text-center">
                  <button onClick={() => openEdit(p)} className="text-brand-violet font-bold mr-3">Edit</button>
                  <button onClick={() => remove(p._id, p.name)} className="text-red-600 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
