# AutoDo 01-v2 — Full Learning Roadmap

> Lahat ng makabuluhang React, Next.js, TypeScript, at AI Engineering fundamentals
> ay matututunan mo sa pamamagitan ng pagbuo ng isang real AI OS.

---

## Legend

| Symbol | Ibig Sabihin |
|--------|--------------|
| ✅ | Guide tapos na, handa para aralin |
| 🔜 | Guide isusulat kapag malapit na |
| ⏳ | Future — darating mamaya |

---

## ✅ PHASE 0 — Browser Basics
**Guide:** [`phases/phase_0.md`](./phases/phase_0.md)

| Lesson | Paksa | React | Next.js | TypeScript |
|--------|-------|-------|---------|------------|
| 0.1 | Hello World sa Browser | JSX, export default | page.tsx = URL route | — |
| 0.2 | React Component | Components, composition | — | — |
| 0.3 | Tailwind Styling | className | — | — |

**Commit pattern:** `feat(phase-0): ...`

---

## ✅ PHASE 1 — Interactive UI
**Guide:** [`phases/phase_1.md`](./phases/phase_1.md)

| Lesson | Paksa | React | Next.js | TypeScript |
|--------|-------|-------|---------|------------|
| 1.1 | "use client" + useState + onClick | useState, onClick, conditional render | Server vs Client boundary | — |
| 1.2 | Controlled Input | onChange, controlled input pattern | — | — |
| 1.3 | Submit + F12 Console | handleSubmit, console.log styling | — | — |

**Commit pattern:** `feat(phase-1): ...`

---

## ✅ PHASE 2 — TypeScript Fundamentals
**Guide:** [`phases/phase_2.md`](./phases/phase_2.md)

| Lesson | Paksa | React | Next.js | TypeScript |
|--------|-------|-------|---------|------------|
| 2.1 | Type Alias + Union Types | — | — | type, union, literal types |
| 2.2 | Interface + Object Shape | — | — | interface, required properties |
| 2.3 | Readonly (Immutability) | — | — | readonly, data integrity |

**Commit pattern:** `feat(phase-2): ...`

---

## ✅ PHASE 3 — Pipeline Functions + UI Connection
**Guide:** [`phases/phase_3.md`](./phases/phase_3.md)

| Lesson | Paksa | React | Next.js | TypeScript |
|--------|-------|-------|---------|------------|
| 3.1 | Pure Functions (concept) | — | — | return types |
| 3.2 | Expand types.ts (Layer 2 contract) | — | — | export type, export interface |
| 3.3 | core/cue.ts — Layer 1 function | — | — | import type, function signature |
| 3.4 | Connect Layer 1 sa UI | useState with custom type | — | generic useState<T> |
| 3.5 | core/perception.ts — Layer 2 | — | — | Indexed access types T["key"] |
| 3.6 | Layer 1 → Layer 2 sa UI | Multiple imports, display | — | import type |

**Commit pattern:** `feat(phase-3): ...`

---

## ✅ PHASE 4 — Route Handler (Server)
**Guide:** [`phases/phase_4.md`](./phases/phase_4.md)

| Lesson | Paksa | React | Next.js | TypeScript |
|--------|-------|-------|---------|------------|
| 4.1 | Simpleng POST Route Handler | — | Route Handlers, NextRequest/Response | async, Promise |
| 4.2 | fetch() sa UI + loading state | async state, loading | — | async/await typing |
| 4.3 | Ilipat pipeline sa server | — | Server-side imports | — |

**Commit pattern:** `feat(phase-4): ...`

---

## ✅ PHASE 5 — Real AI API (Gemini)
**Guide:** [`phases/phase_5.md`](./phases/phase_5.md)

| Lesson | Paksa | React | Next.js | TypeScript |
|--------|-------|-------|---------|------------|
| 5.1 | .env.local + API key safety | — | env variables, .gitignore | — |
| 5.2 | Gemini SDK + AI function | — | Server-only imports | Promise<T>, generic types |
| 5.3 | Full pipeline sa UI | Streaming-ready state | — | Discriminated unions |

**Commit pattern:** `feat(phase-5): ...`

---

## 🔜 PHASE 6 — PostgreSQL + SQL
**Guide:** Isusulat kapag nasa Phase 5 ka na

| Lesson | Paksa |
|--------|-------|
| 6.1 | Ano ang database? Tables, rows, columns |
| 6.2 | Unang SQL: SELECT, INSERT |
| 6.3 | WHERE, ORDER BY, LIMIT |
| 6.4 | Primary keys, foreign keys, constraints |
| 6.5 | JOINs — pagsamahin ang dalawang tables |
| 6.6 | Transactions — all or nothing |
| 6.7 | I-connect sa Next.js (pg library) |

**Commit pattern:** `feat(phase-6): ...`

---

## 🔜 PHASE 7 — Drizzle ORM
**Guide:** Isusulat kapas nasa Phase 6 ka na

| Lesson | Paksa |
|--------|-------|
| 7.1 | Bakit ORM? TypeScript + SQL = Drizzle |
| 7.2 | Schema definition (type-safe tables) |
| 7.3 | Migrations |
| 7.4 | Queries (select, insert, update, delete) |
| 7.5 | Relations (one-to-many, many-to-many) |

**Commit pattern:** `feat(phase-7): ...`

---

## 🔜 PHASE 8 — Memory + RAG (pgvector)
**Guide:** Isusulat kapag nasa Phase 7 ka na

| Lesson | Paksa |
|--------|-------|
| 8.1 | Ano ang vector? Ano ang embedding? |
| 8.2 | pgvector extension setup |
| 8.3 | Gumawa ng embedding mula sa text |
| 8.4 | HNSW index para sa mabilis na search |
| 8.5 | Semantic similarity search |
| 8.6 | Reranker — i-filter ang best results |
| 8.7 | I-connect sa AutoDo pipeline (Layer 4) |

**Commit pattern:** `feat(phase-8): ...`

---

## 🔜 PHASE 9 — Policy Layer (Safety)
**Guide:** Isusulat kapag nasa Phase 8 ka na

| Lesson | Paksa |
|--------|-------|
| 9.1 | Bakit deterministic policy? Hindi LLM |
| 9.2 | Policy rules (allowlist, denylist) |
| 9.3 | Llama Guard 4 integration |
| 9.4 | Policy decision types (ALLOW, DENY, REVIEW) |
| 9.5 | I-test ang policy bypass scenarios |

**Commit pattern:** `feat(phase-9): ...`

---

## 🔜 PHASE 10 — Authorization Layer
**Guide:** Isusulat kapag nasa Phase 9 ka na

| Lesson | Paksa |
|--------|-------|
| 10.1 | Requested scope != permission |
| 10.2 | Capability scopes (read_only, write_email, etc.) |
| 10.3 | RBAC (Role-Based Access Control) |
| 10.4 | Authorization decision types |
| 10.5 | I-test na hindi pwedeng mag-authorize ang AI mismo |

**Commit pattern:** `feat(phase-10): ...`

---

## ⏳ PHASE 11 — Gmail Integration
## ⏳ PHASE 12 — Durable Execution (retry, idempotency)
## ⏳ PHASE 13 — Observation + Verification
## ⏳ PHASE 14 — Reward + Learning
## ⏳ PHASE 15 — Verified Memory
## ⏳ PHASE 16 — Calendar Integration
## ⏳ PHASE 17 — MCP (Model Context Protocol)
## ⏳ PHASE 18 — Multi-provider AI (Claude, Llama, Ollama)
## ⏳ PHASE 19 — OpenTelemetry Observability
## ⏳ PHASE 20 — Production Hardening + Deployment

---

## Full Fundamentals Coverage

### React
| Concept | Phase |
|---------|-------|
| JSX, components, composition | 0 |
| useState, onClick, conditional render | 1 |
| Controlled inputs, onChange | 1 |
| "use client" vs Server Component | 1 |
| Async state (loading/error/success) | 4 |
| Generic useState<T> | 3 |
| useReducer | 6+ |
| Custom hooks | 8+ |
| React 19 Server Actions | 4+ |
| Streaming UI (Suspense) | 5+ |
| useRef, useMemo, useCallback | Later |

### Next.js
| Concept | Phase |
|---------|-------|
| File-based routing | 0 |
| Layout (layout.tsx) | 0 |
| Server Components | 0 |
| Client Components | 1 |
| Route Handlers | 4 |
| Environment variables | 5 |
| Middleware | 9+ |
| Server Actions | 4+ |
| Streaming responses | 5+ |
| Deployment (Vercel) | 20 |

### TypeScript
| Concept | Phase |
|---------|-------|
| Type annotations | 2 |
| Type alias, union, literal | 2 |
| Interface, readonly | 2 |
| import type, export | 3 |
| Function return types | 3 |
| Generic types <T> | 3-4 |
| Promise<T>, async/await | 4 |
| Discriminated unions | 5 |
| satisfies operator | 5 |
| Record<K,V>, Partial, Pick | 6 |
| Mapped types | 7 |
| never type | 9 |
| Conditional types | 10+ |
| Template literal types | Later |

---

## Kasalukuyang Posisyon

```
git log --oneline   ← I-run ito para malaman kung nasaan ka
```

Decode gamit ang `CONTEXT.md`.

**Simulan sa Phase 0 Lesson 0.1 kung bago ka pa lang!**
