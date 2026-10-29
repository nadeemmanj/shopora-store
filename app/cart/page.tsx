"use client";

import Link from "next/link";
import { useCart } from "../../components/CartProvider";

const FREE_LIMIT = 100;

export default function CartPage() {
  const { cart, subtotal, updateQuantity, removeFromCart, clearCart, loaded } = useCart();

  const progress = Math.min(100, (subtotal / FREE_LIMIT) * 100);
  const remaining = Math.max(0, FREE_LIMIT - subtotal);
  const delivery = subtotal === 0 || subtotal >= FREE_LIMIT ? 0 : 5;
  const total = subtotal + delivery;

  if (!loaded) {
    return <div className="max-w-7xl mx-auto px-6 py-16 text-center font-semibold">Loading your cart...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Your Cart is Empty</h1>
        <p className="text-slate-600 mt-2">Add some products first.</p>
        <Link href="/shop" className="inline-block mt-6 bg-brand-violet text-white px-8 py-3 rounded-full font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold">Your Cart</h1>

      <div className="bg-white border rounded-2xl p-5 mt-6">
        <p className="font-semibold">
          {remaining > 0 ? `Add $${remaining.toFixed(2)} more for FREE delivery` : "You got FREE delivery!"}
        </p>
        <div className="bg-slate-200 h-3 rounded-full mt-3 overflow-hidden">
          <div className="bg-brand-violet h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-slate-600 mt-2">{Math.round(progress)}% towards free delivery ($100)</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={`${item.slug}-${item.variant}`} className="bg-white border rounded-2xl p-4 flex gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1">
                <Link href={`/product/${item.slug}`} className="font-bold hover:text-brand-violet">
                  {item.name}
                </Link>
                <p className="text-sm text-slate-600">{item.variant}</p>
                <p className="font-bold text-brand-violet mt-1">${item.price}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => updateQuantity(item.slug, item.variant, item.quantity - 1)} className="w-8 h-8 border rounded-full font-bold">−</button>
                  <span className="font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.slug, item.variant, item.quantity + 1)} className="w-8 h-8 border rounded-full font-bold">+</button>
                  <button onClick={() => removeFromCart(item.slug, item.variant)} className="text-red-600 text-sm font-semibold ml-2">
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <button onClick={clearCart} className="text-red-600 text-sm font-semibold">
            Clear Cart
          </button>
        </div>

        <div className="bg-white border rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-lg">Order Summary</h2>
          <div className="flex justify-between mt-4 text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between mt-2 text-sm"><span>Delivery</span><span>{delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}</span></div>
          <div className="flex justify-between mt-4 font-bold text-lg border-t pt-4"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <Link href="/checkout" className="block text-center mt-6 bg-brand-violet text-white py-3 rounded-full font-semibold">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="block text-center mt-3 text-brand-violet font-semibold text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
