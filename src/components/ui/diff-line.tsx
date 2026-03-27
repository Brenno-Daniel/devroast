import type { ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

const diffLineVariants = tv({
  base: "flex gap-2 px-4 py-2 font-mono text-[13px]",
  variants: {
    variant: {
      removed: "bg-[#1A0A0A]",
      added: "bg-[#0A1A0F]",
      context: "bg-transparent",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

const prefixVariants = tv({
  base: "w-3 shrink-0 select-none font-normal",
  variants: {
    variant: {
      removed: "text-red-500",
      added: "text-emerald-500",
      context: "text-[#4B5563]",
    },
  },
});

const bodyVariants = tv({
  variants: {
    variant: {
      removed: "text-[#6B7280]",
      added: "text-foreground",
      context: "text-[#6B7280]",
    },
  },
});

export type DiffLineProps = ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof diffLineVariants> & {
    children: React.ReactNode;
  };

export function DiffLine({
  className,
  variant,
  children,
  ...props
}: DiffLineProps) {
  const prefix =
    variant === "removed" ? "-" : variant === "added" ? "+" : "\u00a0";

  return (
    <div className={cn(diffLineVariants({ variant, className }))} {...props}>
      <span className={prefixVariants({ variant })}>{prefix}</span>
      <span className={cn("min-w-0 flex-1", bodyVariants({ variant }))}>
        {children}
      </span>
    </div>
  );
}

export { diffLineVariants };
