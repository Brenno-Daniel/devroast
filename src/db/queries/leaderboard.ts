import { asc, eq } from "drizzle-orm";
import { getDb } from "../index";
import { analysisResults, submissions } from "../schema";

/** Leaderboard-style list: worst scores first (join, no relational query API). */
export async function getLeaderboardWorst(limit = 20) {
  const db = getDb();
  return db
    .select({
      submissionId: submissions.id,
      codeText: submissions.codeText,
      language: submissions.language,
      mode: submissions.mode,
      score: analysisResults.score,
      submittedAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(
      analysisResults,
      eq(analysisResults.submissionId, submissions.id),
    )
    .orderBy(asc(analysisResults.score))
    .limit(limit);
}
