import type { Metadata } from "next";
import {
  AnalysisCardRoot,
  AnalysisCardHeader,
  AnalysisCardTitle,
  AnalysisCardDescription,
  Badge,
  CodeBlock,
  CodeBlockHeader,
  DiffLine,
} from "@/components/ui";
import {
  ANALYSIS_TITLE_PROMPT,
  ANALYSIS_TITLE_REST,
  DIFF_TITLE_PROMPT,
  DIFF_TITLE_REST,
  RESULT_DATA,
  RESULTS_TITLE_PROMPT,
  RESULTS_TITLE_REST,
} from "@/lib/results-static";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ id: RESULT_DATA.id }];
}

export const metadata: Metadata = {
  title: "Roast Results | Devroast",
  description: "Your code analysis results with detailed feedback.",
};

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void id;
  const data = RESULT_DATA;

  const getVerdictColor = (verdict: string) =>
    verdict === "needs_serious_help" ? "text-red-500" : "text-amber-500";

  const getIssueVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "critical";
      case "warning":
        return "warning";
      case "good":
        return "good";
      default:
        return "good";
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return "text-red-500";
    if (score <= 6) return "text-amber-500";
    return "text-emerald-500";
  };

  const diffLines = data.diff.split("\n");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1440px] px-20 py-10">
        <section className="mb-10 flex items-center gap-12">
          <div className="relative flex h-[180px] w-[180px] items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-border" />
            <div className="absolute inset-0 rounded-full border-4 border-destructive/30" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent [border-top-color:rgb(239,68,68)_50%] [border-right-color:rgb(245,158,11)_50%]" />
            <span
              className={`font-mono text-[48px] font-bold ${getScoreColor(Number(data.score))}`}
            >
              {data.score}
            </span>
            <span className="absolute bottom-6 font-mono text-sm text-muted-foreground">
              /10
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-sm font-medium ${getVerdictColor(data.verdict)}`}
              >
                verdict: {data.verdict}
              </span>
            </div>
            <h1 className="max-w-2xl font-mono text-xl leading-relaxed text-foreground">
              {data.roastTitle}
            </h1>
            <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
              <span>lang: {data.language}</span>
              <span>·</span>
              <span>{data.lines} lines</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 rounded border border-border px-4 py-2 font-mono text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                type="button"
              >
                share_roast
              </button>
            </div>
          </div>
        </section>

        <div className="mb-10 h-px w-full bg-border" />

        <section className="mb-10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-emerald-500">
              {RESULTS_TITLE_PROMPT}
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {RESULTS_TITLE_REST}
            </span>
          </div>
          <div className="overflow-hidden rounded-md border border-border bg-[#111111]">
            <CodeBlockHeader filename={`snippet.${data.language}`} />
            <div className="bg-input p-4">
              <CodeBlock code={data.code} lang={data.language} />
            </div>
          </div>
        </section>

        <div className="mb-10 h-px w-full bg-border" />

        <section className="mb-10 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-emerald-500">
              {ANALYSIS_TITLE_PROMPT}
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {ANALYSIS_TITLE_REST}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {data.issues.map((issue, idx) => (
              <AnalysisCardRoot key={idx} className="p-5">
                <AnalysisCardHeader>
                  <Badge variant={getIssueVariant(issue.severity)}>
                    {issue.severity}
                  </Badge>
                </AnalysisCardHeader>
                <AnalysisCardTitle>{issue.title}</AnalysisCardTitle>
                <AnalysisCardDescription>
                  {issue.description}
                </AnalysisCardDescription>
              </AnalysisCardRoot>
            ))}
          </div>
        </section>

        <div className="mb-10 h-px w-full bg-border" />

        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-emerald-500">
              {DIFF_TITLE_PROMPT}
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {DIFF_TITLE_REST}
            </span>
          </div>
          <div className="overflow-hidden rounded-md border border-border bg-[#111111]">
            <div className="flex h-10 items-center justify-between border-b border-border px-4">
              <span className="font-mono text-xs text-muted-foreground">
                your_code.ts → improved_code.ts
              </span>
            </div>
            <div className="bg-input p-1">
              {diffLines.map((line, idx) => {
                let variant: "added" | "removed" | "context" = "context";
                if (line.startsWith("+")) variant = "added";
                else if (line.startsWith("-")) variant = "removed";
                else if (line.startsWith("@@")) variant = "context";

                return (
                  <DiffLine key={idx} variant={variant}>
                    {line}
                  </DiffLine>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
