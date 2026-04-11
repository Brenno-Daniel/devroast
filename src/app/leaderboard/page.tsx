import type { Metadata } from "next";
import {
  LeaderboardRowCode,
  LeaderboardRowCodeLine,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
} from "@/components/ui";
import {
  LEADERBOARD_ENTRIES,
  LEADERBOARD_STATS,
  LEADERBOARD_SUBTITLE,
  LEADERBOARD_TITLE_PROMPT,
  LEADERBOARD_TITLE_REST,
} from "@/lib/leaderboard-static";

export const metadata: Metadata = {
  title: "Shame Leaderboard | Devroast",
  description:
    "The most roasted code on the internet - see the worst submissions ranked by shame score.",
};

export default function LeaderboardPage() {
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
            <span>{LEADERBOARD_STATS.totalSubmissions} submissions</span>
            <span>·</span>
            <span>avg score: {LEADERBOARD_STATS.avgScore}/10</span>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="grid grid-cols-[60px_80px_1fr_100px] items-center border-border border-b bg-surface px-5 py-3 font-mono text-xs text-muted-foreground">
            <span className="font-medium">#</span>
            <span className="font-medium">score</span>
            <span className="font-medium">code</span>
            <span className="text-right font-medium">lang</span>
          </div>

          {LEADERBOARD_ENTRIES.map((entry) => (
            <div
              key={entry.rank}
              className="flex flex-col overflow-hidden rounded-md border border-border"
            >
              <div className="flex items-center justify-between border-border border-b bg-surface px-5 py-3">
                <div className="flex items-center gap-4">
                  <LeaderboardRowRoot className="flex items-center gap-3">
                    <LeaderboardRowRank
                      className={
                        entry.rank === 1
                          ? "font-mono text-sm font-medium text-amber-500"
                          : "font-mono text-sm font-medium text-muted-foreground"
                      }
                    >
                      {entry.rank}
                    </LeaderboardRowRank>
                    <LeaderboardRowScore className="font-mono text-sm text-muted-foreground">
                      {entry.score}
                    </LeaderboardRowScore>
                  </LeaderboardRowRoot>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] uppercase text-muted-foreground">
                    {entry.mode}
                  </span>
                </div>
              </div>
              <div className="bg-input px-5 py-4">
                <LeaderboardRowCode className="font-mono text-[13px] text-foreground">
                  {entry.codeText.split("\n").map((line, idx) => (
                    <LeaderboardRowCodeLine key={idx}>
                      {line}
                    </LeaderboardRowCodeLine>
                  ))}
                </LeaderboardRowCode>
                <div className="mt-3 flex justify-end">
                  <LeaderboardRowLanguage className="font-mono text-xs text-muted-foreground">
                    {entry.language}
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
