import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Coupon from "../../../../../models/Coupon";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();
  const set: any = {};
  if (body.percent !== undefined) set.percent = Number(body.percent);
  if (body.active !== undefined) set.active = !!body.active;
  const coupon = await Coupon.findByIdAndUpdate(id, { $set: set }, { new: true }).lean();
  return NextResponse.json({ coupon: JSON.parse(JSON.stringify(coupon)) });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  await Coupon.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
