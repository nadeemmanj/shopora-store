import { NextResponse } from "next/server";
import {connectDB} from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

export async function GET(_req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  await connectDB();
  const { orderNumber } = await params;
  const order = await Order.findOne({ orderNumber }).lean();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(JSON.parse(JSON.stringify(order)));
}
