import type { Metadata } from "next";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Biblioteca de componentes · Devroast",
  description:
    "Showcase dos componentes de interface (espelho do design Pencil).",
};

const buttonVariants = ["default", "outline", "ghost", "destructive"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;

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
          Pré-visualização alinhada ao frame Component Library (Pencil). Seção
          de botões espelha primary, secondary e link; abaixo, matriz de
          variantes para desenvolvimento.
        </p>
      </header>

      <div className="flex flex-col gap-[60px]">
        <section className="flex flex-col gap-6">
          <SectionLabel label="buttons" />
          <p className="max-w-xl font-mono text-muted-foreground text-xs">
            Mesma ordem e rótulos do design: primary (default), secondary
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

          <div className="mt-6">
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
        </section>
      </div>
    </main>
  );
}
