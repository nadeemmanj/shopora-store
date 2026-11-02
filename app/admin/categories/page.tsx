"use client";
import { useEffect, useState } from "react";

export default function AdminCategories() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, { count: number; stock: number; total: number }> = {};
        (d.products || []).forEach((p: any) => {
          if (!map[p.category]) map[p.category] = { count: 0, stock: 0, total: 0 };
          map[p.category].count += 1;
          map[p.category].stock += p.stock || 0;
          map[p.category].total += Number(p.price) || 0;
        });
        setRows(
          Object.entries(map).map(([name, v]) => ({
            name,
            ...v,
            avg: v.count ? Math.round((v.total / v.count) * 100) / 100 : 0,
          }))
        );
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-5">Categories</h2>
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-150">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Products</th>
              <th className="p-3 text-right">Total Stock</th>
              <th className="p-3 text-right">Avg. Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t">
                <td className="p-3 font-semibold">{r.name}</td>
                <td className="p-3 text-right">{r.count}</td>
                <td className="p-3 text-right">{r.stock}</td>
                <td className="p-3 text-right font-bold">${r.avg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
