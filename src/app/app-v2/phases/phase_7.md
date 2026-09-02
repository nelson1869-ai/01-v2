# Phase 7 — Drizzle ORM

> **Layunin:** Matutunan kung paano gamitin ang Drizzle ORM para maging type-safe ang lahat ng
> database queries. Hindi na raw SQL — TypeScript na ang magpo-produce ng SQL para sa atin.

> **Gabay sa Git:** May `git commit` sa dulo ng bawat lesson.

---

## Bakit Kailangan ng ORM Pagkatapos ng SQL?

Sa Phase 6, gumamit tayo ng raw SQL sa pg library:

```ts
// Phase 6 — Raw SQL (gumagana pero may problema)
const result = await pool.query("SELECT * FROM runs WHERE id = $1", [id]);
const run = result.rows[0]; // Type: any! Walang autocompletion!
run.intentTypo; // Walang error sa TypeScript — mag-crash sa runtime!
```

Sa Drizzle ORM:

```ts
// Phase 7 — Drizzle (type-safe!)
const run = await db.select().from(runs).where(eq(runs.id, id));
run[0].intentTypo; // ERROR sa VS Code agad! TypeScript caught it!
```

**Mental model:**

```
TypeScript code
      ↓ (Drizzle translates)
SQL query
      ↓ (pg executes)
PostgreSQL
```

---

## Lesson 7.1 — I-install ang Drizzle

### Ano ang gagawin?

I-install ang Drizzle ORM at Drizzle Kit (migration tool).

### I-install:

```bash
npm install drizzle-orm
npm install --save-dev drizzle-kit
```

### Ano ang bawat package?

```
drizzle-orm     → Ang ORM mismo — para sa queries
drizzle-kit     → Development tool — para sa schema at migrations
```

### Gumawa ng `drizzle.config.ts` sa root ng project:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Saan nandoon ang schema file
  schema: "./src/platform/schema.ts",

  // Saan ise-save ang migration files
  out: "./src/platform/migrations",

  // Anong database ang ginagamit
  dialect: "postgresql",

  // Connection string mula sa .env.local
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `drizzle-orm` | Ang ORM library — nag-ti-translate ng TypeScript sa SQL |
| `drizzle-kit` | Dev tool — nagge-generate ng migrations at nagma-manage ng schema |
| `drizzle.config.ts` | Configuration file — tinuturuan ang Drizzle kung saan ang schema at database |

### 📝 Git Commit pagkatapos ng Lesson 7.1:

```bash
git add package.json package-lock.json drizzle.config.ts
git commit -m "chore: install drizzle-orm and drizzle-kit with config"
```

---

## Lesson 7.2 — Schema Definition (Type-Safe Tables)

### Ano ang gagawin?

Gumawa ng `schema.ts` — ang TypeScript na description ng ating database tables.
Ito ang magiging **single source of truth** para sa database structure.

### Gumawa ng `src/platform/schema.ts`:

```ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// runs table — bawat request ay isang run
// Ang definition na ito ang ginagamit ni Drizzle para mag-generate ng SQL
export const runs = pgTable("runs", {
  // text() = TEXT column sa PostgreSQL
  // .primaryKey() = PRIMARY KEY constraint
  id: text("id").primaryKey(),

  // .notNull() = NOT NULL constraint
  rawPrompt: text("raw_prompt").notNull(),

  // Pangalan sa TypeScript (rawPrompt) ↔ Pangalan sa database (raw_prompt)
  intent: text("intent").notNull(),

  // .defaultNow() = DEFAULT NOW() — awtomatikong timestamp
  createdAt: timestamp("created_at").defaultNow(),
});

// commands table — ang parsed command ng bawat run
export const commands = pgTable("commands", {
  id: text("id").primaryKey(),
  runId: text("run_id").notNull(),        // run_id sa database
  intent: text("intent").notNull(),
  requestedScope: text("requested_scope").notNull(),
  normalizedPrompt: text("normalized_prompt").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Ano ang TypeScript type na nakukuha natin?

Awtomatikong nagde-derive ang Drizzle ng TypeScript types mula sa schema:

```ts
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { runs } from "./schema";

// Ang type ng isang row na nakuha mula sa database
type Run = InferSelectModel<typeof runs>;
// { id: string; rawPrompt: string; intent: string; createdAt: Date | null }

// Ang type ng data para mag-insert
type NewRun = InferInsertModel<typeof runs>;
// { id: string; rawPrompt: string; intent: string; createdAt?: Date | null }
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `pgTable("name", {...})` | Nag-de-define ng table — pangalan sa DB at columns |
| `text("column_name")` | TEXT column sa PostgreSQL |
| `timestamp("column_name")` | TIMESTAMPTZ column |
| `.primaryKey()`, `.notNull()` | Constraints — katulad ng `PRIMARY KEY` at `NOT NULL` sa SQL |
| camelCase ↔ snake_case | TypeScript uses camelCase (`rawPrompt`), DB uses snake_case (`raw_prompt`) |
| `InferSelectModel<T>` | Mapped type — automatic TypeScript type mula sa schema |

### 📝 Git Commit pagkatapos ng Lesson 7.2:

```bash
git add src/platform/schema.ts
git commit -m "feat(phase-7): define runs and commands schema with Drizzle pgTable"
```

---

## Lesson 7.3 — Migrations

### Ano ang gagawin?

Gumamit ng Drizzle Kit para mag-generate ng SQL migration files mula sa schema,
tapos i-apply ang migration sa database.

### Bakit Migrations?

```
Problema: Baguhin ang schema.ts — pero hindi pa nababago ang actual na database
Solusyon: Migration = version-controlled na SQL change

schema.ts change → generate migration → apply migration → database updated
```

### I-generate ang migration:

```bash
npx drizzle-kit generate
```

Lalabas ito:
```
src/platform/migrations/
  0000_create_runs_and_commands.sql   ← Ito ang generated SQL!
```

Tingnan ang generated SQL — **ito ang parehong SQL na sinulat natin sa Phase 6!**

```sql
CREATE TABLE IF NOT EXISTS "runs" (
  "id" text PRIMARY KEY NOT NULL,
  "raw_prompt" text NOT NULL,
  "intent" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);
...
```

### I-apply ang migration:

```bash
npx drizzle-kit migrate
```

### Ano ang mangyayari kapag baguhin ang schema?

```ts
// Halimbawa, dagdagan ng bagong column sa runs
export const runs = pgTable("runs", {
  id: text("id").primaryKey(),
  rawPrompt: text("raw_prompt").notNull(),
  intent: text("intent").notNull(),
  status: text("status").default("pending"),  // ← Bagong column!
  createdAt: timestamp("created_at").defaultNow(),
});
```

Tapos:
```bash
npx drizzle-kit generate  # Mag-ge-generate ng bagong migration (ALTER TABLE)
npx drizzle-kit migrate   # I-apply sa database
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| Migration | Version-controlled na database schema change |
| `drizzle-kit generate` | Nag-ge-generate ng SQL migration mula sa schema.ts changes |
| `drizzle-kit migrate` | Nag-a-apply ng pending migrations sa database |
| Migration file | Nakalagay ang actual na SQL na mag-a-alter ng database |
| Schema as source of truth | Ang schema.ts ang pinagsabatayan — doon nagmumula ang lahat |

### 📝 Git Commit pagkatapos ng Lesson 7.3:

```bash
git add src/platform/migrations/
git commit -m "feat(phase-7): generate and apply first Drizzle migration for runs and commands tables"
```

---

## Lesson 7.4 — Type-Safe Queries

### Ano ang gagawin?

Palitan ang raw pg queries ng Drizzle — para may TypeScript autocompletion at safety.

### I-setup ang Drizzle database connection: I-update ang `src/platform/db.ts`

```ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Raw pg pool — kailangan pa rin para sa Drizzle connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Drizzle instance — ito na ang gagamitin natin para sa queries
// Ipinasa ang schema para may type information ang Drizzle
const db = drizzle(pool, { schema });

export { db, pool };
```

### Drizzle CRUD Queries:

```ts
import { db } from "../../platform/db";
import { runs, commands } from "../../platform/schema";
import { eq, desc } from "drizzle-orm";

// INSERT — mag-dagdag ng bagong run
await db.insert(runs).values({
  id: cue.cueId,
  rawPrompt: command.normalizedPrompt,
  intent: command.intent,
});

// SELECT — kunin ang lahat ng runs
const allRuns = await db.select().from(runs);
// allRuns ay may type: { id: string; rawPrompt: string; intent: string; createdAt: Date | null }[]

// SELECT with WHERE — kunin ang isang specific na run
const specificRun = await db.select().from(runs).where(eq(runs.id, "run_001"));

// SELECT with ORDER BY at LIMIT
const recentRuns = await db
  .select()
  .from(runs)
  .orderBy(desc(runs.createdAt))
  .limit(5);

// UPDATE
await db
  .update(runs)
  .set({ intent: "chat.general" })
  .where(eq(runs.id, "run_001"));

// DELETE
await db.delete(runs).where(eq(runs.id, "run_001"));
```

### I-update ang Route Handler para gumamit ng Drizzle:

```ts
import { db } from "../../platform/db";
import { runs } from "../../platform/schema";

// Palitan ang pool.query() ng Drizzle query
await db.insert(runs).values({
  id: cue.cueId,
  rawPrompt: command.normalizedPrompt,
  intent: command.intent,
});
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `drizzle(pool, { schema })` | Gumawa ng Drizzle instance na connected sa database |
| `db.insert(table).values({})` | Type-safe INSERT |
| `db.select().from(table)` | Type-safe SELECT |
| `eq(column, value)` | Type-safe WHERE clause |
| `desc(column)` | Descending sort |
| TypeScript autocompletion | Lalabas ang column names sa VS Code — walang typo errors |

### 📝 Git Commit pagkatapos ng Lesson 7.4:

```bash
git add src/platform/db.ts src/app/api/cue/route.ts
git commit -m "feat(phase-7): replace raw pg queries with type-safe Drizzle queries in route handler"
```

---

## Lesson 7.5 — Relations (One-to-Many)

### Ano ang gagawin?

I-define ang relationship sa pagitan ng `runs` at `commands` tables sa Drizzle,
para pwedeng mag-query ng run kasama ang lahat ng commands nito.

### I-update ang `src/platform/schema.ts`:

```ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const runs = pgTable("runs", {
  id: text("id").primaryKey(),
  rawPrompt: text("raw_prompt").notNull(),
  intent: text("intent").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commands = pgTable("commands", {
  id: text("id").primaryKey(),
  runId: text("run_id").notNull(),
  intent: text("intent").notNull(),
  requestedScope: text("requested_scope").notNull(),
  normalizedPrompt: text("normalized_prompt").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// I-define ang one-to-many relation: isang run → maraming commands
export const runsRelations = relations(runs, ({ many }) => ({
  commands: many(commands), // Ang runs.commands = lahat ng commands ng run
}));

// Ang kabaligtaran: isang command → isang run
export const commandsRelations = relations(commands, ({ one }) => ({
  run: one(runs, {
    fields: [commands.runId],
    references: [runs.id],
  }),
}));
```

### Gamitin ang relation sa query:

```ts
// Kunin ang run kasama ang lahat ng commands nito
const runWithCommands = await db.query.runs.findFirst({
  where: eq(runs.id, "run_001"),
  with: {
    commands: true, // Kasama ang related commands!
  },
});
// runWithCommands.commands = array ng lahat ng commands ng run
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `relations()` | Nag-de-define ng relationship sa pagitan ng tables |
| `many(table)` | One-to-many — isang run → maraming commands |
| `one(table)` | Many-to-one — isang command → isang run |
| `findFirst({ with: {...} })` | Eager loading — kasama agad ang related records |
| Relational data | Data na may connection sa isa't isa — mas realistic na modelling |

### 📝 Git Commit pagkatapos ng Lesson 7.5:

```bash
git add src/platform/schema.ts
git commit -m "feat(phase-7): define Drizzle relations between runs and commands tables"
```

---

## Phase 7 Completion Test

### Kailan ito gagawin?

Gawin lamang ito pagkatapos matapos at ma-commit ang Lessons 7.1 hanggang 7.5. Dapat
running ang local PostgreSQL at tama ang `DATABASE_URL` sa `.env.local`.

```text
UI safe prompt
      │
      ▼
POST /api/cue
      │
      ▼
Drizzle typed INSERT ──► PostgreSQL `runs`
      │
      └── schema + migration + relation artifacts
```

### 1. Automated validation

Sa project root, i-run:

```bash
npm run lint
npx tsc --noEmit
npx drizzle-kit migrate
```

**EXPECTED (guide lamang):** Walang ESLint o TypeScript error. Ang migrate command ay
successful: ia-apply nito ang pending migration, o sasabihing wala nang pending migration.

**ACTUAL (OBSERVED):** Ang output mula sa sarili mong terminal ang tunay na evidence. Huwag
kopyahin ang expected text bilang result.

### 2. Tingnan ang generated artifacts

```bash
rg -n "CREATE TABLE|runs|commands" src/platform/migrations
rg -n "runsRelations|commandsRelations" src/platform/schema.ts
```

**EXPECTED:** May generated SQL migration para sa `runs` at `commands`, at parehong Drizzle
relation declarations ay makikita sa `schema.ts`. Hindi pa exposed sa UI ang relational
`findFirst({ with: ... })` example, kaya compilation ang check para sa relation definition sa
phase na ito.

### 3. Runtime at database check

1. Terminal A: i-run ang `npm run dev`.
2. Buksan ang `/app-v2` at i-submit ang safe test prompt: `hello how are you`.
3. Kumonekta sa `autodo_dev` gamit ang parehong `psql` method mula Phase 6.
4. I-run ang read-only query na ito:

```sql
SELECT id, raw_prompt, intent, created_at
FROM runs
WHERE raw_prompt = 'hello how are you'
ORDER BY created_at DESC
LIMIT 1;
```

**EXPECTED (OBSERVED kapag ikaw na ang nag-run):**

- Successful ang UI/API response at may bagong generated run ID.
- May isang database row na `raw_prompt = 'hello how are you'` at
  `intent = 'chat.general'`.
- Walang automatic SQL text log na required: hindi nag-enable ng Drizzle query logger ang
  phase na ito. Ang returned response at database row ang evidence.

Isulat ang sarili mong result pagkatapos mag-test:

```text
ACTUAL UI/API result: ______________________________
ACTUAL database row: _______________________________
ACTUAL migrate result: _____________________________
```

### 4. Failure indicators

Stop at i-review ang relevant lesson kapag may alinman dito:

- `Cannot find module 'drizzle-orm'` o `drizzle-kit` error
- TypeScript error sa schema, `db`, o Route Handler imports
- `DATABASE_URL` missing, authentication failure, o connection refused
- Migration conflict / table already exists error
- UI/API status `500`, o walang bagong row pagkatapos ng submit
- Nawawala ang migration SQL o relation declarations

### 5. Ano ang puwedeng ipakita sa mentor?

- Buong lint at TypeScript output
- `drizzle-kit migrate` result
- Sanitized UI/API response
- Result ng read-only `SELECT` sa itaas
- Migration filenames at relation search output

Huwag ipakita ang `.env.local`, `DATABASE_URL`, password, access token, o personal prompt/data.
Palitan ng `[REDACTED]` ang credentials bago mag-paste o mag-screenshot.

### 6. Exact commit verification

I-run ang bawat command. Dapat mag-print ng eksaktong subject; kapag blank ang output, missing
ang lesson commit.

```bash
git log --format="%s" --all | grep -Fx "chore: install drizzle-orm and drizzle-kit with config"
git log --format="%s" --all | grep -Fx "feat(phase-7): define runs and commands schema with Drizzle pgTable"
git log --format="%s" --all | grep -Fx "feat(phase-7): generate and apply first Drizzle migration for runs and commands tables"
git log --format="%s" --all | grep -Fx "feat(phase-7): replace raw pg queries with type-safe Drizzle queries in route handler"
git log --format="%s" --all | grep -Fx "feat(phase-7): define Drizzle relations between runs and commands tables"
```

**EXPECTED:** Limang exact commit subjects ang lalabas. **ACTUAL:** Ang sariling `git log`
output mo ang progress evidence; huwag tumuloy sa Phase 8 kung may blank/missing line.

---

## Summary ng Phase 7

| Lesson | Natututo | Commit |
|--------|----------|--------|
| 7.1 | drizzle-orm, drizzle-kit, drizzle.config.ts | `chore: install drizzle-orm and drizzle-kit` |
| 7.2 | pgTable, schema definition, mapped types, camelCase↔snake_case | `feat(phase-7): define runs and commands schema` |
| 7.3 | Migrations, generate, migrate, schema as source of truth | `feat(phase-7): generate and apply first Drizzle migration` |
| 7.4 | Type-safe CRUD queries, insert/select/update/delete, eq/desc | `feat(phase-7): replace raw pg with type-safe Drizzle queries` |
| 7.5 | Relations, one-to-many, eager loading, findFirst with | `feat(phase-7): define Drizzle relations between tables` |

**Next:** [Phase 8 — Memory + RAG (pgvector)](./phase_8.md)
