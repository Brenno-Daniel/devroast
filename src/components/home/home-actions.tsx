"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  SwitchFieldControl,
  SwitchFieldLabel,
  SwitchFieldRoot,
} from "@/components/ui/switch";
import type { EditorLanguageId } from "@/lib/editor-languages";
import { HOME_ROAST_HINT, HOME_SUBMIT_LABEL } from "@/lib/home-static";
import { useTRPC } from "@/trpc/client";

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
  const trpc = useTRPC();

  const submitMutation = trpc.submit.submit.useMutation({
    onSuccess: (data) => {
      router.push(`/results/${data.submissionId}`);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = () => {
    if (isOverLimit || isLoading) return;
    setIsLoading(true);
    submitMutation.mutate({
      code,
      language: resolvedLanguage,
      mode: roastMode ? "roast" : "straight",
    });
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
