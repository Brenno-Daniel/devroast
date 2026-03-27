CREATE TYPE "public"."feedback_mode" AS ENUM('roast', 'straight');--> statement-breakpoint
CREATE TYPE "public"."issue_severity" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "analysis_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_id" uuid NOT NULL,
	"severity" "issue_severity" NOT NULL,
	"title" varchar(512) NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analysis_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"score" numeric(4, 1) NOT NULL,
	"summary_roast" text,
	"summary_straight" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "analysis_results_submissionId_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code_text" text NOT NULL,
	"language" varchar(64) NOT NULL,
	"mode" "feedback_mode" NOT NULL,
	"status" "submission_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suggested_fixes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_id" uuid NOT NULL,
	"diff_text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "suggested_fixes_analysisId_unique" UNIQUE("analysis_id")
);
--> statement-breakpoint
ALTER TABLE "analysis_issues" ADD CONSTRAINT "analysis_issues_analysis_id_analysis_results_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analysis_results"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suggested_fixes" ADD CONSTRAINT "suggested_fixes_analysis_id_analysis_results_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analysis_results"("id") ON DELETE cascade ON UPDATE no action;