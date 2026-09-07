import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide leading-none",
  {
    variants: {
      variant: {
        neutral: "border-white/10 bg-white/5 text-text-secondary",
        accent: "border-accent/40 bg-accent/15 text-accent-soft",
        pink: "border-highlight/40 bg-highlight/15 text-highlight",
        amber: "border-badge-amber-border bg-badge-amber-bg text-badge-amber",
        success: "border-badge-success-border bg-badge-success-bg text-badge-success",
        live: "border-badge-live-border bg-badge-live-bg text-badge-live",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children?: ReactNode;
  className?: string;
  dot?: boolean;
}

const Badge = ({ children, variant, className = "", dot = false }: BadgeProps) => {
  return (
    <span className={`${badgeVariants({ variant })} ${className}`}>
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            variant === "live" ? "animate-live-pulse bg-badge-live" : "bg-current"
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
