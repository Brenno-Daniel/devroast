"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MetricsDisplay } from "./metrics-display";

export function MetricsSection() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.stats.getMetrics.queryOptions());

  return <MetricsDisplay data={data ?? null} />;
}
