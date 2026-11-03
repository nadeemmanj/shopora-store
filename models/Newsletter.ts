import mongoose, { Schema, model, models, type Document } from "mongoose";

export interface INewsletter extends Document {
  email: string;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

const Newsletter = models.Newsletter || model<INewsletter>("Newsletter", NewsletterSchema);
export default Newsletter;
