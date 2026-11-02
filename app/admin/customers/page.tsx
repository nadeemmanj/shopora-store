"use client";
import { useEffect, useState } from "react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-5">Customers ({customers.length})</h2>
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-175">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">City</th>
              <th className="p-3 text-right">Orders</th>
              <th className="p-3 text-right">Total Spent</th>
              <th className="p-3">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.phone} className="border-t">
                <td className="p-3 font-semibold">{c.name}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.city}</td>
                <td className="p-3 text-right">{c.orders}</td>
                <td className="p-3 text-right font-bold">${Number(c.spent).toFixed(2)}</td>
                <td className="p-3">{new Date(c.lastOrder).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="p-6 text-slate-500 text-sm">No customers yet. Customers appear here when orders are placed.</p>}
      </div>
    </div>
  );
}
