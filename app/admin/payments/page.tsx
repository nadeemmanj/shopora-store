"use client";
import { useEffect, useState } from "react";

export default function AdminPayments() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, { orders: number; total: number }> = {};
        (d.orders || [])
          .filter((o: any) => o.status !== "Cancelled")
          .forEach((o: any) => {
            const m = o.paymentMethod || "Unknown";
            if (!map[m]) map[m] = { orders: 0, total: 0 };
            map[m].orders += 1;
            map[m].total = Math.round((map[m].total + o.total) * 100) / 100;
          });
        setRows(Object.entries(map).map(([method, v]) => ({ method, ...v })));
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-5">Payments</h2>
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-125">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-3">Method</th>
              <th className="p-3 text-right">Orders</th>
              <th className="p-3 text-right">Total Received</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.method} className="border-t">
                <td className="p-3 font-semibold">{r.method}</td>
                <td className="p-3 text-right">{r.orders}</td>
                <td className="p-3 text-right font-bold">${r.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-slate-500 text-sm">No payments yet.</p>}
      </div>
      <p className="text-xs text-slate-500 mt-3">Card (Test) means Stripe test mode. No real money is involved.</p>
    </div>
  );
}
