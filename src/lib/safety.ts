/** Shared safety utilities: used by the API route (server) and UI (client). No secrets here. */

/** User QUESTION or request about outcomes/strategy/merits. Applied to `answer` tasks. */
export const STRATEGY_RE =
  /(will i win|will i get bail|winning|strategy|argu(e|ment)|predict|chances?|odds|acquit|convict|loophole|defeat|guarantee|to win\b|win (my|the|this)|should my lawyer|should i (file|plead|say)|what.*sentence.*(be|get|will)|plead guilty|withdraw.*case|get bail|be released)/i;

/**
 * Outcome/strategy REQUESTS embedded in document text (decode/extract tasks).
 * Narrative mentions ("he shall be released on bail") must NOT match — only
 * first-person requests and instruction-injection patterns do.
 */
export const DOC_STRATEGY_RE =
  /(will i|can i|should i|how do i|how can i|tell me).{0,80}(win|bail|acquit|convict|sentence|release)|guarantee.{0,40}(bail|win|acquit)|ignore (all |any )?(previous |above )?instructions|^\s*(system|assistant)\s*:/im;

export type ExplainTask = "decode" | "answer" | "extract";

/** Remove null bytes and stray control chars; enforce max length. */
export function sanitizeText(input: unknown, max: number): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .slice(0, max)
    .trim();
}

export interface ValidRequest {
  task: ExplainTask;
  input: string;
  corpus: string;
  lang: "en" | "hi";
}

export function validateExplainBody(body: unknown): { ok: true; req: ValidRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "bad-request" };
  const b = body as Record<string, unknown>;
  const task = b.task;
  if (task !== "decode" && task !== "answer" && task !== "extract") return { ok: false, error: "bad-request" };
  const input = sanitizeText(b.input, 12000);
  if (!input) return { ok: false, error: "bad-request" };
  const corpus = sanitizeText(b.corpus, 8000);
  const lang = b.lang === "hi" ? "hi" : "en";
  return { ok: true, req: { task, input, corpus, lang } };
}

/* In-memory per-IP rate limiter (single-instance; adequate for hackathon demo). */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const LIMIT = 20;

export function checkRate(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= LIMIT) {
    hits.set(ip, arr);
    return { allowed: false, retryAfterSec: Math.ceil((arr[0] + WINDOW_MS - now) / 1000) };
  }
  arr.push(now);
  if (hits.size > 2000) {
    const first = hits.keys().next().value;
    if (first) hits.delete(first);
  }
  hits.set(ip, arr);
  return { allowed: true, retryAfterSec: 0 };
}

export function getClientIp(forwarded: string | null): string {
  if (!forwarded) return "local";
  return forwarded.split(",")[0].trim().slice(0, 64) || "local";
}

/* ---------- Structured extraction schema (AI `extract` task) ---------- */

export interface AIExtraction {
  docType: "order" | "notice" | "summons" | "unidentified";
  confidence: "high" | "medium" | "low";
  dates: string[];
  caseRefs: string[];
  terms: string[];
  stageHypothesis: string;
  signals: string[];
  unknowns: string[];
}

const DOC_TYPES = ["order", "notice", "summons", "unidentified"] as const;
const CONFS = ["high", "medium", "low"] as const;

function strArray(v: unknown, cap: number, itemCap: number): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((x) => x.trim().slice(0, itemCap))
    .filter(Boolean)
    .slice(0, cap);
}

/** Strict validator: unknown/invalid model JSON never reaches the UI unshaped. */
export function validateExtraction(raw: unknown, validStages: string[]): AIExtraction | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const docType = DOC_TYPES.includes(o.docType as (typeof DOC_TYPES)[number]) ? (o.docType as AIExtraction["docType"]) : "unidentified";
  let confidence = CONFS.includes(o.confidence as (typeof CONFS)[number]) ? (o.confidence as AIExtraction["confidence"]) : "low";
  if (confidence === "high") confidence = "medium"; // never trust model certainty
  const stageHypothesis =
    typeof o.stageHypothesis === "string" && validStages.includes(o.stageHypothesis) ? o.stageHypothesis : "order";
  return {
    docType,
    confidence,
    dates: strArray(o.dates, 8, 40),
    caseRefs: strArray(o.caseRefs, 6, 80),
    terms: strArray(o.terms, 10, 60),
    stageHypothesis,
    signals: strArray(o.signals, 6, 160),
    unknowns: strArray(o.unknowns, 6, 160),
  };
}

/** Pull the first top-level JSON object out of model text (models add chatter). */
export function extractJson(text: string): unknown | null {
  const start = text.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}
