# PROJECT_AUDIT.md — audit of 2026-09-11 (pre-improvement baseline)

No git repo exists (file-based project). `npm run lint` clean, `npm run build` clean. No test files. `.env` present with both keys, git-ignored via `.env*`.

## Current architecture (as found)

- Next.js 16 App Router + React 19 + TS + Tailwind v4 + framer-motion + Lenis + three/R3F + lucide.
- Typed corpus in `src/lib/data.ts`: 7 stages, 10 checklist items, 14 glossary terms, 7 sources, 2 fictional demo docs. Verification badges (`verified`/`general-guidance`/`needs-verification`). No section numbers/deadlines/fees anywhere — good.
- Deterministic `decodeDocument()` (regex dates/case-refs, keyword doc-type + stage map, confidence capped at medium, unknowns list, safe language).
- `/api/explain` (Groq gpt-oss-120b→20b → Gemini 3.8-flash→3.5-flash-lite→2.5-flash→2.5-flash-lite → offline). Server+client strategy blocklist, keys server-side only, nothing secret logged.
- Shared `stageId` state links Setup→Roadmap→Checklist→Decoder→NextStep. EN/HI toggle app-wide.

## Strengths (keep)

1. Narrow scope honestly enforced (MP/District/Bail, Coming-Soon states).
2. Provenance UI on stages/checklist/glossary; legal-safe copy throughout.
3. Decoder never overclaims (unknowns list, "appears to", confidence ≤ medium).
4. Offline deterministic path = demo cannot fully die; provider chain falls through gracefully.
5. No XSS vectors: no `dangerouslySetInnerHTML`/`innerHTML`/`eval`/cookies anywhere (grep verified).

## Weaknesses → planned fix

| # | Weakness | Risk | Fix (phase) |
|---|---|---|---|
| W1 | Roadmap implies one linear path; "Go to" just advances +1 | False certainty | State machine with branches: typical / conditional / order-dependent / uncertain (P2) |
| W2 | AI is paraphrase-only; free-text output, no schema | Unvalidated model text in UI | Structured `extract` task returning schema-validated JSON (P3) |
| W3 | No visible evidence for outputs ("why this stage?") | Trust gap | Signals list from deterministic extraction + state-machine reasons (P2/P3/P5) |
| W4 | PDF upload refused outright | Judge may bring a PDF | pdfjs-dist text extraction + honest scanned-PDF message (P4) |
| W5 | No rate limiting on `/api/explain` | Quota burn / abuse | In-memory per-IP limiter 20/min (P6) |
| W6 | Doc text interpolated into prompt without delimiters | Prompt injection | Delimited DATA blocks + ignore-instructions directive (P6) |
| W7 | Checklist items lack jurisdiction + why-matters display | Grounding gap | Add `scope` per item, render it (P1/P5) |
| W8 | No "Try a Sample Case" one-click flow | Demo friction | Sample-case trigger wiring Setup→Decoder (P5/P7) |
| W9 | Zero tests | Regressions invisible | `tsx` + `node --test` suites for decoder/journey/safety (P9) |
| W10 | ARCHITECTURE.md says "no backend/AI vendor, client-side only" | Stale docs lie | Update docs to reality (P9) |
| W11 | Stray `session-ses_f6fb.md` (247KB, another tool's dump, mojibake) | Repo clutter/confusion | Flagged; recommend delete (not deleted — not my file) |

## Legal/content risks (all mitigated by design, kept)

- Registry variation → per-item verification badges + "verify locally" copy (kept, extended via claims register).
- CrPC/BNSS → zero section citations in corpus (kept; enforced in AI prompts + tests).
- Free-tier training-use → fictional docs only (kept; noted in docs).

## Demo risks

1. Gemini POSTs 404 on this network (GETs fine) — Groq leads; acceptable, offline path covers total outage.
2. gpt-oss reasoning needs token headroom (max_tokens 800 already set).
3. 3D/fonts need network — decorative only, content readable without.

## Implementation order (locked)

P1 claims register → P2 state machine → P3 structured AI → P4 PDF → P5 integration+sample → P6 security → P7/P8 demo+polish → P9 tests+validation+docs.
