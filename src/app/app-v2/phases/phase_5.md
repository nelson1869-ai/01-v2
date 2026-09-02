# Phase 5 — Real AI API (Gemini)

> **Layunin:** I-connect ang AutoDo sa isang totoong AI provider (Gemini).
> Palitan ang rule-based intent detection ng actual AI reasoning.

> **Gabay sa Git:** May `git commit` sa dulo ng bawat lesson.

---

## Bakit Server-Side ang AI?

```
❌ MALI (HUWAG GAWIN):
Browser → Gemini API
Problem: Makikita ang API key sa browser network tab!

✅ TAMA:
Browser → /api/cue (Route Handler) → Gemini API
Reason: Ang API key ay naka-store sa .env.local (hindi visible sa browser)
```

---

## Lesson 5.1 — Setup ng Environment Variable

### Ano ang `.env.local`?

Ito ang file na nagtatago ng mga secrets (API keys) — **hindi ito ini-commit sa GitHub**!

### Gumawa ng `.env.local` sa root ng project:

```
GEMINI_API_KEY=ang-iyong-api-key-dito
```

### I-verify na naka-ignore ito sa git:

Tingnan ang `.gitignore` — dapat nandoon na ang `.env.local`:

```
.env.local
.env*.local
```

### Paano makakuha ng Gemini API key:

1. Pumunta sa [aistudio.google.com](https://aistudio.google.com)
2. I-click ang "Get API Key"
3. Kopyahin ang key at i-paste sa `.env.local`

### 📝 Git Commit:

```bash
# HUWAG i-commit ang .env.local! OK lang na walang commit dito.
# Pero i-commit ang pagbabago sa .gitignore (kung binago mo)
git add .gitignore
git commit -m "chore: verify .env.local is gitignored for API key safety"
```

---

## Lesson 5.2 — I-install ang Gemini SDK at Gumawa ng AI Function

### I-install ang Gemini SDK:

```bash
npm install @google/generative-ai
```

### Gumawa ng bagong file: `src/app/app-v2/core/ai.ts`

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Kukunin ang API key mula sa environment variable
// HINDI ito makikita sa browser — server-side lang!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Ang model na gagamitin natin
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Input at output type para sa AI reasoning
interface AIReasoningInput {
  prompt: string;
  intent: string;
}

interface AIReasoningOutput {
  summary: string;
  suggestedAction: string;
  confidence: number; // 0.0 hanggang 1.0
}

// Layer 5: AI Reasoning — server-side LANG ito pwede
export async function reasonWithAI(input: AIReasoningInput): Promise<AIReasoningOutput> {

  const systemPrompt = `
    Ikaw ay AutoDo, isang personal AI OS assistant.
    Ang intent ng user ay: ${input.intent}
    
    I-analyze ang request at mag-respond ng JSON na may:
    - summary: maikling paliwanag ng gagawin
    - suggestedAction: specific na action (hal. "read_gmail_inbox")
    - confidence: 0.0-1.0 kung gaano ka-confident sa action
    
    Mag-respond ng JSON lang, walang markdown.
  `;

  console.log("[Server] 🤖 Nagpapadala sa Gemini...");

  const result = await model.generateContent([
    systemPrompt,
    `User request: ${input.prompt}`
  ]);

  const responseText = result.response.text();

  // I-parse ang JSON response ng Gemini
  const parsed = JSON.parse(responseText) as AIReasoningOutput;

  console.log("[Server] 🤖 Gemini response:", parsed);

  return parsed;
}
```

### 📝 Git Commit:

```bash
git add src/app/app-v2/core/ai.ts
npm install @google/generative-ai
git add package.json package-lock.json
git commit -m "feat(phase-5): add Gemini AI reasoning function with server-side API call"
```

---

## Lesson 5.3 — I-connect ang AI sa Route Handler

### I-update ang `src/app/api/cue/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createCueEvent } from "../../app-v2/core/cue";
import { parseCommand } from "../../app-v2/core/perception";
import { reasonWithAI } from "../../app-v2/core/ai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { rawPrompt } = body;

  // Layer 1 — Input / Cue
  const cue = createCueEvent(rawPrompt, "chat");

  // Layer 2 — Perception / Parsing
  const command = parseCommand(cue);

  // Layer 5 — AI Reasoning (Gemini)
  const aiOutput = await reasonWithAI({
    prompt: command.normalizedPrompt,
    intent: command.intent,
  });

  // I-return ang buong pipeline output
  return NextResponse.json({
    cueId: cue.cueId,
    intent: command.intent,
    scope: command.requestedScope,
    aiSummary: aiOutput.summary,
    suggestedAction: aiOutput.suggestedAction,
    confidence: aiOutput.confidence,
  });
}
```

### I-update ang `page.tsx` para ipakita ang AI response:

```tsx
// Sa handleSubmit function, palitan ang response display:
{response && (
  <div className="rounded-lg border border-purple-900 bg-purple-950/20 p-4 font-mono text-xs space-y-2">
    <p className="text-purple-400 font-bold mb-2">🤖 AI Pipeline Output:</p>
    <p><span className="text-gray-500">intent:</span> <span className="text-sky-300">{response.intent}</span></p>
    <p><span className="text-gray-500">scope:</span> <span className="text-sky-300">{response.scope}</span></p>
    <p><span className="text-gray-500">AI summary:</span> <span className="text-white">{response.aiSummary}</span></p>
    <p><span className="text-gray-500">suggested action:</span> <span className="text-emerald-400">{response.suggestedAction}</span></p>
    <p><span className="text-gray-500">confidence:</span> <span className="text-yellow-400">{response.confidence}</span></p>
  </div>
)}
```

### Subukan:

1. Mag-type ng "summarize my emails"
2. I-submit — hintayin (1-3 seconds habang nag-a-ask sa Gemini)
3. Makikita ang real AI response sa screen!

### 📝 Git Commit:

```bash
git add src/app/api/cue/route.ts src/app/app-v2/page.tsx
git commit -m "feat(phase-5): connect full Layer1-Layer2-AI pipeline to UI with Gemini response"
```

---

## Summary ng Phase 5

| Lesson | Natututo | Commit |
|--------|----------|--------|
| 5.1 | .env.local, API key safety, gitignore | `chore: verify .env.local is gitignored...` |
| 5.2 | Gemini SDK, server-side AI, async/await | `feat(phase-5): add Gemini AI reasoning function...` |
| 5.3 | Full pipeline: Layer1 → Layer2 → AI → UI | `feat(phase-5): connect full pipeline to UI with Gemini response` |

---

## Pagtingin sa Full Pipeline Pagkatapos ng Phase 5:

```
User types "summarize my emails"
        ↓
    [Browser]
    fetch("/api/cue", POST)
        ↓
    [Server - Route Handler]
    createCueEvent()           → Layer 1: cueId, source, rawPrompt
        ↓
    parseCommand()             → Layer 2: intent, requestedScope
        ↓
    reasonWithAI()             → Layer 5: AI summary, suggestedAction
        ↓
    NextResponse.json()
        ↓
    [Browser]
    Display sa screen
```

**Next:** Phase 6 — Context Building, Memory, at mas maraming layers! 🚀
