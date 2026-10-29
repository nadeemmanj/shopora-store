"use client";
import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";

function InvoiceContent({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderNumber}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d.order || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-center font-semibold">Loading invoice...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Invoice Not Found</h1>
        <p className="text-slate-600 mt-2">No order found with number {orderNumber}.</p>
        <Link href="/orders" className="inline-block mt-6 bg-brand-violet text-white px-8 py-3 rounded-full font-semibold">
          My Orders
        </Link>
      </div>
    );
  }

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <style>{`@media print { header, footer { display: none !important; } }`}</style>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-violet to-brand-orange text-white flex items-center justify-center text-2xl font-extrabold">
                S
              </div>
              <div>
                <p className="text-2xl font-extrabold">Shopora</p>
                <p className="text-sm text-slate-500">Shop Smart, Live Beautiful</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold">INVOICE</p>
              <p className="text-sm text-slate-600 mt-1">Invoice No: <span className="font-bold">{order.orderNumber}</span></p>
              <p className="text-sm text-slate-600">Date: {date}</p>
              <p className="text-sm text-slate-600">Status: <span className="font-bold">{order.status}</span></p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div>
              <p className="font-bold mb-1">Bill To</p>
              <p>{order.customer.name}</p>
              <p className="text-sm text-slate-600">{order.customer.address}, {order.customer.city}</p>
              <p className="text-sm text-slate-600">{order.customer.phone}</p>
            </div>
            <div>
              <p className="font-bold mb-1">Payment</p>
              <p className="text-sm text-slate-600">{order.paymentMethod}</p>
              {order.coupon && (
                <p className="text-sm text-slate-600">Coupon: <span className="font-bold">{order.coupon}</span></p>
              )}
            </div>
          </div>

          <table className="w-full mt-8 text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Item</th>
                <th className="py-2">Variant</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it: any, i: number) => (
                <tr key={i} className="border-b">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {it.image && <img src={it.image} alt={it.name} className="w-12 h-12 object-cover rounded" />}
                      <span className="font-semibold">{it.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{it.variant || "-"}</td>
                  <td className="py-3 text-center">{it.quantity}</td>
                  <td className="py-3 text-right">${it.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-semibold">${(it.price * it.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between"><span>Delivery</span><span>{order.delivery === 0 ? "FREE" : `$${order.delivery.toFixed(2)}`}</span></div>
              <div className="flex justify-between font-extrabold text-lg border-t pt-2"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
            </div>
          </div>

          <p className="text-center text-slate-500 mt-10">Thank you for shopping with Shopora!</p>
        </div>

        <div className="flex justify-center gap-3 mt-6 print:hidden">
          <Link href={`/order/${order.orderNumber}`} className="border px-8 py-3 rounded-full font-semibold">
            Back to Order
          </Link>
          <button onClick={() => window.print()} className="bg-brand-dark text-white px-8 py-3 rounded-full font-semibold">
            Print / Save as PDF
          </button>
        </div>
      </div>
    </>
  );
}

export default function InvoicePage({ params }: { params: Promise<{ orderNumber: string }> }) {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-16 text-center font-semibold">Loading invoice...</div>}>
      <InvoiceContent params={params} />
    </Suspense>
  );
}
