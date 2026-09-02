# AutoDo 01-v2 — Learning Path (Natural na 0 to Hero)

> **Para kanino ito?**  
> Para sa isang developer na gusto matutunan kung paano talaga gumagawa ng AI system  
> mula sa simula — walang assumed knowledge, natural na progression, visible agad sa browser.

---

## Bakit Mahalaga ang Order?

Sa totoong mundo, hindi ka magsisimula sa abstract na architecture.  
Magsisimula ka sa isang simpleng tanong:

> _"Paano ko mapapakita ang kahit anong bagay sa browser?"_

Tapos habang lumalaki ang problema, lumalaki rin ang solusyon.

**Ito ang natural na paraan:**

```
Makita → Subukan → Maunawaan → Palawakin
```

---

## PHASE 0 — Makita Mo Muna ang Browser

### Lesson 0.1 — Ano ang Next.js page?

**Tanong:** Paano lumabas ang text sa browser?

```tsx
// src/app/app-v2/page.tsx
export default function Page() {
  return <h1>Hello, AutoDo!</h1>;
}
```

- Buksan ang browser: `http://localhost:3000/app-v2`
- Makita mo ang "Hello, AutoDo!" sa screen
- **Konsepto:** Server Component, file-based routing

---

### Lesson 0.2 — Ano ang React Component?

**Tanong:** Paano ko gagawing reusable ang UI?

```tsx
function StatusBadge() {
  return <span>🟢 Online</span>;
}

export default function Page() {
  return (
    <main>
      <h1>AutoDo</h1>
      <StatusBadge />
    </main>
  );
}
```

- **Konsepto:** Components, JSX, composition

---

### Lesson 0.3 — Paano mag-style gamit ang Tailwind?

**Tanong:** Paano gagawing maganda ang page?

```tsx
export default function Page() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold">AutoDo</h1>
    </main>
  );
}
```

- **Konsepto:** Tailwind CSS utility classes, className

---

## PHASE 1 — Gawing Interactive

### Lesson 1.1 — Ano ang "use client"?

**Tanong:** Bakit kailangan ng "use client" bago gumamit ng button?

```tsx
"use client"; // Kailangan ito para sa mga interactive na components

import { useState } from "react";

export default function Page() {
  const [clicked, setClicked] = useState(false);

  return (
    <main>
      <button onClick={() => setClicked(true)}>Subukan</button>
      {clicked && <p>Na-click mo!</p>}
    </main>
  );
}
```

- **Konsepto:** Server vs Client Components, useState, event handlers

---

### Lesson 1.2 — Text Input at State

**Tanong:** Paano makuha ang text na tine-type ng user?

```tsx
"use client";
import { useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");

  return (
    <main>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ano ang gusto mong gawin?"
      />
      <p>Sinulat mo: {prompt}</p>
    </main>
  );
}
```

- **Konsepto:** Controlled input, onChange, state binding

---

### Lesson 1.3 — Submit Button + Console Log

**Tanong:** Paano ko malalaman kung anong napasok sa F12 Console?

```tsx
"use client";
import { useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");

  function handleSubmit() {
    console.log("Prompt na pumasok:", prompt); // Makikita sa Chrome F12!
  }

  return (
    <main>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Subukan: 'summarize my emails'"
      />
      <button onClick={handleSubmit}>Isend</button>
    </main>
  );
}
```

> **Buksan ang Chrome F12 → Console tab habang nag-ti-type ka!**

---

## PHASE 2 — Ipakilala ang TypeScript

### Lesson 2.1 — Bakit kailangan ng TypeScript?

```ts
// PROBLEMA: walang type checks, pwedeng mag-crash
function processPrompt(prompt) {
  console.log(prompt.text); // Error kung wala .text!
}

// SOLUSYON: TypeScript
function processPrompt(prompt: string) {
  console.log(prompt); // Safe na!
}
```

- **Konsepto:** Type annotations, compile-time protection

---

### Lesson 2.2 — Type Alias at Union Types

```ts
// Ito ang type alias
type CueSource = "chat" | "schedule" | "manual";

const source: CueSource = "chat";       // OK
const bad: CueSource = "bluetooth";    // ERROR agad sa VS Code!
```

- **Konsepto:** Union types, literal types, type aliases

---

### Lesson 2.3 — Interface at Readonly

```ts
interface CueEvent {
  readonly id: string;     // Bawal baguhin pagkagawa
  readonly prompt: string;
  source: CueSource;
}

const event: CueEvent = { id: "cue_001", prompt: "hello", source: "chat" };
event.id = "changed"; // ERROR! Readonly
```

- **Konsepto:** Interface, readonly, immutability

---

## PHASE 3 — Ipakilala ang Pipeline Functions

### Lesson 3.1 — Pure Function

```ts
// Pure function: same input = same output, walang side effects
function cleanPrompt(rawText: string): string {
  return rawText.replace(/\s+/g, " ").trim();
}

console.log(cleanPrompt("  hello   world  ")); // "hello world"
```

---

### Lesson 3.2 — Ikonekta ang Layer 1 sa UI (KASALUKUYAN)

```tsx
"use client";
import { useState } from "react";
import { createCueEvent } from "./core/cue";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [cueId, setCueId] = useState<string | null>(null);

  function handleSubmit() {
    const cue = createCueEvent(prompt, "chat"); // Layer 1!
    setCueId(cue.cueId);
    // Tingnan sa F12 Console ang PURPLE na log!
  }

  return (
    <main>
      <input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={handleSubmit}>Run Layer 1</button>
      {cueId && <p>Cue ID: {cueId}</p>}
    </main>
  );
}
```

---

### Lesson 3.3 — Layer 1 → Layer 2 Pipeline

```tsx
function handleSubmit() {
  const cue = createCueEvent(prompt, "chat");    // Layer 1 (Purple)
  const command = parseCommand(cue);             // Layer 2 (Sky Blue)

  // F12 Console magpapakita ng dalawang colored logs!
  console.log("Intent:", command.intent);
}
```

---

## PHASE 4 — Ipakilala ang Server (Route Handlers)

### Lesson 4.1 — Bakit kailangan ng server?

```
Client Side (browser)     Server Side (Node.js)
─────────────────────     ─────────────────────
OK: UI, interactions      OK: Database
OK: Local state           OK: Secret API keys
HINDI: API secrets        OK: Gmail API calls
HINDI: Database           OK: Heavy computation
```

**Kapag kailangan ng Gmail API key → kailangan ng server!**

### Lesson 4.2 — Simpleng Route Handler

```ts
// src/app/api/cue/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { rawPrompt } = body;

  console.log("[Server] Natanggap:", rawPrompt); // Makikita sa Terminal!

  return NextResponse.json({ received: rawPrompt });
}
```

---

## PHASE 5 — Ipakilala ang Real AI

### Lesson 5.1 — Bakit Server-side ang AI calls?

```
MALI:  Browser → Gemini API (exposed ang API key!)
TAMA:  Browser → Route Handler → Gemini API (safe!)
```

---

## Ikaw ay Nandito Na:

```
Phase 0 — Visible sa browser              DONE
Phase 1 — Interactive (buttons, inputs)   DONE
Phase 2 — TypeScript types (types.ts)     DONE
Phase 3.1 — Pipeline functions            DONE (cue.ts, perception.ts)
Phase 3.2 — I-connect sa UI              <-- SUSUNOD NATING GAWIN
Phase 4 — Route Handler (server)          Mamaya
Phase 5 — Real AI calls                   Mamaya
```

> **Next step:** I-connect natin ang createCueEvent + parseCommand sa isang
> simpleng button sa page.tsx para makita ang pipeline sa Chrome F12 Console!
