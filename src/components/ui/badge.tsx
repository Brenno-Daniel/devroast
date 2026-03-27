import type { ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

const badgeVariants = tv({
  base: "inline-flex items-center gap-2 font-mono font-normal",
  variants: {
    variant: {
      critical: "text-red-500",
      warning: "text-amber-500",
      good: "text-emerald-500",
      destructive: "text-red-500",
    },
    size: {
      sm: "text-xs",
      md: "text-[13px]",
    },
  },
  defaultVariants: {
    variant: "good",
    size: "sm",
  },
});

export type BadgeProps = ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Show leading status dot (Pencil badge_status). @default true */
    showDot?: boolean;
  };

export function Badge({
  className,
  variant,
  size,
  showDot = true,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {showDot ? (
        <span
          aria-hidden
          className={cn(
            "size-2 shrink-0 rounded-full",
            variant === "critical" || variant === "destructive"
              ? "bg-red-500"
              : variant === "warning"
                ? "bg-amber-500"
                : "bg-emerald-500",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

export { badgeVariants };
