export type ToastType = "success" | "error" | "info";

export type ButtonVariant = "primary" | "outline" | "accent";

export type ButtonSweep = "left" | "right" | "top" | "bottom";

export interface Feature {
  title: string;
  text: string;
}

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}


export interface ProductData {
  _id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  stock: number;
  badge?: string;
  featured?: boolean;
}



export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
  stock: number;
};



export type OrderItemData = {
  slug: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
};
