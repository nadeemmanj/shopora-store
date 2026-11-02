import { NextResponse } from "next/server";
import { getActiveCoupons } from "../../../lib/coupons";

export async function GET() {
  try {
    const coupons = await getActiveCoupons();
    return NextResponse.json({
      coupons: (coupons as any[]).map((c) => ({ code: c.code, percent: c.percent })),
    });
  } catch {
    return NextResponse.json({ coupons: [] });
  }
}
