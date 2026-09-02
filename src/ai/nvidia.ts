import {
  type AiCandidateAction,
  type AiProviderReasoningResult,
  type AiReasoningRequest,
  normalizeCandidateActions,
} from "./contracts";

export async function callNvidiaReasoning(
  req: AiReasoningRequest,
  apiKey: string,
  baseUrl = "https://integrate.api.nvidia.com/v1",
  defaultModel = "deepseek-ai/deepseek-v4-pro-0813",
): Promise<AiProviderReasoningResult> {
  const startTime = Date.now();
  const modelName = req.model || defaultModel;

  const systemInstruction = `You are AutoDo Personal Assistant acting on behalf of Nelson Fernandez.
Your role:
- Read incoming email messages from contacts.
- Follow Nelson's communication guidelines: professional, friendly, concise, closing with "Best,\\nNelson".
- Identify if the email is asking for a meeting, payroll inquiry, or general question.
- Propose concrete calendar slots if a meeting is requested (e.g. Thursday 2:00 PM).
- Output STRICT JSON matching the required schema. Do NOT include markdown code fences or backticks.`;

  const userPrompt = `Incoming Email:
From: ${req.senderName} <${req.senderEmail}>
Subject: ${req.subject}
Message Body:
${req.body}

Guidelines from Memory:
${req.personaGuideline || "Trusted contacts get polite automated replies. Sensitive financial/wire changes require human approval."}

Produce a JSON object with this exact structure:
{
  "intent": "string summary of user intent",
  "reasoningSummary": "string explanation of how you decided the response",
  "replyDraft": "exact text of the email reply to send to the recipient",
  "meetingProposal": {
    "date": "2026-05-28",
    "time": "2:00 PM",
    "durationMinutes": 30,
    "summary": "Sync with ${req.senderName}"
  },
  "candidateActions": [
    {
      "id": "act_1",
      "tool": "gmail.send_reply",
      "description": "Send email reply to sender",
      "arguments": { "to": "${req.senderEmail}", "subject": "Re: ${req.subject}" },
      "confidence": 0.98,
      "safetyRecommendation": "PROCEED_TO_POLICY"
    }
  ],
  "confidence": 0.98
}`;

  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const endpoint = `${cleanBaseUrl}/chat/completions`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
      temperature: req.temperature ?? 0.2,
      max_tokens: 4096,
      stream: false,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA API error (HTTP ${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const messageObj = data?.choices?.[0]?.message;
  const reasoningContent =
    typeof messageObj?.reasoning_content === "string"
      ? messageObj.reasoning_content
      : null;
  const rawText = messageObj?.content || "{}";
  const cleanedText = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  interface RawAiParsed {
    intent?: string;
    reasoningSummary?: string;
    replyDraft?: string;
    meetingProposal?: {
      date: string;
      time: string;
      durationMinutes: number;
      summary: string;
    };
    candidateActions?: AiCandidateAction[];
    confidence?: number;
  }

  let parsed: RawAiParsed = {};
  try {
    parsed = JSON.parse(cleanedText) as RawAiParsed;
  } catch (parseError) {
    console.warn(
      "Failed to parse NVIDIA JSON output, using raw text:",
      parseError,
    );
    parsed = { replyDraft: rawText };
  }

  return {
    provider: "nvidia",
    modelUsed: modelName,
    intent: parsed.intent || "INBOUND_EMAIL_REPLY",
    reasoningSummary:
      parsed.reasoningSummary ||
      reasoningContent ||
      `NVIDIA NIM (${modelName}) reasoned through the prompt constraints and generated structured decision output.`,
    replyDraft:
      parsed.replyDraft ||
      `Hi ${req.senderName},\n\nThanks for reaching out! I received your email regarding "${req.subject}".\n\nBest,\nNelson`,
    meetingProposal: parsed.meetingProposal,
    candidateActions: normalizeCandidateActions(parsed.candidateActions, [
      {
        id: "act_1",
        tool: "gmail.send_reply",
        description: "Send autonomous email reply",
        arguments: { to: req.senderEmail, subject: `Re: ${req.subject}` },
        confidence: 0.98,
        safetyRecommendation: "REQUIRE_HUMAN_REVIEW",
      },
    ]),
    confidence:
      typeof parsed.confidence === "number" ? parsed.confidence : 0.98,
    durationMs: Date.now() - startTime,
  };
}
