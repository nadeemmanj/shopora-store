"use client";
import { useEffect, useState } from "react";

const TYPES = [
  { t: "orders", label: "Orders" },
  { t: "products", label: "Products" },
  { t: "customers", label: "Customers" },
   { t: "newsletter", label: "Newsletter" },
];
const FORMATS = ["csv", "xlsx", "json"];

export default function AdminReports() {
  const [days, setDays] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setDays(d.revenueByDay || []));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-5">Reports</h2>

      <div className="bg-white rounded-2xl shadow p-5 mb-6">
        <h3 className="font-bold mb-3">Download data</h3>
        {TYPES.map(({ t, label }) => (
          <div key={t} className="flex items-center justify-between border-t py-3 first:border-0 first:pt-0">
            <p className="font-semibold">{label}</p>
            <div className="flex gap-2">
              {FORMATS.map((f) => (
                <a
                  key={f}
                  href={`/api/admin/export?type=${t}&format=${f}`}
                  className="text-xs font-bold bg-brand-dark text-white px-4 py-2 rounded-full uppercase"
                >
                  {f}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <h3 className="font-bold mb-3">Sales, last 14 days</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-2">Date</th>
              <th className="py-2 text-right">Orders</th>
              <th className="py-2 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date} className="border-t">
                <td className="py-2">{d.date}</td>
                <td className="py-2 text-right">{d.orders}</td>
                <td className="py-2 text-right font-bold">${Number(d.revenue).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
