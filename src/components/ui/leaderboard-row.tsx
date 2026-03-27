import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type LeaderboardRowRootProps = ComponentPropsWithoutRef<"div">;

export function LeaderboardRowRoot({
  className,
  ...props
}: LeaderboardRowRootProps) {
  return (
    <div
      className={cn(
        "flex gap-6 border-border border-b px-5 py-4 last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

export type LeaderboardRowRankProps = ComponentPropsWithoutRef<"span">;

export function LeaderboardRowRank({
  className,
  ...props
}: LeaderboardRowRankProps) {
  return (
    <span
      className={cn(
        "w-[50px] shrink-0 font-mono text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export type LeaderboardRowScoreProps = ComponentPropsWithoutRef<"span">;

export function LeaderboardRowScore({
  className,
  ...props
}: LeaderboardRowScoreProps) {
  return (
    <span
      className={cn(
        "w-[70px] shrink-0 font-mono font-bold text-red-500 text-sm",
        className,
      )}
      {...props}
    />
  );
}

export type LeaderboardRowCodeProps = ComponentPropsWithoutRef<"div">;

export function LeaderboardRowCode({
  className,
  ...props
}: LeaderboardRowCodeProps) {
  return (
    <div
      className={cn("min-w-0 flex-1 space-y-0.5 font-mono text-xs", className)}
      {...props}
    />
  );
}

export type LeaderboardRowCodeLineProps = {
  children: ReactNode;
  className?: string;
};

function lineLooksLikeComment(text: string) {
  const t = text.trimStart();
  return t.startsWith("//") || t.startsWith("--");
}

/**
 * One line of code in the leaderboard column; applies muted style for // and -- comments.
 */
export function LeaderboardRowCodeLine({
  children,
  className,
}: LeaderboardRowCodeLineProps) {
  const plain =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : null;
  const isComment = plain !== null && lineLooksLikeComment(plain);

  return (
    <div
      className={cn(
        "break-all",
        plain === null
          ? "text-foreground"
          : isComment
            ? "text-muted-foreground"
            : "text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type LeaderboardRowLanguageProps = ComponentPropsWithoutRef<"span">;

export function LeaderboardRowLanguage({
  className,
  ...props
}: LeaderboardRowLanguageProps) {
  return (
    <span
      className={cn(
        "w-[100px] shrink-0 text-right font-mono text-muted-foreground text-xs",
        className,
      )}
      {...props}
    />
  );
}
