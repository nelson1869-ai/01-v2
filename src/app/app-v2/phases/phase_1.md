# Phase 1 — Gawing Interactive ang Page

> **Layunin:** Matuto kung paano tumugon ang UI sa user input.  
> Ang browser ay kailangan munang "marinig" ang user bago mag-react ang system.

---

## Lesson 1.1 — Ano ang `"use client"`?

**Tanong:** Bakit may error kapag nag-lagay ako ng `onClick`?

**Sagot:** Sa Next.js App Router, ang lahat ng components ay **Server Components** by default.  
Server Components ay nagre-render sa server — hindi sila interactive.

Para gumamit ng:
- `onClick`, `onChange` — user events
- `useState`, `useEffect` — React hooks
- browser APIs

Kailangan ng `"use client"` sa simula ng file.

```tsx
"use client"; // ← Lagyan ito sa UNANG linya ng file

import { useState } from "react";

export default function Page() {
  const [clicked, setClicked] = useState(false);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <button
        onClick={() => setClicked(true)}
        className="bg-indigo-600 px-4 py-2 rounded"
      >
        Subukan
      </button>

      {/* Lalabas lang kapag clicked = true */}
      {clicked && <p className="mt-4 text-green-400">Na-click mo!</p>}
    </main>
  );
}
```

**Natututo tayo ng:**
- Server Component vs Client Component
- `"use client"` directive
- `useState` — nag-iingat ng local state
- Conditional rendering (`{condition && <JSX />}`)
- onClick event handler

---

## Lesson 1.2 — Text Input at State

**Tanong:** Paano makuha ang text na tine-type ng user?

**Sagot:** Gumamit ng "controlled input" — ang value ng input ay naka-bind sa state.

```tsx
"use client";

import { useState } from "react";

export default function Page() {
  // prompt = ang kasalukuyang value ng input
  // setPrompt = ang function para baguhin ito
  const [prompt, setPrompt] = useState("");

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">

      <input
        value={prompt}                            // ← state ang nagko-control ng value
        onChange={(e) => setPrompt(e.target.value)} // ← bawat keypress, nag-a-update ang state
        placeholder="Ano ang gusto mong gawin?"
        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
      />

      {/* Real-time na lumalabas ang tine-type mo */}
      <p className="mt-4 text-gray-400">
        Sinulat mo: <span className="text-white">{prompt}</span>
      </p>

    </main>
  );
}
```

**Natututo tayo ng:**
- Controlled input pattern (`value` + `onChange`)
- `e.target.value` — kunin ang text mula sa input event
- Real-time state updates
- Template literals sa JSX

---

## Lesson 1.3 — Submit Button + Console Log (Chrome F12!)

**Tanong:** Paano ko malalaman kung anong napasok sa F12 Console?

**Sagot:** Gumawa ng function na tumatawag ng `console.log`.  
Tingnan ang output sa **Chrome DevTools → F12 → Console tab**.

```tsx
"use client";

import { useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");

  // Ito ang function na tatakbo kapag na-click ang button
  function handleSubmit() {
    console.log(
      "%c[AutoDo] Prompt na pumasok:",
      "color: #818cf8; font-weight: bold;",
      prompt
    );
    // Buksan ang Chrome F12 → Console para makita ang purple na log!
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 space-y-4">

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Subukan: 'summarize my emails'"
        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
      />

      <button
        onClick={handleSubmit}
        disabled={prompt.trim() === ""}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-6 py-2 rounded font-semibold"
      >
        Isend sa Layer 1
      </button>

    </main>
  );
}
```

**Pag-aralan sa Chrome DevTools:**
1. Buksan ang `http://localhost:3000/app-v2`
2. Pindutin ang `F12` para buksan ang DevTools
3. Pumunta sa **Console** tab
4. Mag-type ng kahit anong text tapos i-click ang button
5. Makikita mo ang **purple na log** sa console!

**Natututo tayo ng:**
- Function declaration
- `console.log` with CSS styling (`%c` prefix)
- `disabled` attribute
- Chrome DevTools Console

---

## Status ng Phase 1

| Lesson | Paksa | Status |
|--------|-------|--------|
| 1.1 | `"use client"`, useState, onClick | ✅ Tapos |
| 1.2 | Controlled input, onChange | ✅ Tapos |
| 1.3 | handleSubmit, console.log, F12 | ✅ Tapos |

**Next:** [Phase 2 — Ipakilala ang TypeScript](./phase_2.md)
