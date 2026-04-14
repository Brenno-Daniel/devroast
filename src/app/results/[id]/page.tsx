import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { cacheLife, Suspense } from "react";
import {
  AnalysisCardDescription,
  AnalysisCardHeader,
  AnalysisCardRoot,
  AnalysisCardTitle,
  Badge,
  CodeBlock,
  CodeBlockHeader,
  DiffLine,
} from "@/components/ui";
import { getDb } from "@/db";
import { analysisResults, submissions } from "@/db/schema";
import {
  ANALYSIS_TITLE_PROMPT,
  ANALYSIS_TITLE_REST,
  DIFF_TITLE_PROMPT,
  DIFF_TITLE_REST,
  RESULTS_TITLE_PROMPT,
  RESULTS_TITLE_REST,
} from "@/lib/results-static";

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
    diff: "+// Suggested fix here\n-// Original code here",
  };

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

  const getScoreColor = (score: string) => {
    const numScore = Number(score);
    if (numScore <= 3) return "text-red-500";
    if (numScore <= 6) return "text-amber-500";
    return "text-emerald-500";
  };

  const diffLines = data.diff.split("\n");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1440px] px-20 py-10">
        <h1 className="mb-8 font-mono text-2xl">
          {RESULTS_TITLE_PROMPT}{" "}
          <span className="text-muted-foreground">{RESULTS_TITLE_REST}</span>
        </h1>

        <section className="mb-8">
          <AnalysisCardRoot>
            <AnalysisCardHeader>
              <AnalysisCardTitle>{ANALYSIS_TITLE_PROMPT}</AnalysisCardTitle>
              <AnalysisCardDescription>
                {ANALYSIS_TITLE_REST}
              </AnalysisCardDescription>
            </AnalysisCardHeader>
            <div className="flex flex-wrap gap-4 p-6">
              <Badge className={getScoreColor(data.score)}>
                {data.score}/10
              </Badge>
              <Badge className={getVerdictColor(data.verdict)}>
                {data.verdict}
              </Badge>
              <Badge>{data.language}</Badge>
              <Badge>{data.lines} lines</Badge>
            </div>
          </AnalysisCardRoot>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 font-mono text-xl">{data.roastTitle}</h2>
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

        <section className="mb-8">
          <h2 className="mb-4 font-mono text-xl">
            {DIFF_TITLE_PROMPT}{" "}
            <span className="text-muted-foreground">{DIFF_TITLE_REST}</span>
          </h2>
          <CodeBlock>
            <CodeBlockHeader>{data.language}</CodeBlockHeader>
            <div className="flex flex-col">
              {diffLines.map((line, idx) => {
                let variant: "added" | "removed" | "context" = "context";
                if (line.startsWith("+")) variant = "added";
                else if (line.startsWith("-")) variant = "removed";
                else if (line.startsWith("@@")) variant = "context";

                return (
                  <DiffLine key={line} variant={variant}>
                    {line}
                  </DiffLine>
                );
              })}
            </div>
          </CodeBlock>
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
