"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

const STRINGS: Record<string, { en: string; hi: string }> = {
  "nav.product": { en: "Court Navigator", hi: "कोर्ट नेविगेटर" },
  "nav.tag": { en: "MP District Courts · Criminal · Bail", hi: "म.प्र. जिला न्यायालय · आपराधिक · जमानत" },
  "nav.start": { en: "Start Navigation", hi: "नेविगेशन शुरू करें" },
  "nav.decode": { en: "Decode document", hi: "दस्तावेज़ समझें" },
  "hero.badge": { en: "ILTN × vibecode.law Vibeathon 2026 · Prototype", hi: "ILTN × vibecode.law वाइबाथॉन 2026 · प्रोटोटाइप" },
  "hero.titleA": { en: "You know your case.", hi: "आप अपना मामला जानते हैं।" },
  "hero.titleB": { en: "We help you navigate the procedure.", hi: "हम प्रक्रिया समझने में मदद करते हैं।" },
  "hero.sub": {
    en: "A procedural guidance tool for MP District Court bail navigation — where am I, what does this mean, what should I prepare, and what happens next?",
    hi: "म.प्र. जिला न्यायालय में जमानत प्रक्रिया हेतु मार्गदर्शन — मैं कहां हूं, इसका अर्थ क्या है, क्या तैयार करूं, आगे क्या होगा?",
  },
  "hero.cta1": { en: "Start Court Navigation", hi: "कोर्ट नेविगेशन शुरू करें" },
  "hero.cta2": { en: "Decode a court document", hi: "न्यायालयीन दस्तावेज़ समझें" },
  "hero.note": {
    en: "Procedural guidance only. Not legal advice. Sources shown on every step.",
    hi: "केवल प्रक्रियात्मक मार्गदर्शन। विधिक सलाह नहीं। प्रत्येक चरण पर स्रोत दिखाए गए हैं।",
  },
  "setup.title": { en: "Where are you in the process?", hi: "प्रक्रिया में आप कहां हैं?" },
  "setup.sub": {
    en: "V1 fully supports one journey. Everything else is honestly marked as coming soon.",
    hi: "V1 में एक यात्रा पूर्ण समर्थित है। शेष को स्पष्ट रूप से coming soon बताया गया है।",
  },
  "roadmap.title": { en: "Your procedural roadmap", hi: "आपकी प्रक्रियात्मक यात्रा" },
  "roadmap.sub": {
    en: "Like Google Maps for court procedure — you are here, and this is what comes next.",
    hi: "कोर्ट प्रक्रिया हेतु Google Maps जैसा — आप यहां हैं, और आगे यह आएगा।",
  },
  "stage.youAreHere": { en: "YOU ARE HERE", hi: "आप यहां हैं" },
  "checklist.title": { en: "Procedural checklist", hi: "प्रक्रियात्मक जांच-सूची" },
  "glossary.title": { en: "Court terminology, in plain words", hi: "न्यायालयीन शब्दावली, सरल भाषा में" },
  "decoder.title": { en: "Procedural decoder", hi: "प्रक्रियात्मक डिकोडर" },
  "next.title": { en: "I am here → what happens next?", hi: "मैं यहां हूं → आगे क्या होगा?" },
  "assistant.title": { en: "Procedural assistant", hi: "प्रक्रियात्मक सहायक" },
  "scope.title": { en: "Scope, sources & safety", hi: "दायरा, स्रोत और सुरक्षा" },
  "footer.disclaimer": {
    en: "Court Navigator provides procedural guidance and legal-literacy information. It is not a substitute for a lawyer and does not provide litigation strategy or outcome assessment.",
    hi: "कोर्ट नेविगेटर प्रक्रियात्मक मार्गदर्शन व विधिक साक्षरता जानकारी देता है। यह अधिवक्ता का विकल्प नहीं है और न मुकदमे की रणनीति या परिणाम बताता है।",
  },
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LangCtx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = useCallback(
    (key: string) => {
      const s = STRINGS[key];
      if (!s) return key;
      return s[lang];
    },
    [lang]
  );
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}
