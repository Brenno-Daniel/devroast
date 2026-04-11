import { Suspense } from "react";
import { MetricsDisplay } from "./metrics-display";
import { MetricsSkeleton } from "./metrics-skeleton";
import { getCaller } from "@/trpc/server";

export function MetricsSection() {
  return (
    <Suspense fallback={<MetricsSkeleton />}>
      <MetricsFetcher />
    </Suspense>
  );
}

async function MetricsFetcher() {
  const caller = await getCaller();
  const metrics = await caller.stats.getMetrics();
  return (
    <MetricsDisplay
      totalRoasts={metrics.totalRoasts}
      avgScore={metrics.avgScore}
    />
  );
}
