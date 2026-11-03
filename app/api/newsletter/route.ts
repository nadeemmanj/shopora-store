import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Newsletter from "../../../models/Newsletter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const clean = String(email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    await connectDB();
    const exists = await Newsletter.findOne({ email: clean }).lean();
    if (exists) {
      return NextResponse.json({ error: "This email is already subscribed." }, { status: 409 });
    }
    await Newsletter.create({ email: clean });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const subscribers = await Newsletter.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ subscribers: JSON.parse(JSON.stringify(subscribers)) });
}
