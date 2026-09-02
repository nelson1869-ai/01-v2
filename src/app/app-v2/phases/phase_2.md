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
