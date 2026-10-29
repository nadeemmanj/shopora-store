"use client";

import { useState } from "react";
import Link from "next/link";

export default function TrackPage() {
  const [number, setNumber] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    setError("");
    setOrder(null);
    const res = await fetch(`/api/orders/${number.trim()}`);
    const data = await res.json();
    if (!res.ok) {
      setError("Order not found. Please check the order number.");
      return;
    }
    setOrder(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold">Track Your Order</h1>
      <div className="flex gap-2 mt-6 max-w-xl">
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter order number, e.g. ORD-123456"
          className="flex-1 border rounded-xl px-4 py-3 outline-none focus:border-brand-violet"
        />
        <button onClick={handleTrack} className="bg-brand-violet text-white px-6 rounded-xl font-semibold">
          Track
        </button>
      </div>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {order && (
        <div className="bg-white border rounded-2xl p-6 mt-6 max-w-xl">
          <p className="font-bold">{order.orderNumber}</p>
          <p className="text-sm text-slate-600 mt-1">Status: {order.status} • Total: ${order.total.toFixed(2)}</p>
          <Link href={`/order/${order.orderNumber}`} className="inline-block mt-4 text-brand-violet font-semibold">
            View Full Tracking →
          </Link>
        </div>
      )}
    </div>
  );
}
