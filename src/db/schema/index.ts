import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const feedbackModeEnum = pgEnum("feedback_mode", ["roast", "straight"]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const issueSeverityEnum = pgEnum("issue_severity", [
  "critical",
  "warning",
  "good",
]);

export const submissions = pgTable("submissions", {
  id: uuid().defaultRandom().primaryKey(),
  codeText: text().notNull(),
  language: varchar({ length: 64 }).notNull(),
  mode: feedbackModeEnum().notNull(),
  status: submissionStatusEnum().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const analysisResults = pgTable("analysis_results", {
  id: uuid().defaultRandom().primaryKey(),
  submissionId: uuid()
    .notNull()
    .unique()
    .references(() => submissions.id, { onDelete: "cascade" }),
  score: numeric({ precision: 4, scale: 1 }).notNull(),
  summaryRoast: text(),
  summaryStraight: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const analysisIssues = pgTable("analysis_issues", {
  id: uuid().defaultRandom().primaryKey(),
  analysisId: uuid()
    .notNull()
    .references(() => analysisResults.id, { onDelete: "cascade" }),
  severity: issueSeverityEnum().notNull(),
  title: varchar({ length: 512 }).notNull(),
  description: text().notNull(),
  sortOrder: integer().notNull().default(0),
});

export const suggestedFixes = pgTable("suggested_fixes", {
  id: uuid().defaultRandom().primaryKey(),
  analysisId: uuid()
    .notNull()
    .unique()
    .references(() => analysisResults.id, { onDelete: "cascade" }),
  diffText: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

export type AnalysisResult = typeof analysisResults.$inferSelect;
export type NewAnalysisResult = typeof analysisResults.$inferInsert;

export type AnalysisIssue = typeof analysisIssues.$inferSelect;
export type NewAnalysisIssue = typeof analysisIssues.$inferInsert;

export type SuggestedFix = typeof suggestedFixes.$inferSelect;
export type NewSuggestedFix = typeof suggestedFixes.$inferInsert;
