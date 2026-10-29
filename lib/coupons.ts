export const COUPONS: Record<string, number> = {
  WELCOME10: 10,
  SHOPORA20: 20,
};

export function getCouponPercent(code: string): number {
  return COUPONS[code.trim().toUpperCase()] || 0;
}
