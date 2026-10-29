import {Product} from "../models/Product";
import Order from "../models/Order";
import { getCouponPercent } from "./coupons";

export type OrderInputItem = {
  slug: string;
  variant?: string;
  quantity: number;
};

export async function buildOrder(input: {
  items: OrderInputItem[];
  customer: { name: string; phone: string; address: string; city: string };
  coupon?: string;
  paymentMethod?: string;
  stripeSessionId?: string;
}) {
  const { items, customer, coupon, paymentMethod, stripeSessionId } = input;

  if (!items || items.length === 0) throw new Error("Cart is empty");
  if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city) {
    throw new Error("Customer details are required");
  }

  const slugs = items.map((i) => i.slug);
  const products = await Product.find({ slug: { $in: slugs } });

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product: any = products.find((p: any) => p.slug === item.slug);
    if (!product) throw new Error(`Product not found: ${item.slug}`);
    if (item.quantity > product.stock) throw new Error(`Not enough stock for ${product.name}`);
    subtotal += product.price * item.quantity;
    orderItems.push({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: item.variant || "Standard",
      quantity: item.quantity,
    });
  }

  const couponCode = (coupon || "").trim().toUpperCase();
  const percent = couponCode ? getCouponPercent(couponCode) : 0;
  const discount = (subtotal * percent) / 100;
  const delivery = subtotal - discount >= 100 ? 0 : 5;
  const total = subtotal - discount + delivery;

  for (const item of items) {
    const product: any = products.find((p: any) => p.slug === item.slug);
    product.stock -= item.quantity;
    await product.save();
  }

  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  const order = await Order.create({
    orderNumber,
    items: orderItems,
    customer,
    subtotal,
    discount,
    delivery,
    total,
    coupon: percent > 0 ? couponCode : "",
    paymentMethod: paymentMethod || "COD",
    stripeSessionId: stripeSessionId || undefined,
    status: "Placed",
  });

  return order;
}
