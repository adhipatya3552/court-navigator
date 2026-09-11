# LEGAL_CONTENT_AUDIT.md — Claim-by-claim audit (V1)

**Method:** every procedural claim in `src/lib/data.ts` was reviewed against the question “could an unsupported detail (rule number, form, fee, deadline, section) mislead a litigant?” Anything answering yes was either removed or demoted to `needs-verification` / general process-literacy language.

**Corpus size:** 7 stages · 10 checklist items · 14 glossary terms · 2 fictional demo documents.

## Standing decisions (apply to all claims)

1. **No section numbers** (CrPC or BNSS) are asserted anywhere in V1. Rationale: the transition period makes version errors likely; India Code is referenced instead.
2. **No deadlines, limitation periods, fees, form numbers, or registry checklists** are asserted as fact. Where a step depends on them, the UI says “verify at the filing counter / registry” and the item is `needs-verification`.
3. **Generic process literacy** (what filing / listing / hearing / order mean as concepts) is marked `general-guidance` with eCourts-service sources — these describe how to look things up, not MP-specific requirements.
4. **Demo documents are fictional** and labelled on-screen and in-text. The decoder describes them with “appears to / based on the text provided” language and lists what cannot be inferred.

## Stage audit

| Stage | Core claim | Source | Jurisdiction | Confidence | Variation risk | Status |
|---|---|---|---|---|---|---|
| 1 Understand & Prepare | Organise parties/stage/court before filing | ecourts-services, mphc-official | MP / general | High (process literacy) | Low | general-guidance |
| 2 Filing / Submission | Filing = submission to office; acknowledgement may issue per local practice | ecourts-manual, mp-district-ecourts | MP District | Medium — “may” language used; exact ack format varies | High | needs-verification |
| 3 Registry / Scrutiny | Registry checks completeness; defects returned for correction | ecourts-manual, mphc-official | MP District | Medium — concept stable, local checklist varies | High | needs-verification |
| 4 Listing | Listed = scheduled in cause list; check evening-before + morning | ecourts-services, mp-district-ecourts | MP District | High for concept + lookup path | Medium (board vs portal lag) | general-guidance |
| 5 Hearing | Matter called; be present, hand only what is asked, note date/directions | ecourts-services | General courtroom literacy | High as literacy, not as rule | Medium | general-guidance |
| 6 Court Order | Only signed/uploaded order text counts; read operative lines first | ecourts-services, mp-district-ecourts | MP District | High (literacy) | Low | general-guidance |
| 7 What Happens Next | Convert directions to dated tasks; track cause list | ecourts-services | General | High (literacy) | Low | general-guidance |

## Checklist audit (all 10)

- `c-prep-1`, `c-prep-2`, `c-file-3`, `c-file-4`, `c-list-1`, `c-hear-1`, `c-order-1`, `c-next-1`: process-literacy items (notes, folders, page numbers, acknowledgements, cause-list checks, order copies, reminders). No registry-specific requirement asserted. Statuses: general-guidance except `c-list-1` (verified lookup path on services.ecourts.gov.in).
- `c-file-1` (application with party details), `c-file-2` (affidavit where applicable), plus affidavit/vakalatnama/interim-application glossary entries: explicitly conditional (“where applicable / verify”) and `needs-verification`.

## Glossary audit (all 14)

Definitions are plain-language literacy (cause list, listing, mentioning, adjournment, affidavit, vakalatnama, annexure, registry, defect, order, notice, summons, interim application, stay). No strategic advice. Items whose exact local applicability varies (mentioning, affidavit, vakalatnama, interim application) are `needs-verification`.

## Decoder audit

- Deterministic regex extraction only (dates, case-ref patterns, glossary keyword hits). No model inference of law.
- Document-type classification is keyword-heuristic with confidence labelled low/medium — never “high” (validator downgrades any model “high” to medium).
- Every mapping ships visible evidence signals (“why this mapping?”); structured AI extraction is schema-validated and, on disagreement, the deterministic mapping is kept.
- PDF text comes from pdfjs-dist (first 10 pages, 5 MB cap); image-only PDFs get an honest unreadable message, never a guessed reading.
- Live-tested on a real MP High Court anticipatory-bail order (tests/fixtures/hc-anticipatory-bail-order.txt): deterministic + AI extraction agree (order, 6 dates, MCRC/SLP refs, bail terms, stage=order); High Court scope flagged honestly since V1 covers District Courts.
- Hardened after full-page-capture review (Sep 2026): order detection now uses structural signals (ORDER line, judge header, decision wording) so real orders stop returning “unidentified”; “no objection” no longer triggers the registry-defect mapping; out-of-scope documents are identification-only — no journey placement asserted, no next step given, and roadmap/checklist state never moves for them; Stage 3 shows an explicit “no items seeded — verify at registry” placeholder instead of silently skipping.
- Guardrails are split: full blocklist for user questions, narrow embedded-request pattern for documents, so narrative bail language ("released on bail") is explained, never refused. Verified live.
- Outputs always include: unknowns list, “based on the text provided” framing, and the safety line pointing to the signed order + registry.
- Full claim-by-claim register: see CLAIMS_REGISTER.md (31 claims). Checklist items now also display jurisdiction scope.

## Residual risks & mitigations

- **Registry variation:** mitigated by per-item verification badges + “verify locally” copy on every flagged item.
- **Stale guidance:** mitigated by `lastCatalogued: 2026-09-11` on all sources and the Scope page stating V1 is a demo prototype.
- **User over-reliance:** mitigated by persistent (not modal-spam) disclaimers: hero note, decoder safety line, assistant refusals, footer disclaimer.
