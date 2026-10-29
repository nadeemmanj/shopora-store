"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const numbers = JSON.parse(localStorage.getItem("shopora-order-numbers") || "[]");
      if (numbers.length === 0) {
        setLoaded(true);
        return;
      }
      fetch(`/api/orders?numbers=${numbers.join(",")}`)
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d)) setOrders(d);
          setLoaded(true);
        });
    } catch {
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return <div className="max-w-7xl mx-auto px-6 py-16 text-center font-semibold">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold">No Orders Yet</h1>
        <p className="text-slate-600 mt-2">Place an order, or track one by its number.</p>
        <div className="flex justify-center gap-3 mt-6">
          <Link href="/shop" className="bg-brand-violet text-white px-8 py-3 rounded-full font-semibold">Shop Now</Link>
          <Link href="/track" className="border px-8 py-3 rounded-full font-semibold">Track Order</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold">My Orders</h1>
      <div className="space-y-4 mt-6">
        {orders.map((o) => (
          <Link key={o.orderNumber} href={`/order/${o.orderNumber}`} className="block bg-white border rounded-2xl p-5 hover:shadow">
            <div className="flex justify-between flex-wrap gap-2">
              <p className="font-bold">{o.orderNumber}</p>
              <p className="font-bold text-brand-violet">${o.total.toFixed(2)}</p>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {o.items.length} items • Status: {o.status} • {o.customer?.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
