import hljs from "highlight.js/lib/common";
import type { EditorLanguageId } from "./editor-languages";
import { mapHljsToEditorId } from "./editor-languages";

/**
 * Only languages registered in highlight.js `common` and supported by the editor.
 * @see https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightAuto
 */
const HLJS_LANGUAGE_SUBSET = [
  "javascript",
  "typescript",
  "json",
  "css",
  "xml",
  "python",
  "sql",
] as const;

export function detectEditorLanguage(code: string): EditorLanguageId {
  const trimmed = code.trim();
  if (!trimmed) {
    return "plaintext";
  }
  try {
    const result = hljs.highlightAuto(trimmed, [...HLJS_LANGUAGE_SUBSET]);
    return mapHljsToEditorId(result.language);
  } catch {
    return "plaintext";
  }
}
