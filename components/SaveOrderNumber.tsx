"use client";

import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";

export default function SaveOrderNumber({ orderNumber }: { orderNumber: string }) {
  const { clearCart } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    try {
      const saved = JSON.parse(localStorage.getItem("shopora-order-numbers") || "[]");
      if (!saved.includes(orderNumber)) {
        saved.push(orderNumber);
        localStorage.setItem("shopora-order-numbers", JSON.stringify(saved));
      }
    } catch {}
    clearCart();
  }, [orderNumber]);

  return null;
}
