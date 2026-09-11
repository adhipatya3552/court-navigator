export interface FaqItem {
  id: string;
  qEn: string;
  qHi: string;
  aEn: string;
  aHi: string;
}

/** Compact pre-use FAQ. Answers only restate documented behavior/scope — no legal claims. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is",
    qEn: "What is Court Navigator?",
    qHi: "कोर्ट नेविगेटर क्या है?",
    aEn: "A procedural guidance tool for one supported journey — MP District Court bail navigation. It shows where you are in the process, what a document appears to mean, what to prepare, and what may happen next.",
    aHi: "एक प्रक्रियात्मक मार्गदर्शन उपकरण — म.प्र. जिला न्यायालय जमानत यात्रा हेतु। यह बताता है आप प्रक्रिया में कहां हैं, दस्तावेज़ का अर्थ क्या प्रतीत होता है, क्या तैयार करें, और आगे क्या हो सकता है।",
  },
  {
    id: "legal-advice",
    qEn: "Is this legal advice?",
    qHi: "क्या यह विधिक सलाह है?",
    aEn: "No. It gives procedural guidance and plain-language explanations. It does not replace a lawyer, decide outcomes, give litigation strategy, or predict results.",
    aHi: "नहीं। यह प्रक्रियात्मक मार्गदर्शन व सरल व्याख्या देता है। यह अधिवक्ता का विकल्प नहीं है — परिणाम, रणनीति या भविष्यवाणी नहीं बताता।",
  },
  {
    id: "get-started",
    qEn: "How do I get started?",
    qHi: "शुरुआत कैसे करूं?",
    aEn: "Pick “Start Court Navigation” and answer the guided setup, or pick “Decode a court document” if you already hold an order or notice. If unsure, “Try a Sample Case” runs the full flow in one click.",
    aHi: "“Start Court Navigation” चुनकर guided setup पूरा करें, या आदेश/नोटिस हो तो “Decode a court document” चुनें। असमंजस हो तो “Try a Sample Case” एक क्लिक में पूरी प्रक्रिया दिखाता है।",
  },
  {
    id: "unknown-stage",
    qEn: "I don't know what stage my case is at. What should I do?",
    qHi: "मुझे नहीं पता मामला किस चरण में है। क्या करूं?",
    aEn: "That's okay. If you roughly know, pick the closest stage — or paste your document in the decoder and it will suggest procedural clues with evidence. Stage suggestions are an aid, not a substitute for the court record.",
    aHi: "कोई बात नहीं। अंदाज़ा हो तो निकटतम चरण चुनें — या दस्तावेज़ decoder में डालें, वह साक्ष्य सहित संकेत देगा। चरण-सुझाव सहायता है, न्यायालयीन रिकॉर्ड का विकल्प नहीं।",
  },
  {
    id: "uploads",
    qEn: "What documents can I upload?",
    qHi: "कौन-से दस्तावेज़ अपलोड कर सकते हैं?",
    aEn: "Pasted text, .txt / .md files, and PDFs with selectable text (first 10 pages, up to 5 MB). Image-only or scanned PDFs cannot be read reliably — paste their text instead. There is no OCR.",
    aHi: "Paste किया पाठ, .txt / .md फ़ाइलें, और selectable text वाले PDF (पहले 10 पृष्ठ, 5 MB तक)। image-only / स्कैन PDF विश्वसनीयता से पढ़े नहीं जा सकते — उनका पाठ paste करें। OCR नहीं है।",
  },
  {
    id: "will-i-get-bail",
    qEn: "Can Court Navigator tell me whether I will get bail?",
    qHi: "क्या यह बताएगा कि जमानत मिलेगी या नहीं?",
    aEn: "No. It never predicts outcomes or gives strategy. It explains the procedure, what your document appears to indicate, and what to verify next.",
    aHi: "नहीं। यह परिणाम या रणनीति कभी नहीं बताता। यह प्रक्रिया, दस्तावेज़ के संकेत और आगे क्या सत्यापित करना है — यही समझाता है।",
  },
  {
    id: "needs-verification",
    qEn: "Why does it sometimes say “Needs verification”?",
    qHi: "कभी “Needs verification” क्यों लिखा आता है?",
    aEn: "Filing requirements, registry practice and case-specific directions vary by court. Uncertain items are deliberately flagged instead of presented as fact — confirm those at the filing counter or registry.",
    aHi: "फ़ाइलिंग आवश्यकताएं, रजिस्ट्री प्रक्रिया और मामला-विशेष निर्देश न्यायालय अनुसार बदलते हैं। अनिश्चित बिंदुओं को तथ्य बताने के बजाय flag किया जाता है — इन्हें काउंटर / रजिस्ट्री पर पुष्ट करें।",
  },
  {
    id: "scope",
    qEn: "Which courts and matters are supported?",
    qHi: "कौन-से न्यायालय और मामले समर्थित हैं?",
    aEn: "Only: Madhya Pradesh · District / Trial Courts · Criminal · Bail navigation. Everything else is marked Coming Soon and is never answered as if verified.",
    aHi: "केवल: मध्य प्रदेश · जिला / विचारण न्यायालय · आपराधिक · जमानत मार्गदर्शन। शेष Coming Soon है और सत्यापित मानकर उत्तर नहीं दिया जाता।",
  },
];

export interface HelpTopic {
  id: string;
  titleEn: string;
  titleHi: string;
  bodyEn: string;
  bodyHi: string;
  /** Optional deep link opened alongside the answer. */
  href?: string;
}

/** Quick contextual answers for the persistent help menu. Short by design. */
export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "start",
    titleEn: "Where should I start?",
    titleHi: "शुरुआत कहां से करूं?",
    bodyEn: "Know roughly where you are → Start Court Navigation. Holding a paper → Decode a court document. Lost → Try a Sample Case.",
    bodyHi: "अंदाज़ा हो तो → Start Court Navigation। कागज़ हो तो → Decode। असमंजस हो तो → Try a Sample Case।",
    href: "#setup",
  },
  {
    id: "upload",
    titleEn: "What can I upload?",
    titleHi: "क्या अपलोड कर सकते हैं?",
    bodyEn: "Orders, notices or summons as pasted text, .txt / .md, or text PDFs (10 pages, 5 MB). Scanned images can't be read — paste the text instead.",
    bodyHi: "आदेश, नोटिस या सम्मन — paste पाठ, .txt / .md, या text PDF (10 पृष्ठ, 5 MB)। स्कैन image नहीं पढ़ी जा सकती — पाठ paste करें।",
    href: "#decoder",
  },
  {
    id: "stage",
    titleEn: "What does “current stage” mean?",
    titleHi: "“वर्तमान चरण” क्या है?",
    bodyEn: "Which step of the court process your matter is at — e.g. filing, listing, hearing. Unsure? The decoder suggests clues from your document with evidence.",
    bodyHi: "आपका मामला प्रक्रिया के किस चरण में है — जैसे फ़ाइलिंग, लिस्टिंग, सुनवाई। पता न हो तो decoder दस्तावेज़ से साक्ष्य सहित संकेत देता है।",
    href: "#setup",
  },
  {
    id: "verification",
    titleEn: "What does “Needs verification” mean?",
    titleHi: "“Needs verification” क्या है?",
    bodyEn: "That requirement can vary by registry or case. We flag it instead of stating it as fact — confirm it at the filing counter.",
    bodyHi: "वह आवश्यकता रजिस्ट्री या मामले अनुसार बदल सकती है। तथ्य बताने के बजाय flag किया जाता है — काउंटर पर पुष्ट करें।",
  },
  {
    id: "trust",
    titleEn: "Can I trust what it tells me?",
    titleHi: "क्या इस पर भरोसा कर सकते हैं?",
    bodyEn: "Every step shows its source, jurisdiction and verification status, plus evidence for decoder mappings. It explains procedure — it never decides outcomes.",
    bodyHi: "प्रत्येक चरण पर स्रोत, अधिकार-क्षेत्र व सत्यापन स्थिति दिखती है। यह प्रक्रिया समझाता है — परिणाम तय नहीं करता।",
    href: "#scope",
  },
];

export interface Shortcut {
  id: string;
  labelEn: string;
  labelHi: string;
  descEn: string;
  descHi: string;
  /** Anchor to scroll to, or "onboarding" to open the walkthrough. */
  target: string;
}

/** "What brings you here?" shortcuts — navigation only, no new flows. */
export const SHORTCUTS: Shortcut[] = [
  {
    id: "understand",
    labelEn: "I want to understand my case",
    labelHi: "मामला समझना है",
    descEn: "Guided setup → roadmap",
    descHi: "Guided setup → roadmap",
    target: "#setup",
  },
  {
    id: "document",
    labelEn: "I received a court document",
    labelHi: "न्यायालयीन दस्तावेज़ मिला है",
    descEn: "Decode it in plain words",
    descHi: "सरल भाषा में समझें",
    target: "#decoder",
  },
  {
    id: "term",
    labelEn: "I don't understand a court term",
    labelHi: "शब्दावली समझ नहीं आती",
    descEn: "Plain EN + Hindi meanings",
    descHi: "सरल अर्थ, हिंदी सहित",
    target: "#glossary",
  },
  {
    id: "unsure",
    labelEn: "I'm not sure where to start",
    labelHi: "समझ नहीं आ रहा, शुरू कहां से करूं",
    descEn: "2-minute walkthrough",
    descHi: "2 मिनट का परिचय",
    target: "onboarding",
  },
];
