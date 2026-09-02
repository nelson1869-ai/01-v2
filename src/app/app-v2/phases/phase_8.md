# Phase 8 — Memory + RAG (pgvector)

> **Layunin:** Ipakilala ang semantic memory — ang kakayahan ng AutoDo na matandaan at mag-retrieve
> ng relevant na impormasyon mula sa nakaraan. Ito ang Layer 4 (Memory Retrieval) ng pipeline.

> **Gabay sa Git:** May `git commit` sa dulo ng bawat lesson.

---

## Bakit Hindi Sapat ang Keyword Search?

Sa Phase 6-7, nagse-SELECT tayo gamit ang `LIKE '%email%'`.
Pero may limitasyon ito:

```
User nagtype:  "summarize unread messages"
Database may:  "read my inbox"

LIKE search:   WALANG match — iba ang salita!
Vector search: MATCH! Magkaparehong kahulugan kahit iba ang salita.
```

**RAG = Retrieval-Augmented Generation:**
Bago mag-reason ang AI, kunin muna ang relevant na context mula sa memory.
Mas magaling ang AI kapag may context siya!

---

## Lesson 8.1 — Ano ang Vector? Ano ang Embedding?

### Ano ang gagawin?

Maunawaan ang konsepto ng vector embedding bago mag-code.

### Embedding = Text → Numbers

```
"summarize emails"     → [0.12, -0.34, 0.89, 0.01, ..., 0.56]  ← 1536 numbers!
"read my inbox"        → [0.11, -0.33, 0.91, 0.02, ..., 0.54]  ← Malapit ang values!
"schedule a meeting"   → [-0.45, 0.78, -0.23, 0.67, ..., -0.12] ← Malayo ang values!
```

### Bakit malapit ang values ng magkaparehong kahulugan?

Ang embedding model ay sinanay sa milyun-milyong text.
Natutunan niya na ang "email" at "inbox" ay magkaugnay.
Kaya ang kanilang vector values ay magkaparehong direksyon sa vector space.

```
Vector Space (imagine 2D lang para sa simplicity):

            ↑ (email-related)
            │
"emails" ●  │  ● "inbox"
"messages"● │
            │
────────────┼──────────────→ (calendar-related)
            │    ● "meeting"
            │    ● "schedule"
```

### Ano ang Cosine Similarity?

Kung gaano ka-"close" ang dalawang vectors:
- `1.0` = eksaktong parehong direksyon = parehong kahulugan
- `0.5` = medyo magkaparehong kahulugan
- `0.0` = walang relasyon
- `-1.0` = kabaligtaran ang kahulugan

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| Embedding | Pagsasalin ng text sa array ng numbers na kumakatawan sa kahulugan |
| Vector | Listahan ng mga numbers (e.g. 1536 numbers) |
| Vector space | Mathematical space kung saan ang magkaparehong kahulugan ay magkalapit |
| Cosine similarity | Measure kung gaano ka-close ang dalawang vectors (0.0 hanggang 1.0) |
| RAG | Retrieval-Augmented Generation — mag-retrieve ng context bago mag-reason ang AI |

### 📝 Git Commit pagkatapos ng Lesson 8.1:

```bash
git commit --allow-empty -m "chore: understand vector embeddings and RAG concepts for Phase 8"
```

---

## Lesson 8.2 — pgvector Extension Setup

### Ano ang gagawin?

I-enable ang pgvector extension sa PostgreSQL at gumawa ng memory_items table
na may embedding column.

### I-enable ang pgvector sa PostgreSQL:

```sql
-- Sa psql, i-run ito:
CREATE EXTENSION IF NOT EXISTS vector;

-- I-verify na naka-install
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### Gumawa ng memory_items table:

```sql
CREATE TABLE memory_items (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,          -- Ang actual na text na matututo
  source TEXT NOT NULL,           -- Galing saan (hal. 'run_output', 'user_feedback')
  embedding vector(1536),         -- Ang vector representation ng content
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### I-update ang `src/platform/schema.ts`:

```ts
import { pgTable, text, timestamp, customType } from "drizzle-orm/pg-core";

// Custom type para sa pgvector — hindi built-in sa Drizzle
const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(1536)"; // 1536 dimensions para sa text-embedding-004
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`; // Convert array to PostgreSQL vector format
  },
  fromDriver(value: string): number[] {
    return value.slice(1, -1).split(",").map(Number); // Parse back from DB
  },
});

export const memoryItems = pgTable("memory_items", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  source: text("source").notNull(),
  embedding: vector("embedding"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### I-run ang migration:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `pgvector` | PostgreSQL extension para sa vector similarity search |
| `vector(1536)` | Column type na nag-iingat ng 1536-dimensional vector |
| `customType` | Drizzle feature para mag-define ng custom column types |
| `memory_items` | Table na nag-iingat ng natutunan ng AutoDo mula sa mga runs |

### 📝 Git Commit pagkatapos ng Lesson 8.2:

```bash
git add src/platform/schema.ts src/platform/migrations/
git commit -m "feat(phase-8): enable pgvector extension and add memory_items table with embedding column"
```

---

## Lesson 8.3 — Gumawa ng Embedding mula sa Text

### Ano ang gagawin?

Gumawa ng function na nag-co-convert ng text sa embedding vector gamit ang Gemini API.

### Gumawa ng `src/platform/embeddings.ts`:

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Ang embedding model — text-embedding-004 ang pinaka-modern na Gemini embedding model
const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

// I-convert ang text sa vector
// Input: string
// Output: number[] (1536 numbers)
export async function embedText(text: string): Promise<number[]> {
  console.log("[Server] 🧬 Generating embedding for:", text.substring(0, 50) + "...");

  const result = await embeddingModel.embedContent(text);
  const embedding = result.embedding.values;

  console.log("[Server] 🧬 Embedding generated:", embedding.length, "dimensions");

  return embedding;
}
```

### Subukan — Gumawa ng memory item:

```ts
// Sa route handler o test script
import { embedText } from "../../platform/embeddings";
import { db } from "../../platform/db";
import { memoryItems } from "../../platform/schema";

const content = "User prefers email summaries in the morning";
const embedding = await embedText(content);

await db.insert(memoryItems).values({
  id: `mem_${Date.now()}`,
  content,
  source: "user_preference",
  embedding,
});
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `text-embedding-004` | Gemini's latest embedding model — 1536 dimensions |
| `embedContent(text)` | Nag-co-convert ng text sa embedding vector |
| `result.embedding.values` | Ang actual na array ng numbers |
| Embedding pipeline | text → Gemini API → vector → store sa database |

### 📝 Git Commit pagkatapos ng Lesson 8.3:

```bash
git add src/platform/embeddings.ts
git commit -m "feat(phase-8): create embedText function using Gemini text-embedding-004"
```

---

## Lesson 8.4 — HNSW Index para sa Mabilis na Search

### Bakit Kailangan ng Index?

```
Walang index: Mag-compare ng query vector sa BAWAT row = mabagal (O(n))
May HNSW index: Mag-navigate lang sa relevant area ng vector space = mabilis (O(log n))
```

HNSW = Hierarchical Navigable Small World
Parang network ng shortcuts sa vector space para mabilis mahanap ang pinaka-malapit.

### I-run sa `psql`:

```sql
-- Gumawa ng HNSW index sa embedding column
-- vector_cosine_ops = gagamitin ang cosine similarity para sa search
CREATE INDEX ON memory_items USING hnsw (embedding vector_cosine_ops);
```

### I-update ang schema para may index:

```ts
import { pgTable, text, timestamp, customType, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Sa loob ng memoryItems pgTable definition, dagdagan ng:
// (pagkatapos ng columns definition)
export const memoryItemsHnswIndex = sql`
  CREATE INDEX IF NOT EXISTS memory_items_embedding_idx
  ON memory_items
  USING hnsw (embedding vector_cosine_ops)
`;
```

### I-run ang migration ulit:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| HNSW | Hierarchical Navigable Small World — efficient approximate nearest neighbor index |
| `vector_cosine_ops` | Cosine similarity ang gagamitin para sa distance calculation |
| Index | Nagpapabilis ng query — katulad ng index sa likod ng libro |
| Approximate nearest neighbor | Hindi 100% exact pero 99%+ tama at 100x mas mabilis |

### 📝 Git Commit pagkatapos ng Lesson 8.4:

```bash
git add src/platform/schema.ts src/platform/migrations/
git commit -m "feat(phase-8): add HNSW index on memory_items embedding for fast similarity search"
```

---

## Lesson 8.5 — Semantic Similarity Search

### Ano ang gagawin?

Gumawa ng function na nag-se-search ng memory items base sa semantic similarity.

### Gumawa ng `src/modules/memory/retrieve.ts`:

```ts
import { pool } from "../../platform/db";
import { embedText } from "../../platform/embeddings";

// Ang output type ng memory retrieval
export interface RetrievedMemory {
  readonly id: string;
  readonly content: string;
  readonly source: string;
  readonly similarity: number; // 0.0 hanggang 1.0
}

// Layer 4: Memory Retrieval — pure async function
// Input: ang prompt ng user
// Output: top-K pinaka-relevant na memories
export async function retrieveMemory(
  prompt: string,
  topK: number = 5,
): Promise<RetrievedMemory[]> {
  // 1. I-embed ang prompt ng user
  const queryEmbedding = await embedText(prompt);
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  // 2. Mag-query ng pinaka-similar na items gamit ang cosine distance
  // `<=>` operator = cosine distance sa pgvector
  // 1 - cosine_distance = cosine similarity
  const result = await pool.query<{
    id: string;
    content: string;
    source: string;
    similarity: number;
  }>(
    `SELECT
      id,
      content,
      source,
      1 - (embedding <=> $1::vector) AS similarity
    FROM memory_items
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> $1::vector
    LIMIT $2`,
    [embeddingStr, topK]
  );

  // Structured Logging para sa DevTools (F12) at Terminal (Emerald #34d399)
  console.log(
    `%c[AutoDo 🧠] [Layer 4: Memory Retrieval] Retrieved ${result.rows.length} items for: "${prompt.substring(0, 30)}..."`,
    "color: #34d399; font-weight: bold;"
  );

  return result.rows;
}
```

### Subukan:

1. Mag-insert ng ilang memory items (Lesson 8.3)
2. I-call ang `retrieveMemory("summarize my emails")`
3. Makikita ang top-5 na pinaka-relevant na memories

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `<=>` operator | pgvector cosine distance operator |
| `1 - (embedding <=> $1)` | Cosine similarity (1 = identical, 0 = unrelated) |
| `$1::vector` | Cast ang string sa vector type sa PostgreSQL |
| Top-K retrieval | Ibalik lang ang pinaka-relevant na K items |
| Layer 4 color | `#34d399` emerald green para sa Memory Retrieval logs |

### 📝 Git Commit pagkatapos ng Lesson 8.5:

```bash
git add src/modules/memory/retrieve.ts
git commit -m "feat(phase-8): implement semantic similarity search with cosine distance query"
```

---

## Lesson 8.6 — Reranker — I-filter ang Best Results

### Bakit Kailangan ng Reranker?

```
Vector search: "top 5 by similarity"  ← hindi palaging top 5 ang pinaka-useful
Reranker: "from top 10, which 3 are ACTUALLY most relevant?" ← mas tumpak!

Example:
Query: "summarize my urgent emails"
Vector top 5:
  1. "email summary approach" — high similarity pero too generic
  2. "urgent task management" — may "urgent" pero hindi email
  3. "inbox zero strategy" — relevant!
  4. "email tools" — too vague
  5. "daily email routine" — relevant!

Reranker output: items 3 and 5 ang pinaka-relevant talaga
```

### I-update ang `src/modules/memory/retrieve.ts`:

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Reranker — second pass filter gamit ang AI
// Input: ang query at candidate memories
// Output: pinaka-relevant na memories, sorted
export async function rerank(
  query: string,
  candidates: RetrievedMemory[],
  topK: number = 3,
): Promise<RetrievedMemory[]> {
  if (candidates.length === 0) return [];

  const candidateList = candidates
    .map((c, i) => `${i + 1}. ${c.content}`)
    .join("\n");

  const prompt = `
    Query: "${query}"

    Rank these memory items by relevance (most relevant first).
    Return ONLY a JSON array of indices (1-based), e.g. [3, 1, 5]

    Items:
    ${candidateList}
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();

  // I-parse ang ranking
  const indices = JSON.parse(responseText) as number[];
  const topIndices = indices.slice(0, topK);

  // I-return ang reranked na items
  return topIndices
    .map((i) => candidates[i - 1])
    .filter(Boolean);
}
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| Reranker | Second-pass filter na nag-a-assess ng actual relevance ng candidates |
| Two-stage retrieval | Stage 1: vector search (fast, approximate) → Stage 2: reranker (slow, precise) |
| Cross-encoder | Nag-a-assess ng query + candidate SABAY — mas accurate kaysa vector-only |
| Retrieval quality | Ang goal ay hindi lang "similar" kundi "actually useful" |

### 📝 Git Commit pagkatapos ng Lesson 8.6:

```bash
git add src/modules/memory/retrieve.ts
git commit -m "feat(phase-8): add AI reranker to filter retrieved memory by relevance"
```

---

## Lesson 8.7 — I-connect sa AutoDo Pipeline (Layer 4)

### Ano ang gagawin?

I-dagdag ang memory retrieval sa Route Handler — sa pagitan ng Layer 2 at Layer 5.

### I-update ang `src/app/api/cue/route.ts`:

```ts
import { retrieveMemory, rerank } from "../../modules/memory/retrieve";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { rawPrompt } = body;

  // Layer 1: Input / Cue
  const cue = createCueEvent(rawPrompt, "chat");

  // Layer 2: Perception / Parsing
  const command = parseCommand(cue);

  // Layer 4: Memory Retrieval (bagong layer!)
  const rawMemories = await retrieveMemory(command.normalizedPrompt, 10);
  const memories = await rerank(command.normalizedPrompt, rawMemories, 3);

  // Layer 5: AI Reasoning (may memory context na!)
  const aiOutput = await reasonWithAI({
    prompt: command.normalizedPrompt,
    intent: command.intent,
    relevantMemory: memories.map((m) => m.content), // Context para sa AI!
  });

  // I-save sa database
  await db.insert(runs).values({
    id: cue.cueId,
    rawPrompt: command.normalizedPrompt,
    intent: command.intent,
  });

  return NextResponse.json({
    cueId: cue.cueId,
    intent: command.intent,
    memoriesRetrieved: memories.length,
    memories: memories.map((m) => m.content),
    aiSummary: aiOutput.summary,
  });
}
```

### I-update ang `page.tsx` para ipakita ang memories:

```tsx
{response?.memories && response.memories.length > 0 && (
  <div className="rounded-lg border border-emerald-900 bg-emerald-950/20 p-4 font-mono text-xs space-y-1">
    <p className="text-emerald-400 font-bold mb-2">🧠 Layer 4: Memory Retrieved ({response.memoriesRetrieved} items):</p>
    {response.memories.map((mem: string, i: number) => (
      <p key={i} className="text-emerald-300">• {mem}</p>
    ))}
  </div>
)}
```

### Subukan:

1. Mag-insert ng ilang memory items sa database (mula Lesson 8.3)
2. Mag-submit ng prompt na related sa mga memories
3. Makikita sa UI ang "🧠 Layer 4: Memory Retrieved"
4. Sa F12 Console: emerald green Layer 4 log!

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| Layer 4 position | Memory Retrieval ay nasa pagitan ng Context Build at AI Reasoning |
| Context augmentation | Ang retrieved memories ay nagiging context ng AI — mas magaling ang response |
| Layer 4 color | `#34d399` emerald green — visible sa F12 Console |
| `modules/memory/` | Memory ay sariling module — hindi nakalagay sa platform/ |

### 📝 Git Commit pagkatapos ng Lesson 8.7:

```bash
git add src/app/api/cue/route.ts src/app/app-v2/page.tsx
git commit -m "feat(phase-8): connect Layer 4 memory retrieval to AutoDo pipeline with UI display"
```

---

## Phase 8 Completion Test

### Kailan ito gagawin?

Gawin pagkatapos matapos at ma-commit ang Lessons 8.1 hanggang 8.7. Kailangan ay running ang
PostgreSQL na may pgvector, valid ang local Gemini configuration, at mayroon nang ilang
**fictional demo memory items** mula sa Lesson 8.3.

```text
Safe query text
      │ embedText()
      ▼
Query vector ──► pgvector + HNSW ──► top candidates
                                           │
                                           ▼
                                      AI reranker
                                           │
                                           ▼
                              Layer 4 memories sa UI
```

### 1. Automated validation

Sa project root, i-run:

```bash
npm run lint
npx tsc --noEmit
npx drizzle-kit migrate
```

**EXPECTED (guide lamang):** Walang ESLint o TypeScript error at successful ang migration.
**ACTUAL (OBSERVED):** Ang sariling terminal output mo ang evidence; huwag i-report ang expected
example bilang actual result.

### 2. Database at migration artifacts

Tingnan muna ang generated migration:

```bash
rg -n "memory_items|vector|hnsw|vector_cosine_ops" src/platform/migrations
```

Pagkatapos, kumonekta sa `autodo_dev` gamit ang parehong `psql` method mula Phase 6 at i-run:

```sql
SELECT extname
FROM pg_extension
WHERE extname = 'vector';

SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'memory_items';

SELECT id, content, source, vector_dims(embedding) AS dimensions
FROM memory_items
ORDER BY created_at DESC
LIMIT 5;
```

**EXPECTED:**

- Isang `vector` extension row
- May index definition na gumagamit ng `hnsw` at `vector_cosine_ops`
- Demo memory rows na may dimension na tugma sa `vector(1536)` schema

Huwag i-`SELECT` o i-paste ang buong embedding array; sapat ang `vector_dims(...)`.

### 3. Safe runtime retrieval test

Kung kailangan pa ng demo data, gamitin ang insertion flow sa Lesson 8.3 at fictional content
lamang, halimbawa:

```text
Demo preference: summarize project updates in the morning
Demo note: calendar reviews happen on Friday
```

1. Terminal A: i-run ang `npm run dev`.
2. Sa `/app-v2`, i-submit ang: `summarize my morning project updates`.
3. Tingnan ang Developer UI at ang terminal kung saan running ang Next.js.

**EXPECTED (OBSERVED kapag successful ang sariling run):**

- Terminal: `[Server] 🧬 Generating embedding ...`
- Terminal: `[Server] 🧬 Embedding generated: ... dimensions`
- Terminal: `[AutoDo 🧠] [Layer 4: Memory Retrieval] Retrieved ... items ...`
- UI/API artifact: `memoriesRetrieved` ay hanggang `3` pagkatapos ng reranker at may
  `memories` list
- Ang morning-project demo memory ay dapat relevant; hindi required ang eksaktong ranking
  dahil AI reranker ang second stage

Sa current Route Handler flow, server-side ang retrieval. Kaya ang Layer 4 log ay karaniwang
makikita sa **Next.js terminal**, hindi sa browser F12 Console. Ang kawalan nito sa F12 lamang
ay hindi failure.

I-record ang tunay na result:

```text
ACTUAL extension/index result: _____________________
ACTUAL embedding dimensions: _______________________
ACTUAL memoriesRetrieved: __________________________
ACTUAL retrieved demo content/order: ______________
```

### 4. Failure indicators

Stop at i-review ang relevant lesson kapag may alinman dito:

- PostgreSQL: `extension "vector" is not available`
- `memory_items` table o HNSW index ay missing
- Vector dimension mismatch habang nag-i-insert
- Gemini authentication/model/API error habang nag-e-embed o nagre-rerank
- Reranker response ay hindi valid JSON array at nag-fail ang `JSON.parse`
- Route returns `500`, walang memories sa seeded relevant query, o walang database rows
- Lint o TypeScript import/type error

### 5. Ano ang puwedeng ipakita sa mentor?

- Lint, TypeScript, at migration output
- Sanitized extension/index query result
- `vector_dims(...)` output, hindi ang vector values
- Terminal Layer 4 logs at UI memory card
- Sanitized response fields: `memoriesRetrieved`, fictional `memories`, at `aiSummary`

Huwag ipakita ang `GEMINI_API_KEY`, `.env.local`, `DATABASE_URL`, credentials, personal memory,
real emails, o buong embedding. Gumamit lamang ng fictional demo text at palitan ng
`[REDACTED]` ang sensitive values.

### 6. Exact commit verification

I-run ang bawat command. Dapat mag-print ng eksaktong subject; blank output = missing commit.

```bash
git log --format="%s" --all | grep -Fx "chore: understand vector embeddings and RAG concepts for Phase 8"
git log --format="%s" --all | grep -Fx "feat(phase-8): enable pgvector extension and add memory_items table with embedding column"
git log --format="%s" --all | grep -Fx "feat(phase-8): create embedText function using Gemini text-embedding-004"
git log --format="%s" --all | grep -Fx "feat(phase-8): add HNSW index on memory_items embedding for fast similarity search"
git log --format="%s" --all | grep -Fx "feat(phase-8): implement semantic similarity search with cosine distance query"
git log --format="%s" --all | grep -Fx "feat(phase-8): add AI reranker to filter retrieved memory by relevance"
git log --format="%s" --all | grep -Fx "feat(phase-8): connect Layer 4 memory retrieval to AutoDo pipeline with UI display"
```

**EXPECTED:** Pitong exact commit subjects ang lalabas. **ACTUAL:** Ang sariling `git log`
output ang progress evidence; huwag tumuloy sa Phase 9 kung may missing line.

---

## Summary ng Phase 8

| Lesson | Natututo | Commit |
|--------|----------|--------|
| 8.1 | Vector, embedding, cosine similarity, RAG concept | `chore: understand vector embeddings...` |
| 8.2 | pgvector extension, memory_items table, customType | `feat(phase-8): enable pgvector extension...` |
| 8.3 | embedText(), text-embedding-004, Gemini SDK | `feat(phase-8): create embedText function...` |
| 8.4 | HNSW index, approximate nearest neighbor | `feat(phase-8): add HNSW index...` |
| 8.5 | Cosine distance query, `<=>` operator, top-K retrieval | `feat(phase-8): implement semantic similarity search...` |
| 8.6 | Reranker, two-stage retrieval, cross-encoder | `feat(phase-8): add AI reranker...` |
| 8.7 | Connect Layer 4 to pipeline, UI display, emerald logs | `feat(phase-8): connect Layer 4 memory retrieval...` |

**Next:** [Phase 9 — Policy Layer (Safety)](./phase_9.md)
