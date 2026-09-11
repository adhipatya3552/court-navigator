import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveNext, kindLabel } from "../src/lib/journey";

describe("resolveNext", () => {
  it("prepare → filing (typical)", () => {
    const r = resolveNext("prepare");
    assert.equal(r.kind, "typical");
    assert.equal(r.nextStageId, "filing");
  });

  it("filing branches on defect", () => {
    assert.equal(resolveNext("filing").nextStageId, "scrutiny");
    assert.equal(resolveNext("filing", { defect: true }).nextStageId, "prepare");
    assert.equal(resolveNext("filing").kind, "conditional");
    assert.ok(resolveNext("filing").alternatives.length === 2);
  });

  it("scrutiny is a conditional gate", () => {
    const r = resolveNext("scrutiny");
    assert.equal(r.kind, "conditional");
    assert.equal(r.nextStageId, "listing");
    assert.equal(resolveNext("scrutiny", { defect: true }).nextStageId, "filing");
  });

  it("hearing can loop back to listing (adjournment)", () => {
    const r = resolveNext("hearing");
    assert.equal(r.kind, "conditional");
    assert.ok(r.alternatives.some((a) => a.stageId === "listing"));
  });

  it("order is order-dependent", () => {
    const r = resolveNext("order");
    assert.equal(r.kind, "order-dependent");
    assert.equal(r.nextStageId, "next-stage");
  });

  it("listing advances typically; the journey loops back from next-stage", () => {
    const l = resolveNext("listing");
    assert.equal(l.kind, "typical");
    assert.equal(l.nextStageId, "hearing");
    const n = resolveNext("next-stage");
    assert.equal(n.kind, "typical");
    assert.equal(n.nextStageId, "listing");
  });

  it("weak evidence → uncertain", () => {
    const r = resolveNext("hearing", { weak: true });
    assert.equal(r.kind, "uncertain");
  });

  it("unknown stage → uncertain with no target", () => {
    const r = resolveNext("nope");
    assert.equal(r.kind, "uncertain");
    assert.equal(r.nextStageId, null);
  });

  it("labels exist in both languages", () => {
    assert.ok(kindLabel("typical", "en").length > 0);
    assert.ok(kindLabel("uncertain", "hi").length > 0);
  });
});
