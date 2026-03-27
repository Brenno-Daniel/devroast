import Link from "next/link";
import { HomeActions } from "@/components/home/home-actions";
import {
  CodeBlock,
  LeaderboardRowCode,
  LeaderboardRowCodeLine,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
} from "@/components/ui";
import {
  HOME_CODE_FILENAME,
  HOME_HERO_SUBTITLE,
  HOME_HERO_TITLE_PROMPT,
  HOME_HERO_TITLE_REST,
  HOME_LEADERBOARD_FOOTER_LINK_LABEL,
  HOME_LEADERBOARD_FOOTER_PREFIX,
  HOME_LEADERBOARD_SUBTITLE,
  HOME_LEADERBOARD_TITLE_PROMPT,
  HOME_LEADERBOARD_TITLE_REST,
  HOME_LEADERBOARD_VIEW_ALL,
  HOME_SAMPLE_CODE,
  HOME_STATS_LINE,
  LEADERBOARD_PREVIEW_ROWS,
} from "@/lib/home-static";

export default async function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[960px] px-10 pb-16 pt-20">
        <div className="flex flex-col gap-10">
          <section className="flex flex-col gap-3">
            <h1 className="flex flex-wrap items-baseline gap-3 font-mono font-bold text-4xl tracking-tight">
              <span className="text-emerald-500">{HOME_HERO_TITLE_PROMPT}</span>
              <span className="text-foreground">{HOME_HERO_TITLE_REST}</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
              {HOME_HERO_SUBTITLE}
            </p>
          </section>

          <div className="mx-auto flex w-full max-w-[780px] flex-col gap-4">
            <CodeBlock
              code={HOME_SAMPLE_CODE}
              filename={HOME_CODE_FILENAME}
              lang="javascript"
            />
            <HomeActions />
          </div>

          <p className="text-center font-mono text-muted-foreground text-xs">
            {HOME_STATS_LINE}
          </p>

          <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="flex flex-wrap items-center gap-2 font-mono font-bold text-sm">
                <span className="text-emerald-500">
                  {HOME_LEADERBOARD_TITLE_PROMPT}
                </span>
                <span className="text-foreground">
                  {HOME_LEADERBOARD_TITLE_REST}
                </span>
              </h2>
              <Link
                className="rounded-md border border-border px-3 py-1.5 font-mono text-muted-foreground text-xs no-underline transition-colors hover:bg-white/5 hover:text-foreground"
                href="/leaderboard"
              >
                {HOME_LEADERBOARD_VIEW_ALL}
              </Link>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {HOME_LEADERBOARD_SUBTITLE}
            </p>

            <div className="overflow-hidden rounded-md border border-border">
              <div className="grid grid-cols-[50px_70px_1fr_100px] items-center border-border border-b bg-[#0F0F0F] px-5 py-2.5 font-mono text-muted-foreground text-xs">
                <span className="font-medium">#</span>
                <span className="font-medium">score</span>
                <span className="font-medium">code</span>
                <span className="text-right font-medium">lang</span>
              </div>
              {LEADERBOARD_PREVIEW_ROWS.map((row) => (
                <LeaderboardRowRoot className="items-start" key={row.rank}>
                  <LeaderboardRowRank
                    className={
                      row.rank === "1"
                        ? "text-amber-500"
                        : "text-muted-foreground"
                    }
                  >
                    {row.rank}
                  </LeaderboardRowRank>
                  <LeaderboardRowScore>{row.score}</LeaderboardRowScore>
                  <LeaderboardRowCode>
                    {row.codeLines.map((line) => (
                      <LeaderboardRowCodeLine key={line}>
                        {line}
                      </LeaderboardRowCodeLine>
                    ))}
                  </LeaderboardRowCode>
                  <LeaderboardRowLanguage>
                    {row.language}
                  </LeaderboardRowLanguage>
                </LeaderboardRowRoot>
              ))}
            </div>

            <p className="text-center font-mono text-[13px] text-muted-foreground">
              {HOME_LEADERBOARD_FOOTER_PREFIX}
              <Link
                className="font-mono text-[13px] text-muted-foreground no-underline transition-colors hover:text-foreground"
                href="/leaderboard"
              >
                {HOME_LEADERBOARD_FOOTER_LINK_LABEL}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
