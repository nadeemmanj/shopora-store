"use client";
import { useEffect, useState } from "react";

export default function AdminNewsletter() {
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/newsletter")
      .then((r) => r.json())
      .then((d) => setSubs(d.subscribers || []));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-2xl font-extrabold">Newsletter ({subs.length})</h2>
        <a
          href="/api/admin/export?type=newsletter&format=csv"
          className="text-xs font-bold bg-brand-dark text-white px-4 py-2 rounded-full"
        >
          Download CSV
        </a>
      </div>
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-3">Email</th>
              <th className="p-3">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-3 font-semibold">{s.email}</td>
                <td className="p-3">{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && <p className="p-6 text-slate-500 text-sm">No subscribers yet.</p>}
      </div>
    </div>
  );
}
