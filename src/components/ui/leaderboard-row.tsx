import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type LeaderboardRowProps = ComponentPropsWithoutRef<"div"> & {
  rank: string;
  score: string;
  /** Single-line preview; ignored when `codeLines` is set. */
  codePreview?: string;
  /** Multi-line code column; takes precedence over `codePreview`. */
  codeLines?: string[];
  language: string;
};

export function LeaderboardRow({
  className,
  rank,
  score,
  codePreview,
  codeLines,
  language,
  ...props
}: LeaderboardRowProps) {
  const multiline = codeLines !== undefined && codeLines.length > 0;

  return (
    <div
      className={cn(
        "flex gap-6 border-border border-b px-5 py-4 last:border-b-0",
        multiline ? "items-start" : "items-center",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "w-[50px] shrink-0 font-mono text-sm",
          rank === "1" ? "text-amber-500" : "text-muted-foreground",
        )}
      >
        {rank}
      </span>
      <span className="w-[70px] shrink-0 font-mono font-bold text-red-500 text-sm">
        {score}
      </span>
      {multiline ? (
        <div className="min-w-0 flex-1 space-y-0.5 font-mono text-xs">
          {codeLines.map((line) => {
            const t = line.trimStart();
            const isComment = t.startsWith("//") || t.startsWith("--");
            return (
              <div
                key={line}
                className={cn(
                  "break-all",
                  isComment ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {line}
              </div>
            );
          })}
        </div>
      ) : (
        <span className="min-w-0 flex-1 truncate font-mono text-muted-foreground text-xs">
          {codePreview ?? ""}
        </span>
      )}
      <span className="w-[100px] shrink-0 text-right font-mono text-muted-foreground text-xs">
        {language}
      </span>
    </div>
  );
}
