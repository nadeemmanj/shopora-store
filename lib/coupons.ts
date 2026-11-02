import { connectDB } from "./mongodb";
import Coupon from "../models/Coupon";

export const FALLBACK_COUPONS: Record<string, number> = {
  WELCOME10: 10,
  SHOPORA20: 20,
};

export async function ensureCouponSeed() {
  await connectDB();
  const count = await Coupon.countDocuments();
  if (count === 0) {
    await Coupon.insertMany([
      { code: "WELCOME10", percent: 10, active: true },
      { code: "SHOPORA20", percent: 20, active: true },
    ]);
  }
}

export async function getCouponPercent(code?: string): Promise<number> {
  if (!code) return 0;
  const clean = code.trim().toUpperCase();
  if (!clean) return 0;
  try {
    await connectDB();
    const found = await Coupon.findOne({ code: clean, active: true }).lean();
    if (found) return found.percent;
  } catch {
    // database down ho to fallback coupons use hon
  }
  return FALLBACK_COUPONS[clean] ?? 0;
}

export async function getActiveCoupons() {
  await ensureCouponSeed();
  return Coupon.find({ active: true }).sort({ code: 1 }).lean();
}
