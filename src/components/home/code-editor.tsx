"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  highlightHtml: string;
  maxLength?: number;
  "aria-label"?: string;
  className?: string;
};

export function CodeEditor({
  value,
  onChange,
  highlightHtml,
  maxLength,
  "aria-label": ariaLabel = "Code to analyze",
  className,
}: CodeEditorProps) {
  const preRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const syncScroll = useCallback(() => {
    const ta = textareaRef.current;
    const layer = preRef.current;
    if (!ta || !layer) {
      return;
    }
    layer.scrollTop = ta.scrollTop;
    layer.scrollLeft = ta.scrollLeft;
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-sync scroll after highlight layer DOM updates
  useEffect(() => {
    syncScroll();
  }, [highlightHtml, value, syncScroll]);

  return (
    <div className={cn("relative min-h-[360px]", className)}>
      <div
        ref={preRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-auto",
          "[&_code]:font-mono [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-relaxed",
        )}
        dangerouslySetInnerHTML={{ __html: highlightHtml }}
      />
      <textarea
        ref={textareaRef}
        aria-label={ariaLabel}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className={cn(
          "absolute inset-0 min-h-[360px] w-full resize-none overflow-auto bg-transparent p-3 font-mono text-[13px] leading-relaxed",
          "text-transparent caret-foreground selection:bg-emerald-500/30",
        )}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        value={value}
        wrap="off"
        maxLength={maxLength}
      />
      {maxLength !== undefined && (
        <div className="pointer-events-none absolute bottom-2 right-10 font-mono text-[11px]">
          <span
            className={cn(
              value.length > maxLength
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {value.length}
          </span>
          <span className="text-muted-foreground">/{maxLength}</span>
        </div>
      )}
    </div>
  );
}
