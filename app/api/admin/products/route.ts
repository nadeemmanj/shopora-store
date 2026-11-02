import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import {Product} from "../../../../models/Product";

export async function GET() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products: JSON.parse(JSON.stringify(products)) });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.slug || body.price === undefined || !body.category) {
      return NextResponse.json({ error: "Name, slug, price and category are required" }, { status: 400 });
    }
    const slug = String(body.slug).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const exists = await Product.findOne({ slug });
    if (exists) return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
    const product = await Product.create({
      name: body.name,
      slug,
      price: Number(body.price),
      oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
      category: body.category,
      image: body.image || "",
      stock: Number(body.stock ?? 0),
      rating: Number(body.rating ?? 4.5),
      badge: body.badge || "",
    });
    return NextResponse.json({ product: JSON.parse(JSON.stringify(product)) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
