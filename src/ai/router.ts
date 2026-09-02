import fs from "fs";
import path from "path";
import type {
  AiProviderAttempt,
  AiProviderReasoningResult,
  AiReasoningRequest,
  AiReasoningResponse,
} from "./contracts";
import { callGeminiReasoning } from "./gemini";
import {
  evaluateSafetyWithLlamaGuard,
  type SafetyEvaluationResult,
} from "./guard";
import { callNvidiaReasoning } from "./nvidia";
import { callOllamaReasoning } from "./ollama";

let cachedTriageRules: string | null = null;

function getTriageRules(): string {
  if (cachedTriageRules) return cachedTriageRules;
  try {
    const filePath = path.join(process.cwd(), "knowledge_base", "triage_rules.md");
    if (fs.existsSync(filePath)) {
      cachedTriageRules = fs.readFileSync(filePath, "utf8");
      return cachedTriageRules;
    }
  } catch (error) {
    console.warn("Could not read triage_rules.md:", error);
  }
  return "Nelson Fernandez persona: professional, concise, sign off as 'Best, Nelson'.";
}

function errorDetail(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown provider failure";
}

async function attemptProvider(
  attempts: AiProviderAttempt[],
  provider: AiProviderAttempt["provider"],
  model: string,
  configured: boolean,
  call: () => Promise<AiProviderReasoningResult>,
): Promise<AiProviderReasoningResult | null> {
  if (!configured) {
    attempts.push({
      provider,
      model,
      status: "SKIPPED",
      durationMs: 0,
      detail: "Provider is not configured",
    });
    return null;
  }

  const startedAt = Date.now();
  try {
    const result = await call();
    attempts.push({
      provider,
      model: result.modelUsed,
      status: "SUCCEEDED",
      durationMs: Date.now() - startedAt,
      detail: "Provider returned a reasoning artifact",
    });
    return result;
  } catch (error) {
    const detail = errorDetail(error);
    attempts.push({
      provider,
      model,
      status: "FAILED",
      durationMs: Date.now() - startedAt,
      detail,
    });
    console.warn(`${provider} (${model}) failed; trying fallback:`, error);
    return null;
  }
}

function completeResponse(
  result: AiProviderReasoningResult,
  safety: SafetyEvaluationResult,
  providerAttempts: AiProviderAttempt[],
): AiReasoningResponse {
  const candidateActions = safety.isSafe
    ? result.candidateActions
    : result.candidateActions.map((action) => ({
        ...action,
        safetyRecommendation: "REQUIRE_HUMAN_REVIEW" as const,
        description: `[SAFETY REVIEW RECOMMENDED] ${action.description}`,
      }));

  return {
    ...result,
    reasoningSummary: safety.isSafe
      ? result.reasoningSummary
      : `${result.reasoningSummary} Safety assessment flagged: ${safety.violatedCategories.join(", ") || "unspecified hazard"}.`,
    candidateActions,
    safetyEvaluation: {
      provider: safety.provider,
      model: safety.model,
      classification: safety.classification,
      violatedCategories: safety.violatedCategories,
      rawResponse: safety.rawResponse,
      durationMs: safety.durationMs,
      fallbackReason: safety.fallbackReason,
    },
    providerAttempts,
  };
}

export async function executeAiReasoning(
  request: AiReasoningRequest,
): Promise<AiReasoningResponse> {
  const enrichedRequest: AiReasoningRequest = {
    ...request,
    personaGuideline: request.personaGuideline || getTriageRules(),
  };

  const nvidiaApiKey = process.env.NVIDIA_API_KEY;
  const nvidiaBaseUrl =
    process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  const nvidiaModel =
    process.env.NVIDIA_MODEL || "deepseek-ai/deepseek-v4-pro-0813";
  const gptOss120bKey = process.env.NVIDIA_GPT_OSS_120B_KEY;
  const gptOss120bModel =
    process.env.NVIDIA_GPT_OSS_120B_MODEL || "openai/gpt-oss-120b";
  const gptOssKey = process.env.NVIDIA_GPT_OSS_KEY;
  const gptOssModel = process.env.NVIDIA_GPT_OSS_MODEL || "openai/gpt-oss-20b";
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiModel = request.model || "gemini-2.5-flash";
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL;
  const ollamaModel = request.model || "llama3.2";
  const hasKey = (value: string | undefined) =>
    Boolean(value && value.trim().length > 5);

  const safetyEvaluation = await evaluateSafetyWithLlamaGuard(
    enrichedRequest.body,
  );
  const providerAttempts: AiProviderAttempt[] = [];

  let result = await attemptProvider(
    providerAttempts,
    "nvidia",
    nvidiaModel,
    hasKey(nvidiaApiKey),
    () =>
      callNvidiaReasoning(
        enrichedRequest,
        nvidiaApiKey as string,
        nvidiaBaseUrl,
        nvidiaModel,
      ),
  );
  if (!result) {
    result = await attemptProvider(
      providerAttempts,
      "nvidia",
      gptOss120bModel,
      hasKey(gptOss120bKey),
      () =>
        callNvidiaReasoning(
          { ...enrichedRequest, model: gptOss120bModel },
          gptOss120bKey as string,
          nvidiaBaseUrl,
          gptOss120bModel,
        ),
    );
  }
  if (!result) {
    result = await attemptProvider(
      providerAttempts,
      "nvidia",
      gptOssModel,
      hasKey(gptOssKey),
      () =>
        callNvidiaReasoning(
          { ...enrichedRequest, model: gptOssModel },
          gptOssKey as string,
          nvidiaBaseUrl,
          gptOssModel,
        ),
    );
  }
  if (!result) {
    result = await attemptProvider(
      providerAttempts,
      "gemini",
      geminiModel,
      hasKey(geminiApiKey),
      () => callGeminiReasoning(enrichedRequest, geminiApiKey as string),
    );
  }
  if (!result) {
    result = await attemptProvider(
      providerAttempts,
      "ollama",
      ollamaModel,
      Boolean(ollamaBaseUrl),
      () => callOllamaReasoning(enrichedRequest, ollamaBaseUrl as string),
    );
  }

  if (result) {
    return completeResponse(result, safetyEvaluation, providerAttempts);
  }

  const startedAt = Date.now();
  const isMeeting = ["meet", "sync", "call", "schedule"].some((keyword) =>
    request.body.toLowerCase().includes(keyword),
  );
  const replyDraft = isMeeting
    ? `Hi ${request.senderName},\n\nThanks for reaching out! The proposed time works great on my calendar. I've placed a tentative hold so our slots remain reserved.\n\nLooking forward to connecting!\n\nBest,\nNelson`
    : `Hi ${request.senderName},\n\nThank you for the update regarding "${request.subject}". I have reviewed the details and will follow up if anything else is needed.\n\nBest,\nNelson`;

  return completeResponse(
    {
      provider: "simulated",
      modelUsed: "local deterministic synthesizer",
      intent: isMeeting
        ? "MEETING_SYNC_REQUEST"
        : "INBOUND_INFORMATION_ACK",
      reasoningSummary: `Deterministic fallback parsed the message from ${request.senderName} as ${isMeeting ? "calendar coordination" : "information acknowledgement"}.`,
      replyDraft,
      meetingProposal: isMeeting
        ? {
            date: "2026-05-28",
            time: "2:00 PM",
            durationMinutes: 30,
            summary: `Sync with ${request.senderName}`,
          }
        : undefined,
      candidateActions: [
        {
          id: "act_reply_1",
          tool: "gmail.send_reply",
          description: `Propose an email reply to ${request.senderName}`,
          arguments: {
            to: request.senderEmail,
            subject: `Re: ${request.subject}`,
          },
          confidence: 0.96,
          safetyRecommendation: safetyEvaluation.isSafe
            ? "PROCEED_TO_POLICY"
            : "REQUIRE_HUMAN_REVIEW",
        },
      ],
      confidence: 0.96,
      durationMs: Date.now() - startedAt,
    },
    safetyEvaluation,
    providerAttempts,
  );
}
