# Especificação: editor de código com syntax highlight (homepage)

Documento de pesquisa e especificação para implementação. As **decisões de V1** estão em [Decisões de produto (V1)](#decisões-de-produto-v1).

---

## 1. Objetivo

- O utilizador cola (e/ou edita) código na homepage.
- Aplicar **syntax highlight** com cores coerentes com a linguagem.
- **Deteção automática** da linguagem após colar (e idealmente durante a edição, com debounce).
- **Seleção manual** opcional da linguagem no UI (override quando a deteção falhar ou for ambígua).
- Alinhar o máximo possível ao comportamento visual de referências como **ray.so** (`[raycast/ray-so](https://github.com/raycast/ray-so)`).

---

## 2. O que o ray.so faz (referência)

Análise do repositório público `raycast/ray-so` (março 2026):


| Aspeto                 | Implementação observada                                                                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Highlight no ecrã**  | **Shiki** — `highlighter.codeToHtml(code, { lang, theme, transformers })`; linguagens carregadas dinamicamente (`import("shiki/langs/javascript.mjs")`, etc.) via mapa `[languages.ts](https://github.com/raycast/ray-so/blob/main/app/(navigation)`/(code)/util/languages.ts). |
| **Deteção automática** | **highlight.js** — `hljs.highlightAuto(input, Object.keys(LANGUAGES))`; o resultado mapeia para a entrada do mapa `LANGUAGES` (chave → objeto `Language` com `name` e `src` para Shiki).                                                                                        |
| **Override manual**    | Estado separado: linguagem escolhida pelo utilizador vs `null` (modo automático). Quando automático, usa a linguagem detetada (atom `detectedLanguageAtom`).                                                                                                                    |
| **Edição**             | `**<textarea>`** com camadas CSS; highlight como HTML **por baixo / por cima** sincronizado (padrão “textarea + preview highlighted”) — ver `Editor.tsx` + `HighlightedCode.tsx`.                                                                                               |
| **Estado**             | Jotai + query na hash da URL (`language`, `code` em Base64, etc.) — específico do produto deles.                                                                                                                                                                                |
| **Outras deps**        | `highlight.js` e `shiki` coexistem no `package.json`; Prettier / Ruff para “format” em algumas linguagens (não é requisito do Devroast nesta fase).                                                                                                                             |


**Conclusão:** a combinação **highlight.js (auto) + Shiki (render)** é uma abordagem comprovada em produção e relativamente leve em comparação com embutir o Monaco inteiro.

---

## 3. Outras opções (comparação resumida)

### 3.1 Shiki (browser) — alinhado ao projeto atual

- **Prós:** Já usamos Shiki no servidor (`[highlight-code.ts](../src/lib/highlight-code.ts)`) com tema **Vesper**; reutilizar a mesma stack no cliente permite **paridade visual** tema/cores.
- **Contras:** Instância do highlighter + carregamento lazy de gramáticas; custo de bundle se se importarem muitas linguagens de uma vez (mitigar com `import()` dinâmico como no ray-so).
- **Deteção:** Shiki **não** inclui deteção automática robusta; é preciso **hljs.highlightAuto**, **@vscode/vscode-languagedetection**, ou heurísticas próprias.

### 3.2 highlight.js (só highlight, sem Shiki)

- **Prós:** Menor complexidade, `highlightAuto` integrado, bom para MVP.
- **Contras:** Tokens/cores **diferentes** do Shiki/Vesper usado no `CodeBlock` estático; experiência inconsistente entre “preview servidor” e “editor cliente” se ambos coexistirem.

### 3.3 CodeMirror 6

- **Prós:** Editor real (cursor, seleção, extensões), bom para edição longa; temecos de linguagem oficiais.
- **Contras:** Integração de tema escuro alinhado ao Vesper exige trabalho; deteção automática não é “baterias incluídas” — costuma combinar-se com outro passo de deteção ou extensão.

### 3.4 Monaco Editor

- **Prós:** Experiência tipo VS Code, IntelliSense opcional.
- **Contras:** Bundle **muito grande**; overkill se o foco é colar + highlight + submit; deteção de linguagem ainda pode precisar de configuração extra.

### 3.5 Prism.js

- **Prós:** Leve, simples.
- **Contras:** Menos alinhado ao ecossistema TextMate do Shiki; mesma questão de consistência com o resto da app.

---

## 4. Deteção automática de linguagem


| Abordagem                            | Notas                                                                                                             |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **highlight.js `highlightAuto`**     | Usada no ray-so; lista de candidatos limitada às chaves que o produto suporta (intersecção com linguagens Shiki). |
| **@vscode/vscode-languagedetection** | Modelo ML leve (Google), boa precisão em trechos maiores; requer mapeamento dos IDs devolvidos para ids Shiki.    |
| **Heurísticas**                      | Ex.: `package.json` → JSON; `def` + indentação → Python; custo baixo, cobertura limitada.                         |


**Recomendação para especificação:** começar com **highlight.js `highlightAuto`** com lista fechada de linguagens suportadas (como ray-so), mais **override manual**; avaliar ML depois se a qualidade for insuficiente.

---

## 5. Arquitetura recomendada (rascunho)

1. **Client Component** dedicado (ex.: `CodeEditor` ou `PasteCodePanel`) — precisa de `textarea` + estado React.
2. **Duas camadas:** `textarea` (texto puro, acessível, foco) + camada com HTML gerado por Shiki **sincronizada** (scroll, fonte, padding) — mesmo padrão ray-so.
3. **Estado:** `code: string`, `languageId: string | 'auto'`, `detectedLanguageId: string | null` (derivado com debounce ao mudar `code`).
4. **Shiki no cliente:** `createHighlighter` ou API recomendada na versão Shiki 4.x do projeto; carregar **apenas** a gramática necessária + tema Vesper (ou tema CSS compatível).
5. **Seletor manual:** `<Select>` / combobox (Base UI) com lista de linguagens suportadas; ao escolher, `languageId` deixa de ser `'auto'`.
6. **Integração futura API (V1):** enviar apenas `**code` (texto)** + `**language`** resolvida (manual ou detetada) no submit.

**Nota:** O `CodeBlock` atual é **Server Component** — o editor interativo **não** deve quebrar essa regra; o highlight em tempo real fica **só no cliente**.

---

## 6. Riscos e mitigações


| Risco                 | Mitigação                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Bundle grande         | Lazy import de gramáticas Shiki por linguagem; evitar importar todas as `langs` de uma vez.                              |
| Main thread bloqueada | `requestIdleCallback` / debounce na deteção; considerar **Web Worker** para Shiki em fase 2.                             |
| Deteção errada        | UI clara para “Language: Auto (JavaScript)” + mudança manual; limite de tamanho do snippet para `highlightAuto`.         |
| Acessibilidade        | `textarea` como fonte de verdade; contraste das cores do tema; não depender só da camada colorida para leitores de ecrã. |


---

## 7. Decisões de produto (V1)

Respostas acordadas (atualizar este bloco se o produto mudar):


| #   | Pergunta                     | Decisão                                                                                                                                                                       |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Só colar vs. escrever/editar | **Permitir colar e escrever/editar** trechos (textarea em camadas continua adequado; CodeMirror/Monaco fica fora de escopo até haver necessidade de UX mais rica).            |
| 2   | Lista de linguagens          | **V1 com lista mínima** (ex.: JavaScript, TypeScript, TSX, JSON, HTML, CSS, Python, SQL, plaintext — ajustar na implementação ao que Shiki/hljs suportarem com lazy imports). |
| 3   | Tema do editor               | **Vesper**, alinhado ao `CodeBlock` / `highlight-code` no servidor.                                                                                                           |
| 4   | Offline / PWA                | **Não é requisito** na fase inicial; lazy-load inicial de gramáticas via rede é aceitável.                                                                                    |
| 5   | Contrato API (futuro)        | **Só texto + linguagem** resolvida (manual ou detetada); sem hash nem código formatado na V1.                                                                                 |


---

## 8. To-dos (implementação)

- **Definir requisitos** — decisões em [Decisões de produto (V1)](#decisões-de-produto-v1).
- **Escolher stack** — confirmar **Shiki (client) + highlight.js (detect)** ou variante; documentar no PR.
- **Mapear linguagens** — objeto `id` → `{ label, shikiLang, hljsAlias? }` alinhado às gramáticas disponíveis.
- **Implementar componente** — textarea + camada highlight + scroll sync + estilos (tokens Vesper / globals).
- **Deteção** — `highlightAuto` com debounce; fallback `plaintext`.
- **UI manual** — seletor de linguagem + indicador “Auto (X)” quando aplicável.
- **Integrar na homepage** — substituir ou complementar o bloco estático atual; alinhar com `HomeActions` / submit.
- **Testes manuais** — colar e editar amostras cobrindo a **lista mínima** de linguagens; verificar override e performance.
- **Documentar** — atualizar `AGENTS.md` ou README se houver convenções novas (client-only Shiki).

---

## 9. Referências

- [raycast/ray-so](https://github.com/raycast/ray-so) — `Editor.tsx`, `HighlightedCode.tsx`, `store/code.ts`, `util/languages.ts`
- [Shiki](https://shiki.style)
- [highlight.js](https://highlightjs.org) — API `highlightAuto`
- Projeto atual: `[src/lib/highlight-code.ts](../src/lib/highlight-code.ts)`, `[src/components/ui/code-block.tsx](../src/components/ui/code-block.tsx)`

