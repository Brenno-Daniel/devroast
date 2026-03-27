import type { Metadata } from "next";
import {
  AnalysisCardDescription,
  AnalysisCardHeader,
  AnalysisCardRoot,
  AnalysisCardTitle,
  Badge,
  Button,
  CodeBlock,
  DiffLine,
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
  SwitchFieldControl,
  SwitchFieldLabel,
  SwitchFieldRoot,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Component library · Devroast",
  description:
    "UI component showcase aligned with the Pencil Component Library frame.",
};

const buttonVariants = ["default", "outline", "ghost", "destructive"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;

const SAMPLE_JS = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
}`;

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 font-mono font-bold text-sm">
      <span className="text-emerald-500">{"//"}</span>
      <span className="text-foreground">{label}</span>
    </div>
  );
}

export default function ComponentsShowcasePage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1440px] bg-background px-20 py-[60px] text-foreground">
      <header className="mb-[60px]">
        <div className="mb-16 flex items-center gap-2 font-mono font-bold text-2xl">
          <span className="text-emerald-500">{"//"}</span>
          <span>component_library</span>
        </div>
        <p className="max-w-2xl font-mono text-muted-foreground text-sm leading-relaxed">
          Preview aligned with the Component Library frame (Pencil). The buttons
          section mirrors primary, secondary, and link; below, a variant matrix
          for development.
        </p>
      </header>

      <div className="flex flex-col gap-[60px]">
        <section className="flex flex-col gap-6">
          <SectionLabel label="buttons" />
          <p className="max-w-xl font-mono text-muted-foreground text-xs">
            Same order and labels as the design: primary (default), secondary
            (outline), link (ghost).
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="default">$ roast_my_code</Button>
            <Button variant="outline">$ share_roast</Button>
            <Button variant="ghost">$ view_all &gt;&gt;</Button>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <SectionLabel label="buttons_matrix" />
          <p className="font-mono text-muted-foreground text-xs">
            Variants: default, outline, ghost, destructive. Sizes: sm, md, lg.
          </p>

          <div className="space-y-8">
            {buttonVariants.map((variant) => (
              <div key={variant}>
                <h3 className="mb-3 font-mono text-foreground/80 text-sm capitalize">
                  variant=&quot;{variant}&quot;
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  {buttonSizes.map((size) => (
                    <Button key={size} size={size} variant={variant}>
                      {variant === "default"
                        ? "$ example"
                        : `${variant} · ${size}`}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-mono text-foreground/80 text-sm">
              Disabled state
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button disabled variant="default">
                $ disabled
              </Button>
              <Button disabled variant="outline">
                outline
              </Button>
              <Button disabled variant="ghost">
                ghost
              </Button>
              <Button disabled variant="destructive">
                destructive
              </Button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <SectionLabel label="toggle" />
          <p className="max-w-xl font-mono text-muted-foreground text-xs">
            Base UI Switch: on/off states as in the Pencil design (roast mode).
          </p>
          <div className="flex flex-wrap gap-8">
            <SwitchFieldRoot>
              <SwitchFieldControl defaultChecked />
              <SwitchFieldLabel>roast mode</SwitchFieldLabel>
            </SwitchFieldRoot>
            <SwitchFieldRoot>
              <SwitchFieldControl />
              <SwitchFieldLabel>roast mode</SwitchFieldLabel>
            </SwitchFieldRoot>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <SectionLabel label="badge_status" />
          <div className="flex flex-wrap gap-6">
            <Badge variant="critical">critical</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="good">good</Badge>
            <Badge size="md" variant="destructive">
              needs_serious_help
            </Badge>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <SectionLabel label="cards" />
          <AnalysisCardRoot>
            <AnalysisCardHeader>
              <Badge variant="critical">critical</Badge>
            </AnalysisCardHeader>
            <AnalysisCardTitle>
              using var instead of const/let
            </AnalysisCardTitle>
            <AnalysisCardDescription>
              the var keyword is function-scoped rather than block-scoped, which
              can lead to unexpected behavior and bugs. modern javascript uses
              const for immutable bindings and let for mutable ones.
            </AnalysisCardDescription>
          </AnalysisCardRoot>
        </section>

        <section className="flex flex-col gap-6">
          <SectionLabel label="code_block" />
          <p className="max-w-xl font-mono text-muted-foreground text-xs">
            Shiki with Vesper theme, rendered on the server (Server Component).
          </p>
          <CodeBlock
            code={SAMPLE_JS}
            filename="calculate.js"
            lang="javascript"
          />
        </section>

        <section className="flex flex-col gap-6">
          <SectionLabel label="diff_line" />
          <div className="max-w-2xl overflow-hidden rounded-md border border-border">
            <DiffLine variant="removed">var total = 0;</DiffLine>
            <DiffLine variant="added">const total = 0;</DiffLine>
            <DiffLine variant="context">
              for (let i = 0; i &lt; items.length; i++) {"{"}
            </DiffLine>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <SectionLabel label="table_row" />
          <div className="max-w-4xl overflow-hidden rounded-md border border-border">
            <LeaderboardRowRoot className="items-center">
              <LeaderboardRowRank>#1</LeaderboardRowRank>
              <LeaderboardRowScore>2.1</LeaderboardRowScore>
              <LeaderboardRowCode>
                <span className="truncate font-mono text-muted-foreground">
                  function calculateTotal(items) {"{"} var total = 0; ...
                </span>
              </LeaderboardRowCode>
              <LeaderboardRowLanguage>javascript</LeaderboardRowLanguage>
            </LeaderboardRowRoot>
          </div>
        </section>
      </div>
    </main>
  );
}
