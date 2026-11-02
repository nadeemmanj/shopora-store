"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const FILTERS = ["All", "Placed", "Packed", "Shipped", "Delivered", "Cancelled"];
export const PILL: Record<string, string> = {
  Placed: "bg-violet-100 text-brand-violet",
  Packed: "bg-blue-100 text-blue-700",
  Shipped: "bg-orange-100 text-orange-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch(`/api/admin/orders${filter === "All" ? "" : `?status=${filter}`}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, [filter]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-5">Orders ({orders.length})</h2>
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold ${filter === f ? "bg-brand-violet text-white" : "bg-white shadow"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-225">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-3">Order</th>
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderNumber} className="border-t">
                <td className="p-3 font-semibold">{o.orderNumber}</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{o.customer.name}<br /><span className="text-xs text-slate-500">{o.customer.phone}</span></td>
                <td className="p-3 text-right font-bold">${Number(o.total).toFixed(2)}</td>
                <td className="p-3 text-xs">{o.paymentMethod}</td>
                <td className="p-3"><span className={`px-3 py-1 rounded-full text-xs font-bold ${PILL[o.status]}`}>{o.status}</span></td>
                <td className="p-3 text-center">
                  <Link href={`/admin/orders/${o.orderNumber}`} className="text-brand-violet font-bold">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-slate-500 text-sm">No orders found.</p>}
      </div>
    </div>
  );
}
