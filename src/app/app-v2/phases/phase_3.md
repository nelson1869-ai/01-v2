# Phase 3 — Pipeline Functions at UI Connection

> **Layunin:** Gumawa ng unang dalawang brain layers (Layer 1: Cue, Layer 2: Perception)
> bilang pure TypeScript functions, tapos i-connect sa UI para makita sa browser at F12 Console.

> **Gabay sa Git:** May `git commit` sa dulo ng bawat lesson.

---

## Lesson 3.1 — Pure Function

### Ano ang pure function?

Isang function na:
1. **Same input → same output** palagi
2. **Walang side effects** — hindi nagbabago ng kahit anong nasa labas nito

```ts
// PURE — predictable, testable, safe
function cleanText(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

cleanText("  hello   world  "); // PALAGI "hello world"
cleanText("  hello   world  "); // PALAGI "hello world"

// IMPURE — nagbabago ng external state
let count = 0;
function countCalls() {
  count++; // Side effect! Nagbabago ng external variable
  return count;
}
```

### Bakit important sa AutoDo?

Sa AutoDo, ang bawat brain layer ay isang function:
- **Tumatanggap ng input** (mula sa nakaraang layer)
- **Nag-rereturn ng output** (para sa susunod na layer)
- **Hindi nagbabago ng data ng ibang layer**

Ito ay tinatawag na **single responsibility** — isang function, isang trabaho.

### 📝 Git Commit:

(Walang code pa para sa lesson na ito — conceptual lang. Proceed sa 3.2!)

---

## Lesson 3.2 — Layer 1 Contract (types.ts update)

### Ano ang gagawin?

I-expand ang `types.ts` para kasama ang Layer 2 contract (`CanonicalCommand`).

Layer 1 nagpo-produce ng `UnparsedCueEvent` → Layer 2 nagpo-produce ng `CanonicalCommand`.

### I-update ang `src/app/app-v2/types.ts`:

```ts
// ==========================================
// LAYER 1: INPUT / CUE
// ==========================================

// Saan nanggaling ang request
export type CueSource = "chat" | "schedule" | "manual";

// Raw na input — hindi pa na-process
export interface UnparsedCueEvent {
  readonly cueId: string;
  readonly source: CueSource;
  readonly rawPrompt: string;
  readonly timestamp: string;
}

// ==========================================
// LAYER 2: PERCEPTION / PARSING
// ==========================================

// Naintindihang layunin ng user
type InferredIntent =
  | "email.summarize"   // Gusto i-summarize ang emails
  | "email.reply"       // Gusto mag-reply sa email
  | "calendar.schedule" // Gusto mag-book ng meeting
  | "chat.general";     // Normal na tanong

// Malinis na command pagkatapos ma-parse
interface CanonicalCommand {
  readonly commandId: string;
  readonly traceId: string;        // Para ma-track sa logs
  readonly cueId: string;          // Galing sa Layer 1
  readonly intent: InferredIntent; // Naintindihang layunin
  readonly requestedScope: "read_only" | "write_email" | "write_calendar" | "general_chat";
  readonly normalizedPrompt: string;
  readonly timestamp: string;
}
```

### 📝 Git Commit:

```bash
git add src/app/app-v2/types.ts
git commit -m "feat(phase-3): add Layer 2 CanonicalCommand and InferredIntent contracts"
```

---

## Lesson 3.3 — Gumawa ng `core/` folder at Layer 1 Function

### Gumawa ng folder at file:

```
src/app/app-v2/core/cue.ts
```

### I-type ang Layer 1 function:

```ts
// Nag-iimport ng types na ginawa natin sa types.ts
import type { CueSource, UnparsedCueEvent } from "../types";

// Layer 1: Input / Cue — Pure function
// Input: rawPrompt (string) + source (CueSource)
// Output: UnparsedCueEvent (structured, immutable)
export function createCueEvent(
  rawPrompt: string,
  source: CueSource = "chat",
): UnparsedCueEvent {
  const now = new Date();
  const randomSuffix = Math.random().toString(36).substring(2, 7);

  const cueId = `cue_${now.getTime()}_${randomSuffix}`;
  const traceId = `trc_${now.getTime()}_${randomSuffix}`;

  const event: UnparsedCueEvent = {
    cueId,
    source,
    rawPrompt: rawPrompt.trim(),
    timestamp: now.toISOString(),
  };

  // Structured Logging para sa DevTools (F12) at Terminal
  // %c = CSS styling, #818cf8 = indigo/purple na kulay
  console.log(
    `%c[AutoDo 🧠] [Layer 1: Input / Cue] Natanggap: "${event.rawPrompt}" (cueId: ${cueId})`,
    "color: #818cf8; font-weight: bold;"
  );

  return event;
}
```

### 📝 Git Commit:

```bash
git add src/app/app-v2/core/cue.ts
git commit -m "feat(phase-3): create Layer 1 createCueEvent pure function"
```

---

## Lesson 3.4 — I-connect ang Layer 1 sa UI

### Ito ang pinakamasayang lesson! 🎉

I-update ang `page.tsx` para ma-trigger ang Layer 1 kapag nag-submit ang user.
Makikita mo ang **purple na log** sa Chrome F12 Console!

### I-update ang `src/app/app-v2/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { createCueEvent } from "./core/cue"; // I-import ang Layer 1 function

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [lastCueId, setLastCueId] = useState<string | null>(null);

  function handleSubmit() {
    if (!prompt.trim()) return;

    // 🟣 Layer 1 tumatakbo na!
    const cue = createCueEvent(prompt, "chat");
    setLastCueId(cue.cueId);

    console.log("[UI] Layer 1 output:", cue); // Makikita sa F12!
    setPrompt("");
  }

  return (
    <main className="min-h-screen bg-[#050711] text-white p-8 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-400">AutoDo 01-v2</h1>

      <p className="text-xs text-gray-500 font-mono">
        F12 → Console para makita ang Layer 1 logs (purple)
      </p>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Subukan: 'summarize my emails'"
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
      />

      <button
        onClick={handleSubmit}
        disabled={!prompt.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 px-6 py-2.5 rounded-lg font-semibold transition"
      >
        Run Layer 1 →
      </button>

      {lastCueId && (
        <div className="rounded-lg border border-indigo-900 bg-indigo-950/30 p-4 font-mono text-xs text-indigo-300">
          <p className="text-indigo-500 mb-1">Layer 1 Output:</p>
          <p>cueId: {lastCueId}</p>
        </div>
      )}
    </main>
  );
}
```

### Subukan:

1. Buksan ang **F12 → Console**
2. Mag-type ng "summarize my emails" at i-submit
3. Makikita mo ang **purple na log** at ang cueId sa screen!

### 📝 Git Commit:

```bash
git add src/app/app-v2/page.tsx
git commit -m "feat(phase-3): connect Layer 1 createCueEvent to UI with F12 console output"
```

---

## Lesson 3.5 — Layer 2 Function (Perception / Parsing)

### Gumawa ng bagong file: `src/app/app-v2/core/perception.ts`

```ts
import type { CanonicalCommand, InferredIntent, UnparsedCueEvent } from "../types";

// Layer 2: Perception / Parsing — Pure function
// Input: UnparsedCueEvent (galing sa Layer 1)
// Output: CanonicalCommand (malinis, may intent at scope)
export function parseCommand(cue: UnparsedCueEvent): CanonicalCommand {
  const cleanedText = cue.rawPrompt.replace(/\s+/g, " ").trim();
  const lower = cleanedText.toLowerCase();

  // Rule-based intent classification (simple rules bago gumamit ng AI)
  let intent: InferredIntent = "chat.general";
  let requestedScope: CanonicalCommand["requestedScope"] = "general_chat";

  if (lower.includes("summarize") || (lower.includes("email") && lower.includes("unread"))) {
    intent = "email.summarize";
    requestedScope = "read_only";
  } else if (lower.includes("reply") || lower.includes("send email")) {
    intent = "email.reply";
    requestedScope = "write_email";
  } else if (lower.includes("schedule") || lower.includes("meeting")) {
    intent = "calendar.schedule";
    requestedScope = "write_calendar";
  } else if (lower.includes("calendar") || lower.includes("availability")) {
    intent = "calendar.query";
    requestedScope = "read_only";
  }

  const now = new Date();
  const randomSuffix = Math.random().toString(36).substring(2, 7);

  const command: CanonicalCommand = {
    commandId: `cmd_${now.getTime()}_${randomSuffix}`,
    traceId: `trc_${now.getTime()}_${randomSuffix}`,
    cueId: cue.cueId,
    intent,
    requestedScope,
    normalizedPrompt: cleanedText,
    timestamp: now.toISOString(),
  };

  // Structured Logging (Sky Blue #38bdf8) para sa F12
  console.log(
    `%c[AutoDo 🧠] [Layer 2: Perception] intent: "${command.intent}" | scope: "${command.requestedScope}"`,
    "color: #38bdf8; font-weight: bold;"
  );

  return command;
}
```

### 📝 Git Commit:

```bash
git add src/app/app-v2/core/perception.ts
git commit -m "feat(phase-3): create Layer 2 parseCommand with rule-based intent detection"
```

---

## Lesson 3.6 — Layer 1 → Layer 2 Pipeline sa UI

### I-update ang `src/app/app-v2/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { createCueEvent } from "./core/cue";
import { parseCommand } from "./core/perception";
import type { CanonicalCommand } from "./types";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [command, setCommand] = useState<CanonicalCommand | null>(null);

  function handleSubmit() {
    if (!prompt.trim()) return;

    // 🟣 Layer 1
    const cue = createCueEvent(prompt, "chat");

    // 🔵 Layer 2
    const parsed = parseCommand(cue);
    setCommand(parsed);

    setPrompt("");
  }

  return (
    <main className="min-h-screen bg-[#050711] text-white p-8 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-400">AutoDo 01-v2</h1>

      <p className="text-xs text-gray-500 font-mono">
        F12 → Console: 🟣 Layer 1 (purple) + 🔵 Layer 2 (sky blue)
      </p>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Subukan: 'summarize my emails' o 'schedule a meeting'"
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
      />

      <button
        onClick={handleSubmit}
        disabled={!prompt.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 px-6 py-2.5 rounded-lg font-semibold transition"
      >
        Run Pipeline →
      </button>

      {command && (
        <div className="rounded-lg border border-sky-900 bg-sky-950/20 p-4 font-mono text-xs space-y-1">
          <p className="text-sky-400 font-bold mb-2">Layer 2 Output (CanonicalCommand):</p>
          <p><span className="text-gray-500">intent:</span> <span className="text-sky-300">{command.intent}</span></p>
          <p><span className="text-gray-500">scope:</span> <span className="text-sky-300">{command.requestedScope}</span></p>
          <p><span className="text-gray-500">prompt:</span> <span className="text-white">{command.normalizedPrompt}</span></p>
          <p><span className="text-gray-500">commandId:</span> <span className="text-gray-400">{command.commandId}</span></p>
        </div>
      )}
    </main>
  );
}
```

### Subukan:

1. Mag-type ng "summarize my emails" → makikita ang intent: `email.summarize`
2. Mag-type ng "schedule a meeting" → makikita ang intent: `calendar.schedule`
3. Sa F12 Console, makikita ang dalawang logs: 🟣 Layer 1 + 🔵 Layer 2

### 📝 Git Commit:

```bash
git add src/app/app-v2/page.tsx
git commit -m "feat(phase-3): connect Layer 1 to Layer 2 pipeline with visual output in UI"
```

---

## Phase 3 Completion Test

Gawin lamang ito pagkatapos ma-complete at ma-commit ang Lessons 3.1–3.6.

### 1. Automated validation

Sa project root, i-run:

```bash
npm run lint && npx tsc --noEmit
```

Expected:

- Walang ESLint error.
- Walang TypeScript error.
- Kapag may warning, i-copy ang warning at ipakita sa mentor para ma-review.

Kapag huminto ang chained command, basahin ang unang error bago baguhin ang code. Ang error ay actual **OBSERVED** result ng validation.

### 2. Run the app

```bash
npm run dev
```

Pagkatapos, buksan ang `/app-v2` route at Chrome **F12 → Console**.

### 3. Test the accumulated pipeline

| Input | Expected Layer 1 | Expected Layer 2 |
|-------|------------------|------------------|
| `summarize my emails` | Purple Input / Cue log at may `cueId` | Sky-blue log, `email.summarize`, `read_only` |
| `schedule a meeting` | Purple Input / Cue log at may `cueId` | Sky-blue log, `calendar.schedule`, `write_calendar` |
| Blank input | Walang Layer 1 execution | Walang Layer 2 execution |

Ang table ay **expected output guide** lamang. Ang nasa sarili mong browser at terminal ang actual **OBSERVED output**.

Expected visual flow:

```text
Browser input
     │
     ▼
Layer 1: createCueEvent
     │  purple log + cueId
     ▼
Layer 2: parseCommand
     │  sky-blue log + intent + scope
     ▼
CanonicalCommand shown in UI
```

### 4. Ipakita ang logs/output sa mentor

Kapag magre-review gamit ang `d`, puwedeng i-paste ang:

1. Output ng `npm run lint && npx tsc --noEmit`.
2. Layer 1 at Layer 2 text mula sa F12 Console.
3. Actual UI values para sa `intent`, `scope`, `prompt`, at `commandId`.
4. Error text kung may hindi tumugma sa expected result.

Huwag mag-paste ng secrets, tokens, passwords, o personal email content. Gumamit ng safe test prompts lamang.

### 5. Failure indicators

- May ESLint o TypeScript error.
- Walang Layer 1 o Layer 2 log pagkatapos ng valid submit.
- May pipeline execution kahit blank ang input.
- Hindi tumutugma ang `intent` o `requestedScope` sa expected row.
- Walang `cueId` o `commandId` sa observed result.

Kapag may failure, huwag manghula. I-copy ang exact safe error/log at send `d` para ma-trace natin ang layer na nag-fail.

### 6. Verify the lesson commits

```bash
git log --oneline
```

Expected na present ang exact required implementation commits:

```text
feat(phase-3): add Layer 2 CanonicalCommand and InferredIntent contracts
feat(phase-3): create Layer 1 createCueEvent pure function
feat(phase-3): connect Layer 1 createCueEvent to UI with F12 console output
feat(phase-3): create Layer 2 parseCommand with rule-based intent detection
feat(phase-3): connect Layer 1 to Layer 2 pipeline with visual output in UI
```

Huwag pumunta sa Phase 4 kapag may missing lesson commit o failing validation.

---

## Summary ng Phase 3

| Lesson | Natututo | Commit |
|--------|----------|--------|
| 3.1 | Pure functions, single responsibility | (conceptual) |
| 3.2 | Expand types.ts para sa Layer 2 | `feat(phase-3): add Layer 2 CanonicalCommand...` |
| 3.3 | core/cue.ts — Layer 1 function | `feat(phase-3): create Layer 1 createCueEvent...` |
| 3.4 | I-connect Layer 1 sa UI | `feat(phase-3): connect Layer 1 createCueEvent to UI...` |
| 3.5 | core/perception.ts — Layer 2 function | `feat(phase-3): create Layer 2 parseCommand...` |
| 3.6 | Layer 1 → Layer 2 pipeline sa UI | `feat(phase-3): connect Layer 1 to Layer 2 pipeline...` |

**Next:** [Phase 4 — Route Handler (Server)](./phase_4.md)
