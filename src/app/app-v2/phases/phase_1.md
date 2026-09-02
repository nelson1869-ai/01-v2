# Phase 1 — Gawing Interactive ang Page

> **Layunin:** Matuto kung paano tumugon ang UI sa user input.
> Ang button at text input ang pinaka-basic na paraan ng pakikipag-usap ng user sa system.

> **Gabay sa Git:** May `git commit` sa dulo ng bawat lesson.

---

## Lesson 1.1 — Ano ang `"use client"`?

### Problema muna:

Subukan mong dagdagan ang `page.tsx` ng `onClick` nang **walang** `"use client"`:

```tsx
export default function Page() {
  return (
    <button onClick={() => console.log("clicked")}>
      Click me
    </button>
  );
}
```

Makikita mo ang **error sa browser** — hindi pwede ang `onClick` sa Server Component.

### Bakit?

Sa Next.js App Router, ang lahat ng components ay **Server Components** by default.
Server Components ay nagre-render sa server — hindi sila interactive.

```
Server Component    →  Nagre-render sa server  →  Walang interactivity
Client Component    →  Nagre-render sa browser →  May onClick, useState, etc.
```

Para gawing Client Component ang isang file, lagyan ng `"use client"` sa UNANG linya.

### Ang solusyon:

```tsx
"use client"; // ← Unang linya — ginagawang Client Component

export default function Page() {
  return (
    <button onClick={() => console.log("clicked")}>
      Click me
    </button>
  );
}
```

### I-type mo sa `src/app/app-v2/page.tsx`:

```tsx
"use client";

import { useState } from "react";

export default function Page() {
  // useState = nagtatago ng value na pwedeng magbago
  // false = default na value (hindi pa na-click)
  const [clicked, setClicked] = useState(false);

  return (
    <main className="min-h-screen bg-[#050711] text-white p-8">
      <h1 className="text-2xl font-bold text-indigo-400 mb-4">
        AutoDo 01-v2
      </h1>

      <button
        onClick={() => setClicked(true)}
        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-semibold"
      >
        Subukan
      </button>

      {/* Lalabas lang kapag clicked ay true */}
      {clicked && (
        <p className="mt-4 text-emerald-400">
          Na-click mo! 🎉
        </p>
      )}
    </main>
  );
}
```

### Subukan:

1. Refresh ang browser: `http://localhost:3000/app-v2`
2. I-click ang button
3. Dapat lumabas ang "Na-click mo! 🎉"

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `"use client"` | Ginagawang interactive ang component |
| `useState(false)` | Nag-iingat ng value na maaaring magbago |
| `[clicked, setClicked]` | `clicked` = value, `setClicked` = function para baguhin |
| `onClick={() => setClicked(true)}` | Kapag na-click, i-set ang clicked sa true |
| `{clicked && <p>...</p>}` | Conditional rendering — lalabas lang kapag true |

### 📝 Git Commit:

```bash
git add src/app/app-v2/page.tsx
git commit -m "feat(phase-1): add use client useState and onClick button"
```

---

## Lesson 1.2 — Text Input at State

### Ano ang gagawin?

"Controlled input" — ang value ng input ay naka-bind sa state.
Bawat keypress ng user ay nag-a-update ng state, at ang state ang nagko-control ng input.

```
User nag-type → onChange event → setPrompt() → state nag-update → input nag-update
```

### I-update ang `src/app/app-v2/page.tsx`:

```tsx
"use client";

import { useState } from "react";

export default function Page() {
  // prompt = ang text na tine-type ng user
  const [prompt, setPrompt] = useState("");

  return (
    <main className="min-h-screen bg-[#050711] text-white p-8 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-400">
        AutoDo 01-v2
      </h1>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ano ang gusto mong gawin?"
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
      />

      {/* Real-time na lumalabas ang tine-type mo */}
      {prompt && (
        <p className="text-sm text-gray-400">
          Sinulat mo: <span className="text-white font-medium">{prompt}</span>
        </p>
      )}
    </main>
  );
}
```

### Subukan:

1. Refresh ang browser
2. Mag-type ng kahit anong text sa input
3. Dapat makita mo real-time ang text sa ibaba

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `value={prompt}` | Ang state ang nagko-control ng value ng input |
| `onChange={(e) => setPrompt(e.target.value)}` | Bawat keypress, kinukuha ang text at inilagay sa state |
| `e.target.value` | Ang actual na text na naka-type sa input |
| `{prompt && <p>...</p>}` | Lalabas lang kapag may laman ang prompt |

### 📝 Git Commit:

```bash
git add src/app/app-v2/page.tsx
git commit -m "feat(phase-1): add controlled text input with real-time state binding"
```

---

## Lesson 1.3 — Submit Button + Console Log (Chrome F12!)

### Ano ang gagawin?

Gumawa ng **handleSubmit** function at makita ang output sa **Chrome DevTools Console (F12)**.

Ito ang pinaka-importanteng tool ng developer — ang F12 Console!

### I-update ang `src/app/app-v2/page.tsx`:

```tsx
"use client";

import { useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");

  // Ito ang function na tatakbo kapag na-click ang Send button
  function handleSubmit() {
    if (!prompt.trim()) return; // Huwag mag-proceed kapag walang laman

    // console.log na may kulay! Makikita sa Chrome F12 → Console
    // %c = CSS styling, ang pangalawang argument ay ang CSS
    console.log(
      "%c[AutoDo] 🧠 Prompt received:",
      "color: #818cf8; font-weight: bold;",
      prompt
    );

    setPrompt(""); // I-clear ang input pagkatapos mag-submit
  }

  return (
    <main className="min-h-screen bg-[#050711] text-white p-8 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-400">
        AutoDo 01-v2
      </h1>

      <p className="text-xs text-gray-500 font-mono">
        Buksan ang Chrome F12 → Console para makita ang logs!
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
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg font-semibold transition"
      >
        Send →
      </button>

    </main>
  );
}
```

### Subukan:

1. Refresh ang browser
2. Buksan ang **Chrome F12 → Console tab**
3. Mag-type ng "summarize my emails" sa input
4. I-click ang Send (o pindutin ang Enter)
5. Makikita mo ang **purple na log** sa console!

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `function handleSubmit()` | Function declaration — pinangalanang function |
| `if (!prompt.trim()) return` | Guard clause — huwag mag-proceed kapag walang laman |
| `console.log("%c...", "color:...")` | Styled console log — visible sa Chrome F12 |
| `onKeyDown={(e) => e.key === "Enter" && handleSubmit()}` | Submit din kapag pinindot ang Enter |
| `disabled={!prompt.trim()}` | Button ay disabled kapag walang laman ang input |

### 📝 Git Commit:

```bash
git add src/app/app-v2/page.tsx
git commit -m "feat(phase-1): add submit handler with styled F12 console logging"
```

---

## Phase 1 Completion Test

Gawin lamang ito pagkatapos ma-complete at ma-commit ang Lessons 1.1–1.3.

### 1. Automated validation

Sa project root, i-run:

```bash
npm run lint && npx tsc --noEmit
```

Expected:

- Walang ESLint error.
- Walang TypeScript error.
- Karaniwang walang output ang `npx tsc --noEmit` kapag successful.
- Kapag may warning, i-copy ang warning at ipakita sa mentor para ma-review.

### 2. Run the app and open the console

```bash
npm run dev
```

Buksan ang `http://localhost:3000/app-v2`, tapos buksan ang Chrome **F12 → Console**.

### 3. Test the final Phase 1 interaction

Gamitin lamang ang safe test prompt na:

```text
summarize my test emails
```

Expected visual flow:

```text
User types safe prompt
          │
          ▼
prompt state updates
          │
          ▼
Send click or Enter
          │
          ▼
handleSubmit()
     ├── F12 log
     └── input clears
```

Kapag successful, ito ang dapat mong **OBSERVE**:

- Habang blank o spaces lang ang input, disabled ang `Send →` button.
- Kapag may prompt, enabled ang button.
- Ang pag-click sa `Send →` o pagpindot sa Enter ay parehong nagso-submit.
- Lumalabas sa F12 Console ang styled `[AutoDo] 🧠 Prompt received:` log kasama ang safe prompt.
- Nagiging blank ulit ang input pagkatapos ng successful submit.
- Ang blank input ay hindi gumagawa ng prompt log.

Ang listahan sa itaas ay expected guide; ang sariling UI behavior at F12 log mo ang actual **OBSERVED output**.

### 4. Ipakita ang logs/output sa mentor

Kapag magre-review gamit ang `d`, puwedeng i-paste o ipakita ang:

1. Output ng `npm run lint && npx tsc --noEmit`.
2. F12 Console prompt log gamit ang safe test prompt.
3. Screenshot bago at pagkatapos mag-submit.
4. Exact terminal o browser error kung may hindi tumugma.

Huwag gumamit o mag-paste ng tunay na email content, passwords, tokens, o ibang personal data.

### 5. Failure indicators

- Hindi makapag-type sa input.
- Enabled ang button kahit blank ang input.
- Walang log pagkatapos ng valid submit, o may log pagkatapos ng blank submit.
- Hindi nagki-clear ang input pagkatapos mag-submit.
- May browser, ESLint, o TypeScript error.

### 6. Verify the lesson commits

```bash
git log --oneline
```

Expected: makikita ang exact commit message ng bawat lesson:

```text
feat(phase-1): add use client useState and onClick button
feat(phase-1): add controlled text input with real-time state binding
feat(phase-1): add submit handler with styled F12 console logging
```

Kapag may nawawalang required commit, huwag munang pumunta sa Phase 2.

---

## Summary ng Phase 1

| Lesson | Natututo | Commit |
|--------|----------|--------|
| 1.1 | `"use client"`, useState, onClick, conditional render | `feat(phase-1): add use client useState and onClick button` |
| 1.2 | Controlled input, onChange, real-time binding | `feat(phase-1): add controlled text input with real-time state binding` |
| 1.3 | handleSubmit, console.log F12, Enter key, disabled | `feat(phase-1): add submit handler with styled F12 console logging` |

**Next:** [Phase 2 — Ipakilala ang TypeScript](./phase_2.md)
