# Roast Creation Feature Design

**Date:** 2026-04-13
**Status:** Approved

## 1. User Flow

```
Home → (clicks "Roast My Code") → Loading state (2-3s) → /results/[uuid]
```

- User pastes code on home page
- Selects language (or auto-detect)
- Chooses roast mode or straight mode (toggle already exists)
- Clicks button → loading state → redirected to results page

## 2. Loading State (Home)

- Button disabled
- Text changes to "roasting code..."
- Pulsing color effect (lighter shade ↔ darker shade)
- Estimated time: 2-3 seconds (Groq API is fast)

## 3. Results Page (`/results/[uuid]`)

Reuses existing page with:

- **Score** (0-10) - circular, color-coded
- **Verdict** - summary text (roast or straight)
- **Submitted code** - with syntax highlight
- **Detailed analysis** - cards: critical / warning / good
- **Suggested fixes** - diff view

## 4. Backend

- New tRPC route: `submit` mutation
- Saves submission to database (`status: "processing"`)
- Calls Groq API (Llama 3.1 70B)
- Processes response and saves to database
- Returns UUID for redirect

## 5. Groq Integration

- Different prompt for roast vs straight mode
- JSON-structured response (score, issues, summary, diff)
- Timeout: 30 seconds
- Fallback: error with retry option

## 6. API Choice

- **Provider:** Groq (Llama 3.1 70B)
- **Reasoning:** Fast (~2-3s), excellent for code analysis, simple API
- **Fallback:** None initially (future: Google Gemini 1.5 Flash)

## 7. Not Included (v1)

- Share roast functionality
- User authentication
- Save/edit submissions