import { GLOSSARY, STAGES } from "./data";
import { STRATEGY_RE } from "./safety";

export interface DecodedDoc {
  docType: "order" | "notice" | "summons" | "unidentified";
  docTypeConfidence: "high" | "medium" | "low";
  summaryEn: string;
  summaryHi: string;
  dates: string[];
  caseRefs: string[];
  partiesNoteEn: string;
  partiesNoteHi: string;
  termsFound: { id: string; term: string }[];
  mappedStageId: string;
  /** Visible evidence: why this type / stage was chosen. Never chain-of-thought. */
  signalsEn: string[];
  signalsHi: string[];
  /** Non-empty when the document falls outside the V1 journey (e.g. High Court). */
  scopeNoteEn: string;
  scopeNoteHi: string;
  nextEn: string;
  nextHi: string;
  unknownsEn: string[];
  unknownsHi: string[];
  safetyEn: string;
  safetyHi: string;
}

const DATE_RE =
  /(\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b|\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*,?\s+\d{2,4}\b)/gi;

const CASE_RE =
  /\b((?:BA|B\.A\.|MCRC|M\.Cr\.C\.|SLP|S\.L\.P\.|CRL|Case|C\.C\.|S\.T\.|S\.C\.|CIS|CNR|N\/)\s*[./-]?\s*[A-Z()]*\.?\s*\d[\d/.-]*\d|No\.\s*\d{2,}\/\d{2,})/gi;

function includesWord(hay: string, word: string) {
  return new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?\\b`, "i").test(hay);
}

export function decodeDocument(rawText: string): DecodedDoc | { error: string } {
  const text = rawText.trim();
  if (text.length < 40) {
    return { error: "We could not reliably read this document. Please paste more complete text or try a demo document." };
  }
  const lower = text.toLowerCase();
  const signalsEn: string[] = [];
  const signalsHi: string[] = [];

  let docType: DecodedDoc["docType"] = "unidentified";
  let conf: DecodedDoc["docTypeConfidence"] = "low";
  if (/(^|\n)\s*order\b/.test(lower) || includesWord(lower, "order") && includesWord(lower, "heard")) {
    docType = "order";
    conf = lower.includes("demo document") || lower.includes("order") ? "medium" : "low";
    signalsEn.push(`Treated as an order because the text contains “order” near “heard”.`);
    signalsHi.push(`पाठ में “order” व “heard” होने से इसे आदेश माना गया।`);
  }
  if (includesWord(lower, "notice") && includesWord(lower, "appear")) {
    docType = docType === "order" ? docType : "notice";
    if (docType === "notice") {
      conf = "medium";
      signalsEn.push(`Treated as a notice because the text asks someone to “appear”.`);
      signalsHi.push(`पाठ में “appear” होने से इसे नोटिस माना गया।`);
    }
  }
  if (includesWord(lower, "summons")) {
    docType = "summons";
    conf = "medium";
    signalsEn.push(`Treated as summons because the word “summons” appears.`);
    signalsHi.push(`“summons” शब्द होने से इसे सम्मन माना गया।`);
  }

  const dates = Array.from(new Set(Array.from(text.matchAll(DATE_RE)).map((m) => m[1]).slice(0, 8)));
  const caseRefs = Array.from(new Set(Array.from(text.matchAll(CASE_RE)).map((m) => m[1].trim()).slice(0, 6)));
  dates.slice(0, 3).forEach((d) => {
    signalsEn.push(`Date detected: “${d}”.`);
    signalsHi.push(`तारीख मिली: “${d}”।`);
  });
  caseRefs.slice(0, 2).forEach((c) => {
    signalsEn.push(`Reference detected: “${c}”.`);
    signalsHi.push(`संदर्भ मिला: “${c}”।`);
  });

  const termsFound = GLOSSARY.filter((g) => {
    const keys = [g.term.toLowerCase(), g.hindi, g.id.replace(/-/g, " ")];
    return keys.some((k) => k.length > 2 && lower.includes(k));
  })
    .slice(0, 8)
    .map((g) => ({ id: g.id, term: g.term }));

  // Map to journey stage using deterministic keyword logic (no model inference of law).
  // Each rule appends its evidence so the UI can show "why this stage".
  let mappedStageId = "order";
  const mapSignal = (en: string, hi: string) => {
    signalsEn.push(en);
    signalsHi.push(hi);
  };
  if (docType === "notice" || docType === "summons") {
    mappedStageId = "listing";
    mapSignal("Notices/summons carry a date to appear, so mapped to Listing.", "नोटिस/सम्मन में उपस्थिति तारीख होती है, इसलिए लिस्टिंग से जोड़ा गया।");
  }
  if (includesWord(lower, "reply") || includesWord(lower, "prosecution")) {
    mappedStageId = "hearing";
    mapSignal("Words like “reply/prosecution” suggest an ongoing hearing.", "“reply/prosecution” जैसे शब्द जारी सुनवाई की ओर इशारा करते हैं।");
  }
  if (includesWord(lower, "list") && dates.length > 0) {
    mappedStageId = "listing";
    mapSignal("Phrase like “list the matter” plus a date → mapped to Listing.", "“list the matter” जैसा वाक्य + तारीख → लिस्टिंग से जोड़ा गया।");
  }
  if (includesWord(lower, "adjourned") || includesWord(lower, "adjourn")) {
    mappedStageId = "order";
    mapSignal("Word “adjourned” records what the court directed → mapped to Order.", "“adjourned” शब्द न्यायालयीन निर्देश दर्शाता है → आदेश से जोड़ा गया।");
  }
  if (includesWord(lower, "defect") || includesWord(lower, "objection")) {
    mappedStageId = "scrutiny";
    mapSignal("Words “defect/objection” come from the registry → mapped to Scrutiny.", "“defect/objection” शब्द रजिस्ट्री से आते हैं → जांच से जोड़ा गया।");
  }
  // A granted/disposed order records the court's decision → Order, even when the
  // text also narrates earlier hearing language. Placed last so it wins ties.
  if (docType === "order" && /(application[^.]{0,80}is\s+allowed|stands?\s+disposed\s+of|bail application[^.]{0,80}is\s+allowed)/.test(lower)) {
    mappedStageId = "order";
    mapSignal("Phrases like “application is allowed / stands disposed of” record a decision → mapped to Order.", "“allowed / disposed of” जैसे वाक्य निर्णय दर्शाते हैं → आदेश से जोड़ा गया।");
  }

  // Jurisdiction honesty: High Court / Supreme Court documents fall outside the
  // V1 District-Court journey. Flag, don't pretend.
  let scopeNoteEn = "";
  let scopeNoteHi = "";
  if (/(high court|supreme court|apex court)/.test(lower)) {
    scopeNoteEn =
      "Scope note: this document appears to come from a High Court or the Supreme Court — outside the V1 journey (MP District Courts). Stages and next steps below are general guidance only; verify against the actual court's procedure.";
    scopeNoteHi =
      "दायरा नोट: यह दस्तावेज़ उच्च न्यायालय या उच्चतम न्यायालय का प्रतीत होता है — V1 यात्रा (म.प्र. जिला न्यायालय) से बाहर। नीचे के चरण सामान्य मार्गदर्शन मात्र हैं; संबंधित न्यायालय की प्रक्रिया से सत्यापित करें।";
  }

  const stage = STAGES.find((s) => s.id === mappedStageId) ?? STAGES[5];

  const typeLabelEn =
    docType === "order"
      ? "court order"
      : docType === "notice"
        ? "court notice"
        : docType === "summons"
          ? "summons"
          : "court-related document";
  const typeLabelHi =
    docType === "order" ? "न्यायालयीन आदेश" : docType === "notice" ? "न्यायालयीन नोटिस" : docType === "summons" ? "सम्मन" : "न्यायालयीन दस्तावेज़";

  const summaryEn =
    docType === "unidentified"
      ? "Based on the text provided, this appears to be a court-related document, but its exact type cannot be safely identified. Please verify against the original signed copy."
      : `Based on the text provided, this appears to be a ${typeLabelEn}. ` +
        (dates.length > 0
          ? `It mentions ${dates.length === 1 ? "a date" : "dates"} (${dates.slice(0, 3).join(", ")}). `
          : "No clear hearing date could be extracted — check the original for dates. ") +
        `It appears to relate to the “${stage.titleEn}” part of the journey. Please verify with the current court record.`;
  const summaryHi =
    docType === "unidentified"
      ? "दिए गए पाठ के आधार पर यह न्यायालयीन दस्तावेज़ प्रतीत होता है, पर सटीक प्रकार सुरक्षित रूप से पहचाना नहीं जा सका। मूल हस्ताक्षरित प्रति से जांचें।"
      : `दिए गए पाठ के आधार पर यह ${typeLabelHi} प्रतीत होता है। ` +
        (dates.length > 0 ? `इसमें तारीख उल्लिखित है (${dates.slice(0, 3).join(", ")})। ` : "स्पष्ट तारीख नहीं मिली — मूल प्रति में तारीख जांचें। ") +
        `यह यात्रा के “${stage.titleHi}” चरण से संबंधित प्रतीत होता है। वर्तमान न्यायालयीन रिकॉर्ड से सत्यापित करें।`;

  const unknownsEn: string[] = [];
  const unknownsHi: string[] = [];
  if (dates.length === 0) {
    unknownsEn.push("No hearing or compliance date could be safely extracted.");
    unknownsHi.push("कोई सुनवाई या पालन तारीख सुरक्षित रूप से नहीं निकाली जा सकी।");
  }
  if (caseRefs.length === 0) {
    unknownsEn.push("No case identifier could be safely extracted — match this document to your case file manually.");
    unknownsHi.push("प्रकरण पहचान संख्या सुरक्षित रूप से नहीं मिली — दस्तावेज़ को फ़ाइल से स्वयं मिलाएं।");
  }
  if (docType === "unidentified") {
    unknownsEn.push("Document type is uncertain — do not act on assumptions about what this paper is.");
    unknownsHi.push("दस्तावेज़ का प्रकार अनिश्चित है — अनुमान पर कार्रवाई न करें।");
  }
  if (scopeNoteEn) {
    unknownsEn.push("Jurisdiction is outside the V1 journey — treat stages below as general guidance, not registry-confirmed steps.");
    unknownsHi.push("अधिकार-क्षेत्र V1 यात्रा से बाहर है — नीचे के चरणों को सामान्य मार्गदर्शन मानें, पुष्ट चरण नहीं।");
  }
  unknownsEn.push("This explanation is based only on the pasted text, not the full case record or court discretion.");
  unknownsHi.push("यह व्याख्या केवल दिए गए पाठ पर आधारित है — पूर्ण रिकॉर्ड या न्यायालयीन विवेक पर नहीं।");

  return {
    docType,
    docTypeConfidence: conf,
    summaryEn,
    summaryHi,
    dates,
    caseRefs,
    partiesNoteEn:
      "Parties are not auto-identified in V1 to avoid misattribution. Check names exactly as printed on the document.",
    partiesNoteHi: "V1 में पक्षकार स्वतः पहचाने नहीं जाते ताकि गलत नामन से बचा जा सके। नाम दस्तावेज़ पर छपे अनुसार जांचें।",
    termsFound,
    mappedStageId,
    signalsEn: signalsEn.slice(0, 8),
    signalsHi: signalsHi.slice(0, 8),
    scopeNoteEn,
    scopeNoteHi,
    nextEn: stage.nextEn,
    nextHi: stage.nextHi,
    unknownsEn,
    unknownsHi,
    safetyEn:
      "Court Navigator explains procedure only. It does not assess case outcomes or litigation strategy. Verify with the signed order and the court registry.",
    safetyHi: "कोर्ट नेविगेटर केवल प्रक्रिया समझाता है। परिणाम या रणनीति नहीं बताता। हस्ताक्षरित आदेश व रजिस्ट्री से सत्यापित करें।",
  };
}

export function assistantReply(input: string): { en: string; hi: string } {
  const q = input.toLowerCase();
  if (STRATEGY_RE.test(q)) {
    return {
      en: "I can help explain the procedural stage and what the court process generally requires, but Court Navigator does not assess case outcomes or provide litigation strategy.",
      hi: "मैं प्रक्रियात्मक चरण समझाने में मदद कर सकता हूं, पर कोर्ट नेविगेटर परिणाम या रणनीति नहीं बताता।",
    };
  }
  const hit = GLOSSARY.find(
    (g) => q.includes(g.term.toLowerCase()) || q.includes(g.hindi) || q.includes(g.id.replace(/-/g, " "))
  );
  if (hit) {
    return {
      en: `${hit.term} — ${hit.simpleEn} ${hit.whyEn}`,
      hi: `${hit.term} (${hit.hindi}) — ${hit.simpleHi} ${hit.whyHi}`,
    };
  }
  if (q.includes("next") || q.includes("agle") || q.includes("आगे")) {
    return {
      en: "Tell me your current stage (e.g. Filing, Listing, Hearing, Order) and I will show the next likely procedural step with its source. Procedure can vary by registry — verification flags apply.",
      hi: "अपना वर्तमान चरण बताएं (जैसे फ़ाइलिंग, लिस्टिंग, सुनवाई, आदेश) — अगला संभावित चरण स्रोत सहित दिखाऊंगा। रजिस्ट्री अनुसार भिन्नता संभव है।",
    };
  }
  if (q.includes("support") || q.includes("scope") || q.includes("court")) {
    return {
      en: "V1 supports Madhya Pradesh District Courts — Criminal Bail navigation only. Other courts and procedures are marked Coming Soon and are not answered as if verified.",
      hi: "V1 में केवल म.प्र. जिला न्यायालय — आपराधिक जमानत मार्गदर्शन समर्थित है। शेष Coming Soon है।",
    };
  }
  return {
    en: "I answer from the verified journey corpus (roadmap, checklist, glossary, sources). Ask about a stage, a term like “cause list”, or paste an order to decode it.",
    hi: "मैं सत्यापित यात्रा-संग्रह से उत्तर देता हूं। कोई चरण, “कॉज़ लिस्ट” जैसा शब्द पूछें, या आदेश paste करके समझें।",
  };
}
