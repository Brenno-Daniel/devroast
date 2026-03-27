import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type LeaderboardRowProps = ComponentPropsWithoutRef<"div"> & {
  rank: string;
  score: string;
  codePreview: string;
  language: string;
};

export function LeaderboardRow({
  className,
  rank,
  score,
  codePreview,
  language,
  ...props
}: LeaderboardRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-6 border-border border-b px-5 py-4 last:border-b-0",
        className,
      )}
      {...props}
    >
      <span className="w-10 shrink-0 font-mono text-muted-foreground text-sm">
        {rank}
      </span>
      <span className="w-14 shrink-0 font-mono font-bold text-red-500 text-sm">
        {score}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-muted-foreground text-xs">
        {codePreview}
      </span>
      <span className="w-24 shrink-0 text-right font-mono text-muted-foreground text-xs">
        {language}
      </span>
    </div>
  );
}
