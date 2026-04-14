"use client";

import { useEffect, useRef, useState } from "react";
import { CodeBlockHeader } from "@/components/ui";
import { highlightForEditor } from "@/lib/client-highlighter";
import { detectEditorLanguage } from "@/lib/detect-code-language";
import {
  EDITOR_LANGUAGES,
  type EditorLanguageId,
  getEditorEntry,
} from "@/lib/editor-languages";
import { HOME_CODE_FILENAME, HOME_SAMPLE_CODE } from "@/lib/home-static";
import { CodeEditor } from "./code-editor";
import { HomeActions } from "./home-actions";

const AUTO_VALUE = "__auto__";

const DETECT_DEBOUNCE_MS = 200;
const HIGHLIGHT_DEBOUNCE_MS = 120;
const MAX_CODE_LENGTH = 2000;

export function HomeCodePanel() {
  const [code, setCode] = useState(HOME_SAMPLE_CODE);
  const [manualLanguage, setManualLanguage] = useState<EditorLanguageId | null>(
    null,
  );
  const [detectedLanguage, setDetectedLanguage] = useState<EditorLanguageId>(
    () => detectEditorLanguage(HOME_SAMPLE_CODE),
  );
  const [highlightHtml, setHighlightHtml] = useState("");

  const resolvedLanguage = manualLanguage ?? detectedLanguage;

  const highlightDebounceRef = useRef(true);

  useEffect(() => {
    if (manualLanguage !== null) {
      return;
    }
    const t = window.setTimeout(() => {
      setDetectedLanguage(detectEditorLanguage(code));
    }, DETECT_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [code, manualLanguage]);

  useEffect(() => {
    let cancelled = false;
    const immediate = highlightDebounceRef.current;
    highlightDebounceRef.current = false;
    const ms = immediate ? 0 : HIGHLIGHT_DEBOUNCE_MS;
    const t = window.setTimeout(() => {
      void highlightForEditor(code, resolvedLanguage).then((html) => {
        if (!cancelled) {
          setHighlightHtml(html);
        }
      });
    }, ms);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [code, resolvedLanguage]);

  const languageSelectValue = manualLanguage ?? AUTO_VALUE;
  const autoHint =
    manualLanguage === null ? getEditorEntry(detectedLanguage).label : null;

  const isOverLimit = code.length > MAX_CODE_LENGTH;

  return (
    <div className="mx-auto flex w-full max-w-[780px] flex-col gap-4">
      <div className="overflow-hidden rounded-md border border-border bg-[#111111]">
        <CodeBlockHeader filename={HOME_CODE_FILENAME} />
        <div className="flex min-h-10 flex-wrap items-center gap-3 border-border border-b px-4 py-2">
          <label className="sr-only" htmlFor="home-lang-select">
            Language
          </label>
          <select
            className="max-w-[180px] rounded border border-border bg-[#0F0F0F] px-2 py-1 text-muted-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            id="home-lang-select"
            onChange={(e) => {
              const v = e.target.value;
              if (v === AUTO_VALUE) {
                setManualLanguage(null);
              } else {
                setManualLanguage(v as EditorLanguageId);
              }
            }}
            value={languageSelectValue}
          >
            <option value={AUTO_VALUE}>Auto</option>
            {EDITOR_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          {autoHint ? (
            <span className="text-muted-foreground text-xs">
              <span aria-hidden> · </span>
              {autoHint}
            </span>
          ) : null}
        </div>
        <CodeEditor
          highlightHtml={highlightHtml}
          maxLength={MAX_CODE_LENGTH}
          onChange={setCode}
          value={code}
        />
      </div>
      <HomeActions
        code={code}
        isOverLimit={isOverLimit}
        resolvedLanguage={resolvedLanguage}
      />
    </div>
  );
}
