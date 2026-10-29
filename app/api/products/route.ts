import { NextResponse, type NextRequest } from "next/server";
import type { SortOrder } from "mongoose";
import { Product } from "../../../models/Product";
import { ensureSeed } from "../../../lib/products";

export async function GET(req: NextRequest) {
  try {
    await ensureSeed();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "All";
    const sort = searchParams.get("sort") || "newest";

    const query: any = {};
    if (category !== "All") {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let sortObj: Record<string, SortOrder> = { createdAt: -1 };
    if (sort === "price-low") {
      sortObj = { price: 1 };
    }
    if (sort === "price-high") {
      sortObj = { price: -1 };
    }
    if (sort === "rating") {
      sortObj = { rating: -1 };
    }

    const products = await Product.find(query).sort(sortObj).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(products)));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
