import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

export async function GET() {
  await connectDB();
  const orders = (await Order.find({ status: { $ne: "Cancelled" } }).lean()) as any[];
  const map = new Map<string, any>();
  for (const o of orders) {
    const key = o.customer.phone;
    if (!map.has(key)) {
      map.set(key, {
        name: o.customer.name,
        phone: o.customer.phone,
        city: o.customer.city,
        orders: 0,
        spent: 0,
        lastOrder: o.createdAt,
      });
    }
    const c = map.get(key);
    c.orders += 1;
    c.spent = Math.round((c.spent + (o.total || 0)) * 100) / 100;
    if (new Date(o.createdAt) > new Date(c.lastOrder)) {
      c.lastOrder = o.createdAt;
      c.name = o.customer.name;
      c.city = o.customer.city;
    }
  }
  const customers = [...map.values()].sort((a, b) => b.spent - a.spent);
  return NextResponse.json({ customers: JSON.parse(JSON.stringify(customers)) });
}
