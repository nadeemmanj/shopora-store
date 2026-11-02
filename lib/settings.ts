import { connectDB } from "./mongodb";
import Settings from "../models/Settings";

export async function getSettings() {
  await connectDB();
  let s = await Settings.findOne().lean();
  if (!s) {
    const created = await Settings.create({});
    s = created.toObject();
  }
  return JSON.parse(JSON.stringify(s));
}
