"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartProvider";
import { useToast } from "../../components/ToastProvider";
import { COUPONS } from "../../lib/coupons";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart, loaded } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponPercent, setCouponPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");
  const [loading, setLoading] = useState(false);

  const discount = (subtotal * couponPercent) / 100;
  const delivery = subtotal === 0 || subtotal - discount >= 100 ? 0 : 5;
  const total = subtotal - discount + delivery;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const percent = COUPONS[code];
    if (!percent) {
      showToast("Invalid coupon code", "error");
      return;
    }
    setCouponCode(code);
    setCouponPercent(percent);
    showToast(`Coupon applied: ${percent}% off`);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      showToast("Please fill all customer details", "error");
      return;
    }
    setLoading(true);
    const payload = {
      items: cart.map((i) => ({ slug: i.slug, variant: i.variant, quantity: i.quantity })),
      customer: { name, phone, address, city },
      coupon: couponCode,
    };
    try {
      if (paymentMethod === "CARD") {
        const res = await fetch("/api/stripe/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.url) {
          showToast(data.error || "Stripe session failed", "error");
          setLoading(false);
          return;
        }
        window.location.href = data.url;
        return;
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, paymentMethod: "COD" }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Order failed", "error");
        setLoading(false);
        return;
      }
      try {
        const saved = JSON.parse(localStorage.getItem("shopora-order-numbers") || "[]");
        if (!saved.includes(data.orderNumber)) {
          saved.push(data.orderNumber);
          localStorage.setItem("shopora-order-numbers", JSON.stringify(saved));
        }
      } catch {}
      clearCart();
      showToast("Order placed successfully");
      router.push(`/order/${data.orderNumber}`);
    } catch {
      showToast("Something went wrong, please try again", "error");
      setLoading(false);
    }
  };

  if (!loaded) {
    return <div className="max-w-7xl mx-auto px-6 py-16 text-center font-semibold">Loading checkout...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Your Cart is Empty</h1>
        <Link href="/shop" className="inline-block mt-6 bg-brand-violet text-white px-8 py-3 rounded-full font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-lg">Delivery Details</h2>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full border rounded-xl px-4 py-3 outline-none focus:border-brand-violet" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full border rounded-xl px-4 py-3 outline-none focus:border-brand-violet" />
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Address" className="w-full border rounded-xl px-4 py-3 outline-none focus:border-brand-violet" />
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full border rounded-xl px-4 py-3 outline-none focus:border-brand-violet" />

          <div>
            <label className="font-semibold text-sm">Coupon Code</label>
            <div className="flex gap-2 mt-2">
              <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Try WELCOME10" className="flex-1 border rounded-xl px-4 py-3 outline-none focus:border-brand-violet" />
              <button type="button" onClick={applyCoupon} className="bg-brand-violet text-white px-5 rounded-xl font-semibold">
                Apply
              </button>
            </div>
            {couponCode && (
              <p className="text-green-600 text-sm mt-2">
                {couponCode} applied: {couponPercent}% off
                <button type="button" onClick={() => { setCouponCode(""); setCouponPercent(0); setCouponInput(""); }} className="text-red-600 ml-3 font-semibold">
                  Remove
                </button>
              </p>
            )}
          </div>

          <div>
            <label className="font-semibold text-sm">Payment Method</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`border rounded-xl p-4 text-left ${paymentMethod === "COD" ? "border-brand-violet bg-violet-50" : ""}`}
              >
                <p className="font-bold text-sm">Cash on Delivery</p>
                <p className="text-xs text-slate-600 mt-1">Pay cash when your order arrives.</p>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`border rounded-xl p-4 text-left ${paymentMethod === "CARD" ? "border-brand-violet bg-violet-50" : ""}`}
              >
                <p className="font-bold text-sm">Card (Test Mode)</p>
                <p className="text-xs text-slate-600 mt-1">Pay online with a test card. No real money.</p>
              </button>
            </div>
            {paymentMethod === "CARD" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-3 text-sm">
                <p className="font-semibold">Stripe Test Mode</p>
                <p className="text-slate-700 mt-1">
                  Use card <span className="font-mono font-bold">4242 4242 4242 4242</span>, any future expiry date, any CVC. You will be redirected to Stripe's secure test page.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-lg">Order Summary</h2>
          <div className="space-y-3 mt-4">
            {cart.map((i) => (
              <div key={`${i.slug}-${i.variant}`} className="flex gap-3 text-sm">
                <img src={i.image} alt={i.name} className="w-14 h-14 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-slate-600">{i.variant} x {i.quantity}</p>
                </div>
                <p className="font-bold">${(i.price * i.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-5 text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between mt-2 text-sm"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
          <div className="flex justify-between mt-2 text-sm"><span>Delivery</span><span>{delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}</span></div>
          <div className="flex justify-between mt-4 font-bold text-lg border-t pt-4"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button type="submit" disabled={loading} className="w-full mt-6 bg-brand-violet text-white py-3 rounded-full font-semibold disabled:opacity-50">
            {loading ? "Please wait..." : paymentMethod === "CARD" ? "Pay with Card (Test)" : "Place Order (Cash on Delivery)"}
          </button>
        </div>
      </form>
    </div>
  );
}
