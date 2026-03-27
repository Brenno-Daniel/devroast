import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="w-full border-border border-b bg-background">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-10">
        <Link
          className="flex items-center gap-2 font-mono no-underline"
          href="/"
        >
          <span className="font-bold text-emerald-500 text-xl leading-none">
            &gt;
          </span>
          <span className="font-medium text-[18px] text-foreground leading-none">
            devroast
          </span>
        </Link>
        <nav>
          <Link
            className="font-mono text-[13px] text-muted-foreground no-underline transition-colors hover:text-foreground"
            href="/leaderboard"
          >
            leaderboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
