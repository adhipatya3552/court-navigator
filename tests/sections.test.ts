import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * Guards the visible section numbering (02 Setup → 10 Trust).
 * Reads source (no rendering) so a swapped label like the FAQ/Scope
 * "10 before 09" incident fails fast without touching runtime code.
 */
const FILES = [
  "src/components/JourneySetup.tsx",
  "src/components/Roadmap.tsx",
  "src/components/Checklist.tsx",
  "src/components/Glossary.tsx",
  "src/components/Decoder.tsx",
  "src/components/NextStep.tsx",
  "src/components/Assistant.tsx",
  "src/components/Faq.tsx",
  "src/components/Scope.tsx",
];

describe("section numbering", () => {
  it("runs 02..10 in page order, no duplicates", () => {
    const nums: string[] = FILES.map((f) => {
      const src = readFileSync(f, "utf8");
      const m = src.match(/>(0\d|10) · /);
      assert.ok(m, `${f} has no numbered eyebrow`);
      return m![1];
    });
    assert.deepEqual(nums, ["02", "03", "04", "05", "06", "07", "08", "09", "10"]);
  });

  it("page composes sections in the same order", () => {
    const page = readFileSync("src/app/page.tsx", "utf8");
    const order = ["JourneySetup", "Roadmap", "Checklist", "Glossary", "Decoder", "NextStep", "Assistant", "Faq", "Scope"];
    let last = -1;
    for (const name of order) {
      const i = page.indexOf(`<${name}`);
      assert.ok(i > last, `${name} out of order`);
      last = i;
    }
  });
});
