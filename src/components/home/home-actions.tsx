"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SwitchField } from "@/components/ui/switch";
import { HOME_ROAST_HINT, HOME_SUBMIT_LABEL } from "@/lib/home-static";

export function HomeActions() {
  const [roastMode, setRoastMode] = useState(true);

  return (
    <div className="flex w-full max-w-[780px] flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
        <SwitchField
          checked={roastMode}
          label="roast mode"
          onCheckedChange={setRoastMode}
        />
        <span className="font-mono text-[12px] text-muted-foreground">
          {HOME_ROAST_HINT}
        </span>
      </div>
      <Button size="md" type="button" variant="default">
        {HOME_SUBMIT_LABEL}
      </Button>
    </div>
  );
}
