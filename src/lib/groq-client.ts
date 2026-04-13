import { cache } from "react";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export type RoastAnalysis = {
  score: number;
  verdict: string;
  summary: string;
  issues: Array<{
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
  }>;
  diff: string;
};

const ROAST_SYSTEM_PROMPT = `You are an expert code reviewer with a sarcastic, humorous personality. Your job is to "roast" bad code in a funny but helpful way. Analyze the code and provide a JSON response with:

- score (0-10): How bad is the code? 0 is terrible, 10 is perfect
- verdict: Short funny verdict like "needs_serious_help", "not_great", or "acceptable"
- summary: 1-2 sentence roast summary
- issues: Array of issues found with severity (critical/warning/good), title, and description
- diff: A code diff showing suggested fixes (optional)

Respond ONLY with valid JSON, no extra text.`;

const STRAIGHT_SYSTEM_PROMPT = `You are an expert code reviewer. Your job is to provide constructive, professional feedback. Analyze the code and provide a JSON response with:

- score (0-10): How good is the code? 0 is terrible, 10 is perfect
- verdict: Short verdict like "needs_work", "needs_improvement", or "good"
- summary: 1-2 sentence constructive summary
- issues: Array of issues found with severity (critical/warning/good), title, and description
- diff: A code diff showing suggested fixes (optional)

Respond ONLY with valid JSON, no extra text.`;

export const analyzeCode = cache(
  async (code: string, mode: "roast" | "straight"): Promise<RoastAnalysis> => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY not configured");
    }

    const systemPrompt =
      mode === "roast" ? ROAST_SYSTEM_PROMPT : STRAIGHT_SYSTEM_PROMPT;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Analyze this code:\n\n\`\`\`\n${code}\n\`\`\``,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const content = data.choices[0]?.message.content;
    if (!content) {
      throw new Error("No response from Groq API");
    }

    try {
      return JSON.parse(content) as RoastAnalysis;
    } catch {
      throw new Error("Invalid JSON response from Groq API");
    }
  },
);
