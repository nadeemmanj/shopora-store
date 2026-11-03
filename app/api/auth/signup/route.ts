import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name?.trim() || !emailRe.test(email || "") || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Please provide a valid name, email and a password of at least 6 characters." },
      { status: 400 }
    );
  }

  await connectDB();
  const cleanEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    return NextResponse.json(
      { error: "This email is already registered. Please log in." },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const role = adminEmail && cleanEmail === adminEmail ? "admin" : "customer";

  await User.create({ name: name.trim().slice(0, 50), email: cleanEmail, password: hashed, role });
  return NextResponse.json({ ok: true });
}
