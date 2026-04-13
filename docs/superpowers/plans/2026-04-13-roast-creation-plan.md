# Roast Creation Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to submit code and receive AI-generated roast/straight analysis via Groq API

**Architecture:** 
- New tRPC mutation `submit` to handle code submission
- Calls Groq API with different prompts for roast vs straight mode
- Saves submission to database and redirects to results page
- Results page fetches from database by UUID

**Tech Stack:** Next.js 16, tRPC, Drizzle ORM, Groq API (Llama 3.1 70B)

---

### Task 1: Add GROQ_API_KEY to environment

**Files:**
- Modify: `.env.local`
- Modify: `.env.example`

- [ ] **Step 1: Add GROQ_API_KEY to .env.local**

```
GROQ_API_KEY=your_groq_api_key_here
```

- [ ] **Step 2: Add GROQ_API_KEY placeholder to .env.example**

```
GROQ_API_KEY=your_groq_api_key_here
```

- [ ] **Step 3: Commit**

```bash
git add .env.local .env.example
git commit -m "chore: add GROQ_API_KEY env var"
```

---

### Task 2: Create Groq API client

**Files:**
- Create: `src/lib/groq-client.ts`

- [ ] **Step 1: Write the groq-client.ts**

```typescript
import { cache } from "react";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export type GroqResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type RoastAnalysis = {
  score: number;
  verdict: string;
  summary: string;
  issues: Array<{
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
  }>;
  diff: string;
};

const ROAST_SYSTEM_PROMPT = `You are an expert code reviewer with a sarcastic, humorous personality. Your job is to "roast" bad code in a funny but helpful way. Analyze the code and provide a JSON response with:

- score (0-10): How bad is the code? 0 is terrible, 10 is perfect
- verdict: Short funny verdict like "needs_serious_help", "not_great", or "acceptable"
- summary: 1-2 sentence roast summary
- issues: Array of issues found with severity (critical/warning/good), title, and description
- diff: A code diff showing suggested fixes (optional)

Respond ONLY with valid JSON, no extra text.`;

const STRAIGHT_SYSTEM_PROMPT = `You are an expert code reviewer. Your job is to provide constructive, professional feedback. Analyze the code and provide a JSON response with:

- score (0-10): How good is the code? 0 is terrible, 10 is perfect
- verdict: Short verdict like "needs_work", "needs_improvement", or "good"
- summary: 1-2 sentence constructive summary
- issues: Array of issues found with severity (critical/warning/good), title, and description
- diff: A code diff showing suggested fixes (optional)

Respond ONLY with valid JSON, no extra text.`;

export const analyzeCode = cache(
  async (code: string, mode: "roast" | "straight"): Promise<RoastAnalysis> => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY not configured");
    }

    const systemPrompt =
      mode === "roast" ? ROAST_SYSTEM_PROMPT : STRAIGHT_SYSTEM_PROMPT;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Analyze this code:\n\n\`\`\`\n${code}\n\`\`\``,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data: GroqResponse = await response.json();
    const content = data.choices[0]?.message.content;
    if (!content) {
      throw new Error("No response from Groq API");
    }

    try {
      return JSON.parse(content) as RoastAnalysis;
    } catch {
      throw new Error("Invalid JSON response from Groq API");
    }
  }
);
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/groq-client.ts
git commit -m "feat: add Groq API client for code analysis"
```

---

### Task 3: Create submit mutation in tRPC

**Files:**
- Modify: `src/server/trpc/routers/submit.ts` (create new file)
- Modify: `src/server/trpc/routers/_app.ts`

- [ ] **Step 1: Create submit router**

```typescript
import { publicProcedure, createTRPCRouter } from "../init";
import { getDb } from "@/db";
import { submissions, analysisResults } from "@/db/schema";
import { analyzeCode } from "@/lib/groq-client";
import { feedbackModeEnum } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

export const submitRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        code: z.string().min(1).max(10000),
        language: z.string().min(1),
        mode: z.enum(["roast", "straight"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const submissionId = uuidv4();

      // Insert submission with pending status
      await db.insert(submissions).values({
        id: submissionId,
        codeText: input.code,
        language: input.language,
        mode: input.mode as "roast" | "straight",
        status: "processing",
      });

      try {
        // Call Groq API
        const analysis = await analyzeCode(input.code, input.mode);

        // Save analysis results
        await db.insert(analysisResults).values({
          id: uuidv4(),
          submissionId,
          score: analysis.score.toString(),
          summaryRoast:
            input.mode === "roast" ? analysis.summary : null,
          summaryStraight:
            input.mode === "straight" ? analysis.summary : null,
        });

        // Update submission status to completed
        await db
          .update(submissions)
          .set({ status: "completed" })
          .where(eq(submissions.id, submissionId));

        return { submissionId };
      } catch (error) {
        // Update submission status to failed
        await db
          .update(submissions)
          .set({ status: "failed" })
          .where(eq(submissions.id, submissionId));

        throw error;
      }
    }),
});
```

Note: Need to add `z` import and `uuid` package

- [ ] **Step 2: Register router in _app.ts**

```typescript
import { submitRouter } from "./submit";
// Add to AppRouter
export const AppRouter = createTRPCRouter({
  stats: statsRouter,
  leaderboard: leaderboardRouter,
  submit: submitRouter, // NEW
});
```

- [ ] **Step 3: Commit**

```bash
git add src/server/trpc/routers/submit.ts src/server/trpc/routers/_app.ts
git commit -m "feat: add submit mutation for code analysis"
```

---

### Task 4: Update HomeActions with loading state

**Files:**
- Modify: `src/components/home/home-actions.tsx`

- [ ] **Step 1: Add loading state and submit handler**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/home-actions.tsx
git commit -m "feat: add loading state to HomeActions"
```

---

### Task 5: Update results page to fetch from database

**Files:**
- Modify: `src/app/results/[id]/page.tsx`

- [ ] **Step 1: Add getResultById query and update page**

Add to leaderboard router or create new results router:

```typescript
// In src/server/trpc/routers/results.ts
getResultById: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const db = getDb();
    const result = await db
      .select({
        submissionId: submissions.id,
        codeText: submissions.codeText,
        language: submissions.language,
        mode: submissions.mode,
        score: analysisResults.score,
        summaryRoast: analysisResults.summaryRoast,
        summaryStraight: analysisResults.summaryStraight,
      })
      .from(submissions)
      .innerJoin(
        analysisResults,
        eq(analysisResults.submissionId, submissions.id)
      )
      .where(eq(submissions.id, input.id))
      .get();

    return result;
  }),
```

Update page to fetch from database instead of static data

- [ ] **Step 2: Commit**

```bash
git add src/app/results/\[id\]/page.tsx
git commit -m "feat: update results page to fetch from database"
```

---

### Task 6: Test the flow end-to-end

**Files:**
- Test manually in browser

- [ ] **Step 1: Test submission flow**

1. Go to http://localhost:3000
2. Paste some code
3. Select language (or auto)
4. Toggle roast mode on/off
5. Click "Roast My Code"
6. Verify loading state shows
7. After ~3s, verify redirected to /results/[uuid]
8. Verify analysis displays correctly

- [ ] **Step 2: Commit**

```bash
git commit -m "test: verify end-to-end roast creation flow"
```

---

**Plan complete saved to `docs/superpowers/plans/2026-04-13-roast-creation-plan.md`. Two execution options:**

1. **Subagent-Driven (recommended)** - Dispatch fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**