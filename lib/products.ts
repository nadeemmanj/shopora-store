import { connectDB } from "./mongodb";
import { Product } from "../models/Product";
import { seedProducts } from "../data/products";
import type { ProductData } from "../types";

export async function ensureSeed(): Promise<void> {
  await connectDB();
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(seedProducts);
  }
}

export async function getProducts(): Promise<ProductData[]> {
  await ensureSeed();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products)) as ProductData[];
}

export async function getProductBySlug(slug: string): Promise<ProductData | null> {
  await ensureSeed();
  const product = await Product.findOne({ slug }).lean();
  if (!product) {
    return null;
  }
  return JSON.parse(JSON.stringify(product)) as ProductData;
}
