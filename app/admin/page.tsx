"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RevenueChart, StatusChart } from "../../components/admin/DashboardCharts";

export default function AdminDashboard() {
  const [s, setS] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setS)
      .catch(() => setS({ error: "Failed to load" }));
  }, []);

  if (!s) return <p className="font-semibold">Loading dashboard...</p>;
  if (s.error) return <p className="text-red-600 font-semibold">Error: {s.error}</p>;

  const cards = [
    { label: "Total Revenue", value: `$${Number(s.revenue).toFixed(2)}` },
    { label: "Total Orders", value: s.orders },
    { label: "Products", value: s.products },
    { label: "Customers", value: s.customers },
  ];

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-5">Dashboard</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl shadow p-5">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-3xl font-extrabold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="font-bold mb-3">Revenue, last 14 days</h3>
          <RevenueChart data={s.revenueByDay || []} />
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="font-bold mb-3">Orders by status</h3>
          <StatusChart data={s.ordersByStatus || []} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Recent orders</h3>
            <Link href="/admin/orders" className="text-sm font-semibold text-brand-violet">View all</Link>
          </div>
          {s.recentOrders.length === 0 ? (
            <p className="text-slate-500 text-sm">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {s.recentOrders.map((o: any) => (
                  <tr key={o.orderNumber} className="border-t">
                    <td className="py-2 font-semibold">{o.orderNumber}</td>
                    <td className="py-2">{o.customer}</td>
                    <td className="py-2 text-right font-bold">${Number(o.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Low stock (5 or less)</h3>
            <Link href="/admin/inventory" className="text-sm font-semibold text-brand-violet">Manage</Link>
          </div>
          {s.lowStock.length === 0 ? (
            <p className="text-slate-500 text-sm">All products have enough stock.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {s.lowStock.map((p: any) => (
                  <tr key={p.slug} className="border-t">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2 text-right font-bold text-red-600">{p.stock} left</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
