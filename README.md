# Court Navigator — “You know your case. We help you navigate the procedure.”

Procedural guidance prototype for the **ILTN × vibecode.law Vibeathon 2026**.

**V1 scope (honest, narrow):** Madhya Pradesh · District / Trial Court · Criminal — Bail navigation.
Everything else is explicitly marked *Coming Soon* and never answered as if verified.

## What it does

- **Procedure roadmap** — 7-stage “Google Maps for court procedure” with YOU ARE HERE; branch-aware next steps (typical / conditional / order-dependent / uncertain) with reasons and alternatives.
- **Procedural checklist** — 10 interactive items with source + verification + jurisdiction-scope badges.
- **Glossary** — 16 searchable terms in plain English + Hindi, no strategy language.
- **Procedural decoder** — paste / upload (.txt, .md, PDF with selectable text) / demo order or notice → deterministic extraction (dates, case refs, terms) + evidence signals (“why this mapping?”) + schema-validated AI extraction + journey mapping + “appears to happen next” + explicit *cannot-safely-infer* list. Image-only PDFs get an honest unreadable message.
- **What happens next** — I AM HERE → NEXT (branch badge + reason) + prepare + terms + watch-for + alternatives.
- **Structured assistant** — corpus-grounded answers with source labels (AI/offline/guardrail); refuses outcome/strategy questions with a redirect.
- **Try a Sample Case** — one click in Court Setup decodes the demo order end-to-end.
- **Onboarding + Help + FAQ** — 4-step first-visit walkthrough (remembered, reopenable), floating “?” contextual help, 8-question EN/HI accordion before Scope.
- **EN/हिंदी toggle**, smooth scrolling (Lenis), 3D hero (react-three-fiber), scroll animations (framer-motion), responsive + loading/error/empty states.

## What it does NOT do

No outcome prediction, no litigation strategy, no section-number citations, no invented deadlines/forms/fees, no nationwide coverage claims. See `PRODUCT_SCOPE.md` and `LEGAL_CONTENT_AUDIT.md`.

## Run locally

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
npm start
npm test       # 30 unit tests (decoder, journey state machine, safety)
```

No API keys needed for V1 (decoder + assistant are deterministic and client-side). See `.env.example` for optional future AI wiring.

## Project layout

- `src/app/` — layout, landing page composition
- `src/components/` — Scene3D, Hero, JourneySetup, Roadmap, Checklist, Glossary, Decoder, NextStep, Assistant, Scope, Footer, SmoothScroll, Nav
- `src/lib/data.ts` — stages, checklist, glossary, sources, demo docs (all content lives here with provenance)
- `src/lib/decoder.ts` — deterministic decoder + assistant logic (with evidence signals)
- `src/lib/journey.ts` — branch-aware next-step state machine
- `src/lib/safety.ts` — blocklist, sanitization, validation, rate limit, extraction schema
- `src/lib/i18n.tsx` — EN/HI strings + language provider

- `src/app/api/explain/route.ts` — server AI route (Gemini → Groq → offline), guardrailed prompts
- `src/lib/aiClient.ts` — client helper for the AI route (null = use offline path)

## AI setup (free tiers, no credit card)

```bash
cp .env.example .env   # then fill in free keys
```

- `GROQ_API_KEY` — primary (gpt-oss-120B → 20B, Production table per Groq docs), free at https://console.groq.com
- `GEMINI_API_KEY` — secondary (3.8-flash → 3.5-flash-lite → 2.5-flash → 2.5-flash-lite), free at https://aistudio.google.com
- No keys? The app still works fully on the deterministic offline path.

## Docs

- `SOURCES.md` — official source registry
- `LEGAL_CONTENT_AUDIT.md` — claim-by-claim audit
- `ARCHITECTURE.md` — frontend/data/AI/safety design
- `PRODUCT_SCOPE.md` — supported vs out-of-scope
- `DEMO_SCRIPT.md` — 2–3 minute demo path
- `PROJECT_AUDIT.md` — audit findings → fixes
- `CLAIMS_REGISTER.md` — every claim → source → status
- `tests/` — decoder, journey, safety suites (`npm test`)

## Safety principle

**AI explains. Sources establish. Rules structure. Humans decide.**
