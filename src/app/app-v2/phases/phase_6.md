# Phase 6 — PostgreSQL + SQL

> **Layunin:** Matuto ng database fundamentals — ang paraan ng permanent na pag-iingat ng data.
> Bago gamitin ang ORM, kailangan munang maunawaan ang SQL itself.

> **Gabay sa Git:** May `git commit` sa dulo ng bawat lesson.

---

## Bakit Kailangan ng Database?

Sa Phase 1–5, lahat ng data ay nawawala kapag nag-refresh ka ng browser.
Kailangan ng database para:

```
Walang database:
Browser → Server → Response → TAPOS. Nawala ang data.

May database:
Browser → Server → Database (naka-save!) → Response
                   ↑
              Makikita ulit kahit mag-restart ang server
```

**Ang AutoDo ay kailangan ng database para:**
- Mag-imbak ng bawat run (cue → command → AI output)
- Mag-track ng history ng lahat ng actions
- Mag-store ng memory na matututunan ng AI sa susunod

---

## Lesson 6.1 — Ano ang Database? Tables, Rows, Columns

### Ano ang gagawin?

Maunawaan ang mental model ng relational database bago mag-type ng kahit anong code.

### Mental Model: Spreadsheet → Relational Table

```
SPREADSHEET                      DATABASE TABLE
─────────────                    ─────────────────────────────────
Sheet name = "runs"              Table name = "runs"
Column header = "id"             Column = "id" (TEXT, PRIMARY KEY)
Column header = "prompt"         Column = "raw_prompt" (TEXT)
Row 1 = data ng isang run        Row = isang run record
```

### Ang `runs` table ng AutoDo:

```
┌──────────────────┬────────────────────────┬─────────────────┬──────────────────────────┐
│ id               │ raw_prompt             │ intent          │ created_at               │
├──────────────────┼────────────────────────┼─────────────────┼──────────────────────────┤
│ run_001          │ summarize my emails    │ email.summarize │ 2026-09-03 00:00:00+00   │
│ run_002          │ schedule a meeting     │ calendar.schedule│ 2026-09-03 00:01:00+00  │
└──────────────────┴────────────────────────┴─────────────────┴──────────────────────────┘
```

### I-install ang PostgreSQL:

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql@16

# I-start ang PostgreSQL service
sudo service postgresql start   # Linux
brew services start postgresql  # macOS
```

### Kumonekta sa psql (PostgreSQL shell):

```bash
sudo -u postgres psql   # Linux
psql postgres           # macOS
```

Makikita mo ang prompt na:
```
postgres=#
```

Ikaw ay nasa loob na ng PostgreSQL! Type `\q` para lumabas.

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| Database | Sistemang nag-iingat ng structured data nang permanent |
| Table | Parang spreadsheet sheet — may pangalan, columns, rows |
| Row | Isang record — isang run, isang command, isang user |
| Column | Isang property — id, prompt, intent, timestamp |
| `psql` | PostgreSQL command-line tool para mag-interact sa database |

### 📝 Git Commit pagkatapos ng Lesson 6.1:

```bash
# Walang code change pa — note lang sa README na naka-setup na ang PostgreSQL
git commit --allow-empty -m "chore: set up local PostgreSQL for AutoDo persistence"
```

---

## Lesson 6.2 — Unang SQL: CREATE TABLE, INSERT, SELECT

### Ano ang gagawin?

Gumawa ng unang table at mag-insert ng unang record gamit ang SQL.

### I-type sa `psql` prompt:

```sql
-- Gumawa ng database para sa AutoDo
CREATE DATABASE autodo_dev;

-- Kumonekta sa bagong database
\c autodo_dev

-- Gumawa ng runs table
CREATE TABLE runs (
  id TEXT PRIMARY KEY,           -- Unique identifier — walang dalawang run ang parehong id
  raw_prompt TEXT NOT NULL,      -- Hindi pwedeng walang prompt
  intent TEXT NOT NULL,          -- Hindi pwedeng walang intent
  created_at TIMESTAMPTZ DEFAULT NOW()  -- Awtomatikong may timestamp
);
```

### I-insert ang unang record:

```sql
-- Mag-insert ng isang run
INSERT INTO runs (id, raw_prompt, intent)
VALUES ('run_001', 'summarize my emails', 'email.summarize');

-- Makita ang lahat ng records
SELECT * FROM runs;
```

Output:
```
    id    |      raw_prompt       |     intent      │         created_at
----------+-----------------------+-----------------+----------------------------
 run_001  | summarize my emails   | email.summarize | 2026-09-03 00:00:00+00
```

### Subukan:

1. I-type ang `CREATE TABLE` sa `psql`
2. I-insert ang isang record
3. I-run ang `SELECT * FROM runs;`
4. Makita ang iyong data!

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `CREATE TABLE` | Gumawa ng bagong table na may columns |
| `PRIMARY KEY` | Unique identifier — walang dalawang row ang parehong value |
| `NOT NULL` | Constraint — bawal mag-insert ng walang value |
| `DEFAULT NOW()` | Awtomatikong lalagyan ng kasalukuyang timestamp |
| `INSERT INTO ... VALUES` | Nagdadagdag ng bagong row |
| `SELECT * FROM` | Nakikita ang lahat ng rows sa table |

### 📝 Git Commit pagkatapos ng Lesson 6.2:

```bash
# Gumawa ng SQL migration file
mkdir -p src/platform/migrations
cat > src/platform/migrations/001_create_runs.sql << 'SQL'
CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  raw_prompt TEXT NOT NULL,
  intent TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
SQL

git add src/platform/migrations/001_create_runs.sql
git commit -m "feat(phase-6): create runs table and first INSERT SELECT queries"
```

---

## Lesson 6.3 — WHERE, ORDER BY, LIMIT

### Ano ang gagawin?

Matuto ng mga filter at sort na commands para makita lang ang kailangan nating data.

### Mag-insert muna ng ilang records para may data:

```sql
INSERT INTO runs (id, raw_prompt, intent) VALUES
  ('run_002', 'schedule a meeting', 'calendar.schedule'),
  ('run_003', 'summarize unread emails', 'email.summarize'),
  ('run_004', 'what is on my calendar', 'calendar.query'),
  ('run_005', 'hello how are you', 'chat.general');
```

### WHERE — I-filter ang results:

```sql
-- Lahat ng email-related na runs
SELECT * FROM runs WHERE intent = 'email.summarize';

-- Runs na may salitang "email" sa prompt
SELECT * FROM runs WHERE raw_prompt LIKE '%email%';

-- Runs pagkatapos ng isang specific na oras
SELECT * FROM runs WHERE created_at > '2026-09-03';
```

### ORDER BY at LIMIT — Mag-sort at limitahan ang results:

```sql
-- Pinakabagong 3 runs
SELECT * FROM runs ORDER BY created_at DESC LIMIT 3;

-- Lahat ng runs, pinakamatanda muna
SELECT * FROM runs ORDER BY created_at ASC;
```

### Subukan:

1. Mag-insert ng 5 records
2. I-try ang bawat query sa itaas
3. Subukang baguhin ang `LIMIT 3` sa `LIMIT 1`

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `WHERE` | Nagfi-filter ng rows base sa condition |
| `LIKE '%text%'` | Pattern matching — `%` = kahit anong character |
| `ORDER BY ... DESC` | Sort mula pinakabago (descending) |
| `ORDER BY ... ASC` | Sort mula pinakamatanda (ascending) |
| `LIMIT N` | Ibalik lang ang N rows |

### 📝 Git Commit pagkatapos ng Lesson 6.3:

```bash
cat > src/platform/migrations/002_sample_data.sql << 'SQL'
-- Sample queries para sa learning
-- SELECT * FROM runs WHERE intent = 'email.summarize';
-- SELECT * FROM runs ORDER BY created_at DESC LIMIT 5;
SQL

git add src/platform/migrations/002_sample_data.sql
git commit -m "feat(phase-6): learn WHERE ORDER BY and LIMIT filter queries"
```

---

## Lesson 6.4 — Primary Keys, Foreign Keys, Constraints

### Ano ang gagawin?

Gumawa ng pangalawang table (`commands`) na may foreign key reference sa `runs` table.

### Bakit kailangan ng Foreign Key?

```
Problema: Pwedeng mag-insert ng command na walang parent run
Solution: Foreign key — kung walang run_id sa runs table, bawal mag-insert ng command
```

### I-type sa `psql`:

```sql
-- Gumawa ng commands table na may foreign key sa runs
CREATE TABLE commands (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES runs(id),  -- Foreign key!
  intent TEXT NOT NULL,
  requested_scope TEXT NOT NULL,
  normalized_prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Subukan ang constraint:

```sql
-- Ito ay mag-e-error! Walang run na may id = 'run_999'
INSERT INTO commands (id, run_id, intent, requested_scope, normalized_prompt)
VALUES ('cmd_001', 'run_999', 'email.summarize', 'read_only', 'summarize emails');

-- Ito ay OK — may existing run
INSERT INTO commands (id, run_id, intent, requested_scope, normalized_prompt)
VALUES ('cmd_001', 'run_001', 'email.summarize', 'read_only', 'summarize emails');
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `REFERENCES table(column)` | Foreign key — dapat nandoon ang value sa referenced table |
| Foreign key constraint | Nagpoprotekta ng data integrity — walang orphaned records |
| `UNIQUE` | Pwede ring gamitin para siguruhing unique ang isang column |
| Data integrity | Sigurado na consistent at valid ang lahat ng data |

### 📝 Git Commit pagkatapos ng Lesson 6.4:

```bash
cat > src/platform/migrations/003_create_commands.sql << 'SQL'
CREATE TABLE IF NOT EXISTS commands (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES runs(id),
  intent TEXT NOT NULL,
  requested_scope TEXT NOT NULL,
  normalized_prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
SQL

git add src/platform/migrations/003_create_commands.sql
git commit -m "feat(phase-6): add commands table with foreign key constraint to runs"
```

---

## Lesson 6.5 — JOINs — Pagsamahin ang Dalawang Tables

### Ano ang gagawin?

Matuto ng JOIN — ang paraan para makuha ang data mula sa dalawang tables nang sabay.

### Bakit kailangan ng JOIN?

```
runs table:     run_001, 'summarize emails', 'email.summarize'
commands table: cmd_001, run_001, 'email.summarize', 'read_only'

Gusto nating makita:  run_001 + cmd_001 sabay — kailangan ng JOIN
```

### INNER JOIN — data na nandoon sa PAREHONG tables:

```sql
-- Makita ang runs kasama ang kanilang commands
SELECT
  runs.id AS run_id,
  runs.raw_prompt,
  commands.id AS command_id,
  commands.intent,
  commands.requested_scope
FROM runs
INNER JOIN commands ON runs.id = commands.run_id;
```

### LEFT JOIN — lahat ng runs, kahit walang command:

```sql
-- Lahat ng runs, kasama ang command (kung mayroon)
SELECT
  runs.id AS run_id,
  runs.raw_prompt,
  commands.id AS command_id
FROM runs
LEFT JOIN commands ON runs.id = commands.run_id;
-- Runs na walang command ay lalabas pa rin, command columns ay NULL
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `JOIN ... ON` | Pinagsasama ang dalawang tables base sa matching column |
| `INNER JOIN` | Mga rows na nandoon sa PAREHONG tables |
| `LEFT JOIN` | Lahat ng rows mula sa LEFT table, kahit walang match |
| `table.column` | Pag-specify kung saang table ang column (para walang ambiguity) |
| `AS alias` | Pangalanan ang column para mas malinaw |

### 📝 Git Commit pagkatapos ng Lesson 6.5:

```bash
git commit --allow-empty -m "feat(phase-6): learn INNER JOIN and LEFT JOIN across runs and commands"
```

---

## Lesson 6.6 — Transactions — All or Nothing

### Bakit Kailangan ng Transaction?

```
Problema:
Step 1: INSERT sa runs → OK ✅
Step 2: INSERT sa commands → ERROR ❌ (server crash?)

Result: may run pero walang command — incomplete data!

Solusyon: Transaction — kung may error sa kahit isang step, i-rollback lahat
```

### I-type sa `psql`:

```sql
-- Simulan ang transaction
BEGIN;

  INSERT INTO runs (id, raw_prompt, intent)
  VALUES ('run_tx_001', 'test transaction', 'chat.general');

  INSERT INTO commands (id, run_id, intent, requested_scope, normalized_prompt)
  VALUES ('cmd_tx_001', 'run_tx_001', 'chat.general', 'general_chat', 'test transaction');

-- I-commit kapag lahat ay OK
COMMIT;

-- O i-rollback kung may problema:
-- ROLLBACK;
```

### Subukan ang rollback:

```sql
BEGIN;
  INSERT INTO runs (id, raw_prompt, intent)
  VALUES ('run_rollback', 'this will be cancelled', 'chat.general');

  SELECT * FROM runs WHERE id = 'run_rollback'; -- Makikita sa loob ng transaction

ROLLBACK; -- I-cancel ang lahat!

SELECT * FROM runs WHERE id = 'run_rollback'; -- Wala na! Na-rollback
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `BEGIN` | Simula ng transaction |
| `COMMIT` | I-save ang lahat ng changes — permanente na |
| `ROLLBACK` | I-cancel ang lahat ng changes sa transaction |
| Atomicity | Lahat o wala — hindi pwedeng partial na mag-succeed |
| Data consistency | Laging consistent ang database kahit may errors |

### 📝 Git Commit pagkatapos ng Lesson 6.6:

```bash
git commit --allow-empty -m "feat(phase-6): learn SQL transactions with BEGIN COMMIT and ROLLBACK"
```

---

## Lesson 6.7 — I-connect sa Next.js (pg library)

### Ano ang gagawin?

I-connect ang Next.js server sa PostgreSQL para mag-save ng runs sa bawat request.

### I-install ang pg library:

```bash
npm install pg
npm install --save-dev @types/pg
```

### Gumawa ng database connection: `src/platform/db.ts`

```ts
import { Pool } from "pg";

// Pool = nagtatago ng maraming connections para hindi mag-overload ang database
// Kukunin ang URL mula sa .env.local — hindi hardcoded ang credentials!
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// I-export para magamit sa ibang files
export { pool };
```

### I-dagdag sa `.env.local`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/autodo_dev
```

### I-update ang `src/app/api/cue/route.ts` para mag-save ng run:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createCueEvent } from "../../app-v2/core/cue";
import { parseCommand } from "../../app-v2/core/perception";
import { pool } from "../../platform/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { rawPrompt } = body;

  // Layer 1
  const cue = createCueEvent(rawPrompt, "chat");

  // Layer 2
  const command = parseCommand(cue);

  // 💾 I-save sa database!
  await pool.query(
    "INSERT INTO runs (id, raw_prompt, intent) VALUES ($1, $2, $3)",
    [cue.cueId, command.normalizedPrompt, command.intent]
  );

  console.log("[Server] 💾 Run saved to database:", cue.cueId);

  return NextResponse.json({
    cueId: cue.cueId,
    intent: command.intent,
    scope: command.requestedScope,
    persisted: true, // Naka-save na sa database!
  });
}
```

### Subukan:

1. I-submit ang isang prompt sa UI
2. Tingnan ang terminal — dapat may `[Server] 💾 Run saved`
3. Sa `psql`, i-run ang `SELECT * FROM runs;` — dapat nandoon ang bagong run!

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `Pool` | Connection pool — maraming concurrent connections sa database |
| `pool.query(sql, params)` | I-run ang SQL query mula sa Node.js |
| `$1, $2, $3` | Parameterized query — proteksyon laban sa SQL injection |
| `DATABASE_URL` | Connection string sa .env.local — hindi naka-commit sa git |
| `platform/` folder | Infrastructure layer — db, config, secrets, logging |

### 📝 Git Commit pagkatapos ng Lesson 6.7:

```bash
git add src/platform/db.ts src/app/api/cue/route.ts
git commit -m "feat(phase-6): connect Next.js to PostgreSQL with pg pool and insert run on submit"
```

---

## Phase 6 Completion Test

Gawin lamang ito pagkatapos ma-complete at ma-commit ang Lessons 6.1–6.7, tumatakbo ang local PostgreSQL, at na-create na ang `autodo_dev` database at mga tables.

### 1. Automated at setup validation

Sa project root, i-run:

```bash
npm run lint && npx tsc --noEmit
npm ls pg @types/pg
psql --version
rg --files src/platform/migrations
git check-ignore .env.local
git status --short -- .env.local
```

Expected:

- Walang ESLint o TypeScript error.
- Installed ang `pg` at `@types/pg`.
- Available ang `psql` command.
- Nakalista ang `001_create_runs.sql`, `002_sample_data.sql`, at `003_create_commands.sql`.
- Ignored at hindi staged/tracked ang `.env.local` na may `DATABASE_URL`.

Huwag i-print o i-paste ang `DATABASE_URL`; maaari itong may database username at password.

### 2. Test the Next.js → PostgreSQL flow

```bash
npm run dev
```

Buksan ang `/app-v2`, Chrome **F12 → Network**, at panatilihing bukas ang server terminal. I-submit ang safe synthetic prompt:

```text
phase 6 persistence test
```

Expected flow:

```text
Browser UI
   │  POST /api/cue
   ▼
Layer 1 → Layer 2
   │
   ▼
parameterized INSERT ($1, $2, $3)
   │
   ▼
PostgreSQL runs table
   │
   ▼
{ persisted: true } → Browser
```

Sa F12 Network, i-check na `200` ang `/api/cue` request at may `persisted: true` ang response.

### 3. Verify the OBSERVED database row

Kumonekta sa `autodo_dev` gamit ang working `psql` command mula sa Lesson 6.1. Sa `psql`, i-run:

```sql
SELECT id, raw_prompt, intent, created_at
FROM runs
WHERE raw_prompt = 'phase 6 persistence test'
ORDER BY created_at DESC
LIMIT 1;
```

Expected example lamang:

```text
id: cue_<dynamic>
raw_prompt: phase 6 persistence test
intent: chat.general
created_at: <dynamic database timestamp>
```

Ang row na talagang ibinalik ng iyong query ang **actual OBSERVED output**. Dynamic ang `id` at `created_at`; huwag ikumpara nang literal sa example.

Expected server evidence:

```text
[AutoDo 🧠] [Layer 1: Input / Cue] ...
[AutoDo 🧠] [Layer 2: Perception] ...
[Server] 💾 Run saved to database: cue_<dynamic>
POST /api/cue 200 ...
```

Para mapatunayan ang durability, ihinto at i-restart ang app, pagkatapos ulitin ang parehong `SELECT`. Dapat nandoon pa rin ang row.

### 4. Verify SQL relationships at transaction behavior

Sa `psql`, i-run ang safe checks na ito.

I-check ang LEFT JOIN para sa run na ginawa ng UI:

```sql
SELECT
  runs.id AS run_id,
  runs.raw_prompt,
  commands.id AS command_id
FROM runs
LEFT JOIN commands ON runs.id = commands.run_id
WHERE runs.raw_prompt = 'phase 6 persistence test'
ORDER BY runs.created_at DESC
LIMIT 1;
```

Expected: makikita ang run. Normal na `NULL` ang `command_id` dahil ang Lesson 6.7 Route Handler ay nag-i-insert lamang sa `runs` table.

I-check na gumagana ang foreign key constraint:

```sql
BEGIN;
INSERT INTO commands (id, run_id, intent, requested_scope, normalized_prompt)
VALUES (
  'cmd_phase6_fk_should_fail',
  'run_phase6_parent_does_not_exist',
  'chat.general',
  'general_chat',
  'safe foreign key test'
);
ROLLBACK;
```

Expected: ang `INSERT` ay dapat mag-fail dahil walang matching parent row. Pagkatapos ng error, i-run ang `ROLLBACK;` para linisin ang transaction state.

I-check ang rollback:

```sql
BEGIN;
INSERT INTO runs (id, raw_prompt, intent)
VALUES ('run_phase6_rollback_test', 'safe rollback test', 'chat.general');
ROLLBACK;

SELECT COUNT(*) AS rollback_row_count
FROM runs
WHERE id = 'run_phase6_rollback_test';
```

Expected: `rollback_row_count` ay `0`.

### 5. Ipakita ang logs/output sa mentor

Kapag magre-review gamit ang `d`, puwedeng i-paste o i-screenshot ang:

1. Lint, TypeScript, installed-package, migration-file, at gitignore check results.
2. Redacted `/api/cue` status at JSON response.
3. Server log na may `Run saved to database` at ang matching safe `SELECT` row.
4. Foreign-key error text, LEFT JOIN result, at `rollback_row_count`.
5. Exact connection or SQL error text kung may failure.

I-redact ang database URL, username, password, host details kung private, cookies, tokens, at personal prompts/data. Huwag gamitin ang tunay na email content sa test rows.

### 6. Failure indicators

- May lint/TypeScript error, missing package, o missing migration file.
- `connection refused`, authentication failure, o `database/relation does not exist` error.
- Non-`200` ang `/api/cue`, walang `persisted: true`, o walang save log.
- Sinasabi ng API na persisted pero walang matching row sa `SELECT`.
- Nawawala ang row pagkatapos i-restart ang app/PostgreSQL.
- Nag-succeed ang command na may nonexistent `run_id`; hindi gumagana ang foreign key constraint.
- Hindi `0` ang `rollback_row_count`; hindi gumana ang rollback test.
- Nakikita ang raw database password o `DATABASE_URL` sa logs/output.

### 7. Verify the exact lesson commits

```bash
git log --format='%s' --all
```

Hanapin ang eksaktong pitong lines na ito:

```text
chore: set up local PostgreSQL for AutoDo persistence
feat(phase-6): create runs table and first INSERT SELECT queries
feat(phase-6): learn WHERE ORDER BY and LIMIT filter queries
feat(phase-6): add commands table with foreign key constraint to runs
feat(phase-6): learn INNER JOIN and LEFT JOIN across runs and commands
feat(phase-6): learn SQL transactions with BEGIN COMMIT and ROLLBACK
feat(phase-6): connect Next.js to PostgreSQL with pg pool and insert run on submit
```

Kapag may kulang o iba ang spelling, huwag munang pumunta sa Phase 7.

---

## Summary ng Phase 6

| Lesson | Natututo | Commit |
|--------|----------|--------|
| 6.1 | Database mental model, tables/rows/columns, psql | `chore: set up local PostgreSQL...` |
| 6.2 | CREATE TABLE, INSERT, SELECT | `feat(phase-6): create runs table and first INSERT SELECT` |
| 6.3 | WHERE, ORDER BY, LIMIT | `feat(phase-6): learn WHERE ORDER BY and LIMIT` |
| 6.4 | PRIMARY KEY, FOREIGN KEY, constraints | `feat(phase-6): add commands table with foreign key` |
| 6.5 | INNER JOIN, LEFT JOIN | `feat(phase-6): learn INNER JOIN and LEFT JOIN` |
| 6.6 | Transactions, BEGIN, COMMIT, ROLLBACK | `feat(phase-6): learn SQL transactions` |
| 6.7 | pg library, Pool, parameterized queries, DATABASE_URL | `feat(phase-6): connect Next.js to PostgreSQL` |

**Next:** [Phase 7 — Drizzle ORM](./phase_7.md)
