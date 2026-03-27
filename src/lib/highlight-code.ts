import { cache } from "react";
import { type BundledLanguage, codeToHtml } from "shiki";

/**
 * Server-only syntax highlight (Shiki, Vesper). Cached per request for duplicate calls.
 */
export const highlightCode = cache(async (code: string, lang: string) => {
  return codeToHtml(code, {
    lang: lang as BundledLanguage,
    theme: "vesper",
  });
});
