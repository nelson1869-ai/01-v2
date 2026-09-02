export interface AiReasoningRequest {
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  personaGuideline?: string;
  model?: string;
  temperature?: number;
}

export interface AiCandidateAction {
  id: string;
  tool: string;
  description: string;
  arguments: Record<string, unknown>;
  confidence: number;
  safetyRecommendation: "PROCEED_TO_POLICY" | "REQUIRE_HUMAN_REVIEW" | "BLOCK";
}

export interface AiProviderReasoningResult {
  provider: "gemini" | "nvidia" | "ollama" | "simulated";
  modelUsed: string;
  intent: string;
  reasoningSummary: string;
  replyDraft: string;
  meetingProposal?: {
    date: string;
    time: string;
    durationMinutes: number;
    summary: string;
  };
  candidateActions: AiCandidateAction[];
  confidence: number;
  durationMs: number;
}

export interface AiProviderAttempt {
  provider: "nvidia" | "gemini" | "ollama";
  model: string;
  status: "SKIPPED" | "FAILED" | "SUCCEEDED";
  durationMs: number;
  detail: string;
}

export interface AiSafetyEvaluation {
  provider: "nvidia-llama-guard" | "simulated";
  model: string;
  classification: "SAFE" | "UNSAFE";
  violatedCategories: string[];
  rawResponse: string;
  durationMs: number;
  fallbackReason?: string;
}

export interface AiReasoningResponse extends AiProviderReasoningResult {
  safetyEvaluation: AiSafetyEvaluation;
  providerAttempts: AiProviderAttempt[];
}

export function normalizeCandidateActions(
  rawActions: unknown,
  fallback: AiCandidateAction[],
): AiCandidateAction[] {
  if (!Array.isArray(rawActions) || rawActions.length === 0) {
    return fallback;
  }
  return rawActions.map((item, idx) => {
    const act = (
      typeof item === "object" && item !== null ? item : {}
    ) as Record<string, unknown>;
    const recommendation = act.safetyRecommendation;
    const validRecommendation:
      | "PROCEED_TO_POLICY"
      | "REQUIRE_HUMAN_REVIEW"
      | "BLOCK" =
      recommendation === "PROCEED_TO_POLICY" ||
      recommendation === "REQUIRE_HUMAN_REVIEW" ||
      recommendation === "BLOCK"
        ? recommendation
        : "REQUIRE_HUMAN_REVIEW";

    return {
      id: typeof act.id === "string" ? act.id : `act_${idx + 1}`,
      tool: typeof act.tool === "string" ? act.tool : "gmail.send_reply",
      description:
        typeof act.description === "string"
          ? act.description
          : "Execute proposed action",
      arguments:
        typeof act.arguments === "object" &&
        act.arguments !== null &&
        !Array.isArray(act.arguments)
          ? (act.arguments as Record<string, unknown>)
          : {},
      confidence:
        typeof act.confidence === "number" && Number.isFinite(act.confidence)
          ? Math.min(1, Math.max(0, act.confidence))
          : 0,
      safetyRecommendation: validRecommendation,
    };
  });
}
