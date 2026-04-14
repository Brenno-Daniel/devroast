import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { highlightCode } from "@/lib/highlight-code";

export type CodeBlockProps = {
  code?: string;
  /** Shiki bundled language id (e.g. javascript, tsx). */
  lang?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Server Component only when using code/lang props.
 * If children provided, renders as wrapper without Shiki.
 */
export async function CodeBlock({
  code,
  lang,
  className,
  children,
}: CodeBlockProps) {
  if (code && lang) {
    const html = await highlightCode(code, lang);

    return (
      <div
        className={cn(
          "overflow-hidden rounded-md border border-border bg-[#111111]",
          className,
        )}
      >
        <div
          className="overflow-x-auto [&_code]:font-mono [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-[#111111]",
        className,
      )}
    >
      {children}
    </div>
  );
}
