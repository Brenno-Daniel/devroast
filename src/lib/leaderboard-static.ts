export const LEADERBOARD_STATS = {
  totalSubmissions: "2,847",
  avgScore: "4.2",
};

export const LEADERBOARD_TITLE_PROMPT = ">";
export const LEADERBOARD_TITLE_REST = "shame_leaderboard";
export const LEADERBOARD_SUBTITLE = "// the most roasted code on the internet";

export const LEADERBOARD_ENTRIES = [
  {
    rank: 1,
    score: "1.2",
    language: "javascript",
    codeText:
      "eval(prompt('enter code'))\ndocument.write(response)\n// trust the user lol",
    mode: "roast",
  },
  {
    rank: 2,
    score: "1.8",
    language: "typescript",
    codeText:
      "if (x == true) { return true; }\nelse if (x == false) { return false; }\nelse { return !false; }",
    mode: "roast",
  },
  {
    rank: 3,
    score: "2.1",
    language: "sql",
    codeText: "SELECT * FROM users WHERE 1=1\n-- TODO: add authentication",
    mode: "roast",
  },
  {
    rank: 4,
    score: "2.5",
    language: "python",
    codeText: "exec(user_input)\neval('print(' + user_input + ')')",
    mode: "straight",
  },
  {
    rank: 5,
    score: "2.8",
    language: "go",
    codeText:
      "func foo() interface{} { return nil }\nvar x interface{} = userInput",
    mode: "roast",
  },
] as const;
