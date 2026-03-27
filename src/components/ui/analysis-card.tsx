import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type AnalysisCardRootProps = ComponentPropsWithoutRef<"div">;

export function AnalysisCardRoot({
  className,
  ...props
}: AnalysisCardRootProps) {
  return (
    <div
      className={cn(
        "flex max-w-[480px] flex-col gap-3 border border-border p-5",
        className,
      )}
      {...props}
    />
  );
}

export type AnalysisCardHeaderProps = ComponentPropsWithoutRef<"div">;

export function AnalysisCardHeader({
  className,
  ...props
}: AnalysisCardHeaderProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props} />
  );
}

export type AnalysisCardTitleProps = ComponentPropsWithoutRef<"h3">;

export function AnalysisCardTitle({
  className,
  ...props
}: AnalysisCardTitleProps) {
  return (
    <h3
      className={cn("font-mono text-[13px] text-foreground", className)}
      {...props}
    />
  );
}

export type AnalysisCardDescriptionProps = ComponentPropsWithoutRef<"p">;

export function AnalysisCardDescription({
  className,
  ...props
}: AnalysisCardDescriptionProps) {
  return (
    <p
      className={cn(
        "font-sans text-muted-foreground text-xs leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
