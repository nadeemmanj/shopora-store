import mongoose, { Schema, model, models, type Document } from "mongoose";

export interface IReview extends Document {
  productSlug: string;
  name: string;
  rating: number;
  comment: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    productSlug: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Review = models.Review || model<IReview>("Review", ReviewSchema);
export default Review;
