import type {
  AiCandidateAction,
  AiReasoningRequest,
  AiProviderReasoningResult,
} from "./contracts";
import { normalizeCandidateActions } from "./contracts";

export async function callGeminiReasoning(
  req: AiReasoningRequest,
  apiKey: string,
): Promise<AiProviderReasoningResult> {
  const startTime = Date.now();
  const modelName = req.model || "gemini-2.5-flash";

  const systemInstruction = `You are AutoDo Personal Assistant acting on behalf of Nelson Fernandez.
Your role:
- Read incoming email messages from contacts.
- Follow Nelson's communication guidelines: professional, friendly, concise, closing with "Best,\\nNelson".
- Identify if the email is asking for a meeting, payroll inquiry, or general question.
- Propose concrete calendar slots if a meeting is requested (e.g. Thursday 2:00 PM).
- Output STRICT JSON matching the required schema. Do NOT include markdown fences in the response.`;

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
    "date": "e.g. 2026-05-28",
    "time": "e.g. 2:00 PM",
    "durationMinutes": 30,
    "summary": "Meeting description"
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
  "confidence": 0.95
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: req.temperature ?? 0.2,
        response_mime_type: "application/json",
      },
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (HTTP ${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
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
      "Failed to parse Gemini JSON output, using raw text:",
      parseError,
    );
    parsed = { replyDraft: rawText };
  }

  return {
    provider: "gemini",
    modelUsed: modelName,
    intent: parsed.intent || "INBOUND_EMAIL_REPLY",
    reasoningSummary:
      parsed.reasoningSummary || "Analyzed message and synthesized reply.",
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
      typeof parsed.confidence === "number" ? parsed.confidence : 0.95,
    durationMs: Date.now() - startTime,
  };
}
