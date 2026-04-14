import { cn } from "@/lib/cn";

export type ScoreRingProps = {
  score: string;
  className?: string;
};

export function ScoreRing({ score, className }: ScoreRingProps) {
  const numScore = Number(score);
  const getNumberColor = () => {
    if (numScore <= 3) return "#EF4444";
    if (numScore <= 6) return "#F59E0B";
    return "#10B981";
  };

  const getBorderColor = () => {
    if (numScore <= 3) return "#EF4444";
    if (numScore <= 6) return "#F59E0B";
    return "#10B981";
  };

  return (
    <div
      className={cn(
        "relative flex h-[180px] w-[180px] items-center justify-center rounded-full",
        className,
      )}
    >
      {/* White outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-white/20" />

      {/* Colored inner ring using box-shadow for visible border on dark bg */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 0 2px #0a0a0a, 0 0 0 6px ${getBorderColor()}`,
        }}
      />

      {/* Score text - clear visibility */}
      <div className="flex flex-col items-center z-10">
        <span
          className="font-mono text-5xl font-bold leading-none"
          style={{
            color: getNumberColor(),
            textShadow: `0 0 30px ${getNumberColor()}`,
          }}
        >
          {score}
        </span>
        <span className="font-mono text-base text-zinc-500">/10</span>
      </div>
    </div>
  );
}
