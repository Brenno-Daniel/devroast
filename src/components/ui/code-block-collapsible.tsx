"use client";

import { useState } from "react";

export type CodeBlockCollapsibleProps = {
  code: string;
  lang: string;
  highlightHtml: string;
  className?: string;
};

export function CodeBlockCollapsible({
  code,
  highlightHtml,
  className,
}: CodeBlockCollapsibleProps) {
  const [open, setOpen] = useState(false);
  const lines = code.split("\n");
  const shouldCollapse = lines.length > 5;

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-md border border-border bg-[#111111]">
        <div
          className="[&_code]:font-mono [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-relaxed"
          style={{
            maxHeight: open ? "none" : "160px",
            overflow: open ? "visible" : "hidden",
          }}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki returns sanitized HTML with theme colors
          dangerouslySetInnerHTML={{ __html: highlightHtml }}
        />
        {shouldCollapse && (
          <button
            className="flex w-full items-center justify-center border-t border-border bg-[#0F0F0F] py-2 font-mono text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            onClick={() => setOpen(!open)}
            type="button"
          >
            {open ? "Show less" : `Show more (${lines.length} lines)`}
          </button>
        )}
      </div>
    </div>
  );
}

export type CodeBlockCollapsibleWithHighlightProps = {
  code: string;
  lang: string;
  className?: string;
};

export async function CodeBlockCollapsibleWithHighlight({
  code,
  lang,
  className,
}: CodeBlockCollapsibleWithHighlightProps) {
  const { highlightCode } = await import("@/lib/highlight-code");
  const highlightHtml = await highlightCode(code, lang);
  return (
    <CodeBlockCollapsible
      code={code}
      lang={lang}
      highlightHtml={highlightHtml}
      className={className}
    />
  );
}
