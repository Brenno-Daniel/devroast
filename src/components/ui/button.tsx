"use client";

import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default:
        "bg-primary font-mono text-primary-foreground hover:brightness-95 active:brightness-90",
      outline:
        "border border-primary bg-transparent font-sans text-primary hover:bg-primary/10",
      ghost:
        "bg-transparent font-sans text-foreground hover:bg-foreground/10 dark:hover:bg-foreground/15",
      destructive:
        "bg-destructive font-sans text-destructive-foreground hover:brightness-95 active:brightness-90",
    },
    size: {
      sm: "h-8 gap-1.5 px-3 text-xs",
      md: "gap-2 py-2.5 px-6 text-[13px]",
      lg: "gap-2 px-8 py-3 text-base",
    },
  },
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
