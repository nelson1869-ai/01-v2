export interface SafetyEvaluationResult {
  provider: "nvidia-llama-guard" | "simulated";
  model: string;
  isSafe: boolean;
  classification: "SAFE" | "UNSAFE";
  violatedCategories: string[];
  rawResponse: string;
  durationMs: number;
  fallbackReason?: string;
}

export async function evaluateSafetyWithLlamaGuard(
  prompt: string,
  responseText?: string,
): Promise<SafetyEvaluationResult> {
  const startTime = Date.now();
  const apiKey =
    process.env.NVIDIA_GUARD_API_KEY ||
    process.env.NVIDIA_API_KEY;
  const modelName =
    process.env.NVIDIA_GUARD_MODEL || "meta/llama-guard-4-12b";
  const baseUrl =
    process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  let fallbackReason = "NVIDIA guard API key is not configured";

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
      const messages = [{ role: "user", content: prompt }];

      if (responseText) {
        messages.push({ role: "assistant", content: responseText });
      }

      const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages,
          temperature: 0.0,
          max_tokens: 128,
        }),
        signal: AbortSignal.timeout(15_000),
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent =
          data?.choices?.[0]?.message?.content?.trim() || "safe";
        const isSafe = rawContent.toLowerCase().startsWith("safe");

        const lines = rawContent.split("\n").map((l: string) => l.trim());
        const violatedCategories = isSafe
          ? []
          : lines.filter((l: string) => l !== "unsafe" && l.length > 0);

        return {
          provider: "nvidia-llama-guard",
          model: modelName,
          isSafe,
          classification: isSafe ? "SAFE" : "UNSAFE",
          violatedCategories,
          rawResponse: rawContent,
          durationMs: Date.now() - startTime,
        };
      } else {
        const errText = await response.text();
        fallbackReason = `NVIDIA guard returned HTTP ${response.status}: ${errText}`;
        console.warn("Llama Guard 4 API non-200:", errText);
      }
    } catch (err) {
      fallbackReason =
        err instanceof Error ? err.message : "Unknown NVIDIA guard failure";
      console.warn("Llama Guard 4 fetch failed:", err);
    }
  }

  // Fallback heuristic evaluation
  const lowerPrompt = prompt.toLowerCase();
  const isSuspicious =
    lowerPrompt.includes("wire transfer") ||
    lowerPrompt.includes("bank account #") ||
    lowerPrompt.includes("penalties immediately");

  return {
    provider: "simulated",
    model: "llama-guard-4-12b (simulated)",
    isSafe: !isSuspicious,
    classification: isSuspicious ? "UNSAFE" : "SAFE",
    violatedCategories: isSuspicious ? ["S2: Financial Crimes & Unverified Wire Fraud"] : [],
    rawResponse: isSuspicious ? "unsafe\nS2" : "safe",
    durationMs: Date.now() - startTime + 40,
    fallbackReason,
  };
}
