"use client";
import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { PILL } from "../page";

const STATUSES = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"];

function OrderDetailContent({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${orderNumber}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d.order || null);
        setStatus(d.order?.status || "");
      });
  }, [orderNumber]);

  const saveStatus = async () => {
    setSaving(true);
    setMsg("");
    const r = await fetch(`/api/orders/${orderNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const d = await r.json();
    setSaving(false);
    if (d.order) {
      setOrder(d.order);
      setMsg("Status updated. The customer tracking page shows the new status right away.");
    } else {
      setMsg(d.error || "Failed to update");
    }
  };

  const copyInvoiceLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/order/${orderNumber}/invoice`);
    setMsg("Invoice link copied. Share it with the customer.");
  };

  if (!order) return <p className="font-semibold">Loading order...</p>;

  return (
    <div>
      <Link href="/admin/orders" className="text-sm font-semibold text-brand-violet">← Back to orders</Link>
      <div className="flex justify-between items-center mt-2 mb-5 flex-wrap gap-3">
        <h2 className="text-2xl font-extrabold">{order.orderNumber}</h2>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${PILL[order.status]}`}>{order.status}</span>
      </div>

      {msg && <p className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm font-semibold">{msg}</p>}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold mb-3">Items</h3>
          <table className="w-full text-sm">
            <tbody>
              {order.items.map((it: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="py-2">
                    <div className="flex items-center gap-3">
                      {it.image && <img src={it.image} alt={it.name} className="w-10 h-10 object-cover rounded" />}
                      <div>
                        <p className="font-semibold">{it.name}</p>
                        <p className="text-xs text-slate-500">{it.variant} × {it.quantity}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-right font-bold">${(it.price * it.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <div className="w-56 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span>Delivery</span><span>{order.delivery === 0 ? "FREE" : `$${order.delivery.toFixed(2)}`}</span></div>
              <div className="flex justify-between font-extrabold text-base border-t pt-1"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold mb-3">Customer</h3>
            <p className="font-semibold">{order.customer.name}</p>
            <p className="text-sm text-slate-600">{order.customer.phone}</p>
            <p className="text-sm text-slate-600">{order.customer.address}, {order.customer.city}</p>
            <p className="text-sm text-slate-600 mt-2">Payment: <b>{order.paymentMethod}</b></p>
            {order.coupon && <p className="text-sm text-slate-600">Coupon: <b>{order.coupon}</b></p>}
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold mb-3">Change Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 mb-3"
            >
              {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
            </select>
            <button
              onClick={saveStatus}
              disabled={saving}
              className="w-full bg-brand-violet text-white py-2.5 rounded-full font-bold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Status"}
            </button>
            <p className="text-xs text-slate-500 mt-2">Cancelling an order returns its items to stock.</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold mb-3">Invoice</h3>
            <Link
              href={`/order/${orderNumber}/invoice`}
              className="block text-center border px-4 py-2.5 rounded-full font-bold mb-2"
            >
              View / Print Invoice
            </Link>
            <button onClick={copyInvoiceLink} className="w-full bg-brand-dark text-white py-2.5 rounded-full font-bold">
              Copy Invoice Link
            </button>
            <p className="text-xs text-slate-500 mt-2">Email is not set up yet, so share the invoice link with the customer directly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrderDetail({ params }: { params: Promise<{ orderNumber: string }> }) {
  return (
    <Suspense fallback={<p className="font-semibold">Loading order...</p>}>
      <OrderDetailContent params={params} />
    </Suspense>
  );
}
