"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";
import { useToast } from "../../components/ToastProvider";

export default function CheckoutPage() {
  const { cart: items, subtotal, clearCart, loaded } = useCart() as any;
  const { showToast } = useToast() as any;
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponList, setCouponList] = useState<{ code: string; percent: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetch("/api/coupons")
      .then((r) => r.json())
      .then((d) => setCouponList(d.coupons || []))
      .catch(() => {});
  }, []);

  const discount = coupon ? Math.round(subtotal * coupon.percent) / 100 : 0;
  const delivery = subtotal - discount >= 100 ? 0 : 5;
  const total = Math.round((subtotal - discount + delivery) * 100) / 100;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const found = couponList.find((c) => c.code === code);
    if (!found) {
      showToast("Invalid coupon code", "error");
      return;
    }
    setCoupon(found);
    showToast(`Coupon ${found.code} applied: ${found.percent}% off`, "success");
  };

  const placeOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      showToast("Please fill in all customer details", "error");
      return;
    }
    const orderItems = (items || []).map((it: any) => ({
      slug: it.slug || it.product?.slug,
      variant: it.variant || "Standard",
      quantity: it.quantity,
    }));
    if (!orderItems.length) return;
    setPlacing(true);
    try {
      const customer = { name: name.trim(), phone: phone.trim(), address: address.trim(), city: city.trim() };
      if (paymentMethod === "CARD") {
        const r = await fetch("/api/stripe/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: orderItems, customer, coupon: coupon?.code }),
        });
        const d = await r.json();
        if (d.url) {
          window.location.href = d.url;
        } else {
          showToast(d.error || "Could not start card payment", "error");
          setPlacing(false);
        }
        return;
      }
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems, customer, coupon: coupon?.code }),
      });
      const d = await r.json();
      if (d.orderNumber) {
        const nums = JSON.parse(localStorage.getItem("shopora-order-numbers") || "[]");
        nums.push(d.orderNumber);
        localStorage.setItem("shopora-order-numbers", JSON.stringify(nums));
        clearCart();
        showToast("Order placed successfully", "success");
        router.push(`/order/${d.orderNumber}`);
      } else {
        showToast(d.error || "Order failed", "error");
        setPlacing(false);
      }
    } catch {
      showToast("Something went wrong", "error");
      setPlacing(false);
    }
  };

  if (!loaded) return <p className="max-w-7xl mx-auto px-6 py-16 font-semibold">Loading...</p>;

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Your Cart is Empty</h1>
        <Link href="/shop" className="inline-block mt-6 bg-brand-violet text-white px-8 py-3 rounded-full font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const inputCls = "w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-violet";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-lg mb-4">Customer Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className={inputCls} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className={inputCls} placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className={inputCls} placeholder="Street address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <input className={inputCls} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-lg mb-4">Payment Method</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("COD")}
                className={`border-2 rounded-2xl p-4 text-left ${paymentMethod === "COD" ? "border-brand-violet bg-violet-50" : "border-slate-200"}`}
              >
                <p className="font-bold">Cash on Delivery</p>
                <p className="text-sm text-slate-500">Pay when your order arrives</p>
              </button>
              <button
                onClick={() => setPaymentMethod("CARD")}
                className={`border-2 rounded-2xl p-4 text-left ${paymentMethod === "CARD" ? "border-brand-violet bg-violet-50" : "border-slate-200"}`}
              >
                <p className="font-bold">Card (Test Mode)</p>
                <p className="text-sm text-slate-500">Pay now with a test card</p>
              </button>
            </div>
            {paymentMethod === "CARD" && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                Test mode: use card <b>4242 4242 4242 4242</b>, any future expiry date, any 3-digit CVC.
                You will be redirected to Stripe's secure test page. No real money is charged.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-lg mb-4">Coupon</h2>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <p className="font-semibold text-green-700">{coupon.code} ({coupon.percent}% off) applied</p>
                <button onClick={() => { setCoupon(null); setCouponInput(""); }} className="text-sm font-bold text-red-600">Remove</button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input className={inputCls} placeholder="Enter coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
                  <button onClick={applyCoupon} className="bg-brand-dark text-white px-6 rounded-xl font-semibold shrink-0">Apply</button>
                </div>
                {couponList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {couponList.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCoupon(c); setCouponInput(c.code); showToast(`Coupon ${c.code} applied`, "success"); }}
                        className="text-xs font-bold border border-dashed border-brand-violet text-brand-violet rounded-full px-3 py-1"
                      >
                        {c.code} ({c.percent}% off)
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {coupon && <div className="flex justify-between text-green-600"><span>Discount ({coupon.code})</span><span>-${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>Delivery</span><span>{delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}</span></div>
            <div className="flex justify-between font-extrabold text-lg border-t pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full mt-6 bg-brand-violet text-white py-3 rounded-full font-bold disabled:opacity-50"
          >
            {placing ? "Processing..." : paymentMethod === "CARD" ? `Pay $${total.toFixed(2)} (Test)` : "Place Order (Cash on Delivery)"}
          </button>
        </div>
      </div>
    </div>
  );
}
