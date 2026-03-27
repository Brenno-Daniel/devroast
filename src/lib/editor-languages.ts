/**
 * Minimal language set for the paste editor (V1), aligned with Shiki bundle-web ids.
 */
export const EDITOR_LANGUAGES = [
  { id: "javascript", label: "JavaScript", shiki: "javascript" },
  { id: "typescript", label: "TypeScript", shiki: "typescript" },
  { id: "tsx", label: "TSX", shiki: "tsx" },
  { id: "json", label: "JSON", shiki: "json" },
  { id: "html", label: "HTML", shiki: "html" },
  { id: "css", label: "CSS", shiki: "css" },
  { id: "python", label: "Python", shiki: "python" },
  { id: "sql", label: "SQL", shiki: "sql" },
  { id: "plaintext", label: "Plain text", shiki: null },
] as const;

export type EditorLanguageId = (typeof EDITOR_LANGUAGES)[number]["id"];

export type ShikiLangForEditor = Exclude<
  (typeof EDITOR_LANGUAGES)[number]["shiki"],
  null
>;

const HLJS_TO_EDITOR: Record<string, EditorLanguageId> = {
  javascript: "javascript",
  jsx: "tsx",
  typescript: "typescript",
  tsx: "tsx",
  json: "json",
  css: "css",
  xml: "html",
  html: "html",
  python: "python",
  py: "python",
  sql: "sql",
  mysql: "sql",
  pgsql: "sql",
  postgres: "sql",
};

export function mapHljsToEditorId(
  hljsLanguage: string | undefined,
): EditorLanguageId {
  if (!hljsLanguage) {
    return "plaintext";
  }
  const mapped = HLJS_TO_EDITOR[hljsLanguage];
  return mapped ?? "plaintext";
}

export function getEditorEntry(id: EditorLanguageId) {
  return EDITOR_LANGUAGES.find((l) => l.id === id) ?? EDITOR_LANGUAGES[8];
}
