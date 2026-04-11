export function MetricsSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 font-mono text-xs">
      <div className="h-4 w-12 animate-pulse rounded bg-muted" />
      <span>codes roasted · avg score:</span>
      <div className="h-4 w-8 animate-pulse rounded bg-muted" />
      <span>/10</span>
    </div>
  );
}
