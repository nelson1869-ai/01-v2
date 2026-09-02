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

## Phase 5 Completion Test

Gawin lamang ito pagkatapos ma-complete at ma-commit ang Lessons 5.1–5.3 at mayroon nang valid Gemini API key sa local `.env.local`.

### 1. Automated at secret-safety validation

Sa project root, i-run:

```bash
npm run lint && npx tsc --noEmit
npm ls @google/generative-ai
git check-ignore .env.local
git status --short -- .env.local
```

Expected:

- Walang ESLint o TypeScript error.
- Makikita ang installed `@google/generative-ai` package.
- Ipi-print ng `git check-ignore` ang `.env.local`, ibig sabihin ignored ito.
- Walang output ang `git status --short -- .env.local`, ibig sabihin hindi ito staged o tracked.

Huwag gamitin ang `cat .env.local` at huwag i-paste ang API key sa mentor.

### 2. Run the real AI pipeline

```bash
npm run dev
```

Buksan ang `/app-v2`, Chrome **F12 → Console**, at ang **Network** panel. Panatilihing bukas ang server terminal.

Gamitin ang safe synthetic prompt na ito—hindi ito nagbabasa o nagpapadala ng totoong email:

```text
summarize my sample emails
```

Expected flow:

```text
Browser UI
   │  POST /api/cue
   ▼
Layer 1 → Layer 2
   │
   ▼
Layer 5: reasonWithAI()
   │  server-side Gemini call
   ▼
Structured AI JSON
   │
   ▼
Route response → UI
```

I-submit nang isang beses at hintayin ang request. Sa F12 Network, dapat `200` ang `/api/cue` at JSON ang response.

### 3. Expected example vs actual OBSERVED output

Ang AI text, confidence, IDs, at wording ay dynamic. Ito ay **expected shape example lamang**, hindi actual output:

```json
{
  "cueId": "cue_<dynamic>",
  "intent": "email.summarize",
  "scope": "read_only",
  "aiSummary": "<dynamic AI-generated summary>",
  "suggestedAction": "<dynamic AI-generated action>",
  "confidence": 0.82
}
```

Ang `0.82` ay sample number lamang; huwag asahang eksaktong iyon ang actual confidence.

Ang **actual OBSERVED output** ay ang JSON na talagang ibinalik ng server. I-check na:

- `intent` ay `email.summarize`.
- `scope` ay `read_only`.
- Non-empty string ang `aiSummary` at `suggestedAction`.
- Number mula `0` hanggang `1` ang `confidence`.
- Lumalabas ang returned values sa UI.

Expected server-terminal evidence:

```text
[AutoDo 🧠] [Layer 1: Input / Cue] ...
[AutoDo 🧠] [Layer 2: Perception] ...
[Server] 🤖 Nagpapadala sa Gemini...
[Server] 🤖 Gemini response: ...
POST /api/cue 200 ...
```

Ang AI response ay OBSERVED provider output. Ang `intent` at `scope` ay DERIVED ng Layer 2 rules. Hindi sila dapat tawaging simulated.

### 4. Ipakita ang logs/output sa mentor

Kapag magre-review gamit ang `d`, puwedeng i-paste o i-screenshot ang:

1. Lint, TypeScript, package, at gitignore check results.
2. `/api/cue` status at redacted JSON response mula sa Network panel.
3. Browser send/receive logs at server Layer 1, Layer 2, at Gemini log labels.
4. Exact provider error message at HTTP status kung nabigo ang request.

I-redact ang API key, request headers, cookies, billing/project identifiers, at personal content. Huwag i-paste ang buong `.env.local`. Safe synthetic prompt lang ang gamitin.

### 5. Failure indicators

- May lint o TypeScript error, o missing ang SDK package.
- Hindi ignored ang `.env.local`, o lumalabas ito bilang staged/tracked.
- `401`/`403` authentication error, quota/rate-limit error, unavailable-model error, o non-`200` API response.
- Hindi valid JSON ang Gemini response kaya nag-fail ang `JSON.parse`.
- Missing o maling type ang alinman sa `aiSummary`, `suggestedAction`, o `confidence`.
- Walang Gemini send/response logs sa server terminal.
- May TypeScript error sa Phase 5 UI dahil hindi na-update ang `ServerResponse` contract kasabay ng bagong response fields; ipakita ang error sa mentor.

### 6. Verify the exact lesson commits

```bash
git log --format='%s' --all
```

Hanapin ang eksaktong tatlong lines na ito:

```text
chore: verify .env.local is gitignored for API key safety
feat(phase-5): add Gemini AI reasoning function with server-side API call
feat(phase-5): connect full Layer1-Layer2-AI pipeline to UI with Gemini response
```

Kapag may kulang o iba ang spelling, huwag munang pumunta sa Phase 6.

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
