# ARCHITECTURE.md

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · framer-motion · Lenis (smooth scroll) · three + @react-three/fiber + @react-three/drei (hero 3D) · lucide-react (icons) · pdfjs-dist (client-side PDF text extraction) · tsx + node:test (tests). One server route (`/api/explain`); no database; AI vendors via free-tier keys only.

## Data flow

```
User input (stage select / text / upload incl. PDF)
  → jurisdiction + court + matter context (fixed to MP/District/Criminal-Bail in V1)
  → deterministic retrieval from src/lib/data.ts (stages, checklist, glossary, sources)
  → deterministic logic: src/lib/decoder.ts (regex extract, keyword classify, stage map, evidence signals) + src/lib/journey.ts (branch-aware next-step state machine)
  → generative explanation via src/app/api/explain/route.ts (tasks: decode/answer/extract; Groq → Gemini → offline), schema-validated for `extract`
  → source + jurisdiction + verification metadata + evidence signals on screen
```

## AI layer (deterministic core + grounded generative explanation)

AI is used where it is genuinely useful *as explanation*, never as authority:

- **Extract:** dates, case-ref patterns, glossary hits (regex, deterministic — `src/lib/decoder.ts`).
- **Classify:** document kind + journey stage (keyword rules with confidence caps at medium).
- **Explain (generative):** `src/app/api/explain/route.ts` sends *only retrieved corpus text + user input* to the model with a system prompt that forbids inventing sections/deadlines/fees/strategy. Chain: **Groq (gpt-oss-120B → gpt-oss-20B, Production table per Groq docs) → Gemini Flash-Lite → Flash → offline deterministic**. Both are genuine free tiers (no credit card); keys live server-side only (`GROQ_API_KEY`, `GEMINI_API_KEY`).
- **Refuse/redirect:** outcome/strategy questions match a blocklist on client AND server and return the safety redirect without spending quota.

## Document pipeline

Paste / .txt / .md / PDF (pdfjs-dist, client-side, first 10 pages, 5 MB cap) → length guard (<40 chars → honest error; image-only PDF → honest scanned message) → regex extraction → glossary matching → stage mapping + evidence signals → structured AI extraction (schema-validated, deterministic mapping kept on disagreement) → rendered explanation + unknowns.

## Safety boundary

- Corpus items carry `verificationStatus`: `verified` | `general-guidance` | `needs-verification`, rendered as badges everywhere; checklist items also show jurisdiction scope (MP District Courts vs general literacy).
- Shared guardrails in `src/lib/safety.ts`: strategy blocklist (single source, tested), input sanitization + length caps, request-shape validation, per-IP rate limit (20/min) on `/api/explain`.
- Documents are untrusted DATA: `<<<DATA>>>` delimiters + ignore-instructions directive in every prompt; model JSON parsed via `extractJson` + strict `validateExtraction` (confidence never `high`, stage must be a known id).
- Decoder outputs always include evidence signals + unknowns + “based on the text provided” + signed-order/registry pointer.
- No `dangerouslySetInnerHTML`/`innerHTML`/`eval`/cookies anywhere; AI text rendered as plain text nodes. Keys server-side only, `.env*` git-ignored, nothing secret logged.
- Narrow scope (MP/District/Bail) is enforced in copy; anything else renders “Coming Soon”.

## Rendering / motion

- `SmoothScroll` mounts one Lenis instance + anchor-scroll handling.
- `Scene3D` is an isolated client Canvas (torus-knot “scale” motif + pillar ring + stars + pointer rig) behind the hero, with a radial scrim for legibility.
- Section reveals use framer-motion `whileInView` (once) + hero `useScroll` parallax; cards use perspective tilt on hover. No layout-shifting animations on the critical path.
