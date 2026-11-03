import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import { Product } from "../../../../models/Product";
import * as XLSX from "xlsx";
import Newsletter from "../../../../models/Newsletter";

function toCSV(rows: any[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "orders";
  const format = searchParams.get("format") || "csv";
  await connectDB();

  let rows: any[] = [];
  if (type === "products") {
    const products = (await Product.find({}).lean()) as any[];
    rows = products.map((p) => ({
      name: p.name, slug: p.slug, category: p.category, price: p.price,
      oldPrice: p.oldPrice || "", stock: p.stock, rating: p.rating, badge: p.badge || "",
    }));
  } else if (type === "customers") {
    const orders = (await Order.find({ status: { $ne: "Cancelled" } }).lean()) as any[];
    const map = new Map<string, any>();
    for (const o of orders) {
      if (!map.has(o.customer.phone)) {
        map.set(o.customer.phone, { name: o.customer.name, phone: o.customer.phone, city: o.customer.city, orders: 0, spent: 0 });
      }
      const c = map.get(o.customer.phone);
      c.orders += 1;
      c.spent = Math.round((c.spent + o.total) * 100) / 100;
    }
    rows = [...map.values()];
  } else if (type === "newsletter") {
    const subs = (await Newsletter.find({}).sort({ createdAt: -1 }).lean()) as any[];
    rows = subs.map((s: any) => ({
      email: s.email,
      subscribed: new Date(s.createdAt).toISOString().slice(0, 10),
    }));
  } else {
    const orders = (await Order.find({}).sort({ createdAt: -1 }).lean()) as any[];
    rows = orders.map((o) => ({
      orderNumber: o.orderNumber,
      date: new Date(o.createdAt).toISOString().slice(0, 10),
      customer: o.customer.name,
      phone: o.customer.phone,
      city: o.customer.city,
      items: o.items.map((i: any) => `${i.name} x${i.quantity}`).join("; "),
      subtotal: o.subtotal, discount: o.discount, delivery: o.delivery, total: o.total,
      coupon: o.coupon || "", payment: o.paymentMethod, status: o.status,
    }));
  }

  const filename = `shopora-${type}-${new Date().toISOString().slice(0, 10)}`;

  if (format === "json") {
    return new NextResponse(JSON.stringify(rows, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}.json"`,
      },
    });
  }
  if (format === "xlsx") {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type);
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
      },
    });
  }
  return new NextResponse(toCSV(rows), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
