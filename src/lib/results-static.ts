export const RESULT_DATA = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  score: "3.5",
  verdict: "needs_serious_help",
  roastTitle:
    '"this code looks like it was written during a power outage... in 2005."',
  language: "javascript",
  lines: 7,
  code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  return total;
}`,
  issues: [
    {
      severity: "critical",
      title: "eval() or similar dangerous method",
      description:
        "Using eval() or similar dynamic execution can lead to code injection vulnerabilities. Avoid at all costs.",
    },
    {
      severity: "critical",
      title: "No input validation",
      description:
        "User input is processed without any validation, which can lead to XSS or injection attacks.",
    },
    {
      severity: "warning",
      title: "Magic numbers detected",
      description:
        "Hardcoded values like 100 and 0.9 should be extracted to named constants for better readability.",
    },
    {
      severity: "warning",
      title: "Use modern JS features",
      description:
        "Prefer const/let over var, arrow functions, and modern array methods for cleaner code.",
    },
    {
      severity: "warning",
      title: "Missing error handling",
      description:
        "No try-catch blocks or error handling for edge cases like null/undefined inputs.",
    },
    {
      severity: "good",
      title: "Logic is correct",
      description:
        "The calculation logic itself is sound, just needs modern syntax improvements.",
    },
  ],
  diff: `--- a/your_code.ts
+++ b/improved_code.ts
@@ -1,7 +1,10 @@
-function calculateTotal(items) {
-  var total = 0;
-  for (var i = 0; i < items.length; i++) {
-    total = total + items[i].price;
+function calculateTotal(items) {
+  const DISCOUNT_THRESHOLD = 100;
+  const DISCOUNT_RATE = 0.9;
+
+  if (!items || !Array.isArray(items)) {
+    return 0;
   }
-  if (total > 100) {
-    console.log("discount applied");
-    total = total * 0.9;
+
+  let total = 0;
+  for (const item of items) {
+    total += item?.price ?? 0;
   }
-  return total;
+  return total > DISCOUNT_THRESHOLD
+    ? total * DISCOUNT_RATE
+    : total;
 }`,
};

export const RESULTS_TITLE_PROMPT = "//";
export const RESULTS_TITLE_REST = "results";

export const ANALYSIS_TITLE_PROMPT = "//";
export const ANALYSIS_TITLE_REST = "detailed_analysis";

export const DIFF_TITLE_PROMPT = "//";
export const DIFF_TITLE_REST = "suggested_fix";
