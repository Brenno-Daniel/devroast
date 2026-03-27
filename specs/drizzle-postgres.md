# Especificação: Drizzle ORM + PostgreSQL (Docker Compose)

Documento para implementação da camada de dados do **Devroast**, alinhado ao [README](../README.md), ao design no Pencil (`devroast.pen`) e às specs existentes em [`specs/`](./).

---

## 1. Contexto (fontes)

### 1.1 README

- Produto: colar código → avaliação em **roast mode** ou **modo real** (sem sarcasmo).
- Roadmap: **ranking** dos trechos mais mal avaliados, **partilha** em redes.
- Stack atual **não** inclui base de dados; esta spec introduz Postgres + Drizzle.

### 1.2 Pencil — ecrãs relevantes para o modelo de dados

| Ecrã | ID | Entidades implícitas |
|------|-----|----------------------|
| **Screen 1 – Code Input** | `9qwc9` | Entrada: código, modo (toggle “roast”), linguagem (futuro editor); estatísticas agregadas na UI. |
| **Screen 2 – Roast Results** | `8pCh0` | **Pontuação** (ex.: 3,5/10), **citação/roast**, **código submetido** (preview), **análise detalhada** (vários cartões tipo issues), **diff sugerido** (bloco +/-). |
| **Screen 3 – Shame Leaderboard** | `5iseT` | Lista ordenada: **rank**, **meta** (submissões, score médio), **entradas** com preview de código e metadados por linha. |

**Decisão V1:** submissões **anónimas** (sem tabela `users` nem `user_id`). Autenticação pode entrar numa migração futura.

### 1.3 Relação com `specs/code-editor-syntax-highlight.md`

- Contrato V1 da API: **`code` (texto) + `language`**.
- Isto mapeia naturalmente para colunas `code_text` / `language_id` (ou `language`) na tabela de submissões.

---

## 2. Decisões de stack

| Peça | Escolha recomendada | Notas |
|------|---------------------|--------|
| Base de dados | **PostgreSQL** | JSONB útil para evoluções; tipos numéricos e enums nativos. |
| ORM | **Drizzle ORM** | Type-safe, SQL-like, bom encaixe em Next.js; migrações com `drizzle-kit`. |
| Driver | **`postgres`** (postgres.js) ou **`pg`** | `postgres` é comum com Drizzle em serverless/Node; validar compatibilidade com o runtime do deploy. |
| Dev local | **Docker Compose** | Um serviço `postgres` com volume nomeado e variável `DATABASE_URL`. |
| Variáveis | `.env.local` (gitignored) | `DATABASE_URL=postgresql://user:pass@localhost:5432/devroast` (exemplo). |

---

## 3. Enums PostgreSQL (Drizzle `pgEnum`)

Nomes sugeridos (ajustar ao estilo do projeto: `snake_case` em DB, `camelCase` em TS se preferirem).

| Enum | Valores | Uso |
|------|---------|-----|
| **`feedback_mode`** | `roast`, `straight` | Modo escolhido pelo utilizador (README: roast vs “modo real”). |
| **`submission_status`** | `pending`, `processing`, `completed`, `failed` | Estado do pipeline até haver resultado persistido. |
| **`issue_severity`** | `critical`, `warning`, `good` | Alinhado aos badges / `AnalysisCard` na UI. |

**Opcional (fase 2):** `language` como enum só se a lista for estável; na V1 pode ser **`varchar`** ou **`text`** com valores validados na app (ver spec do editor — lista mínima).

---

## 4. Tabelas propostas (V1)

### 4.1 `users` (fora do âmbito V1)

Não criar tabela `users` na primeira implementação. Quando existir autenticação, adicionar `users` e optional `submissions.user_id` via migração.

---

### 4.2 `submissions`

Representa **um pedido** de avaliação (código colado + modo + língua).

| Coluna | Tipo | Notas |
|--------|------|--------|
| `id` | `uuid` PK | |
| `code_text` | `text` | Conteúdo bruto |
| `language` | `varchar(64)` | Id da linguagem (ex.: `typescript`, `javascript`) — alinhado à spec do editor |
| `mode` | `feedback_mode` | `roast` \| `straight` |
| `status` | `submission_status` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Regra de produto:** cada ação de envio cria **sempre uma nova linha**, mesmo que o `code_text` seja idêntico a uma submissão anterior (sem deduplicação).

Índices sugeridos: `(created_at DESC)`, `(mode, status)` para filas e dashboards.

---

### 4.3 `analysis_results`

**Um registo por submissão concluída** (ecrã 2 — score, texto principal).

| Coluna | Tipo | Notas |
|--------|------|--------|
| `id` | `uuid` PK | |
| `submission_id` | `uuid` FK → `submissions.id` | **unique** (1:1) |
| `score` | `numeric(4,1)` ou `real` | Ex.: 3,5 para “/10” |
| `summary_roast` | `text` | nullable se `mode = straight`; citação sarcástica |
| `summary_straight` | `text` | nullable se `mode = roast`; feedback direto |
| `created_at` | `timestamptz` | |

*Nota de produto:* pode normalizar-se num único campo `summary` + convenção por modo; a separação evita misturar semânticas no mesmo campo.

---

### 4.4 `analysis_issues`

Linhas da secção **detailed_analysis** (vários cartões).

| Coluna | Tipo | Notas |
|--------|------|--------|
| `id` | `uuid` PK | |
| `analysis_id` | `uuid` FK → `analysis_results.id` | |
| `severity` | `issue_severity` | |
| `title` | `varchar(512)` | |
| `description` | `text` | |
| `sort_order` | `integer` | default 0 |

Índice: `(analysis_id, sort_order)`.

---

### 4.5 `suggested_fixes`

Bloco **suggested_fix** (diff unificado ou linhas).

| Coluna | Tipo | Notas |
|--------|------|--------|
| `id` | `uuid` PK | |
| `analysis_id` | `uuid` FK → `analysis_results.id` | unique 1:1 se só um diff por resultado |
| `diff_text` | `text` | Patch unificado ou representação serializada |
| `created_at` | `timestamptz` | |

**Alternativa:** `jsonb` com array de linhas `{ type: 'add'|'remove'|'context', text }` se o render for sempre estruturado.

---

### 4.6 Leaderboard (ecrã 3)

**Opção A (recomendada para V1):** não criar tabela dedicada; **consulta** sobre `analysis_results` + `submissions` com `ORDER BY score ASC` (piores primeiro) ou `ASC` conforme produto, com `LIMIT` e paginação.

**Opção B:** tabela `leaderboard_snapshots` ou materialização para cache se o ranking for pesado ou houver regras (decay temporal, moderador).

Incluir na implementação apenas **Opção A** até haver requisito de performance.

---

## 5. Diagrama relacional (Mermaid)

```mermaid
erDiagram
  submissions ||--o| analysis_results : yields
  analysis_results ||--|{ analysis_issues : contains
  analysis_results ||--o| suggested_fixes : has

  submissions {
    uuid id PK
    text code_text
    varchar language
    feedback_mode mode
    submission_status status
    timestamptz created_at
  }

  analysis_results {
    uuid id PK
    uuid submission_id FK
    numeric score
    text summary_roast
    text summary_straight
  }

  analysis_issues {
    uuid id PK
    uuid analysis_id FK
    issue_severity severity
    varchar title
    text description
    int sort_order
  }

  suggested_fixes {
    uuid id PK
    uuid analysis_id FK
    text diff_text
  }
```

---

## 6. Docker Compose (requisito)

Ficheiro sugerido na raiz: `docker-compose.yml` (ou `docker-compose.dev.yml`).

- Serviço **`postgres`** (imagem `postgres:16-alpine` ou pin fixo).
- **Porta** host `5432` (ou `5433` se conflito).
- **Volume** para dados persistentes.
- Variáveis: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB=devroast`.
- **Healthcheck** `pg_isready` para o app esperar o DB no dev.

Documentar no README um bloco “Base de dados local” com `docker compose up -d` e exemplo de `DATABASE_URL`.

---

## 7. Integração Drizzle no monorepo

- **`drizzle.config.ts`** na raiz (ou `src/db/`) com `schema` apontando para ficheiros de schema Drizzle.
- **`src/db/schema/`** — tabelas e enums exportados.
- **`src/db/index.ts`** — cliente singleton (cuidado com hot reload no Next: padrão `globalThis`).
- **Scripts** em `package.json`: `db:generate`, `db:migrate`, `db:push` (dev), `db:studio` (opcional).
- **Variável** `DATABASE_URL` obrigatória em runtime para rotas que acedem ao DB.

**Next.js:** usar o cliente apenas em **Server Actions**, **Route Handlers** ou **RSC** — não expor credenciais ao cliente.

---

## 8. Decisões de produto (V1)

| # | Tema | Decisão |
|---|------|---------|
| 1 | Identidade | Submissões **anónimas** — sem `users` nem `user_id` na V1. |
| 2 | Retenção | **Retenção total** de `code_text` e dados associados (sem TTL nem truncagem automática nesta fase). Reavaliar LGPD antes de produção pública alargada. |
| 3 | Duplicados | **Sempre nova submissão** — cada envio gera um novo registo em `submissions`, sem deduplicação por conteúdo. |

---

## 9. To-dos (implementação)

- [ ] Adicionar dependências: `drizzle-orm`, `drizzle-kit`, driver Postgres (`postgres` ou `pg` + `@types/pg` se necessário).
- [ ] Criar `docker-compose.yml` com serviço Postgres + healthcheck + volume.
- [ ] Documentar `DATABASE_URL` e comandos Docker no [README](../README.md) (secção curta).
- [ ] Criar `drizzle.config.ts` e pasta `src/db/schema/` com enums e tabelas desta spec (sem `users` na V1).
- [ ] Implementar cliente Drizzle singleton seguro para Next.js.
- [ ] Gerar primeira migração (`drizzle-kit generate`) e aplicar (`migrate` ou `push` em dev).
- [ ] (Opcional) `pnpm db:studio` para inspeção local.
- [ ] Ligar uma **Server Action** ou **route** de teste “health” que faça `SELECT 1` para validar a ligação.
- [ ] Quando existir API de análise: transação `submission` → job → `analysis_results` + filhos.

---

## 10. Referências

- [Drizzle ORM — PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [drizzle-kit](https://orm.drizzle.team/kit-docs/overview)
- [Docker Hub — postgres](https://hub.docker.com/_/postgres)
- Design: `devroast.pen` — ecrãs `8pCh0` (resultados), `5iseT` (leaderboard), `9qwc9` (input)
- [README](../README.md) · [spec do editor](./code-editor-syntax-highlight.md)
