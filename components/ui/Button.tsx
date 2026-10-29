"use client";

import type { ReactNode } from "react";
import type { ButtonSweep, ButtonVariant } from "../../types";
import { cn } from "../../lib/utils";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  sweep?: ButtonSweep;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  sweep = "left",
  onClick,
  type = "button",
  className,
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-brand-violet text-white border border-brand-violet",
    outline:
      "bg-transparent text-brand-violet border border-brand-violet hover:text-white",
    accent: "bg-brand-orange text-white border border-brand-orange",
  };

  const sweeps: Record<ButtonSweep, string> = {
    left: "btn-sweep-left",
    right: "btn-sweep-right",
    top: "btn-sweep-top",
    bottom: "btn-sweep-bottom",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn("btn", sweeps[sweep], variants[variant], className)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
