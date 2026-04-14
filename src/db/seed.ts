import { faker } from "@faker-js/faker";
import { config } from "dotenv";

config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { getDb } from "./index";
import {
  analysisIssues,
  analysisResults,
  submissions,
  suggestedFixes,
} from "./schema";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "go",
  "rust",
  "sql",
  "java",
  "c",
  "ruby",
] as const;

const CODE_SAMPLES: Record<string, string[]> = {
  javascript: [
    "function add(a, b) { return a + b; }",
    "var x = 10; var y = 20;",
    "for (var i = 0; i < 10; i++) { console.log(i); }",
    "const data = JSON.parse(userInput);",
    "eval(userInput);",
    "document.write('<h1>' + name + '</h1>');",
  ],
  typescript: [
    "const x: any = userInput;",
    "function foo(x: string): any { return x; }",
    "interface Foo { [key: string]: any; }",
    "let result: unknown = JSON.parse(data);",
  ],
  python: [
    "exec(user_input)",
    "eval('print(' + user_input + ')')",
    "x = 10\ny = 20\nif x == y: print('equal')",
    "import os; os.system(user_input)",
    "cursor.execute('SELECT * FROM users WHERE id = ' + user_id)",
  ],
  go: [
    "func foo() interface{} { return nil }",
    "var x interface{} = userInput",
    "exec.Command(userInput)",
  ],
  rust: [
    "let x: Box<dyn Any> = Box::new(value);",
    "unsafe { *ptr.add(0) = value; }",
  ],
  sql: [
    "SELECT * FROM users WHERE id = " + faker.string.numeric(3),
    "SELECT * FROM users WHERE name = '" + faker.lorem.word() + "'",
    "DELETE FROM users WHERE 1=1",
    "DROP TABLE users",
  ],
};

const ISSUE_TITLES = {
  critical: [
    "SQL Injection vulnerability",
    "Command Injection risk",
    "eval() with user input",
    "XSS vulnerability detected",
    "Missing authentication check",
    "Hardcoded credentials found",
    "Path traversal vulnerability",
  ],
  warning: [
    "Using deprecated method",
    "Missing error handling",
    "Memory leak detected",
    "Unused variable",
    "Performance issue: O(n²) loop",
    "Missing input validation",
    "Magic numbers detected",
  ],
  good: [
    "Good use of const",
    "Proper error handling",
    "Clean function structure",
    "Good naming convention",
    "Type safety implemented",
  ],
};

const ROAST_SUMMARIES = [
  "This code is an absolute disaster. Using eval() with user input is like leaving your front door wide open with a sign that says 'come steal my stuff'. I expected better from someone calling themselves a developer.",
  "Honestly, this is painful to look at. The naming conventions are a mess, there's zero error handling, and the performance is terrible. This looks like it was written at 3am after a coding marathon.",
  "I've seen better code in a hello world tutorial. The security holes in this are actually impressive - it's rare to see someone manage to introduce so many vulnerabilities in so few lines.",
  "This is technically valid JavaScript but that's the worst thing about it. It's the coding equivalent of wearing socks with sandals - technically acceptable but deeply wrong.",
  "The sheer audacity to commit this to production is inspiring. Bold strategy cotton, let's see if it works.",
  "If I had a dollar for every issue in this code, I'd be able to retire early. Please, for the love of all that is holy, rewrite this.",
];

const STRAIGHT_SUMMARIES = [
  "The code has several issues that should be addressed. Consider adding input validation and improving error handling. The naming could be more descriptive.",
  "There are potential security concerns with the current implementation. Review the data flow and add appropriate sanitization where needed.",
  "The code works but could benefit from better error handling and more descriptive variable names. Consider extracting some logic into smaller functions.",
  "This implementation has performance issues. Consider optimizing the database queries and adding proper caching.",
];

function getCodeSample(language: string): string {
  const samples = CODE_SAMPLES[language] ?? CODE_SAMPLES["javascript"];
  return faker.helpers.arrayElement(samples);
}

function getRandomScore(): string {
  const score = faker.number.float({ min: 1.0, max: 10.0, fractionDigits: 1 });
  return score.toFixed(1);
}

async function seed() {
  console.log("🌱 Starting seed...");

  const db = getDb();

  console.log("Deleting existing data...");
  await db.delete(suggestedFixes);
  await db.delete(analysisIssues);
  await db.delete(analysisResults);
  await db.delete(submissions);
  console.log("Existing data deleted.");

  const SUBMISSIONS_COUNT = 100;

  console.log(`Creating ${SUBMISSIONS_COUNT} submissions...`);

  for (let i = 0; i < SUBMISSIONS_COUNT; i++) {
    const language = faker.helpers.arrayElement(LANGUAGES);
    const mode = faker.helpers.arrayElement(["roast", "straight"] as const);
    const score = getRandomScore();

    const [submission] = await db
      .insert(submissions)
      .values({
        codeText: getCodeSample(language),
        language,
        mode,
        status: "completed",
      })
      .returning({ id: submissions.id });

    const [result] = await db
      .insert(analysisResults)
      .values({
        submissionId: submission.id,
        score,
        summaryRoast: faker.helpers.arrayElement(ROAST_SUMMARIES),
        summaryStraight: faker.helpers.arrayElement(STRAIGHT_SUMMARIES),
      })
      .returning({ id: analysisResults.id });

    const issueCount = faker.number.int({ min: 1, max: 5 });
    const severities = faker.helpers.arrayElements(
      ["critical", "warning", "good"] as const,
      { min: 1, max: 3 },
    );

    for (let j = 0; j < issueCount; j++) {
      const severity = severities[j % severities.length];
      const titles = ISSUE_TITLES[severity];
      await db.insert(analysisIssues).values({
        analysisId: result.id,
        severity,
        title: faker.helpers.arrayElement(titles),
        description: faker.lorem.sentence(),
        sortOrder: j,
      });
    }

    const diffText = `--- a/src/code.${language}\n+++ b/src/code.${language}\n@@ -1,3 +1,4 @@\n-${getCodeSample(language)}\n+// Fixed version\n+const fixedCode = () => {\n+  // proper implementation\n+};`;

    await db.insert(suggestedFixes).values({
      analysisId: result.id,
      diffText,
    });

    if ((i + 1) % 10 === 0) {
      console.log(`  Created ${i + 1}/${SUBMISSIONS_COUNT} submissions...`);
    }
  }

  console.log("✅ Seed completed successfully!");

  const total = await db.select({ count: submissions.id }).from(submissions);
  console.log(`Total submissions in database: ${total[0].count}`);
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
