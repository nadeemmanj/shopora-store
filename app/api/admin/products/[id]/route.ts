import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import {Product} from "../../../../../models/Product";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const set: any = {};
    if (body.name !== undefined) set.name = body.name;
    if (body.price !== undefined) set.price = Number(body.price);
    if (body.category !== undefined) set.category = body.category;
    if (body.image !== undefined) set.image = body.image;
    if (body.stock !== undefined) set.stock = Number(body.stock);
    if (body.rating !== undefined) set.rating = Number(body.rating);
    if (body.badge !== undefined) set.badge = body.badge || "";
    const ops: any = { $set: set };
    if (body.oldPrice !== undefined) {
      if (body.oldPrice) ops.$set.oldPrice = Number(body.oldPrice);
      else ops.$unset = { oldPrice: 1 };
    }
    const product = await Product.findByIdAndUpdate(id, ops, { new: true }).lean();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product: JSON.parse(JSON.stringify(product)) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
