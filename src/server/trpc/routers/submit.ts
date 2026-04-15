import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { getDb } from "@/db";
import {
  analysisIssues,
  analysisResults,
  submissions,
  suggestedFixes,
} from "@/db/schema";
import { analyzeCode } from "@/lib/groq-client";
import { createTRPCRouter, publicProcedure } from "../init";

export const submitRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        code: z.string().min(1).max(10000),
        language: z.string().min(1),
        mode: z.enum(["roast", "straight"]),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const submissionId = uuidv4();

      await db.insert(submissions).values({
        id: submissionId,
        codeText: input.code,
        language: input.language,
        mode: input.mode,
        status: "processing",
      });

      try {
        const analysis = await analyzeCode(input.code, input.mode);
        const analysisId = uuidv4();

        await db.insert(analysisResults).values({
          id: analysisId,
          submissionId,
          score: analysis.score.toString(),
          summaryRoast: input.mode === "roast" ? analysis.summary : null,
          summaryStraight: input.mode === "straight" ? analysis.summary : null,
        });

        if (analysis.issues && analysis.issues.length > 0) {
          for (let i = 0; i < analysis.issues.length; i++) {
            const issue = analysis.issues[i];
            await db.insert(analysisIssues).values({
              analysisId,
              severity: issue.severity,
              title: issue.title,
              description: issue.description,
              sortOrder: i,
            });
          }
        }

        if (analysis.diff) {
          await db.insert(suggestedFixes).values({
            analysisId,
            diffText: analysis.diff,
          });
        }

        await db
          .update(submissions)
          .set({ status: "completed" })
          .where(eq(submissions.id, submissionId));

        return { submissionId };
      } catch (error) {
        await db
          .update(submissions)
          .set({ status: "failed" })
          .where(eq(submissions.id, submissionId));

        throw error;
      }
    }),
});
