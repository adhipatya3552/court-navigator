# CLAIMS_REGISTER.md — every procedural claim, its source and status (V1)

Convention: CLAIM → WHY IT IS USED → AUTHORITATIVE SOURCE → JURISDICTION / APPLICABILITY → VERIFICATION STATUS.
Statuses: `verified` (lookup path confirmed) · `general-guidance` (stable process literacy, registry variation possible) · `needs-verification` (depends on local rule/practice — must be confirmed at the counter/registry).
Deliberately absent everywhere: section numbers (CrPC/BNSS), limitation periods, fees, form numbers.

## Stages (7)

**S1 — "Organise parties/stage/court before filing; nothing moves until this is clear."**
→ WHY: prevents filing in the wrong court, the commonest wasted visit. → SOURCE: eCourts Services (case/court lookup), MP HC site (court directory). → MP / general literacy. → `general-guidance`.

**S2 — "Filing = submitting papers to the filing office/registry; filing alone decides nothing; an acknowledgement/diary number may issue per local practice."**
→ WHY: separates submission from hearing in the user's mind. → SOURCE: eCourts manuals (filing flow), MP district eCourts. → MP District Courts; ack format varies. → `needs-verification`.

**S3 — "Registry checks completeness (signatures, copies, annexures, local format); defective filings return with objections instead of going before court."**
→ WHY: explains the most common delay loop. → SOURCE: eCourts manuals, MP HC site. → MP District; local checklist varies. → `needs-verification`.

**S4 — "Listed = scheduled in the cause list; check evening-before + hearing morning; positions shift."**
→ WHY: actionable habit that prevents missed callings. → SOURCE: eCourts Services (cause-list lookup path confirmed). → MP District. → `general-guidance` (lookup path `verified` in checklist c-list-1).

**S5 — "At hearing: wait for item call; identify matter; hand only what is asked; note date/directions — these enter the order."**
→ WHY: courtroom-conduct literacy for first-timers. → SOURCE: eCourts Services (general). → General courtroom literacy. → `general-guidance`.

**S6 — "Only the signed/uploaded order text counts; read operative lines (dates, directions) first; match order to journey."**
→ WHY: stops users acting on oral memory/assumption. → SOURCE: eCourts Services, MP district eCourts. → MP District. → `general-guidance`.

**S7 — "After order: convert every direction+date to tasks, keep compliance proof, track cause list; unclear points get clarified, not guessed."**
→ WHY: compliance discipline; missed dates create fresh complications. → SOURCE: eCourts Services. → General. → `general-guidance`.

## Checklist (10)

**C-prep-1 — note court/parties/stage on one page, names exactly as on papers.** Literacy; eCourts Services; general. → `general-guidance`.
**C-prep-2 — one folder: prior orders, notices, IDs, identifiers; originals + one copy set.** Literacy; eCourts Services; general. → `general-guidance`.
**C-file-1 — application with complete party details; exact local format varies, verify at counter.** Filing requirement shape; eCourts manuals + MP district eCourts; MP District. → `needs-verification`.
**C-file-2 — supporting affidavit WHERE APPLICABLE, signed, consistent; applicability varies.** Conditional requirement; eCourts manuals. → `needs-verification`.
**C-file-3 — annexures ordered with continuous page numbers.** Hearing-usability practice; eCourts manuals; general. → `general-guidance`.
**C-file-4 — keep filing acknowledgement; it is the tracking token until listing.** Tracking literacy; MP district eCourts; MP District. → `general-guidance`.
**C-list-1 — check cause list evening-before + morning, portal + display board.** Lookup path confirmed on services.ecourts.gov.in. → `verified`.
**C-hear-1 — carry acknowledgement + prior orders + one-page request note.** Preparedness; eCourts Services; general. → `general-guidance`.
**C-order-1 — collect signed order copy, highlight dates.** Authoritative-record habit; eCourts Services; general. → `general-guidance`.
**C-next-1 — every direction becomes a dated task with two reminders.** Compliance discipline; eCourts Services; general. → `general-guidance`.

## Glossary (16)

Cause list, listing, adjournment, annexure, registry, defect/objection, order, notice, summons, stay → plain-language literacy; eCourts Services/manuals; general. → `general-guidance` (cause-list lookup `verified`).
Mentioning, affidavit, vakalatnama, interim application → exact local applicability varies (whether/when required). → `needs-verification`.
Bail, anticipatory bail → release-from-custody concept + pre-arrest protection sought before custody; India Code pointed for current text, no sections asserted. → `general-guidance`.

## Decoder outputs (not claims — method statements)

- Dates/case-refs/terms are regex-extracted from user text, shown with counts; never asserted beyond the pasted text.
- Doc-type and stage are keyword hypotheses capped at medium confidence with visible evidence signals.
- Every result ships an explicit "cannot safely be inferred" list + signed-order/registry pointer.
- Parties are NOT auto-identified (misattribution risk) — stated in UI.
