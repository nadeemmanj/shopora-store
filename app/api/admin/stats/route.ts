import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import {Product} from "../../../../models/Product";

export async function GET() {
  try {
    await connectDB();
    const orders = (await Order.find({}).lean()) as any[];
    const valid = orders.filter((o) => o.status !== "Cancelled");
    const revenue = Math.round(valid.reduce((s, o) => s + (o.total || 0), 0) * 100) / 100;
    const products = (await Product.find({}).lean()) as any[];
    const customers = new Set(valid.map((o) => o.customer.phone)).size;

    const revenueByDay: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayOrders = valid.filter((o) => new Date(o.createdAt).toISOString().slice(0, 10) === key);
      revenueByDay.push({
        date: key.slice(5),
        revenue: Math.round(dayOrders.reduce((s, o) => s + o.total, 0) * 100) / 100,
        orders: dayOrders.length,
      });
    }

    const statuses = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"];
    const ordersByStatus = statuses.map((st) => ({
      status: st,
      count: orders.filter((o) => o.status === st).length,
    }));

    const recentOrders = [...orders]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 5)
      .map((o) => ({
        orderNumber: o.orderNumber,
        customer: o.customer.name,
        total: o.total,
        status: o.status,
      }));

    const lowStock = products
      .filter((p) => p.stock <= 5)
      .slice(0, 8)
      .map((p) => ({ name: p.name, slug: p.slug, stock: p.stock }));

    return NextResponse.json({
      revenue,
      orders: orders.length,
      products: products.length,
      customers,
      revenueByDay,
      ordersByStatus,
      recentOrders,
      lowStock,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
