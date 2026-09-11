# Court Navigator — Procedural Guidance for Indian Court Users

<div align="center">

![Court Navigator](https://img.shields.io/badge/Court%20Navigator-Procedural%20Guidance-gold?style=for-the-badge&logo=scales&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Gemini](https://img.shields.io/badge/Gemini%20Flash%203.8-AI%20(free%20tier)-orange?style=for-the-badge&logo=google)
![Groq](https://img.shields.io/badge/Groq%20gpt--oss--120B-AI%20(free%20tier)-red?style=for-the-badge)
![Vibeathon](https://img.shields.io/badge/ILTN%20×%20vibecode.law-Vibeathon%202026-0E4D4A?style=for-the-badge)

**“You know your case. We help you navigate the procedure.” — A source-grounded procedural navigation tool that answers five questions: Where am I? What does this mean? What should I prepare? What happens next? Why trust this?**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Safety & Guardrails System](#-safety--guardrails-system)
- [The Procedural Journey Model](#-the-procedural-journey-model)
- [How It Works](#-how-it-works)
- [Decoder & API Reference](#-decoder--api-reference)
- [AI Provider Setup (Free Tiers)](#-ai-provider-setup-free-tiers)
- [Testing](#-testing)
- [Known Issues & Limitations](#-known-issues--limitations)
- [Documentation](#-documentation)
- [Roadmap](#-roadmap)

---

## ⚖️ Overview

**Court Navigator** is a narrow, source-grounded procedural guidance prototype for people who interact with Indian courts but don't understand court *procedure* — party-in-person litigants, junior advocates, law students, legal-aid volunteers, and citizens holding a court document they can't read.

It is explicitly **not** a generic AI lawyer, a legal chatbot, or a "knows all Indian law" product. V1 supports exactly one journey end-to-end:

> **Madhya Pradesh → District / Trial Court → Criminal → Bail navigation.**

Everything else is honestly marked *Coming Soon* and never answered as if verified. The product converts confusion into a navigable route:

```
CONFUSION → UNDERSTAND STAGE → KNOW NEXT STEP → KNOW WHAT TO PREPARE
          → UNDERSTAND TERMINOLOGY → UNDERSTAND THE DOCUMENT → KNOW WHAT TO EXPECT
```

**AI explains. Sources establish. Rules structure. Humans decide.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Procedure Roadmap** | 7-stage "Google Maps for court procedure" — YOU ARE HERE marker, animated progress, per-stage meaning, what normally happens, next step, watch-for, sources |
| 🔀 **Branch-Aware Next Steps** | State machine distinguishes *typical / conditional / order-dependent / uncertain* — never false certainty; reasons + alternatives are visible |
| ↻ **Honest Loop Model** | Court matters repeat listing → hearing → order → tasks → next listing; stage 7 is a visual loop-back, never presented as a hidden "backwards jump" |
| ✅ **Procedural Checklist** | 10 source-grounded items grouped in numbered stage order 1–7 (empty stage 3 shows an explicit "no items seeded — verify at registry" placeholder), interactive with global progress ring |
| 📖 **Plain-Language Glossary** | 16 terms (cause list, listing, adjournment, affidavit, vakalatnama, bail, anticipatory bail…) in EN + Hindi; every decoder/next-step mention links straight to its definition |
| 📄 **Procedural Decoder** | Paste text or upload .txt/.md/PDF (pdfjs, text-based, 10 pages / 5 MB) → document type, dates, case refs, terms, journey placement, "what appears to happen next" + explicit *cannot-safely-infer* list |
| 🧠 **Meaningful AI (2 layers)** | Deterministic regex/keyword core + schema-validated structured JSON extraction + grounded plain-language explanation — the model explains retrieved facts, never invents them |
| 👁️ **Evidence Signals** | "Why this mapping?" panel shows the deciding structural cue; superseded signals shown dimmed, never hidden |
| 🔍 **Source Transparency** | Every claim carries Source-backed / General guidance / Needs-verification badges, jurisdiction scope, and clickable official sources |
|  **Onboarding + Help + FAQ** | 4-step first-visit walkthrough (remembered, reopenable), floating "?" contextual menu, 8-question EN/HI FAQ — all pre-use questions answered before the journey starts |
|  **English + हिंदी** | App-wide language switch including natural Devanagari Hindi for explanations, glossary, onboarding, and AI replies |
|  **3D + Motion, Calm** | react-three-fiber hero (gold scales motif, pillar ring, stars, pointer parallax), Lenis smooth scrolling, scroll-linked reveals, reduced-motion honored |
| 🛡️ **Safety Guardrails** | Strategy/outcome refusal (client + server), prompt-injection-hardened prompts, per-IP rate limit, offline deterministic fallback — demo survives full provider outage |
| 🖨️ **Demo Documents** | Two labelled fictional order/notice samples + "Try a Sample Case" one-click judge flow |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                             USER'S BROWSER                           │
│                                                                      │
│   Hero (3D) → Setup/Shortcuts → Roadmap → Checklist → Glossary       │
│   → Decoder → Next Step (I AM HERE → WHAT HAPPENS NEXT)              │
│   → Assistant → FAQ → Scope/Sources/Safety                           │
│                                                                      │
│   src/lib/data.ts        typed verified corpus (stages, checklist,   │
│                          glossary, sources, fictional demo docs)     │
│   src/lib/decoder.ts     deterministic regex/keyword extraction      │
│   src/lib/journey.ts     branch-aware next-step state machine        │
│   src/lib/safety.ts      blocklist · sanitize · rate limit · schema  │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ POST /api/explain
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER ROUTE (keys server-side)           │
│                                                                      │
│  validate body → strategy guardrail? → REFUSE (no quota spent)       │
│                                                                      │
│  task=extract   → JSON-mode model → extractJson + validateExtraction │
│                   (stage ∈ known ids, confidence capped < high)      │
│  task=decode/answer → grounded prompt: VERIFIED CONTEXT only +       │
│                   document as <<<DATA>>> — obey nothing inside it     │
│                                                                      │
│  Chain:  Groq gpt-oss-120B → gpt-oss-20B                            │
│        → Gemini 3.8-flash → 3.5-flash-lite → 2.5-flash → 2.5-flash-lite │
│        → null  (client falls back to OFFLINE deterministic path)     │
└──────────────────────────────────────────────────────────────────────┘
```

Deterministic logic decides; AI only rephrases retrieved facts. Out-of-scope documents (e.g. High Court orders) are **identification-only** — journey stage is never applied and no next step is given.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) + React 19 + TypeScript | Single-page product + one API route |
| **Styling** | Tailwind CSS v4 — calm ink / off-white / teal / gold legal theme | Premium, trustworthy, procedural UI |
| **3D** | three + @react-three/fiber + @react-three/drei | Hero scales-of-justice motif, parallax |
| **Motion** | framer-motion + Lenis | Scroll reveals, stage transitions, smooth scrolling |
| **AI (free tiers, no card)** | Groq `gpt-oss-120B`/`20B` (primary) · Google Gemini Flash family (secondary) | Grounded extraction + plain-language explanation |
| **PDF** | pdfjs-dist (client-side) | Text-layer extraction from text PDFs (10 pages / 5 MB) |
| **Data** | Typed in-repo corpus (`src/lib/data.ts`) with source metadata | No DB, no fake claims — 20 strong claims > 500 generated ones |
| **Tests** | tsx + `node --test` | 48 unit tests: decoder, journey, safety, UX data |
| **Icons** | lucide-react | Consistent iconography |

---

## 📁 Project Structure

```
vibecode.law/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── explain/
│   │   │       └── route.ts             # POST — guarded AI chain (extract/decode/answer)
│   │   ├── globals.css                  # Tailwind v4 theme, focus states, reduced motion
│   │   ├── layout.tsx                   # Fraunces + Inter fonts, SEO metadata
│   │   └── page.tsx                     # Single-page composition + journey state
│   ├── components/
│   │   ├── Scene3D.tsx                  # R3F hero: torus-knot scale, pillar ring, stars
│   │   ├── Hero.tsx / Nav.tsx           # Entry CTAs, "How it works", language toggle
│   │   ├── Onboarding.tsx               # 4-step first-visit walkthrough (localStorage)
│   │   ├── JourneySetup.tsx             # Scope rows, shortcuts, stage picker, sample case
│   │   ├── Roadmap.tsx / Checklist.tsx / Glossary.tsx
│   │   ├── Decoder.tsx / NextStep.tsx / Assistant.tsx
│   │   ├── Faq.tsx / Scope.tsx / HelpMenu.tsx / Footer.tsx
│   │   └── SmoothScroll.tsx             # Lenis + native fallback
│   └── lib/
│       ├── data.ts                      # 7 stages · 10 checklist · 16 glossary · 7 sources · demos
│       ├── decoder.ts                   # deterministic decode + structural doc-type signals
│       ├── journey.ts                   # resolveNext() state machine w/ branches + reasons
│       ├── safety.ts                    # blocklists, validation, rate limit, extraction schema
│       ├── help.ts                      # FAQ items, help topics, shortcuts (EN/HI)
│       ├── aiClient.ts                  # aiExplain()/aiExtract() → null = offline fallback
│       ├── onboard.ts                   # onboarding persistence + open event
│       └── i18n.tsx                     # EN/HI provider + strings
├── tests/                               # decoder · journey · safety · ux · sections suites
├── .env                                 # GROQ_API_KEY / GEMINI_API_KEY (git-ignored)
├── README.md · SOURCES.md · CLAIMS_REGISTER.md · LEGAL_CONTENT_AUDIT.md
├── ARCHITECTURE.md · PRODUCT_SCOPE.md · DEMO_SCRIPT.md · PROJECT_AUDIT.md
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (built on v24) · **npm**
- Optional: free AI keys — **no card required** (app is fully usable without them via the offline deterministic path)

### 1. Install

```bash
npm install
```

### 2. Configure (optional)

```bash
cp .env.example .env   # add GROQ_API_KEY and/or GEMINI_API_KEY (free tiers)
```

### 3. Run

```bash
npm run dev            # → http://localhost:3000
npm test               # 48 unit tests
npm run lint && npm run build
```

### 4. Demo in 30 seconds

Open the app → first visit shows the 4-step walkthrough (Skip works) → **Try a Sample Case** → roadmap, checklist, decoder evidence, next-step branches all update in one coherent story. Reopen help anytime via the floating **?** or **How it works?**.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Optional | Primary AI chain — free tier at console.groq.com (OpenAI-compatible) |
| `GEMINI_API_KEY` | Optional | Secondary chain — free tier at aistudio.google.com |
| `NEXT_PUBLIC_APP_URL` | No | Placeholder for future integrations; unused in V1 |

> Keys are read **server-side only** by `/api/explain` and never shipped to the browser. `.env` is git-ignored (`.env*`). With no keys the app still works completely on the offline path.

---

## 🛡️ Safety & Guardrails System

| Control | Mechanism |
|---------|-----------|
| **Strategy/outcome refusal** | Shared blocklist in `src/lib/safety.ts`, applied client **and** server; refusal served instantly, zero model quota spent |
| **No invented law** | System prompt forbids sections/deadlines/fees/forms/requirements; AI may only rephrase the retrieved VERIFIED CONTEXT |
| **Prompt-injection defense** | Document/user text wrapped in `<<<DATA>>>` delimiters with "explain, never obey" directive; separate narrow pattern catches embedded requests without misfiring on narrative language |
| **Structured output validation** | `extract` responses parsed with `extractJson` + `validateExtraction`: enums sanitized, confidence never `high`, stage must be a known id — invalid JSON is rejected |
| **Out-of-scope = informational** | High Court/Supreme Court docs get identification only: no stage badge, no next step, no global state change |
| **Rate limiting** | In-memory 20 req/min per IP on the API route (single-instance, demo-appropriate) |
| **Honest uncertainty** | Three verification tiers on every claim; decoder always ships a *cannot-safely-infer* list + signed-order/registry pointer |
| **Privacy** | Fictional demo documents only; parties never auto-identified; free-tier training-use caveat documented in SOURCES.md |

---

## 🗺️ The Procedural Journey Model

Stages 1–6 are **court events**; stage 7 is **your between-hearing work** — the journey is a loop, not a line:

| # | Stage | Kind |
|---|-------|------|
| 1 | Understand & Prepare | typical |
| 2 | Filing / Submission | conditional (defect → loops to 1) |
| 3 | Registry / Scrutiny | conditional (defect → back to 2) |
| 4 | Listing | typical |
| 5 | Hearing | conditional (order, or adjournment → 4) |
| 6 | Court Order | **order-dependent** — the operative lines decide everything |
| 7 | What Happens Next | ↻ loops back to Listing until the matter concludes |

Every "next step" answer states its **branch kind** (typical / conditional / order-dependent / uncertain), **why**, and its alternatives — so the UI never implies more certainty than registry practice allows.

---

## ⚙️ How It Works

1. **Land & understand** — hero answers *what is this / can it help / what first*, with a walkthrough for first-timers and four "What brings you here?" shortcuts.
2. **Setup** — MP · District · Criminal · Bail locked; pick your current stage (helper text: not sure? use the decoder).
3. **Roadmap** — select a stage → animated timeline, YOU ARE HERE, meaning, what happens, next, sources.
4. **Checklist & Glossary** — do-now actions first per stage, everything expandable; terms link everywhere they appear.
5. **Decoder** — paste/upload a document → structural type detection → dates/refs/terms extracted → stage mapped with evidence → grounded AI explanation → unknowns.
6. **What happens next** — branch badge + reason + prepare + watch-for + sources; alternatives are clickable and move the whole page.
7. **Assistant** — corpus-only answers with source labels (AI · provider / instant / guardrail refusal).
8. **FAQ, help, sources** — pre-use doubts resolved; official source registry visible, not buried.

---

## 📡 Decoder & API Reference

### `POST /api/explain`

**Request**
```json
{ "task": "extract", "input": "<document text>", "corpus": "<retrieved verified context>", "lang": "en|hi" }
```

**Response (extract — always schema-validated)**
```json
{ "ok": true, "provider": "groq", "model": "openai/gpt-oss-120b", "extraction": {
  "docType": "order", "confidence": "medium", "dates": ["07-01-2026", "7 January, 2026"],
  "caseRefs": ["MCRC-50247-2025"], "terms": ["order", "anticipatory bail"],
  "stageHypothesis": "order", "signals": ["mentions 'order is allowed'"],
  "unknowns": ["next hearing schedule"] } }
```

**Response (decode / answer)**
```json
{ "ok": true, "provider": "groq", "model": "openai/gpt-oss-120b", "text": "Plain-language explanation…" }
```

**Refusal (never calls a provider):** `{ "ok": true, "provider": "guardrail", "model": "refusal", "text": "…does not assess case outcomes…" }` · **Rate limit:** HTTP 429 · **All providers down:** `{ "ok": false, "error": "all-providers-failed" }` → client falls back to the deterministic answer.

### Decoder input rules
Pasted text / `.txt` / `.md` / text-PDF (≤10 pages, ≤5 MB). Scanned/image PDF → honest "could not reliably read", no guessed OCR. `>300` chars in the assistant routes to the decode path so narrative bail language is explained, not refused.

---

## 🧪 AI Provider Setup (Free Tiers)

**Groq (primary)** → console.groq.com → sign in → API Keys → create key. Verify free access: **Billing → set spend limit to $0** (key works within rate limits at no cost). Models used: `openai/gpt-oss-120b`, fallback `gpt-oss-20b`.

**Google AI Studio (secondary)** → aistudio.google.com → Get API Key (Google account, no card). Models used: `gemini-3.8-flash`, `gemini-3.5-flash-lite`, `gemini-2.5-flash`, `gemini-2.5-flash-lite` (Flash family = free tier; 3.x Pro is paid-only).

Both verified live against this project's keys (Sep 2026) — see ARCHITECTURE.md for the tested chain and model-decision audit trail.

---

## 🧪 Testing

```bash
npm test
```

**Latest result: 48/48 PASS ✅** — 15 suites covering: document classification (incl. real HC fixture: structural order detection, "no objection" ≠ registry defect, decisive-signal integrity), journey state machine (branches, loop, uncertainty), safety (blocklists, injection patterns, sanitizer, rate limiter, extraction schema), UX data contracts (FAQ/help/shortcuts), section-numbering regression guard. `npm run lint` and `npm run build` are enforced as pre-delivery gates.

Manual passes (fresh vs returning profile): onboarding, sample case, decoder on fictional + real documents, out-of-scope handling, EN/HI, reduced motion, mobile layout, error/empty/loading states.

---

## ⚠️ Known Issues & Limitations

| Issue | Status | Workaround |
|-------|--------|-----------|
| Gemini `generateContent` blocked on some networks (key valid, GETs fine) | Environment | Groq leads the chain; offline path covers total outage |
| No OCR — scanned PDFs refused honestly | By design | Paste the readable text |
| PDF cap: 10 pages / 5 MB | By design | Trim the PDF or paste the relevant order text |
| Rate limiter is per-process (in-memory) | Demo-adequate | Redis/edge store for multi-instance production |
| Registry-specific requirements not asserted anywhere | By design | `Needs verification` badges + "verify at the counter" copy |
| V1 = MP District Bail only; HC/other states identification-only | By design | PRODUCT_SCOPE.md + Scope section |
| Free cloud tiers may use prompts for product improvement | Disclosed | Fictional demo docs only; real confidential files → local/offline path |
| 1-2 checklist/glossary items await local legal sanity check | Open | Review flagged items with an MP district court advocate |

---

## 📚 Documentation

| File | Contents |
|------|----------|
| `SOURCES.md` | Official source registry + general-vs-MP-vs-registry distinctions |
| `CLAIMS_REGISTER.md` | Claim → why → source → jurisdiction → verification status (31 claims) |
| `LEGAL_CONTENT_AUDIT.md` | Stage/checklist/glossary/decoder audits + residual risks |
| `ARCHITECTURE.md` | Stack, data flow, AI chain, safety boundary, motion system |
| `PRODUCT_SCOPE.md` | Supported / unsupported / why narrow / expansion path |
| `DEMO_SCRIPT.md` | Timed 2–3 minute judge walkthrough |
| `PROJECT_AUDIT.md` | Baseline audit → fixes (improvement history) |
| `CONVERSATION_EXPORT.md` | Full build-session history (handoff record) |

---

## 🗺️ Roadmap

- [x] 7-stage procedural roadmap with honest loop model
- [x] Branch-aware next-step state machine (typical/conditional/order-dependent/uncertain)
- [x] Source-grounded checklist with jurisdiction + verification badges
- [x] 16-term EN/HI glossary, contextually linked from every surface
- [x] Procedural decoder: structural detection, evidence signals, unknowns, scope gating
- [x] Schema-validated AI extraction + grounded explanation (Groq → Gemini → offline)
- [x] Safety: strategy refusals, injection hardening, rate limit, no-invention prompts
- [x] Onboarding walkthrough + persistent help + compact FAQ
- [x] EN/हिंदी app-wide · 3D hero · smooth scroll · reduced-motion support
- [x] Real-order hardening from full-page capture review (48 tests)
- [ ] Civil / family / consumer journeys (same engine)
- [ ] Criminal beyond bail · High Court · Supreme Court · other states
- [ ] Verified registry update feed · deadline reminders
- [ ] Case-status lookup integration (eCourts) · lawyer handoff · legal-aid routing
- [ ] PDF order-photograph OCR · more Indian languages

---

<div align="center">

**Court Navigator** — procedural guidance, not legal advice. Source-backed, jurisdiction-honest, and quietly teaching the user how to use itself.

*Built as a working prototype for the ILTN × vibecode.law Vibeathon 2026 — "more trust, clarity, and usefulness per feature."*

</div>
