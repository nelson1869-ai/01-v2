import { NextResponse } from "next/server";
import { executeAiReasoning } from "@/ai/router";
import type { AiReasoningRequest } from "@/ai/contracts";
import {
  optionalString,
  readJsonBody,
  requiredString,
} from "@/ai/validation";

export async function POST(request: Request) {
  const parsedBody = await readJsonBody(request);
  if (!parsedBody.value) {
    return NextResponse.json({ error: parsedBody.error }, { status: 400 });
  }

  const errors: string[] = [];
  const temperatureValue = parsedBody.value.temperature;
  const temperature =
    temperatureValue === undefined
      ? undefined
      : typeof temperatureValue === "number" &&
          Number.isFinite(temperatureValue) &&
          temperatureValue >= 0 &&
          temperatureValue <= 2
        ? temperatureValue
        : (errors.push("temperature must be a finite number from 0 to 2"),
          undefined);
  const body: AiReasoningRequest = {
    senderName: requiredString(parsedBody.value.senderName, "senderName", errors),
    senderEmail: requiredString(parsedBody.value.senderEmail, "senderEmail", errors),
    subject: requiredString(parsedBody.value.subject, "subject", errors),
    body: requiredString(parsedBody.value.body, "body", errors),
    personaGuideline: optionalString(
      parsedBody.value.personaGuideline,
      "personaGuideline",
      errors,
    ),
    model: optionalString(parsedBody.value.model, "model", errors),
    temperature,
  };

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Invalid request body", validationErrors: errors },
      { status: 400 },
    );
  }

  try {
    const aiResult = await executeAiReasoning(body);
    return NextResponse.json(aiResult);
  } catch (error) {
    console.error("AI reason API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal AI error" },
      { status: 500 },
    );
  }
}
