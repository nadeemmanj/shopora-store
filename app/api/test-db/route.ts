import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "Connected" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ status: "Failed", error: message }, { status: 500 });
  }
}
