import type { Metadata } from "next";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Componentes UI · Devroast",
  description: "Showcase dos componentes de interface e respetivas variantes.",
};

const buttonVariants = ["default", "outline", "ghost", "destructive"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;

export default function ComponentsShowcasePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12 border-foreground/15 border-b pb-8">
        <p className="mb-1 font-mono text-foreground/60 text-sm">
          Devroast · design system
        </p>
        <h1 className="font-semibold text-3xl text-foreground tracking-tight">
          Componentes UI
        </h1>
        <p className="mt-2 max-w-2xl text-foreground/80">
          Pré-visualização de todos os componentes em{" "}
          <code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-sm">
            src/components/ui
          </code>
          . Atualiza esta página ao adicionar novos componentes ou variantes.
        </p>
      </header>

      <section className="space-y-10">
        <div>
          <h2 className="mb-1 font-semibold text-foreground text-xl">Button</h2>
          <p className="mb-6 text-foreground/70 text-sm">
            Variantes: default, outline, ghost, destructive. Tamanhos: sm, md,
            lg.
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
                        ? "$ exemplo"
                        : `${variant} · ${size}`}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="mb-3 font-mono text-foreground/80 text-sm">
              Estado disabled
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
        </div>
      </section>
    </main>
  );
}
