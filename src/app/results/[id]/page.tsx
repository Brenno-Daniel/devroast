import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { CodeBlock } from "@/components/ui";
import { ScoreRing } from "@/components/ui/score-ring";
import { getDb } from "@/db";
import {
  analysisIssues,
  analysisResults,
  submissions,
  suggestedFixes,
} from "@/db/schema";

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

  // Get main submission + analysis
  const results = await db
    .select({
      submissionId: submissions.id,
      codeText: submissions.codeText,
      language: submissions.language,
      mode: submissions.mode,
      analysisId: analysisResults.id,
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

  // Fetch issues related to this analysis
  const issuesResult = await db
    .select({
      severity: analysisIssues.severity,
      title: analysisIssues.title,
      description: analysisIssues.description,
    })
    .from(analysisIssues)
    .where(eq(analysisIssues.analysisId, result.analysisId));

  // Fetch suggested fix
  const fixResult = await db
    .select({
      diffText: suggestedFixes.diffText,
    })
    .from(suggestedFixes)
    .where(eq(suggestedFixes.analysisId, result.analysisId))
    .limit(1);

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
    issues:
      issuesResult.length > 0
        ? issuesResult
        : [
            {
              severity: "warning",
              title: "Sample issue",
              description: "This is sample data",
            },
          ],
  };

  const getFileName = (lang: string) => {
    if (lang === "javascript") return "your_code.js";
    if (lang === "typescript") return "your_code.ts";
    return "your_code.js";
  };

  // Parse diff from DB or use sample
  const diffText = fixResult[0]?.diffText;
  const defaultDiff = [
    { type: "context", content: "function calculateTotal(items) {" },
    { type: "removed", content: "  var total = 0;" },
    { type: "removed", content: "  for (var i = 0; i < items.length; i++) {" },
    { type: "removed", content: "    total = total + items[i].price;" },
    { type: "removed", content: "  }" },
    { type: "removed", content: "  return total;" },
    {
      type: "added",
      content: "  return items.reduce((sum, item) => sum + item.price, 0);",
    },
    { type: "context", content: "}" },
  ];

  const diff = diffText
    ? {
        originalFile: getFileName(result.language),
        improvedFile: "improved_code.js",
        lines: diffText.split("\n").map((line: string) => {
          if (line.startsWith("+")) return { type: "added", content: line };
          if (line.startsWith("-")) return { type: "removed", content: line };
          return { type: "context", content: line };
        }),
      }
    : {
        originalFile: getFileName(result.language),
        improvedFile: "improved_code.js",
        lines: defaultDiff,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.issues.map((issue) => {
              const severityColor =
                issue.severity === "critical"
                  ? "text-red-500"
                  : issue.severity === "warning"
                    ? "text-amber-500"
                    : "text-emerald-500";

              const dotColor =
                issue.severity === "critical"
                  ? "bg-red-500"
                  : issue.severity === "warning"
                    ? "bg-amber-500"
                    : "bg-emerald-500";

              return (
                <div
                  key={issue.title}
                  className="rounded-md border border-border p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${dotColor}`} />
                    <span
                      className={`font-mono text-xs font-medium ${severityColor}`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <h3 className="font-mono text-[13px] font-medium text-foreground mb-2">
                    {issue.title}
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              );
            })}
          </div>
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
