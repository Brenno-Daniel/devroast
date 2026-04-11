# Server & tRPC (`src/server`, `src/trpc`)

Guia para backend tRPC. Para contexto do projeto, ver [AGENTS.md global](../../../AGENTS.md).

## tRPC Setup

### Estrutura de arquivos

```
src/
├── server/trpc/
│   ├── init.ts           # initTRPC, context, createTRPCRouter
│   └── routers/
│       ├── _app.ts       # AppRouter export
│       └── *.ts         # Routers específicos
├── trpc/
│   ├── client.tsx        # TRPCReactProvider (Client Components)
│   ├── query-client.ts   # QueryClient factory
│   └── server.ts         # getCaller para Server Components
└── app/api/trpc/[trpc]/route.ts  # API route
```

## Server Components

Para queries em Server Components, usar `getCaller`:

```tsx
import { getCaller } from "@/trpc/server";

async function ServerComponent() {
  const caller = await getCaller();
  const data = await caller.stats.getMetrics();
}
```

## Client Components

Para queries/mutations em Client Components, usar `useQuery`/`useMutation`:

```tsx
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

function ClientComponent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.stats.getMetrics.queryOptions());
}
```

## Provider

O `TRPCReactProvider` já está configurado em [`src/app/layout.tsx`](../../app/layout.tsx).

## Criando um novo router

1. Criar arquivo em `src/server/trpc/routers/example.ts`
2. Exportar router em `src/server/trpc/routers/_app.ts`
3. Importar tipo `AppRouter` nos arquivos client quando necessário

```tsx
// src/server/trpc/routers/example.ts
import { publicProcedure, createTRPCRouter } from "../init";

export const exampleRouter = createTRPCRouter({
  myQuery: publicProcedure.query(() => "hello"),
});
```

## Performance

Sempre usar `Promise.all` para executar queries em paralelo quando possível:

```tsx
// ✅ Bom - executa em paralelo
const [users, posts] = await Promise.all([
  db.select().from(users),
  db.select().from(posts),
]);

// ❌ Ruim - executa sequencialmente
const users = await db.select().from(users);
const posts = await db.select().from(posts);
```