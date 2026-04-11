import { publicProcedure, createTRPCRouter } from "../init";
import { getDb } from "@/db";
import { submissions, analysisResults } from "@/db/schema";
import { sql, eq, asc } from "drizzle-orm";

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
});
