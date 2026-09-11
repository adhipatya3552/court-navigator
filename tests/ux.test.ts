import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { FAQ_ITEMS, HELP_TOPICS, SHORTCUTS } from "../src/lib/help";
import { onboardComplete, markOnboarded, resetOnboarded, ONBOARD_EVENT } from "../src/lib/onboard";

function fakeWindow() {
  const mem = new Map<string, string>();
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
      setItem: (k: string, v: string) => void mem.set(k, String(v)),
      removeItem: (k: string) => void mem.delete(k),
    },
    dispatchEvent: () => true,
  };
}

describe("onboarding persistence", () => {
  beforeEach(() => {
    fakeWindow();
    resetOnboarded();
  });

  it("starts incomplete, completes on mark, resets cleanly", () => {
    assert.equal(onboardComplete(), false);
    markOnboarded();
    assert.equal(onboardComplete(), true);
    resetOnboarded();
    assert.equal(onboardComplete(), false);
  });

  it("never throws without a window (SSR safety)", () => {
    delete (globalThis as unknown as { window?: unknown }).window;
    assert.doesNotThrow(() => markOnboarded());
    assert.equal(onboardComplete(), false);
    assert.equal(typeof ONBOARD_EVENT, "string");
  });
});

describe("FAQ data", () => {
  it("has 8 unique, bilingual, non-legal-claim items", () => {
    assert.equal(FAQ_ITEMS.length, 8);
    assert.equal(new Set(FAQ_ITEMS.map((f) => f.id)).size, 8);
    for (const f of FAQ_ITEMS) {
      assert.ok(f.qEn.length > 5 && f.qHi.length > 5, f.id);
      assert.ok(f.aEn.length > 20 && f.aHi.length > 20, f.id);
      assert.doesNotMatch(f.aEn, /will win|guarantee|Section \d+/i, f.id);
    }
  });

  it("covers scope honestly (MP/District/Bail only)", () => {
    const scope = FAQ_ITEMS.find((f) => f.id === "scope")!;
    assert.match(scope.aEn, /Madhya Pradesh/i);
    assert.match(scope.aEn, /Coming Soon/i);
  });
});

describe("help topics + shortcuts", () => {
  it("topics are short and link only to real anchors", () => {
    assert.equal(HELP_TOPICS.length, 5);
    for (const h of HELP_TOPICS) {
      assert.ok(h.bodyEn.length <= 240, h.id);
      assert.ok(h.bodyHi.length <= 240, h.id);
      if (h.href) assert.match(h.href, /^#(setup|decoder|glossary|scope|faq)$/, h.id);
    }
  });

  it("shortcuts map to existing sections or onboarding", () => {
    assert.equal(SHORTCUTS.length, 4);
    for (const s of SHORTCUTS) {
      assert.ok(s.target === "onboarding" || /^#(setup|decoder|glossary)$/.test(s.target), s.id);
      assert.ok(s.labelEn.length > 0 && s.labelHi.length > 0, s.id);
    }
  });
});
