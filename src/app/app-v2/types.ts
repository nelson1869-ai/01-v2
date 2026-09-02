// Saan nanggaling ang request ng user
// Union type — isa lang sa tatlong ito ang pwede
type CueSource = "chat" | "schedule" | "manual";

// Interface — nagde-describe ng object na may maraming properties
// Interface — nagde-describe ng object na may maraming properties
interface UnparsedCueEvent {
  readonly cueId: string; // Unique ID ng event — bawal baguhin!
  readonly source: CueSource; // Gamit ang type natin sa itaas!
  readonly rawPrompt: string; // Ang text na tinype ng user — huwag baguhin!
  readonly timestamp: string; // Kailan ito pumasok (ISO format) — permanente
}
