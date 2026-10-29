import mongoose, { Schema, model, models, type Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  stock: number;
  badge?: string;
  featured?: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    stock: { type: Number, default: 10 },
    badge: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = models.Product || model<IProduct>("Product", ProductSchema);
