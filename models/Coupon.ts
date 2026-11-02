import mongoose, { Schema, model, models, type Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  percent: number;
  active: boolean;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    percent: { type: Number, required: true, min: 1, max: 90 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Coupon = models.Coupon || model<ICoupon>("Coupon", CouponSchema);
export default Coupon;
