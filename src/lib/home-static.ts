/** Static homepage copy and sample data (no API). */

export const HOME_HERO_TITLE_PROMPT = "$";
export const HOME_HERO_TITLE_REST = "paste your code. get roasted.";

export const HOME_HERO_SUBTITLE =
  "// drop your code below and we'll rate it — brutally honest or full roast mode";

export const HOME_CODE_FILENAME = "snippet.js";

export const HOME_SAMPLE_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`;

export const HOME_ROAST_HINT = "// maximum sarcasm enabled";

export const HOME_SUBMIT_LABEL = "$ roast_my_code";

export const HOME_STATS_LINE = "2,847 codes roasted · avg score: 4.2/10";

export const HOME_LEADERBOARD_TITLE_PROMPT = "//";
export const HOME_LEADERBOARD_TITLE_REST = "shame_leaderboard";

export const HOME_LEADERBOARD_SUBTITLE =
  "// the worst code on the internet, ranked by shame";

export const HOME_LEADERBOARD_VIEW_ALL = "$ view_all >>";

/** Text before the leaderboard footer link (same line). */
export const HOME_LEADERBOARD_FOOTER_PREFIX = "showing top 3 of 2,847 · ";

/** Label for the inline link to the full leaderboard page. */
export const HOME_LEADERBOARD_FOOTER_LINK_LABEL = "view full leaderboard >>";

export const LEADERBOARD_PREVIEW_ROWS = [
  {
    rank: "1",
    score: "1.2",
    language: "javascript",
    codeLines: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
  },
  {
    rank: "2",
    score: "1.8",
    language: "typescript",
    codeLines: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
  },
  {
    rank: "3",
    score: "2.1",
    language: "sql",
    codeLines: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
  },
] as const;
