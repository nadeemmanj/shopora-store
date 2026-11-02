import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  await connectDB();
  const q: any = {};
  if (status && status !== "All") q.status = status;
  const orders = await Order.find(q).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders: JSON.parse(JSON.stringify(orders)) });
}
