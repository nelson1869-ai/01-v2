# AutoDo 01-v2 — My Learning Progress

> Ito ang personal tracker ng lahat ng natutunan ko.
> Ini-update ito pagkatapos ng bawat phase na natapos.

---

## How to Read This File

- ✅ = Natutunan ko na at may git commit
- 🔲 = Hindi pa

---

## PHASE 0 — Browser Basics ✅ COMPLETE

### Lesson 0.1 — Hello World sa Browser
> Commit: `feat(phase-0): hello world page at /app-v2 route`

| Concept | Natutunan |
|---------|-----------|
| `page.tsx` = URL route | ✅ Ang filename ang nagiging URL path sa Next.js |
| `export default function` | ✅ Ito ang lalabas sa browser — required sa bawat page |
| JSX | ✅ HTML-like syntax na pwede sa loob ng TypeScript |
| Server Component | ✅ Nagre-render sa server, hindi interactive by default |

---

### Lesson 0.2 — React Component
> Commit: `feat(phase-0): add reusable StatusBadge component`

| Concept | Natutunan |
|---------|-----------|
| React Component | ✅ Function na nag-rereturn ng JSX, capital letter ang pangalan |
| Component composition | ✅ Pwedeng gumamit ng component sa loob ng component |
| Self-closing tag | ✅ `<StatusBadge />` — walang laman, may self-close |
| Reusability | ✅ Isang component, maraming beses magagamit |

---

### Lesson 0.3 — Tailwind Styling
> Commit: `feat(phase-0): add Tailwind styling — dark theme and green status badge`

| Concept | Natutunan |
|---------|-----------|
| `className` | ✅ Sa JSX, `class` ay `className` |
| Tailwind utility classes | ✅ bg-, text-, p-, m-, font-, flex, etc. |
| Arbitrary values `bg-[#050711]` | ✅ Pwede custom hex colors sa Tailwind |
| JSX comments `{/* */}` | ✅ Ganito mag-comment sa loob ng JSX |
| Dark theme setup | ✅ bg-[#050711] + text-white |

---

## PHASE 1 — Interactive UI ✅ COMPLETE

### Lesson 1.1 — "use client" + useState + onClick
> Commit: `feat(phase-1): add use client useState and onClick button`

| Concept | Natutunan |
|---------|-----------|
| `"use client"` | ✅ Ginagawang Client Component — pwede na interactive |
| Server vs Client Component | ✅ Server = static, Client = interactive |
| `useState(initialValue)` | ✅ Nag-iingat ng value na maaaring magbago |
| `[value, setValue]` destructuring | ✅ value = kasalukuyan, setValue = function para baguhin |
| `onClick` event handler | ✅ Tatakbo ang function kapag na-click |
| Conditional rendering `{cond && <JSX>}` | ✅ Lalabas lang ang JSX kapag true ang condition |

---

### Lesson 1.2 — Controlled Input
> Commit: `feat(phase-1): add controlled text input with real-time state binding`

| Concept | Natutunan |
|---------|-----------|
| Controlled input pattern | ✅ State ang nagko-control ng input value |
| `value={state}` | ✅ Ibinabase ang value ng input sa state |
| `onChange={(e) => setState(e.target.value)}` | ✅ Bawat keypress, nag-a-update ang state |
| `e.target.value` | ✅ Ang actual na text na naka-type sa input |
| Real-time display | ✅ Makikita agad ang changes habang nagta-type |

---

### Lesson 1.3 — Submit Handler + F12 Console
> Commit: `feat(phase-1): add submit handler with styled F12 console logging`

| Concept | Natutunan |
|---------|-----------|
| `function handleSubmit()` | ✅ Named function — mas madaling i-debug kaysa arrow function inline |
| Guard clause `if (!x) return` | ✅ Huwag mag-proceed kapag invalid ang input |
| `console.log("%c...", "color:...")` | ✅ Styled log — may kulay sa Chrome F12 Console |
| `onKeyDown` + Enter key check | ✅ Submit din kapag pinindot ang Enter |
| `disabled` attribute | ✅ Bawal mag-click kapag walang laman ang input |
| Chrome DevTools F12 | ✅ Buksan ang Console tab para makita ang logs |

---

## PHASE 2 — TypeScript Fundamentals 🔲 IN PROGRESS

### Lesson 2.1 — Type Alias + Union Types 🔲
> Next commit: `feat(phase-2): add CueSource type alias with union literals`

| Concept | Status |
|---------|--------|
| `type` keyword | 🔲 |
| Union type `A \| B \| C` | 🔲 |
| Literal types `"chat"` | 🔲 |
| Compile-time safety | 🔲 |

---

### Lesson 2.2 — Interface + Object Shape 🔲
> Next commit: `feat(phase-2): add UnparsedCueEvent interface with object shape`

| Concept | Status |
|---------|--------|
| `interface` keyword | 🔲 |
| Required properties | 🔲 |
| Reusing types as property types | 🔲 |

---

### Lesson 2.3 — Readonly (Immutability) 🔲
> Next commit: `feat(phase-2): add readonly modifiers for immutable CueEvent contract`

| Concept | Status |
|---------|--------|
| `readonly` modifier | 🔲 |
| Immutability | 🔲 |
| Data integrity between layers | 🔲 |

---

## PHASE 3 — Pipeline Functions 🔲

### Lesson 3.1 — Pure Functions (conceptual) 🔲
### Lesson 3.2 — Expand types.ts 🔲
### Lesson 3.3 — Layer 1 (cue.ts) 🔲
### Lesson 3.4 — Connect Layer 1 to UI 🔲
### Lesson 3.5 — Layer 2 (perception.ts) 🔲
### Lesson 3.6 — Layer 1 → Layer 2 Pipeline 🔲

---

## PHASE 4 — Route Handler (Server) 🔲

### Lesson 4.1 — POST Route Handler 🔲
### Lesson 4.2 — Connect UI to Server 🔲
### Lesson 4.3 — Move Pipeline to Server 🔲

---

## PHASE 5 — Real AI (Gemini) 🔲

### Lesson 5.1 — .env.local + API Key Safety 🔲
### Lesson 5.2 — Gemini SDK + AI Function 🔲
### Lesson 5.3 — Full AI Pipeline in UI 🔲

---

## PHASE 6+ — Coming Soon ⏳

> Mga phases na ito ay isusulat kapag malapit ka na:
> PostgreSQL, Drizzle, RAG/pgvector, Policy, Auth, Gmail, Durable Execution, Observability, Production

---

## Summary Stats

| Phase | Lessons Done | Total Lessons | Status |
|-------|-------------|---------------|--------|
| Phase 0 | 3 / 3 | ✅ COMPLETE |
| Phase 1 | 3 / 3 | ✅ COMPLETE |
| Phase 2 | 0 / 3 | 🔲 Next |
| Phase 3 | 0 / 6 | 🔲 |
| Phase 4 | 0 / 3 | 🔲 |
| Phase 5 | 0 / 3 | 🔲 |

**Total Lessons Completed: 6 / 21 (so far)**

---

> **Rule:** Ang PROGRESS.md ay ini-update ng AI mentor pagkatapos ng bawat phase
> based sa `git log --oneline`. Hindi kailangan i-update ng student.
