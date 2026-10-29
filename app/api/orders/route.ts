import { NextResponse } from "next/server";
import {connectDB} from "../../../lib/mongodb";
import { buildOrder } from "../../../lib/orderService";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const order = await buildOrder({ ...body, paymentMethod: "COD" });
    return NextResponse.json({ orderNumber: order.orderNumber, total: order.total, status: order.status });
  } catch (e: any) {
    const msg = e.message || "Order failed";
    const isClientError =
      msg.includes("empty") || msg.includes("required") || msg.includes("stock") || msg.includes("not found");
    return NextResponse.json({ error: msg }, { status: isClientError ? 400 : 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const numbers = searchParams.get("numbers");
  if (!numbers) return NextResponse.json([]);
  const list = numbers.split(",").map((n) => n.trim()).filter(Boolean);
  const { default: Order } = await import("../../../models/Order");
  const orders = await Order.find({ orderNumber: { $in: list } }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(JSON.parse(JSON.stringify(orders)));
}
