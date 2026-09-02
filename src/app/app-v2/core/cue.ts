// Nag-iimport ng types na ginawa natin sa types.ts
import type { CueSource, UnparsedCueEvent } from "../types";

// Layer 1: Input / Cue — Pure function
// Input: rawPrompt (string) + source (CueSource)
// Output: UnparsedCueEvent (structured, immutable)
export function createCueEvent(
  rawPrompt: string,
  source: CueSource = "chat",
): UnparsedCueEvent {
  const now = new Date();
  const randomSuffix = Math.random().toString(36).substring(2, 7);

  const cueId = `cue_${now.getTime()}_${randomSuffix}`;
  const traceId = `trc_${now.getTime()}_${randomSuffix}`;

  const event: UnparsedCueEvent = {
    cueId,
    source,
    rawPrompt: rawPrompt.trim(),
    timestamp: now.toISOString(),
  };

  // Structured Logging para sa DevTools (F12) at Terminal
  // %c = CSS styling, #818cf8 = indigo/purple na kulay
  console.log(
    `%c[AutoDo 🧠] [Layer 1: Input / Cue] Natanggap: "${event.rawPrompt}" (cueId: ${cueId})`,
    "color: #818cf8; font-weight: bold;",
  );

  return event;
}
