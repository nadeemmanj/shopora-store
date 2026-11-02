"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminInvoices() {
  const [orders, setOrders] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, []);

  const copy = (n: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/order/${n}/invoice`);
    setMsg(`Invoice link for ${n} copied.`);
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-5">Invoices</h2>
      {msg && <p className="text-green-600 font-semibold mb-3">{msg}</p>}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-175">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-3">Invoice No</th>
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderNumber} className="border-t">
                <td className="p-3 font-semibold">{o.orderNumber}</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{o.customer.name}</td>
                <td className="p-3 text-right font-bold">${Number(o.total).toFixed(2)}</td>
                <td className="p-3 text-center">
                  <Link href={`/order/${o.orderNumber}/invoice`} className="text-brand-violet font-bold mr-3">View</Link>
                  <button onClick={() => copy(o.orderNumber)} className="text-slate-600 font-bold">Copy Link</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-slate-500 text-sm">No invoices yet.</p>}
      </div>
    </div>
  );
}
