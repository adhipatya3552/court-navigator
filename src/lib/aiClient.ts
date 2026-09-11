"use client";

import type { AIExtraction } from "./safety";

export interface AiResult {
  text: string;
  provider: "gemini" | "groq" | "guardrail";
  model: string;
}

async function post(task: "decode" | "answer" | "extract", input: string, corpus: string, lang: "en" | "hi") {
  const res = await fetch("/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, input: input.slice(0, 12000), corpus: corpus.slice(0, 8000), lang }),
  });
  if (res.status === 429) return { ratelimited: true } as const;
  if (!res.ok) return null;
  return await res.json();
}

/** Calls the server AI route. Returns null when offline / unconfigured / failed — callers must fall back to deterministic content. */
export async function aiExplain(
  task: "decode" | "answer",
  input: string,
  corpus: string,
  lang: "en" | "hi"
): Promise<AiResult | null> {
  try {
    const data = await post(task, input, corpus, lang);
    if (!data || "ratelimited" in data || !data?.ok || typeof data.text !== "string") return null;
    return { text: data.text, provider: data.provider, model: data.model };
  } catch {
    return null;
  }
}

/** Structured extraction: validated JSON or null. Never throws. */
export async function aiExtract(
  input: string,
  corpus: string,
  lang: "en" | "hi"
): Promise<{ extraction: AIExtraction; provider: string; model: string } | null> {
  try {
    const data = await post("extract", input, corpus, lang);
    if (!data || "ratelimited" in data || !data?.ok || !data?.extraction) return null;
    return { extraction: data.extraction as AIExtraction, provider: data.provider, model: data.model };
  } catch {
    return null;
  }
}
