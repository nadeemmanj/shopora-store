import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Review from "../../../models/Review";
import { Product } from "../../../models/Product";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  await connectDB();
  const reviews = (await Review.find({ productSlug: slug }).sort({ createdAt: -1 }).lean()) as any[];
  const count = reviews.length;
  const average = count
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
    : 0;
  return NextResponse.json({ reviews: JSON.parse(JSON.stringify(reviews)), average, count });
}

export async function POST(req: Request) {
  try {
    const { productSlug, name, rating, comment } = await req.json();
    if (!productSlug || !name?.trim() || !comment?.trim()) {
      return NextResponse.json({ error: "Name and review are required" }, { status: 400 });
    }
    const r = Number(rating);
    if (!r || r < 1 || r > 5) {
      return NextResponse.json({ error: "Rating must be 1 to 5" }, { status: 400 });
    }
    await connectDB();
    const product = await Product.findOne({ slug: productSlug }).lean();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    const review = await Review.create({
      productSlug,
      name: name.trim().slice(0, 50),
      rating: r,
      comment: comment.trim().slice(0, 1000),
    });
    return NextResponse.json({ review: JSON.parse(JSON.stringify(review)) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
