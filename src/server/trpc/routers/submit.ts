import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { getDb } from "@/db";
import { analysisResults, submissions } from "@/db/schema";
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

        await db.insert(analysisResults).values({
          id: uuidv4(),
          submissionId,
          score: analysis.score.toString(),
          summaryRoast: input.mode === "roast" ? analysis.summary : null,
          summaryStraight: input.mode === "straight" ? analysis.summary : null,
        });

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
