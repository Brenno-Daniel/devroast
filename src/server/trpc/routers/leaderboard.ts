import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { analysisResults, submissions } from "@/db/schema";
import { createTRPCRouter, publicProcedure } from "../init";

export const leaderboardRouter = createTRPCRouter({
  getHomeLeaderboard: publicProcedure.query(async () => {
    const db = getDb();

    const [worstItems, countResult] = await Promise.all([
      db
        .select({
          submissionId: submissions.id,
          codeText: submissions.codeText,
          language: submissions.language,
          score: analysisResults.score,
        })
        .from(submissions)
        .innerJoin(
          analysisResults,
          eq(analysisResults.submissionId, submissions.id),
        )
        .where(eq(submissions.status, "completed"))
        .orderBy(asc(analysisResults.score))
        .limit(3),
      db
        .select({ count: sql<number>`count(${submissions.id})` })
        .from(submissions)
        .where(eq(submissions.status, "completed")),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return {
      items: worstItems,
      total,
    };
  }),

  getLeaderboard: publicProcedure.query(async () => {
    const db = getDb();

    const [worstItems, countResult, avgResult] = await Promise.all([
      db
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
          eq(analysisResults.submissionId, submissions.id),
        )
        .where(eq(submissions.status, "completed"))
        .orderBy(asc(analysisResults.score))
        .limit(20),
      db
        .select({ count: sql<number>`count(${submissions.id})` })
        .from(submissions)
        .where(eq(submissions.status, "completed")),
      db
        .select({
          avgScore: sql<number>`avg(${analysisResults.score})`,
        })
        .from(analysisResults)
        .innerJoin(
          submissions,
          eq(analysisResults.submissionId, submissions.id),
        )
        .where(eq(submissions.status, "completed")),
    ]);

    const total = Number(countResult[0]?.count ?? 0);
    const avgScore = Number(avgResult[0]?.avgScore ?? 0).toFixed(1);

    return {
      items: worstItems,
      total,
      avgScore,
    };
  }),
});
