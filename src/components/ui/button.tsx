"use client";

import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

/**
 * Variants aligned with the Pencil "Component Library" frame: primary (#10B981),
 * secondary with #2A2A2A border, link-style ghost with muted text.
 */
const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default:
        "bg-emerald-500 font-mono text-neutral-950 hover:bg-emerald-400 active:bg-emerald-600",
      outline:
        "border border-border bg-transparent font-mono text-foreground hover:bg-white/5",
      ghost:
        "border border-border bg-transparent font-mono text-muted-foreground hover:bg-white/5 hover:text-foreground",
      destructive:
        "bg-destructive font-sans text-destructive-foreground hover:brightness-95 active:brightness-90",
    },
    size: {
      sm: "h-8 gap-1.5 px-3 text-xs",
      md: "gap-2 py-2.5 px-6 text-[13px]",
      lg: "gap-2 px-8 py-3 text-base",
    },
  },
  compoundVariants: [
    {
      variant: "outline",
      size: "md",
      class: "py-2 px-4 text-xs",
    },
    {
      variant: "ghost",
      size: "md",
      class: "py-1.5 px-3 text-xs",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
