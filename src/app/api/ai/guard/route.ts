import { NextResponse } from "next/server";
import { evaluateSafetyWithLlamaGuard } from "@/ai/guard";
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
  const prompt = requiredString(parsedBody.value.prompt, "prompt", errors);
  const responseText = optionalString(
    parsedBody.value.responseText,
    "responseText",
    errors,
  );
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Invalid request body", validationErrors: errors },
      { status: 400 },
    );
  }

  try {
    const result = await evaluateSafetyWithLlamaGuard(prompt, responseText);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Guard API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal safety guardrail error" },
      { status: 500 },
    );
  }
}
