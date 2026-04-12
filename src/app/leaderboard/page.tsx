import type { Metadata } from "next";
import { getCaller } from "@/trpc/server";
import { highlightCode } from "@/lib/highlight-code";
import {
  LeaderboardRowCode,
  LeaderboardRowCodeLine,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
} from "@/components/ui";
import { CodeBlockCollapsible } from "@/components/ui";
import {
  LEADERBOARD_SUBTITLE,
  LEADERBOARD_TITLE_PROMPT,
  LEADERBOARD_TITLE_REST,
} from "@/lib/leaderboard-static";

export const metadata: Metadata = {
  title: "Shame Leaderboard | Devroast",
  description:
    "The most roasted code on the internet - see the worst submissions ranked by shame score.",
};

export default async function LeaderboardPage() {
  const caller = await getCaller();
  const data = await caller.leaderboard.getLeaderboard();

  const highlightItems = await Promise.all(
    data.items.map(async (item) => ({
      ...item,
      highlightHtml: await highlightCode(item.codeText, item.language),
    })),
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1440px] px-20 py-10">
        <section className="mb-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[32px] font-bold text-emerald-500">
              {LEADERBOARD_TITLE_PROMPT}
            </span>
            <h1 className="font-mono text-[28px] font-bold text-foreground">
              {LEADERBOARD_TITLE_REST}
            </h1>
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            {LEADERBOARD_SUBTITLE}
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>{data.total} submissions</span>
            <span>·</span>
            <span>avg score: {data.avgScore}/10</span>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="grid grid-cols-[60px_80px_1fr_100px] items-center border-border border-b bg-surface px-5 py-3 font-mono text-xs text-muted-foreground">
            <span className="font-medium">#</span>
            <span className="font-medium">score</span>
            <span className="font-medium">code</span>
            <span className="text-right font-medium">lang</span>
          </div>

          {highlightItems.map((item, index) => (
            <div
              key={item.submissionId}
              className="flex flex-col overflow-hidden rounded-md border border-border"
            >
              <div className="flex items-center justify-between border-border border-b bg-surface px-5 py-3">
                <div className="flex items-center gap-4">
                  <LeaderboardRowRoot className="flex items-center gap-3">
                    <LeaderboardRowRank
                      className={
                        index === 0
                          ? "font-mono text-sm font-medium text-amber-500"
                          : "font-mono text-sm font-medium text-muted-foreground"
                      }
                    >
                      {index + 1}
                    </LeaderboardRowRank>
                    <LeaderboardRowScore className="font-mono text-sm text-muted-foreground">
                      {item.score}
                    </LeaderboardRowScore>
                  </LeaderboardRowRoot>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] uppercase text-muted-foreground">
                    {item.mode}
                  </span>
                </div>
              </div>
              <div className="bg-input px-5 py-4">
                <div className="min-w-0">
                  <CodeBlockCollapsible
                    code={item.codeText}
                    lang={item.language}
                    highlightHtml={item.highlightHtml}
                    className="w-full"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <LeaderboardRowLanguage className="font-mono text-xs text-muted-foreground">
                    {item.language}
                  </LeaderboardRowLanguage>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
