import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CodeBlockHeaderProps = {
  filename?: string;
  trailing?: ReactNode;
  className?: string;
};

export function CodeBlockHeader({
  filename,
  trailing,
  className,
}: CodeBlockHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-3 border-border border-b px-4",
        className,
      )}
    >
      <span className="flex gap-1.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-red-500" />
        <span className="size-2.5 rounded-full bg-amber-500" />
        <span className="size-2.5 rounded-full bg-emerald-500" />
      </span>
      {filename ? (
        <span className="min-w-0 flex-1 truncate font-mono text-[#4B5563] text-xs">
          {filename}
        </span>
      ) : null}
      {trailing ? (
        <div className="flex items-center gap-3">{trailing}</div>
      ) : null}
    </div>
  );
}
