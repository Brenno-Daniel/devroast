import { cn } from "@/lib/cn";
import { highlightCode } from "@/lib/highlight-code";

export type CodeBlockProps = {
  code: string;
  /** Shiki bundled language id (e.g. javascript, tsx). */
  lang: string;
  /** Optional file tab label (traffic lights + name). */
  filename?: string;
  className?: string;
};

/**
 * Server Component only: uses Shiki on the server. Do not add "use client".
 */
export async function CodeBlock({
  code,
  lang,
  filename,
  className,
}: CodeBlockProps) {
  const html = await highlightCode(code, lang);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-[#111111]",
        className,
      )}
    >
      {filename ? (
        <div className="flex h-10 items-center gap-3 border-border border-b px-4">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-red-500" />
            <span className="size-2.5 rounded-full bg-amber-500" />
            <span className="size-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-[#4B5563] text-xs">
            {filename}
          </span>
        </div>
      ) : null}
      <div
        className="overflow-x-auto [&_code]:font-mono [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
