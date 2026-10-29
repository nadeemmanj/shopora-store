import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getStripe } from "../../lib/stripe";
import {connectDB} from "../../lib/mongodb";
import Order from "../../models/Order";
import { buildOrder } from "../../lib/orderService";
import SaveOrderNumber from "../../components/SaveOrderNumber";

async function PaymentSuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  await connection();
  const { session_id } = await searchParams;
  const stripe = getStripe();
  if (!session_id || !stripe) redirect("/checkout");

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status !== "paid") {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Payment Not Completed</h1>
        <p className="text-slate-600 mt-2">Your card payment did not go through. No order was created and no money was charged.</p>
        <Link href="/checkout" className="inline-block mt-6 bg-brand-violet text-white px-8 py-3 rounded-full font-semibold">
          Back to Checkout
        </Link>
      </div>
    );
  }

  await connectDB();
  let order: any = await Order.findOne({ stripeSessionId: session.id }).lean();
  let error = "";

  if (!order) {
    try {
      const md = session.metadata || {};
      order = await buildOrder({
        items: JSON.parse(md.items || "[]"),
        customer: JSON.parse(md.customer || "{}"),
        coupon: md.coupon,
        paymentMethod: "Card (Test)",
        stripeSessionId: session.id,
      });
      order = JSON.parse(JSON.stringify(order));
    } catch (e: any) {
      error = e.message || "Order creation failed";
    }
  } else {
    order = JSON.parse(JSON.stringify(order));
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Payment received, order issue</h1>
        <p className="text-slate-600 mt-2">{error || "Could not create your order. Please contact support with your payment reference."}</p>
        <Link href="/track" className="inline-block mt-6 bg-brand-violet text-white px-8 py-3 rounded-full font-semibold">
          Track Order
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 text-center">
      <SaveOrderNumber orderNumber={order.orderNumber} />
      <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">
        ✓
      </div>
      <h1 className="text-3xl font-extrabold mt-4">Payment Successful</h1>
      <p className="text-slate-600 mt-2">
        Order <span className="font-bold">{order.orderNumber}</span> placed. Paid ${order.total.toFixed(2)} in test mode, no real money was charged.
      </p>
      <div className="flex justify-center gap-3 mt-6 flex-wrap">
        <Link href={`/order/${order.orderNumber}`} className="bg-brand-violet text-white px-8 py-3 rounded-full font-semibold">
          Track Order
        </Link>
        <Link href={`/order/${order.orderNumber}/invoice`} className="border px-8 py-3 rounded-full font-semibold">
          View Invoice
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-16 text-center font-semibold">Verifying payment...</div>}>
      <PaymentSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
