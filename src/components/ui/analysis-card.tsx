import type { ComponentPropsWithoutRef } from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export type AnalysisStatus = "critical" | "warning" | "good";

export type AnalysisCardProps = ComponentPropsWithoutRef<"div"> & {
  status: AnalysisStatus;
  title: string;
  description: string;
};

function statusToBadgeVariant(status: AnalysisStatus): BadgeProps["variant"] {
  if (status === "critical") {
    return "critical";
  }
  if (status === "warning") {
    return "warning";
  }
  return "good";
}

export function AnalysisCard({
  className,
  status,
  title,
  description,
  ...props
}: AnalysisCardProps) {
  return (
    <div
      className={cn(
        "flex max-w-[480px] flex-col gap-3 border border-border p-5",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Badge variant={statusToBadgeVariant(status)}>
          {status === "critical"
            ? "critical"
            : status === "warning"
              ? "warning"
              : "good"}
        </Badge>
      </div>
      <h3 className="font-mono text-[13px] text-foreground">{title}</h3>
      <p className="font-sans text-muted-foreground text-xs leading-relaxed">
        {description}
      </p>
    </div>
  );
}
