"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";

export type MetricsData = {
  totalRoasts: number;
  avgScore: number;
};

export function MetricsDisplay({ data }: { data: MetricsData | null }) {
  const [totalRoasts, setTotalRoasts] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    if (data) {
      setTotalRoasts(data.totalRoasts);
      setAvgScore(data.avgScore);
    }
  }, [data]);

  return (
    <p className="text-center font-mono text-muted-foreground text-xs">
      <NumberFlow
        value={totalRoasts}
        format={{ notation: "compact" }}
        className="inline"
      />{" "}
      codes roasted · avg score:{" "}
      <NumberFlow
        value={avgScore}
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        className="inline"
      />
      /10
    </p>
  );
}
