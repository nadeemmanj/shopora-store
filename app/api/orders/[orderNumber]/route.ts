import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";

const STATUSES = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"];

export async function GET(req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  await connectDB();
  const { default: Order } = await import("../../../../models/Order");
  const order = await Order.findOne({ orderNumber }).lean();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order: JSON.parse(JSON.stringify(order)) });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    const { orderNumber } = await params;
    const { status } = await req.json();
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await connectDB();
    const { default: Order } = await import("../../../../models/Order");
    const prev: any = await Order.findOne({ orderNumber }).lean();
    if (!prev) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (status === "Cancelled" && prev.status !== "Cancelled") {
      const { Product } = await import("../../../../models/Product");
      for (const it of prev.items) {
        await Product.updateOne({ slug: it.slug }, { $inc: { stock: it.quantity } });
      }
    }

    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { $set: { status } },
      { new: true }
    ).lean();
    return NextResponse.json({ order: JSON.parse(JSON.stringify(order)) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
