# Phase 4 — Route Handler (Server Side)

> **Layunin:** Matuto kung kailan kailangan ng server at paano gumawa ng simpleng Route Handler
> para sa mga actions na kailangan ng API keys o database access.

> **Gabay sa Git:** May `git commit` sa dulo ng bawat lesson.

---

## Bakit Kailangan ng Server?

Sa Phase 3, lahat ay nangyayari sa browser (client side).
Pero may mga bagay na **hindi dapat mangyari sa browser**:

```
CLIENT (Browser)           SERVER (Node.js)
──────────────────         ──────────────────────
✅ UI rendering            ✅ API keys (Gemini, Gmail)
✅ User interaction        ✅ Database queries
✅ Local state             ✅ Heavy AI computation
✅ Console logs (F12)      ✅ Terminal logs
❌ API secrets             ✅ Secure file access
❌ Database access         ✅ Server-to-server calls
```

**Konklusyon:** Kapag kailangan ng API key (tulad ng Gemini o Gmail), kailangan ng server!

---

## Lesson 4.1 — Ang Simpleng Route Handler

### Ano ang Route Handler?

Sa Next.js App Router, ang isang `route.ts` file sa loob ng `src/app/api/` ay nagiging API endpoint.

```
src/app/api/cue/route.ts → http://localhost:3000/api/cue
```

### Gumawa ng bagong file: `src/app/api/cue/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

// POST /api/cue — tumatanggap ng prompt mula sa browser
export async function POST(req: NextRequest) {
  // Kunin ang body ng request
  const body = await req.json();
  const { rawPrompt } = body;

  // Makikita sa TERMINAL (hindi sa F12!)
  console.log("[Server] 📨 Natanggap na prompt:", rawPrompt);

  // I-return ang response bilang JSON
  return NextResponse.json({
    received: true,
    prompt: rawPrompt,
    serverTime: new Date().toISOString(),
  });
}
```

### Subukan gamit ang browser fetch:

Pansamantala, i-test natin gamit ang browser console. Buksan ang F12 → Console at i-type:

```js
fetch("/api/cue", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ rawPrompt: "test mula sa console" })
}).then(r => r.json()).then(console.log)
```

Makikita mo ang response sa F12 Console, at ang log sa TERMINAL!

### 📝 Git Commit:

```bash
git add src/app/api/cue/route.ts
git commit -m "feat(phase-4): create POST /api/cue Route Handler"
```

---

## Lesson 4.2 — I-connect ang UI sa Server

### I-update ang `src/app/app-v2/page.tsx`:

Palitan ang client-side pipeline ng isang server call:

```tsx
"use client";

import { useState } from "react";

type ServerResponse = {
  received: boolean;
  prompt: string;
  serverTime: string;
};

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<ServerResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!prompt.trim()) return;
    setLoading(true);

    console.log("%c[Browser] 📤 Nagpapadala sa server...", "color: #818cf8; font-weight: bold;");

    // I-send ang prompt sa server
    const res = await fetch("/api/cue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawPrompt: prompt }),
    });

    const data: ServerResponse = await res.json();

    console.log("%c[Browser] 📥 Natanggap mula sa server:", "color: #38bdf8; font-weight: bold;", data);

    setResponse(data);
    setPrompt("");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050711] text-white p-8 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-400">AutoDo 01-v2</h1>

      <p className="text-xs text-gray-500 font-mono">
        F12 → Console: browser logs | Terminal: server logs
      </p>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="I-send sa server..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
      />

      <button
        onClick={handleSubmit}
        disabled={!prompt.trim() || loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 px-6 py-2.5 rounded-lg font-semibold transition"
      >
        {loading ? "Nagpapadala..." : "Send sa Server →"}
      </button>

      {response && (
        <div className="rounded-lg border border-sky-900 bg-sky-950/20 p-4 font-mono text-xs space-y-1">
          <p className="text-sky-400 font-bold mb-2">Server Response:</p>
          <p><span className="text-gray-500">received:</span> <span className="text-emerald-400">{String(response.received)}</span></p>
          <p><span className="text-gray-500">prompt:</span> <span className="text-white">{response.prompt}</span></p>
          <p><span className="text-gray-500">serverTime:</span> <span className="text-gray-400">{response.serverTime}</span></p>
        </div>
      )}
    </main>
  );
}
```

### Subukan:

1. I-type ang kahit anong text at i-submit
2. **F12 Console:** Makikita ang "Nagpapadala sa server..." at ang response
3. **Terminal:** Makikita ang "[Server] 📨 Natanggap na prompt: ..."

**Ito ang pinaka-importanteng konsepto:** Browser at server ay magkaibang proseso!

### 📝 Git Commit:

```bash
git add src/app/app-v2/page.tsx
git commit -m "feat(phase-4): connect UI to POST /api/cue server route with fetch"
```

---

## Lesson 4.3 — I-lagay ang Layer 1 at 2 sa Server

### Pindalan: Ilipat ang pipeline sa server (mas tama at ligtas)

```ts
// src/app/api/cue/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCueEvent } from "../../app-v2/core/cue";
import { parseCommand } from "../../app-v2/core/perception";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { rawPrompt } = body;

  // Layer 1 — sa server
  const cue = createCueEvent(rawPrompt, "chat");

  // Layer 2 — sa server
  const command = parseCommand(cue);

  // Terminal ang mag-sho-show ng logs (hindi F12!)
  console.log("[Server] Pipeline complete:", command);

  return NextResponse.json({ command });
}
```

### 📝 Git Commit:

```bash
git add src/app/api/cue/route.ts
git commit -m "feat(phase-4): move Layer 1 and Layer 2 pipeline to server Route Handler"
```

---

## Summary ng Phase 4

| Lesson | Natututo | Commit |
|--------|----------|--------|
| 4.1 | Route Handler, POST endpoint, terminal logs | `feat(phase-4): create POST /api/cue Route Handler` |
| 4.2 | fetch() sa UI, async/await, loading state | `feat(phase-4): connect UI to POST /api/cue server route with fetch` |
| 4.3 | Ilipat pipeline sa server (mas ligtas) | `feat(phase-4): move Layer 1 and Layer 2 pipeline to server Route Handler` |

**Next:** [Phase 5 — Real AI API](./phase_5.md)
