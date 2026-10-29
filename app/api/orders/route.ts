import { NextResponse } from "next/server";
import {connectDB} from "../../../lib/mongodb";
import {Product} from "../../../models/Product";
import Order from "../../../models/Order";
import { getCouponPercent } from "../../../lib/coupons";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { items, customer, coupon, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city) {
      return NextResponse.json({ error: "Customer details are required" }, { status: 400 });
    }

    const slugs = items.map((i: any) => i.slug);
    const products = await Product.find({ slug: { $in: slugs } });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product: any = products.find((p: any) => p.slug === item.slug);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.slug}` }, { status: 400 });
      }
      if (item.quantity > product.stock) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 });
      }
      subtotal += product.price * item.quantity;
      orderItems.push({
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        variant: item.variant || "Standard",
        quantity: item.quantity,
      });
    }

    const couponCode = (coupon || "").trim().toUpperCase();
    const percent = couponCode ? getCouponPercent(couponCode) : 0;
    const discount = (subtotal * percent) / 100;
    const delivery = subtotal - discount >= 100 ? 0 : 5;
    const total = subtotal - discount + delivery;

    for (const item of items) {
      const product: any = products.find((p: any) => p.slug === item.slug);
      product.stock -= item.quantity;
      await product.save();
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const order = await Order.create({
      orderNumber,
      items: orderItems,
      customer,
      subtotal,
      discount,
      delivery,
      total,
      coupon: percent > 0 ? couponCode : "",
      paymentMethod: paymentMethod || "COD",
      status: "Placed",
    });

    return NextResponse.json({ orderNumber: order.orderNumber, total: order.total, status: order.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Order failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const numbers = searchParams.get("numbers");
  if (!numbers) return NextResponse.json([]);
  const list = numbers.split(",").map((n) => n.trim()).filter(Boolean);
  const orders = await Order.find({ orderNumber: { $in: list } }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(JSON.parse(JSON.stringify(orders)));
}
