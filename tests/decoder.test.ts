import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { decodeDocument, assistantReply } from "../src/lib/decoder";
import { DEMO_DOCS } from "../src/lib/data";

const ORDER = DEMO_DOCS[0].fictionalText;
const NOTICE = DEMO_DOCS[1].fictionalText;

describe("decodeDocument", () => {
  it("rejects tiny input with an honest error", () => {
    const out = decodeDocument("hello") as { error: string };
    assert.match(out.error, /could not reliably read/i);
  });

  it("classifies the demo order and maps listing (list + date rule wins)", () => {
    const out = decodeDocument(ORDER);
    assert.ok(!("error" in out));
    if ("error" in out) return;
    assert.equal(out.docType, "order");
    assert.equal(out.mappedStageId, "listing");
    assert.ok(out.dates.includes("04-09-2026"));
    assert.ok(out.dates.includes("18-09-2026"));
    assert.ok(out.caseRefs.length > 0);
    assert.ok(out.signalsEn.length > 0, "must emit evidence signals");
    assert.ok(out.unknownsEn.length > 0, "must admit unknowns");
  });

  it("classifies the demo notice and maps listing", () => {
    const out = decodeDocument(NOTICE);
    assert.ok(!("error" in out));
    if ("error" in out) return;
    assert.equal(out.docType, "notice");
    assert.equal(out.mappedStageId, "listing");
  });

  it("marks defect language as scrutiny", () => {
    const out = decodeDocument(
      "Registry objection: the filing has a defect. Remove the defect and re-file the bail application papers at the counter."
    );
    assert.ok(!("error" in out));
    if ("error" in out) return;
    assert.equal(out.mappedStageId, "scrutiny");
  });

  it("stays uncertain on vague text", () => {
    const out = decodeDocument(
      "This is a long enough piece of writing about visiting the court premises yesterday for general information purposes only."
    );
    assert.ok(!("error" in out));
    if ("error" in out) return;
    assert.equal(out.docType, "unidentified");
    assert.ok(out.unknownsEn.some((u) => /uncertain/i.test(u)));
  });

  it("never assigns high confidence", () => {
    for (const t of [ORDER, NOTICE]) {
      const out = decodeDocument(t);
      assert.ok(!("error" in out));
      if ("error" in out) continue;
      assert.notEqual(out.docTypeConfidence, "high");
    }
  });
});

describe("real High Court anticipatory-bail order (fixture)", () => {
  const text = readFileSync("tests/fixtures/hc-anticipatory-bail-order.txt", "utf8");

  it("classifies as order and maps the granted bail to the order stage", () => {
    const out = decodeDocument(text);
    assert.ok(!("error" in out));
    if ("error" in out) return;
    assert.equal(out.docType, "order");
    assert.equal(out.mappedStageId, "order");
  });

  it("extracts month-name dates with commas and MCRC/SLP references", () => {
    const out = decodeDocument(text);
    assert.ok(!("error" in out));
    if ("error" in out) return;
    assert.ok(out.dates.includes("7 January, 2026"), `dates: ${out.dates}`);
    assert.ok(out.dates.includes("19.12.2025"));
    assert.ok(out.caseRefs.some((r) => r.includes("MCRC-50247-2025")), `refs: ${out.caseRefs}`);
    assert.ok(out.caseRefs.some((r) => r.includes("15170/2025")));
  });

  it("finds bail terminology and flags High Court scope honestly", () => {
    const out = decodeDocument(text);
    assert.ok(!("error" in out));
    if ("error" in out) return;
    const terms = out.termsFound.map((t) => t.term);
    assert.ok(terms.includes("Bail"));
    assert.ok(terms.includes("Anticipatory Bail"));
    assert.ok(out.scopeNoteEn.includes("High Court"), "must flag out-of-V1-journey scope");
    assert.ok(out.unknownsEn.some((u) => /outside the V1 journey/i.test(u)));
  });

  it("keeps demo fixtures scoped (no false scope flag)", () => {
    for (const t of [ORDER, NOTICE]) {
      const out = decodeDocument(t);
      assert.ok(!("error" in out));
      if ("error" in out) continue;
      assert.equal(out.scopeNoteEn, "");
    }
  });

  it("marks the decisive stage signal (last rule wins, stays visible)", () => {
    const out = decodeDocument(ORDER);
    assert.ok(!("error" in out));
    if ("error" in out) return;
    assert.ok(out.decisiveEn.length > 0);
    assert.ok(out.signalsEn.includes(out.decisiveEn), "decisive signal must survive the display cap");
    assert.match(out.decisiveEn, /list the matter/i);
  });
});

describe("assistantReply", () => {
  it("refuses outcome/strategy questions", () => {
    for (const q of ["Will I get bail?", "What argument guarantees success?", "Which loophole should I exploit?"]) {
      assert.match(assistantReply(q).en, /does not assess case outcomes/i);
    }
  });

  it("answers glossary terms from corpus", () => {
    assert.match(assistantReply("What does listing mean?").en, /cause list/i);
  });

  it("states narrow scope", () => {
    assert.match(assistantReply("Which courts are supported?").en, /Madhya Pradesh/i);
  });
});
