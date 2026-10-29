import mongoose, { Schema, model, models, type Document } from "mongoose";

export type OrderItemData = {
  slug: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
};

export interface IOrder extends Document {
  orderNumber: string;
  items: OrderItemData[];
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  coupon: string;
  paymentMethod: string;
  stripeSessionId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItemData>({
  slug: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  variant: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    items: { type: [OrderItemSchema], required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    delivery: { type: Number, required: true },
    total: { type: Number, required: true },
    coupon: { type: String, default: "" },
    paymentMethod: { type: String, default: "COD" },
    stripeSessionId: { type: String, default: undefined },
    status: {
      type: String,
      enum: ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);
