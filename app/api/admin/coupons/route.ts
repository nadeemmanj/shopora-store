import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Coupon from "../../../../models/Coupon";
import { ensureCouponSeed } from "../../../../lib/coupons";

export async function GET() {
  await ensureCouponSeed();
  const coupons = await Coupon.find({}).sort({ code: 1 }).lean();
  return NextResponse.json({ coupons: JSON.parse(JSON.stringify(coupons)) });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code, percent } = await req.json();
    if (!code || percent === undefined || percent === "") {
      return NextResponse.json({ error: "Code and percent are required" }, { status: 400 });
    }
    const p = Number(percent);
    if (p < 1 || p > 90) {
      return NextResponse.json({ error: "Percent must be between 1 and 90" }, { status: 400 });
    }
    const coupon = await Coupon.create({ code: String(code).toUpperCase().trim(), percent: p, active: true });
    return NextResponse.json({ coupon: JSON.parse(JSON.stringify(coupon)) });
  } catch (e: any) {
    const msg = e.code === 11000 ? "This coupon code already exists" : e.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
