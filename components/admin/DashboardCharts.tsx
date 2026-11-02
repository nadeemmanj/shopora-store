"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export function RevenueChart({ data }: { data: { date: string; revenue: number; orders: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="revenue" fill="#6D28D9" radius={[6, 6, 0, 0]} name="Revenue ($)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

const COLORS = ["#6D28D9", "#F97316", "#16A34A", "#0EA5E9", "#EF4444"];

export function StatusChart({ data }: { data: { status: string; count: number }[] }) {
  const filtered = data.filter((d) => d.count > 0);
  if (!filtered.length) return <p className="text-slate-500 text-sm">No orders yet.</p>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={filtered} dataKey="count" nameKey="status" innerRadius={60} outerRadius={100} paddingAngle={3} label>
          {filtered.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
