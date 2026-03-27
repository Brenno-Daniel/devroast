import type { BundledLanguage } from "shiki/bundle/web";
import { getSingletonHighlighter } from "shiki/bundle/web";
import { type EditorLanguageId, getEditorEntry } from "./editor-languages";

const SHIKI_LANGS: BundledLanguage[] = [
  "javascript",
  "typescript",
  "tsx",
  "json",
  "html",
  "css",
  "python",
  "sql",
];

let highlighterPromise: ReturnType<typeof getSingletonHighlighter> | null =
  null;

function loadHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getSingletonHighlighter({
      themes: ["vesper"],
      langs: SHIKI_LANGS,
    });
  }
  return highlighterPromise;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Client-only Shiki (Vesper) for the paste editor. Plaintext uses escaped HTML, no grammar.
 */
export async function highlightForEditor(
  code: string,
  lang: EditorLanguageId,
): Promise<string> {
  const entry = getEditorEntry(lang);
  if (entry.shiki === null) {
    return `<pre class="shiki vesper" style="background-color:#111111;color:#cbccc6"><code>${escapeHtml(code)}</code></pre>`;
  }
  const highlighter = await loadHighlighter();
  return highlighter.codeToHtml(code, { lang: entry.shiki, theme: "vesper" });
}
