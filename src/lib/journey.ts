import { STAGES } from "./data";

/** How certain the "next step" is — never imply certainty where none exists. */
export type BranchKind = "typical" | "conditional" | "order-dependent" | "uncertain";

export interface BranchAlt {
  stageId: string;
  whenEn: string;
  whenHi: string;
}

export interface NextResolution {
  kind: BranchKind;
  nextStageId: string | null;
  alternatives: BranchAlt[];
  reasonEn: string;
  reasonHi: string;
}

export interface ResolveOpts {
  /** Registry/counter raised a defect or objection. */
  defect?: boolean;
  /** Evidence for the current stage is weak (e.g. vague document). */
  weak?: boolean;
}

const KIND_LABEL: Record<BranchKind, { en: string; hi: string }> = {
  typical: { en: "Typical next step", hi: "सामान्य अगला चरण" },
  conditional: { en: "Conditional — depends on what happens", hi: "सशर्त — परिस्थिति पर निर्भर" },
  "order-dependent": { en: "Order-dependent", hi: "आदेश पर निर्भर" },
  uncertain: { en: "Uncertain — verify first", hi: "अनिश्चित — पहले सत्यापित करें" },
};

export function kindLabel(kind: BranchKind, lang: "en" | "hi") {
  return KIND_LABEL[kind][lang];
}

function stageTitle(id: string, lang: "en" | "hi") {
  const s = STAGES.find((x) => x.id === id);
  return s ? (lang === "en" ? s.titleEn : s.titleHi) : id;
}

export function resolveNext(stageId: string, opts: ResolveOpts = {}): NextResolution {
  // Produces both reason* and when* keys so the same helper serves
  // NextResolution and BranchAlt (spread extras are permitted).
  const L = (en: string, hi: string) => ({ reasonEn: en, reasonHi: hi, whenEn: en, whenHi: hi });

  if (opts.weak) {
    const fallback = fallbackNext(stageId);
    return {
      kind: "uncertain",
      nextStageId: fallback,
      alternatives: [],
      ...L(
        "Evidence for the current stage is weak, so no next step is asserted. Confirm the stage from the signed order or registry first.",
        "वर्तमान चरण का प्रमाण कमजोर है, इसलिए अगला चरण बताया नहीं जा रहा। पहले हस्ताक्षरित आदेश या रजिस्ट्री से चरण पुष्ट करें।"
      ),
    };
  }

  switch (stageId) {
    case "prepare":
      return {
        kind: "typical",
        nextStageId: "filing",
        alternatives: [],
        ...L(
          "Once parties, stage and court are organised, papers normally go to the filing office.",
          "पक्षकार, स्थिति और न्यायालय व्यवस्थित होते ही कागज़ सामान्यतः फ़ाइलिंग कार्यालय में जाते हैं।"
        ),
      };
    case "filing":
      return {
        kind: "conditional",
        nextStageId: opts.defect ? "prepare" : "scrutiny",
        alternatives: [
          {
            stageId: "prepare",
            ...L("when the counter marks objections — fix and re-present", "जब काउंटर आपत्ति लगाए — सुधार कर पुनः प्रस्तुत करें"),
          },
          {
            stageId: "scrutiny",
            ...L("when papers are accepted without objection", "जब कागज़ बिना आपत्ति स्वीकार हों"),
          },
        ],
        ...L(
          opts.defect
            ? "A defect was indicated, so the matter loops back to preparation instead of moving forward."
            : "If the filing is accepted, the registry checks completeness; any objection loops back to preparation.",
          opts.defect
            ? "कमी बताई गई है, इसलिए मामला आगे बढ़ने के बजाय तैयारी पर लौटता है।"
            : "फ़ाइलिंग स्वीकार हो तो रजिस्ट्री पूर्णता जांचती है; आपत्ति पर तैयारी पर वापसी होती है।"
        ),
      };
    case "scrutiny":
      return {
        kind: "conditional",
        nextStageId: opts.defect ? "filing" : "listing",
        alternatives: [
          {
            stageId: "filing",
            ...L("when defects are marked — correct and re-file", "जब कमी लगे — सुधार कर पुनः फ़ाइल करें"),
          },
          {
            stageId: "listing",
            ...L("when the filing is complete and processed toward listing", "जब फ़ाइलिंग पूर्ण होकर लिस्टिंग की ओर बढ़े"),
          },
        ],
        ...L(
          "Scrutiny is a gate, not a queue: complete filings move to listing, defective ones return.",
          "जांच द्वार है, कतार नहीं — पूर्ण फ़ाइलिंग लिस्टिंग में, कमी वाली वापस जाती है।"
        ),
      };
    case "listing":
      return {
        kind: "typical",
        nextStageId: "hearing",
        alternatives: [],
        ...L(
          "A listed matter is normally called for hearing on its date — re-check the cause list that morning.",
          "listed मामला सामान्यतः तारीख पर सुनवाई हेतु पुकारा जाता है — उस सुबह कॉज़ लिस्ट पुनः जांचें।"
        ),
      };
    case "hearing":
      return {
        kind: "conditional",
        nextStageId: "order",
        alternatives: [
          {
            stageId: "order",
            ...L("when the court records directions at that hearing", "जब न्यायालय उस सुनवाई में निर्देश अभिलिखित करे"),
          },
          {
            stageId: "listing",
            ...L("when the matter is adjourned — a fresh date means fresh listing", "जब मामला स्थगित हो — नई तारीख यानी नई लिस्टिंग"),
          },
        ],
        ...L(
          "A hearing normally produces an order, but adjournment loops back to listing with a new date.",
          "सुनवाई में सामान्यतः आदेश बनता है, पर स्थगन पर नई तारीख सहित लिस्टिंग में वापसी होती है।"
        ),
      };
    case "order":
      return {
        kind: "order-dependent",
        nextStageId: "next-stage",
        alternatives: [],
        ...L(
          "What follows depends entirely on the operative lines of this order — dates, directions, conditions. Read them first; never assume.",
          "आगे क्या होगा यह पूर्णतः इस आदेश की operative पंक्तियों पर निर्भर है — तारीखें, निर्देश, शर्तें। पहले वही पढ़ें; अनुमान न लगाएं।"
        ),
      };
    case "next-stage":
      return {
        kind: "typical",
        nextStageId: "listing",
        alternatives: [],
        ...L(
          "After compliance, the loop continues: watch the cause list for the next hearing date.",
          "पालन के बाद चक्र जारी रहता है — अगली सुनवाई हेतु कॉज़ लिस्ट देखते रहें।"
        ),
      };
    default:
      return {
        kind: "uncertain",
        nextStageId: null,
        alternatives: [],
        ...L("Unknown stage — no next step can be suggested.", "अज्ञात चरण — अगला चरण सुझाया नहीं जा सकता।"),
      };
  }
}

function fallbackNext(stageId: string): string | null {
  const idx = STAGES.findIndex((s) => s.id === stageId);
  if (idx < 0 || idx >= STAGES.length - 1) return null;
  return STAGES[idx + 1].id;
}

export function stageName(id: string | null, lang: "en" | "hi"): string {
  if (!id) return lang === "en" ? "—" : "—";
  return stageTitle(id, lang);
}

