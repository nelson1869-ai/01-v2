// Saan nanggaling ang request ng user
// Union type — isa lang sa tatlong ito ang pwede
type CueSource = "chat" | "schedule" | "manual";

// Interface — nagde-describe ng object na may maraming properties
interface UnparsedCueEvent {
  cueId: string; // Unique ID ng event
  source: CueSource; // Gamit ang type natin sa itaas!
  rawPrompt: string; // Ang text na tinype ng user
  timestamp: string; // Kailan ito pumasok (ISO format)
}
