// ==========================================
// LAYER 1: INPUT / CUE
// ==========================================

// Saan nanggaling ang request
type CueSource = "chat" | "schedule" | "manual";

// Raw na input — hindi pa na-process
interface UnparsedCueEvent {
  readonly cueId: string;
  readonly source: CueSource;
  readonly rawPrompt: string;
  readonly timestamp: string;
}

// ==========================================
// LAYER 2: PERCEPTION / PARSING
// ==========================================

// Naintindihang layunin ng user
type InferredIntent =
  | "email.summarize" // Gusto i-summarize ang emails
  | "email.reply" // Gusto mag-reply sa email
  | "calendar.schedule" // Gusto mag-book ng meeting
  | "chat.general"; // Normal na tanong

// Malinis na command pagkatapos ma-parse
interface CanonicalCommand {
  readonly commandId: string;
  readonly traceId: string; // Para ma-track sa logs
  readonly cueId: string; // Galing sa Layer 1
  readonly intent: InferredIntent; // Naintindihang layunin
  readonly requestedScope:
    | "read_only"
    | "write_email"
    | "write_calendar"
    | "general_chat";
  readonly normalizedPrompt: string;
  readonly timestamp: string;
}
