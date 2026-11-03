"use client";
import { useEffect, useState } from "react";
import { Stars, StarInput } from "./StarRating";

export default function Reviews({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => {
    fetch(`/api/reviews?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews || []);
        setAverage(d.average || 0);
        setCount(d.count || 0);
      });
  };
  useEffect(load, [slug]);

  const submit = async (e: any) => {
    e.preventDefault();
    setMsg("");
    if (!name.trim() || !comment.trim()) {
      setMsg("Please write your name and review.");
      return;
    }
    setSending(true);
    const r = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug: slug, name, rating, comment }),
    });
    const d = await r.json();
    setSending(false);
    if (d.error) {
      setMsg(d.error);
    } else {
      setName("");
      setComment("");
      setRating(5);
      setMsg("Thank you! Your review has been added.");
      load();
    }
  };

  return (
    <div className="mt-12 bg-white rounded-3xl border p-6">
      <h2 className="text-2xl font-extrabold">Customer Reviews</h2>
      {count > 0 ? (
        <p className="mt-2 flex items-center gap-2">
          <Stars value={average} className="text-xl" />
          <span className="font-bold">{average.toFixed(1)}</span>
          <span className="text-slate-500 text-sm">({count} review{count > 1 ? "s" : ""})</span>
        </p>
      ) : (
        <p className="text-slate-500 text-sm mt-2">No reviews yet. Be the first to review this product!</p>
      )}

      <div className="space-y-4 mt-6">
        {reviews.map((r) => (
          <div key={r._id} className="border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="font-bold">{r.name}</p>
              <span className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            <Stars value={r.rating} className="text-sm" />
            <p className="text-slate-700 text-sm mt-1">{r.comment}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-8 border-t pt-6">
        <h3 className="font-bold text-lg">Write a Review</h3>
        <input
          className="border rounded-xl px-4 py-2.5 mt-4 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-brand-violet"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-3">
          <p className="text-sm font-semibold mb-1">Your rating</p>
          <StarInput value={rating} onChange={setRating} />
        </div>
        <textarea
          className="border rounded-xl px-4 py-2.5 mt-3 w-full focus:outline-none focus:ring-2 focus:ring-brand-violet"
          rows={4}
          placeholder="What did you like about this product?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {msg && <p className="text-sm font-semibold mt-2 text-slate-700">{msg}</p>}
        <button
          type="submit"
          disabled={sending}
          className="mt-3 bg-brand-violet text-white px-8 py-2.5 rounded-full font-bold disabled:opacity-50"
        >
          {sending ? "Posting..." : "Post Review"}
        </button>
      </form>
    </div>
  );
}
