import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import {
  AnalysisCardDescription,
  AnalysisCardHeader,
  AnalysisCardRoot,
  AnalysisCardTitle,
  Badge,
  CodeBlock,
} from "@/components/ui";
import { ScoreRing } from "@/components/ui/score-ring";
import { getDb } from "@/db";
import { analysisResults, submissions } from "@/db/schema";

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export const metadata: Metadata = {
  title: "Roast Results | Devroast",
  description: "Your code analysis results with detailed feedback.",
};

async function ResultsContent({ id }: { id: string }) {
  "use cache";
  cacheLife("minutes");

  const db = getDb();
  const results = await db
    .select({
      submissionId: submissions.id,
      codeText: submissions.codeText,
      language: submissions.language,
      mode: submissions.mode,
      score: analysisResults.score,
      summaryRoast: analysisResults.summaryRoast,
      summaryStraight: analysisResults.summaryStraight,
    })
    .from(submissions)
    .innerJoin(
      analysisResults,
      eq(analysisResults.submissionId, submissions.id),
    )
    .where(eq(submissions.id, id))
    .limit(1);

  const result = results[0];

  if (!result) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto w-full max-w-[1440px] px-20 py-10">
          <h1 className="font-mono text-xl">Result not found</h1>
        </div>
      </main>
    );
  }

  const data = {
    id: result.submissionId,
    code: result.codeText,
    language: result.language,
    mode: result.mode,
    score: result.score,
    roastTitle:
      result.mode === "roast"
        ? result.summaryRoast || "Roast Complete!"
        : result.summaryStraight || "Analysis Complete!",
    lines: result.codeText.split("\n").length,
    verdict: Number(result.score) <= 3 ? "needs_serious_help" : "acceptable",
    issues: [
      {
        severity: "warning",
        title: "Sample issue",
        description: "This is sample data - update when issues are stored",
      },
    ],
  };

  const getFileName = (lang: string) => {
    if (lang === "javascript") return "your_code.js";
    if (lang === "typescript") return "your_code.ts";
    return "your_code.js";
  };

  const diff = {
    originalFile: getFileName(result.language),
    improvedFile: "improved_code.js",
    lines: [
      { type: "context", content: "function calculateTotal(items) {" },
      { type: "removed", content: "  var total = 0;" },
      {
        type: "removed",
        content: "  for (var i = 0; i < items.length; i++) {",
      },
      { type: "removed", content: "    total = total + items[i].price;" },
      { type: "removed", content: "  }" },
      { type: "removed", content: "  return total;" },
      {
        type: "added",
        content: "  return items.reduce((sum, item) => sum + item.price, 0);",
      },
      { type: "context", content: "}" },
    ],
  };

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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1440px] px-20 py-10">
        {/* Score Hero */}
        <section className="mb-10 flex items-center gap-12">
          <ScoreRing score={data.score} />
          <div className="flex flex-1 flex-col gap-4">
            {/* Verdict Badge */}
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  data.verdict === "needs_serious_help"
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
              />
              <span
                className={`font-mono text-sm font-medium ${
                  data.verdict === "needs_serious_help"
                    ? "text-red-500"
                    : "text-amber-500"
                }`}
              >
                verdict: {data.verdict}
              </span>
            </div>

            {/* Roast Title */}
            <p className="font-mono text-xl leading-relaxed">
              "{data.roastTitle}"
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>lang: {data.language}</span>
              <span>·</span>
              <span>{data.lines} lines</span>
            </div>

            {/* Share Button */}
            <Link
              href="#"
              className="w-fit no-underline rounded-md border border-border px-4 py-2 font-mono text-sm transition-colors hover:bg-white/5"
            >
              $ share_roast
            </Link>
          </div>
        </section>

        <div className="h-px w-full border-b border-border" />

        {/* Submitted Code Section */}
        <section className="mb-10 mt-10">
          <div className="mb-4 flex items-center gap-2 font-mono text-sm font-bold">
            <span className="text-emerald-500">{"//"}</span>
            <span className="text-foreground">your_submission</span>
          </div>
          <CodeBlock code={data.code} lang={data.language} />
        </section>

        <div className="h-px w-full border-b border-border" />

        {/* Analysis Section */}
        <section className="mb-10 mt-10">
          <div className="mb-4 flex items-center gap-2 font-mono text-sm font-bold">
            <span className="text-emerald-500">{"//"}</span>
            <span className="text-foreground">detailed_analysis</span>
          </div>
          <AnalysisCardRoot>
            <AnalysisCardHeader>
              <AnalysisCardTitle>Issues</AnalysisCardTitle>
              <AnalysisCardDescription>
                Findings from analysis
              </AnalysisCardDescription>
            </AnalysisCardHeader>
            <div className="flex flex-col gap-4 p-6">
              {data.issues.map((issue) => (
                <Badge
                  key={issue.title}
                  variant={getIssueVariant(issue.severity)}
                >
                  {issue.severity}: {issue.title}
                </Badge>
              ))}
            </div>
          </AnalysisCardRoot>
        </section>

        <div className="h-px w-full border-b border-border" />

        {/* Diff Section */}
        <section className="mb-10 mt-10">
          <div className="mb-4 flex items-center gap-2 font-mono text-sm font-bold">
            <span className="text-emerald-500">{"//"}</span>
            <span className="text-foreground">suggested_fix</span>
          </div>
          <div className="overflow-hidden rounded-md border border-border bg-[#111111]">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="font-mono text-xs text-muted-foreground">
                {diff.originalFile} → {diff.improvedFile}
              </span>
            </div>
            <div className="flex flex-col font-mono text-[13px] leading-relaxed">
              {diff.lines.map((line) => (
                <div
                  key={line.content}
                  className={`flex px-4 py-1 ${
                    line.type === "removed"
                      ? "bg-red-500/10 text-red-400"
                      : line.type === "added"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-muted-foreground"
                  }`}
                >
                  <span className="w-4 mr-2 text-xs">
                    {line.type === "added"
                      ? "+"
                      : line.type === "removed"
                        ? "-"
                        : " "}
                  </span>
                  <span>{line.content}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background text-foreground">
          <div className="mx-auto w-full max-w-[1440px] px-20 py-10">
            <h1 className="font-mono text-xl">Loading...</h1>
          </div>
        </main>
      }
    >
      <ResultsContent id={id} />
    </Suspense>
  );
}
