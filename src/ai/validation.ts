export type JsonObject = Record<string, unknown>;

export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function requiredString(
  value: unknown,
  field: string,
  errors: string[],
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${field} must be a non-empty string`);
    return "";
  }
  return value;
}

export function optionalString(
  value: unknown,
  field: string,
  errors: string[],
): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    errors.push(`${field} must be a string when provided`);
    return undefined;
  }
  return value;
}

export async function readJsonBody(
  request: Request,
): Promise<{ value?: JsonObject; error?: string }> {
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return { error: "Request body must be valid JSON" };
  }

  if (!isJsonObject(value)) {
    return { error: "Request body must be a JSON object" };
  }

  return { value };
}
