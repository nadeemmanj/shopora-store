"use client";

export function Stars({ value, className = "text-base" }: { value: number; className?: string }) {
  const full = Math.round(value);
  return (
    <span className={`text-amber-400 tracking-wide ${className}`} aria-label={`${value} out of 5 stars`}>
      {"★".repeat(full)}{"☆".repeat(5 - full)}
    </span>
  );
}

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-3xl ${n <= value ? "text-amber-400" : "text-slate-300"} hover:scale-110 transition`}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
