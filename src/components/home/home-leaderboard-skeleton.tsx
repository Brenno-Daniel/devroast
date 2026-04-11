import {
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
} from "@/components/ui";

export function HomeLeaderboardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-[50px_70px_1fr_100px] items-center border-border border-b bg-[#0F0F0F] px-5 py-2.5 font-mono text-muted-foreground text-xs">
        <span className="font-medium">#</span>
        <span className="font-medium">score</span>
        <span className="font-medium">code</span>
        <span className="text-right font-medium">lang</span>
      </div>
      {[1, 2, 3].map((i) => (
        <LeaderboardRowRoot className="items-start" key={i}>
          <LeaderboardRowRank className="h-4 w-6 animate-pulse rounded bg-muted" />
          <LeaderboardRowScore className="h-4 w-8 animate-pulse rounded bg-muted" />
          <LeaderboardRowCode className="flex flex-col gap-1">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </LeaderboardRowCode>
          <LeaderboardRowLanguage className="h-4 w-12 animate-pulse rounded bg-muted" />
        </LeaderboardRowRoot>
      ))}
      <div className="flex items-center justify-center py-3">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
