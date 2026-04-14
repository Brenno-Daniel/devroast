"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SwitchFieldControl,
  SwitchFieldLabel,
  SwitchFieldRoot,
} from "@/components/ui/switch";
import type { EditorLanguageId } from "@/lib/editor-languages";
import { HOME_ROAST_HINT, HOME_SUBMIT_LABEL } from "@/lib/home-static";

export type HomeActionsProps = {
  code: string;
  isOverLimit: boolean;
  resolvedLanguage: EditorLanguageId;
};

export function HomeActions({
  code,
  isOverLimit,
  resolvedLanguage,
}: HomeActionsProps) {
  const [roastMode, setRoastMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (isOverLimit || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/trpc/submit.submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            code,
            language: resolvedLanguage,
            mode: roastMode ? "roast" : "straight",
          },
        }),
      });

      const data = await response.json();

      if (data.result?.data?.json?.submissionId) {
        router.push(`/results/${data.result.data.json.submissionId}`);
      } else if (data.error) {
        throw new Error(data.error.message || "Failed to submit");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting code. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-[780px] flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
        <SwitchFieldRoot>
          <SwitchFieldControl
            checked={roastMode}
            onCheckedChange={setRoastMode}
            disabled={isLoading}
          />
          <SwitchFieldLabel>roast mode</SwitchFieldLabel>
        </SwitchFieldRoot>
        <span className="font-mono text-[12px] text-muted-foreground">
          {HOME_ROAST_HINT}
        </span>
      </div>
      <Button
        disabled={isOverLimit || isLoading}
        size="md"
        type="button"
        variant="default"
        onClick={handleSubmit}
        className={isLoading ? "animate-pulse" : ""}
      >
        {isLoading ? "roasting code..." : HOME_SUBMIT_LABEL}
      </Button>
    </div>
  );
}
