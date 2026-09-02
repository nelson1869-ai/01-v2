export interface TranslationResult {
  provider: "nvidia-riva" | "simulated";
  model: string;
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  translatedText: string;
  durationMs: number;
  fallbackReason?: string;
}

export async function translateTextWithRiva(
  text: string,
  targetLang = "es-us",
  sourceLang = "en",
): Promise<TranslationResult> {
  const startTime = Date.now();
  const apiKey =
    process.env.NVIDIA_TRANSLATE_API_KEY ||
    process.env.NVIDIA_API_KEY;
  const modelName =
    process.env.NVIDIA_TRANSLATE_MODEL || "nvidia/riva-translate-4b-instruct-v2";
  const baseUrl =
    process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  let fallbackReason = "NVIDIA translation API key is not configured";

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
      const systemPrompt = `You are an expert at translating text from ${sourceLang} to ${targetLang}. Provide ONLY the translation with no extra commentary.`;

      const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text },
          ],
          temperature: 0.1,
          max_tokens: 2048,
        }),
        signal: AbortSignal.timeout(15_000),
      });

      if (response.ok) {
        const data = await response.json();
        const translated =
          data?.choices?.[0]?.message?.content?.trim() || text;

        return {
          provider: "nvidia-riva",
          model: modelName,
          sourceText: text,
          sourceLang,
          targetLang,
          translatedText: translated,
          durationMs: Date.now() - startTime,
        };
      } else {
        const errText = await response.text();
        fallbackReason = `NVIDIA translation returned HTTP ${response.status}: ${errText}`;
        console.warn("NVIDIA Riva Translation API non-200:", errText);
      }
    } catch (err) {
      fallbackReason =
        err instanceof Error ? err.message : "Unknown NVIDIA translation failure";
      console.warn("NVIDIA Riva Translation fetch failed:", err);
    }
  }

  // Fallback simulated translation
  return {
    provider: "simulated",
    model: "riva-translate-4b (simulated)",
    sourceText: text,
    sourceLang,
    targetLang,
    translatedText: `[Translated to ${targetLang}]: ${text}`,
    durationMs: Date.now() - startTime + 50,
    fallbackReason,
  };
}
