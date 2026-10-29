import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderByNumber } from "../../../lib/orders";

const STEPS = ["Placed", "Packed", "Shipped", "Delivered"];

async function OrderDetailContent({ params }: { params: Promise<{ orderNumber: string }> }) {
  await connection();
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  const currentIndex = STEPS.indexOf(order.status);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold">Order {order.orderNumber}</h1>
      <p className="text-slate-600 mt-1">
        {order.customer.name} • {order.customer.city} • Payment: {order.paymentMethod}
      </p>

      {order.status === "Cancelled" ? (
        <p className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mt-6 font-semibold">
          This order was cancelled.
        </p>
      ) : (
        <div className="bg-white border rounded-2xl p-6 mt-6">
          <h2 className="font-bold text-lg">Order Tracking</h2>
          <div className="flex flex-wrap gap-3 mt-4">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                    i <= currentIndex ? "bg-brand-violet text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`font-semibold text-sm ${i <= currentIndex ? "text-brand-violet" : "text-slate-500"}`}>
                  {step}
                </span>
                {i < STEPS.length - 1 && <span className="text-slate-300">→</span>}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600 mt-4">Current status: {order.status}</p>
          <Link href={`/order/${order.orderNumber}/invoice`} className="inline-block mt-4 bg-brand-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold">
            Print / Download Invoice
          </Link>

        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 space-y-4">
          {order.items.map((item: any) => (
            <div key={`${item.slug}-${item.variant}`} className="flex gap-4 text-sm">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
              <div className="flex-1">
                <p className="font-bold">{item.name}</p>
                <p className="text-slate-600">{item.variant} x {item.quantity}</p>
              </div>
              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border rounded-2xl p-6 h-fit">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between mt-2 text-sm"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>
          <div className="flex justify-between mt-2 text-sm"><span>Delivery</span><span>{order.delivery === 0 ? "FREE" : `$${order.delivery.toFixed(2)}`}</span></div>
          <div className="flex justify-between mt-4 font-bold text-lg border-t pt-4"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
          {order.coupon && <p className="text-sm text-green-600 mt-2">Coupon used: {order.coupon}</p>}
        </div>
      </div>

      <Link href="/orders" className="inline-block mt-6 text-brand-violet font-semibold">
        ← My Orders
      </Link>
    </div>
  );
}

export default function OrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-16 text-center font-semibold">Loading order...</div>}>
      <OrderDetailContent params={params} />
    </Suspense>
  );
}
