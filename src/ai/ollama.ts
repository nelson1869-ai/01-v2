import {
  type AiReasoningRequest,
  type AiProviderReasoningResult,
  normalizeCandidateActions,
} from "./contracts";

export async function callOllamaReasoning(
  req: AiReasoningRequest,
  baseUrl = "http://localhost:11434",
): Promise<AiProviderReasoningResult> {
  const startTime = Date.now();
  const modelName = req.model || "llama3.2";

  const prompt = `You are AutoDo Personal Assistant acting for Nelson Fernandez.
Read this email from ${req.senderName} (${req.senderEmail}) with subject "${req.subject}":
"${req.body}"

Respond in STRICT JSON with keys: intent, reasoningSummary, replyDraft, confidence.
Sign off as "Best, Nelson".`;

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelName,
      prompt,
      stream: false,
      format: "json",
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Ollama error HTTP ${response.status}`);
  }

  const data = await response.json();
  const rawText = (data.response as string) || "{}";
  const cleanedText = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  interface RawOllamaParsed {
    intent?: string;
    reasoningSummary?: string;
    replyDraft?: string;
    confidence?: number;
  }

  let parsed: RawOllamaParsed = {};
  try {
    parsed = JSON.parse(cleanedText) as RawOllamaParsed;
  } catch (parseError) {
    console.warn(
      "Failed to parse Ollama JSON output, using raw text:",
      parseError,
    );
    parsed = { replyDraft: rawText };
  }

  return {
    provider: "ollama",
    modelUsed: modelName,
    intent: parsed.intent || "INBOUND_EMAIL_REPLY",
    reasoningSummary:
      parsed.reasoningSummary || "Local Ollama model generated response.",
    replyDraft:
      parsed.replyDraft ||
      `Hi ${req.senderName},\n\nThanks for your note!\n\nBest,\nNelson`,
    candidateActions: normalizeCandidateActions(undefined, [
      {
        id: "act_1",
        tool: "gmail.send_reply",
        description: "Send autonomous email reply",
        arguments: { to: req.senderEmail, subject: `Re: ${req.subject}` },
        confidence:
          typeof parsed.confidence === "number" ? parsed.confidence : 0.9,
        safetyRecommendation: "REQUIRE_HUMAN_REVIEW",
      },
    ]),
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.9,
    durationMs: Date.now() - startTime,
  };
}
