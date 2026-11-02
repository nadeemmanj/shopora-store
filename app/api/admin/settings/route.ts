import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Settings from "../../../../models/Settings";
import { getSettings } from "../../../../lib/settings";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const body = await req.json();
  await connectDB();
  const settings = await Settings.findOneAndUpdate(
    {},
    {
      $set: {
        storeName: body.storeName || "Shopora",
        tagline: body.tagline || "",
        supportEmail: body.supportEmail || "",
        supportPhone: body.supportPhone || "",
        address: body.address || "",
      },
    },
    { new: true, upsert: true }
  ).lean();
  return NextResponse.json({ settings: JSON.parse(JSON.stringify(settings)) });
}
