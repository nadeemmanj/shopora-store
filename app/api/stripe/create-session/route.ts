import { NextResponse } from "next/server";
import {connectDB} from "../../../../lib/mongodb";
import {Product} from "../../../../models/Product";
import { getCouponPercent } from "../../../../lib/coupons";
import { getStripe } from "../../../../lib/stripe";

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY in .env.local and restart the server." },
        { status: 400 }
      );
    }
    await connectDB();
    const body = await req.json();
    const { items, customer, coupon } = body;

    if (!items || items.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city) {
      return NextResponse.json({ error: "Customer details are required" }, { status: 400 });
    }

    const slugs = items.map((i: any) => i.slug);
    const products = await Product.find({ slug: { $in: slugs } });
    const couponCode = (coupon || "").trim().toUpperCase();
    const percent = couponCode ? getCouponPercent(couponCode) : 0;

    const line_items: any[] = [];
    let discountedSubtotal = 0;

    for (const item of items) {
      const product: any = products.find((p: any) => p.slug === item.slug);
      if (!product) return NextResponse.json({ error: `Product not found: ${item.slug}` }, { status: 400 });
      if (item.quantity > product.stock) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 });
      }
      const unitCents = Math.round(product.price * (1 - percent / 100) * 100);
      discountedSubtotal += (unitCents * item.quantity) / 100;
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: `${product.name} (${item.variant || "Standard"})` },
          unit_amount: unitCents,
        },
        quantity: item.quantity,
      });
    }

    const delivery = discountedSubtotal >= 100 ? 0 : 5;
    if (delivery > 0) {
      line_items.push({
        price_data: { currency: "usd", product_data: { name: "Delivery" }, unit_amount: delivery * 100 },
        quantity: 1,
      });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      metadata: {
        items: JSON.stringify(items.map((i: any) => ({ slug: i.slug, variant: i.variant || "Standard", quantity: i.quantity }))),
        customer: JSON.stringify(customer),
        coupon: percent > 0 ? couponCode : "",
      },
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Stripe session failed" }, { status: 500 });
  }
}
