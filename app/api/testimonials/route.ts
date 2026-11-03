import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Review from "../../../models/Review";
import { Product } from "../../../models/Product";

export async function GET() {
  await connectDB();
  const reviews = (await Review.find({ rating: 5 }).sort({ createdAt: -1 }).limit(6).lean()) as any[];
  const testimonials = await Promise.all(
    reviews.map(async (r) => {
      const p: any = await Product.findOne({ slug: r.productSlug }).lean();
      return {
        name: r.name,
        rating: r.rating,
        comment: r.comment,
        productName: p?.name || "",
        date: r.createdAt,
      };
    })
  );
  return NextResponse.json({ testimonials });
}
