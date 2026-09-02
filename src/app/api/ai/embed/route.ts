import { NextResponse } from "next/server";
import { generateTextEmbedding } from "@/ai/embeddings";
import { readJsonBody, requiredString } from "@/ai/validation";

export async function POST(request: Request) {
  const parsedBody = await readJsonBody(request);
  if (!parsedBody.value) {
    return NextResponse.json({ error: parsedBody.error }, { status: 400 });
  }

  const errors: string[] = [];
  const text = requiredString(parsedBody.value.text, "text", errors);
  const inputType = parsedBody.value.inputType ?? "query";
  if (inputType !== "query" && inputType !== "passage") {
    errors.push("inputType must be either 'query' or 'passage'");
  }
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Invalid request body", validationErrors: errors },
      { status: 400 },
    );
  }

  try {
    const result = await generateTextEmbedding(
      text,
      inputType as "query" | "passage",
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Embed API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal embedding error" },
      { status: 500 },
    );
  }
}
