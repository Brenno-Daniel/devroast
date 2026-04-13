export default function LeaderboardLoading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1440px] px-20 py-10">
        <section className="mb-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            <div className="h-7 w-28 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-4 w-96 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-2">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="grid grid-cols-[60px_80px_1fr_100px] items-center border-border border-b bg-surface px-5 py-3 font-mono text-xs text-muted-foreground">
            <span className="font-medium">#</span>
            <span className="font-medium">score</span>
            <span className="font-medium">code</span>
            <span className="text-right font-medium">lang</span>
          </div>

          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-md border border-border"
            >
              <div className="flex items-center justify-between border-border border-b bg-surface px-5 py-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-6 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-8 animate-pulse rounded bg-muted" />
                  </div>
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </div>
              <div className="bg-input px-5 py-4">
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
                </div>
                <div className="mt-3 flex justify-end">
                  <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
