import {connectDB} from "./mongodb";
import Order from "../models/Order";

export async function getOrderByNumber(orderNumber: string) {
  await connectDB();
  const order = await Order.findOne({ orderNumber }).lean();
  if (!order) return null;
  return JSON.parse(JSON.stringify(order));
}

export async function getOrdersByNumbers(numbers: string[]) {
  await connectDB();
  const orders = await Order.find({ orderNumber: { $in: numbers } })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(orders));
}
