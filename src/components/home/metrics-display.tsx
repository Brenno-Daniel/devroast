"use client";

import NumberFlow from "@number-flow/react";

export type MetricsDisplayProps = {
  totalRoasts: number;
  avgScore: number;
};

export function MetricsDisplay({ totalRoasts, avgScore }: MetricsDisplayProps) {
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
