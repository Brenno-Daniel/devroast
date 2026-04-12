import Link from "next/link";
import { HomeCodePanel } from "@/components/home/home-code-panel";
import { MetricsSection } from "@/components/home/metrics-section";
import { HomeLeaderboardSection } from "@/components/home/home-leaderboard-section";
import {
  HOME_HERO_SUBTITLE,
  HOME_HERO_TITLE_PROMPT,
  HOME_HERO_TITLE_REST,
  HOME_LEADERBOARD_VIEW_ALL,
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

          <HomeCodePanel />

          <MetricsSection />

          <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="flex flex-wrap items-center gap-2 font-mono font-bold text-sm">
                <span className="text-emerald-500">{"//"}</span>
                <span className="text-foreground">shame_leaderboard</span>
              </h2>
              <Link
                className="rounded-md border border-border px-3 py-1.5 font-mono text-muted-foreground text-xs no-underline transition-colors hover:bg-white/5 hover:text-foreground"
                href="/leaderboard"
              >
                {HOME_LEADERBOARD_VIEW_ALL}
              </Link>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {"// the worst code on the internet, ranked by shame"}
            </p>

            <HomeLeaderboardSection />
          </section>
        </div>
      </div>
    </main>
  );
}
