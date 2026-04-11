import { highlightCode } from "@/lib/highlight-code";
import { CodeBlockCollapsible } from "@/components/ui";
import { getCaller } from "@/trpc/server";

export async function HomeLeaderboardSection() {
  const caller = await getCaller();
  const data = await caller.leaderboard.getHomeLeaderboard();

  const highlightItems = await Promise.all(
    data.items.map(async (item) => ({
      ...item,
      highlightHtml: await highlightCode(item.codeText, item.language),
    })),
  );

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-[50px_70px_1fr_100px] items-center border-border border-b bg-[#0F0F0F] px-5 py-2.5 font-mono text-muted-foreground text-xs">
        <span className="font-medium">#</span>
        <span className="font-medium">score</span>
        <span className="font-medium">code</span>
        <span className="text-right font-medium">lang</span>
      </div>
      {highlightItems.map((item, index) => (
        <div
          key={item.submissionId}
          className="flex items-start overflow-hidden border-b border-border bg-input px-5 py-4 last:border-b-0"
        >
          <div className="grid w-full min-w-0 grid-cols-[50px_70px_1fr_100px] items-start gap-4">
            <div
              className={
                index === 0
                  ? "font-mono text-sm font-medium text-amber-500"
                  : "font-mono text-sm font-medium text-muted-foreground"
              }
            >
              {index + 1}
            </div>
            <div className="font-mono text-sm text-muted-foreground">
              {item.score}
            </div>
            <div className="min-w-0">
              <CodeBlockCollapsible
                code={item.codeText}
                lang={item.language}
                highlightHtml={item.highlightHtml}
                className="w-full"
              />
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              {item.language}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
