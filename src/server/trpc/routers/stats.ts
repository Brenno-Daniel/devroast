import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../init";
import { submissions, analysisResults } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const statsRouter = createTRPCRouter({
  getMetrics: publicProcedure.query(async ({ ctx }) => {
    const db = ctx.db;

    const [countResult, avgResult] = await Promise.all([
      db
        .select({ count: sql<number>`count(${submissions.id})` })
        .from(submissions)
        .where(eq(submissions.status, "completed")),
      db
        .select({
          avg: sql<number>`cast(avg(${analysisResults.score}) as numeric(4,1))`,
        })
        .from(analysisResults)
        .innerJoin(
          submissions,
          eq(analysisResults.submissionId, submissions.id),
        )
        .where(eq(submissions.status, "completed")),
    ]);

    const totalCount = Number(countResult[0]?.count ?? 0);
    const avgScore = Number(avgResult[0]?.avg ?? 0);

    return {
      totalRoasts: totalCount,
      avgScore: avgScore || 0,
    };
  }),
});
