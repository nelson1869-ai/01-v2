import { NextResponse } from "next/server";
import { translateTextWithRiva } from "@/ai/translate";
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
  const text = requiredString(parsedBody.value.text, "text", errors);
  const targetLang =
    optionalString(parsedBody.value.targetLang, "targetLang", errors) || "es-us";
  const sourceLang =
    optionalString(parsedBody.value.sourceLang, "sourceLang", errors) || "en";
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Invalid request body", validationErrors: errors },
      { status: 400 },
    );
  }

  try {
    const result = await translateTextWithRiva(text, targetLang, sourceLang);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Translate API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal translation error" },
      { status: 500 },
    );
  }
}
