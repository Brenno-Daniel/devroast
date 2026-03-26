"use client";

import { JetBrains_Mono } from "next/font/google";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
});

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: cn(
        jetbrainsMono.className,
        "bg-emerald-500 text-neutral-950 hover:bg-emerald-600",
      ),
      outline:
        "border border-emerald-500 bg-transparent font-sans text-emerald-600 hover:bg-emerald-500/10",
      ghost:
        "bg-transparent font-sans text-neutral-950 hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-neutral-800",
      destructive: "bg-red-600 font-sans text-white hover:bg-red-700",
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
