# Phase 2 — Ipakilala ang TypeScript

> **Layunin:** Matuto kung paano ginagamit ang TypeScript para maging ligtas at malinaw ang code.
> TypeScript ay nagdadagdag ng "rules" sa JavaScript para mapigilan ang mga bug bago pa man tumatakbo ang code.

> **Gabay sa Git:** May `git commit` sa dulo ng bawat lesson.

---

## Bakit Kailangan ng TypeScript?

Sa Phase 0 at 1, gumawa tayo ng working code — pero may panganib:

```tsx
// JavaScript (walang TypeScript) — pwedeng mag-crash sa runtime
function processPrompt(prompt) {
  console.log(prompt.text); // ERROR kapag walang .text property!
}

processPrompt("hello"); // Mag-crash ito!
```

Sa TypeScript, makikita mo ang error **sa VS Code mismo** — bago pa man i-run:

```tsx
// TypeScript — error agad sa VS Code
function processPrompt(prompt: string) {
  console.log(prompt); // Safe! Alam nating string ito
}
```

**Konklusyon:** TypeScript = mas mabilis na makita ang bugs = mas mabilis na mag-build.

---

## Lesson 2.1 — Type Alias at Union Types

### Ano ang type alias?

Isang paraan para pangalanan ang isang type para magamit ulit.

### Gumawa ng bagong file: `src/app/app-v2/types.ts`

```ts
// type alias — pangalan para sa isang uri ng value
type CueSource = "chat" | "schedule" | "manual";
//               ^^^^^^   ^^^^^^^^    ^^^^^^^^
//               Ito lang ang pwedeng values — union type
```

### Ano ang union type (`|`)?

Ang `|` ay nangangahulugang "o". Kaya `"chat" | "schedule" | "manual"` ay ibig sabihin:
- Pwede `"chat"`
- Pwede `"schedule"`
- Pwede `"manual"`
- HINDI pwede `"bluetooth"` o `"wifi"` o kahit anong iba

```ts
// Subukan mo ito sa types.ts:
type CueSource = "chat" | "schedule" | "manual";

// Ito ay VALID — nasa listahan
const source1: CueSource = "chat";     // ✅

// Ito ay ERROR sa VS Code agad!
const source2: CueSource = "bluetooth"; // ❌ Type '"bluetooth"' is not assignable
```

### I-type sa `src/app/app-v2/types.ts`:

```ts
// Saan nanggaling ang request ng user
// Union type — isa lang sa tatlong ito ang pwede
type CueSource = "chat" | "schedule" | "manual";
```

### Subukan:

1. Gumawa ng file na `types.ts`
2. I-type ang code sa itaas
3. Sa VS Code, tingnan kung may red underline kapag gumamit ka ng invalid value

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `type` keyword | Paraan para mag-define ng custom type |
| Union type (`\|`) | "O" — isa sa mga nakalista |
| Literal types (`"chat"`) | Exact na string value — hindi kahit anong string |
| Compile-time safety | Nakikita ang error sa VS Code bago pa man i-run |

### 📝 Git Commit:

```bash
git add src/app/app-v2/types.ts
git commit -m "feat(phase-2): add CueSource type alias with union literals"
```

---

## Lesson 2.2 — Interface at Object Types

### Ano ang interface?

Isang paraan para i-describe ang "hugis" o "shape" ng isang object — anong mga properties ang dapat mayroon.

### I-update ang `src/app/app-v2/types.ts`:

```ts
// Saan nanggaling ang request ng user
type CueSource = "chat" | "schedule" | "manual";

// Interface — nagde-describe ng object na may maraming properties
interface UnparsedCueEvent {
  cueId: string;      // Unique ID ng event
  source: CueSource;  // Gamit ang type natin sa itaas!
  rawPrompt: string;  // Ang text na tinype ng user
  timestamp: string;  // Kailan ito pumasok (ISO format)
}
```

### Subukan sa `types.ts`:

```ts
// Gumawa ng object na sumusunod sa interface
const event: UnparsedCueEvent = {
  cueId: "cue_001",
  source: "chat",
  rawPrompt: "summarize my emails",
  timestamp: new Date().toISOString(),
};

// Subukan — kulang ang property
const badEvent: UnparsedCueEvent = {
  cueId: "cue_002",
  source: "chat",
  // rawPrompt at timestamp ay kulang!
  // ERROR agad sa VS Code!
};
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `interface` | Nagde-describe ng "hugis" ng object |
| `property: Type` | Bawat property may pangalan at type |
| Required properties | Lahat ng nakalista ay required by default |
| Reusing types | Pwedeng gumamit ng ibang type (`CueSource`) bilang type ng property |

### 📝 Git Commit:

```bash
git add src/app/app-v2/types.ts
git commit -m "feat(phase-2): add UnparsedCueEvent interface with object shape"
```

---

## Lesson 2.3 — Readonly (Immutability)

### Bakit kailangan ng `readonly`?

Sa AutoDo, kapag pumasok na ang raw data mula sa labas (Layer 1), **bawal na itong baguhin** ng mga susunod na layers. Kung nagbago ito, hindi na tayo sigurado kung anong data ang orihinal.

```ts
// PROBLEMA: Pwedeng ma-mutate ang data
const event = { cueId: "cue_001", rawPrompt: "hello" };
event.rawPrompt = "hacked!"; // Walang pumipigil dito!

// SOLUSYON: readonly
interface UnparsedCueEvent {
  readonly cueId: string;      // Bawal baguhin pagkagawa
  readonly rawPrompt: string;  // Permanente na ito
}
```

### I-update ang `src/app/app-v2/types.ts` (final version ng Phase 2):

```ts
// Saan nanggaling ang request ng user
// Union type — isa lang sa tatlong ito ang pwede
type CueSource = "chat" | "schedule" | "manual";

// Interface ng raw na input mula sa labas
// readonly = bawal baguhin pagkagawa ng object
interface UnparsedCueEvent {
  readonly cueId: string;      // Unique ID (hal. 'cue_178829_abc')
  readonly source: CueSource;  // Saan nanggaling
  readonly rawPrompt: string;  // Raw text ng user — huwag baguhin!
  readonly timestamp: string;  // Kailan pumasok (ISO UTC)
}
```

### Subukan:

```ts
const event: UnparsedCueEvent = {
  cueId: "cue_001",
  source: "chat",
  rawPrompt: "hello",
  timestamp: new Date().toISOString(),
};

event.rawPrompt = "changed!"; // ❌ ERROR! Cannot assign to 'rawPrompt' because it is read-only
```

### Ano ang natutunan mo?

| Konsepto | Paliwanag |
|----------|-----------|
| `readonly` | Bawal baguhin ang property pagkatapos maitayo ang object |
| Immutability | Data ay hindi nagbabago — mas predictable at ligtas |
| Data integrity | Sigurado na ang raw input ay hindi na-corrupt ng ibang code |

### 📝 Git Commit:

```bash
git add src/app/app-v2/types.ts
git commit -m "feat(phase-2): add readonly modifiers for immutable CueEvent contract"
```

---

## Phase 2 Completion Test

Gawin lamang ito pagkatapos ma-complete at ma-commit ang Lessons 2.1–2.3.

### 1. Automated validation

Sa project root, i-run:

```bash
npm run lint && npx tsc --noEmit
```

Expected:

- Walang ESLint error.
- Walang TypeScript error.
- Karaniwang walang output ang `npx tsc --noEmit` kapag successful.
- Kapag may warning o error, i-copy ang exact output at ipakita sa mentor.

### 2. Check the final TypeScript contract

Sa `types.ts`, i-check na:

- `CueSource` ay tumatanggap lamang ng `"chat"`, `"schedule"`, o `"manual"`.
- Kumpleto ang apat na required properties ng `UnparsedCueEvent`.
- Lahat ng properties ng `UnparsedCueEvent` ay may `readonly`.

Safe values para sa pag-check:

```text
source: "chat"
rawPrompt: "summarize my test emails"
```

Huwag iwan o i-commit ang invalid practice examples mula sa lessons.

Expected learning flow:

```text
types.ts contract
       │
       ▼
TypeScript checks shape
       │
       ├── valid value: accepted
       └── invalid value: editor/compiler error
       │
       ▼
No runtime UI change
```

### 3. Understand the expected output

Ang Phase 2 ay compile-time protection, kaya ito ang dapat mong **OBSERVE**:

- Successful ang `npm run lint && npx tsc --noEmit`.
- Walang bagong required F12 log mula sa `types.ts`.
- Walang bagong UI output; ang final Phase 1 page ay maaari pa ring lumabas sa browser.
- Kapag pansamantalang gumamit ng `"bluetooth"` bilang value ng isang `CueSource` variable, dapat magpakita ang editor ng type error. I-undo agad ito at huwag i-commit.
- Kapag pansamantalang sinubukang baguhin ang `readonly` property ng isang `UnparsedCueEvent`, dapat magpakita ang editor ng read-only error. I-undo agad ito at huwag i-commit.

Ang mga error description sa itaas ay expected guide; ang compiler/editor result na talagang lumabas sa machine mo ang actual **OBSERVED output**.

### 4. Ipakita ang output sa mentor

Kapag magre-review gamit ang `d`, puwedeng i-paste o ipakita ang:

1. Output ng `npm run lint && npx tsc --noEmit`.
2. Screenshot ng `types.ts` na may final valid contract.
3. Screenshot o exact text ng TypeScript error mula sa temporary invalid check.
4. Exact validation error kung hindi pumasa.

Gumamit lamang ng fake IDs at safe sample prompts. Huwag maglagay ng tunay na email content, secrets, tokens, o personal data sa examples.

### 5. Failure indicators

- May ESLint o TypeScript error sa final code.
- Tinatanggap ng `CueSource` ang value na wala sa tatlong allowed literals.
- Puwedeng baguhin ang properties dahil may nawawalang `readonly`.
- Naiwan sa `types.ts` ang intentionally invalid practice code.

### 6. Verify the lesson commits

```bash
git log --oneline
```

Expected: makikita ang exact commit message ng bawat lesson:

```text
feat(phase-2): add CueSource type alias with union literals
feat(phase-2): add UnparsedCueEvent interface with object shape
feat(phase-2): add readonly modifiers for immutable CueEvent contract
```

Kapag may nawawalang required commit, huwag munang pumunta sa Phase 3.

---

## Summary ng Phase 2

| Lesson | Natututo | Commit |
|--------|----------|--------|
| 2.1 | Type alias, union types, literal types | `feat(phase-2): add CueSource type alias with union literals` |
| 2.2 | Interface, object shape, required properties | `feat(phase-2): add UnparsedCueEvent interface with object shape` |
| 2.3 | Readonly, immutability, data integrity | `feat(phase-2): add readonly modifiers for immutable CueEvent contract` |

**Ang `types.ts` mo pagkatapos ng Phase 2:**
```ts
type CueSource = "chat" | "schedule" | "manual";

interface UnparsedCueEvent {
  readonly cueId: string;
  readonly source: CueSource;
  readonly rawPrompt: string;
  readonly timestamp: string;
}
```

**Next:** [Phase 3 — Pipeline Functions](./phase_3.md)
