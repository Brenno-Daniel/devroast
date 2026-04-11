import Link from "next/link";
import {
  LeaderboardRowCode,
  LeaderboardRowCodeLine,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
} from "@/components/ui";
import { getCaller } from "@/trpc/server";

export async function HomeLeaderboardSection() {
  const caller = await getCaller();
  const data = await caller.leaderboard.getHomeLeaderboard();

  const codeLines = (code: string) => code.split("\n").slice(0, 3);

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-[50px_70px_1fr_100px] items-center border-border border-b bg-[#0F0F0F] px-5 py-2.5 font-mono text-muted-foreground text-xs">
        <span className="font-medium">#</span>
        <span className="font-medium">score</span>
        <span className="font-medium">code</span>
        <span className="text-right font-medium">lang</span>
      </div>
      {data.items.map((item, index) => (
        <LeaderboardRowRoot className="items-start" key={item.submissionId}>
          <LeaderboardRowRank
            className={index === 0 ? "text-amber-500" : "text-muted-foreground"}
          >
            {index + 1}
          </LeaderboardRowRank>
          <LeaderboardRowScore>{item.score}</LeaderboardRowScore>
          <LeaderboardRowCode>
            {codeLines(item.codeText).map((line, idx) => (
              <LeaderboardRowCodeLine key={idx}>{line}</LeaderboardRowCodeLine>
            ))}
          </LeaderboardRowCode>
          <LeaderboardRowLanguage>{item.language}</LeaderboardRowLanguage>
        </LeaderboardRowRoot>
      ))}
      <div className="flex items-center justify-center py-3">
        <p className="text-center font-mono text-[13px] text-muted-foreground">
          showing top 3 of {data.total.toLocaleString()} ·{" "}
          <Link
            className="no-underline transition-colors hover:text-foreground"
            href="/leaderboard"
          >
            view full leaderboard &gt;&gt;
          </Link>
        </p>
      </div>
    </div>
  );
}
