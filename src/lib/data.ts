export type VerificationStatus = "verified" | "general-guidance" | "needs-verification";

export interface Source {
  id: string;
  title: string;
  authority: string;
  url: string;
  jurisdiction: string;
  applicability: string;
  lastCatalogued: string;
  verificationStatus: VerificationStatus;
  notes: string;
}

export interface Stage {
  id: string;
  order: number;
  titleEn: string;
  titleHi: string;
  taglineEn: string;
  taglineHi: string;
  meaningEn: string;
  meaningHi: string;
  happensEn: string[];
  happensHi: string[];
  prepareEn: string[];
  prepareHi: string[];
  termIds: string[];
  nextEn: string;
  nextHi: string;
  watchForEn: string;
  watchForHi: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
}

export interface ChecklistItem {
  id: string;
  stageId: string;
  category: "prepare" | "documents" | "before-hearing" | "after-hearing";
  labelEn: string;
  labelHi: string;
  explainEn: string;
  explainHi: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  hindi: string;
  simpleEn: string;
  simpleHi: string;
  whyEn: string;
  whyHi: string;
  exampleEn: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
}

export const SUPPORTED_SCOPE = {
  stateEn: "Madhya Pradesh",
  stateHi: "मध्य प्रदेश",
  courtEn: "District Court / Trial Court",
  courtHi: "जिला न्यायालय / विचारण न्यायालय",
  matterEn: "Criminal — Bail navigation",
  matterHi: "आपराधिक — जमानत मार्गदर्शन",
};

export const SOURCES: Source[] = [
  {
    id: "ecourts-services",
    title: "eCourts Services Portal — Official national portal for case status, cause lists and court services",
    authority: "eCommittee, Supreme Court of India / NIC",
    url: "https://services.ecourts.gov.in",
    jurisdiction: "India — general",
    applicability: "General eCourts process literacy (case status, cause list, court services). Does not prove any MP-registry-specific filing requirement.",
    lastCatalogued: "2026-09-11",
    verificationStatus: "general-guidance",
    notes: "Directory-level source. Use for 'where to look up your case/cause list' guidance, not for bail-specific requirements.",
  },
  {
    id: "ecourts-manual",
    title: "eCourts Manuals & User Documentation (official eCourts documentation set)",
    authority: "eCommittee, Supreme Court of India",
    url: "https://ecourts.gov.in/ecourts_home/static/manuals.php",
    jurisdiction: "India — general",
    applicability: "General e-filing / eCourts usage flow. MP-registry variation still applies.",
    lastCatalogued: "2026-09-11",
    verificationStatus: "needs-verification",
    notes: "Catalogued as the official manual location. Individual procedural claims in this demo are NOT asserted as quoted from a specific manual page unless marked verified.",
  },
  {
    id: "sci-efiling",
    title: "Supreme Court of India — e-Filing resources",
    authority: "Supreme Court of India",
    url: "https://www.sci.gov.in/e-filing/",
    jurisdiction: "Supreme Court of India",
    applicability: "Context only — shows e-filing exists at apex level. NOT the authority for MP District Court bail steps.",
    lastCatalogued: "2026-09-11",
    verificationStatus: "general-guidance",
    notes: "Included for source transparency; V1 journey is District Court, so SCI rules are out of scope and not applied.",
  },
  {
    id: "mphc-official",
    title: "Madhya Pradesh High Court — Official website (rules, notifications, district judiciary links)",
    authority: "High Court of Madhya Pradesh",
    url: "https://mphc.gov.in",
    jurisdiction: "Madhya Pradesh",
    applicability: "MP judiciary notifications, rules and district-court links. Registry-level specifics must be checked against the current notification/order.",
    lastCatalogued: "2026-09-11",
    verificationStatus: "needs-verification",
    notes: "Authoritative directory for MP. Demo does not quote specific MP rule numbers — items depending on them are flagged needs-verification.",
  },
  {
    id: "mp-district-ecourts",
    title: "Madhya Pradesh District Courts on eCourts services",
    authority: "District Judiciary (M.P.) via eCourts services",
    url: "https://services.ecourts.gov.in/ecourtindia_v6/",
    jurisdiction: "Madhya Pradesh — District Courts",
    applicability: "Case-status / cause-list lookup for MP district matters. Filing requirements vary by registry — verify locally.",
    lastCatalogued: "2026-09-11",
    verificationStatus: "general-guidance",
    notes: "Use for 'how to track your matter' guidance.",
  },
  {
    id: "indiacode",
    title: "India Code — Official statute repository",
    authority: "Legislative Department, Government of India",
    url: "https://www.indiacode.nic.in",
    jurisdiction: "India",
    applicability: "Read the current text of an Act where needed. Demo does not cite section numbers for bail procedure to avoid version errors across CrPC/BNSS transition.",
    lastCatalogued: "2026-09-11",
    verificationStatus: "general-guidance",
    notes: "Deliberate choice: no section numbers are asserted in V1 content. Users are pointed to India Code to read current law with a lawyer's help.",
  },
  {
    id: "nalsa",
    title: "National Legal Services Authority (NALSA) — legal-aid information",
    authority: "NALSA",
    url: "https://nalsa.gov.in",
    jurisdiction: "India",
    applicability: "Legal-aid / front-office guidance for people who cannot afford counsel.",
    lastCatalogued: "2026-09-11",
    verificationStatus: "general-guidance",
    notes: "Support route for party-in-person users; not a procedural authority.",
  },
];

export const sourceById = (id: string): Source | undefined => SOURCES.find((s) => s.id === id);

export const STAGES: Stage[] = [
  {
    id: "prepare",
    order: 1,
    titleEn: "Understand & Prepare",
    titleHi: "समझें और तैयारी करें",
    taglineEn: "Know what you are asking the court, and get your papers in order.",
    taglineHi: "आप न्यायालय से क्या निवेदन कर रहे हैं — यह समझें और कागज़ तैयार रखें।",
    meaningEn:
      "Before anything is filed, you organise your matter: who the parties are, what custody/proceeding stage applies, and which court the request belongs to. Nothing moves until this is clear.",
    meaningHi: "फ़ाइल करने से पहले मामला व्यवस्थित करें — पक्षकार कौन हैं, प्रकरण किस स्थिति में है, और निवेदन किस न्यायालय में होगा।",
    happensEn: [
      "You note your case details — court name, case/proceeding identifiers if any, parties, and current custody or proceeding stage.",
      "You check which court your request belongs to instead of assuming every court handles every request.",
      "You list the papers you already have and what is missing.",
    ],
    happensHi: [
      "प्रकरण का विवरण नोट करें — न्यायालय का नाम, पहचान संख्या (यदि हो), पक्षकार और वर्तमान स्थिति।",
      "पता करें कि निवेदन किस न्यायालय में होगा — हर न्यायालय हर निवेदन नहीं सुनता।",
      "जो कागज़ हैं और जो कमी है, उसकी सूची बनाएं।",
    ],
    prepareEn: ["Write down your case identifiers", "List parties and current stage", "Collect existing papers in one folder"],
    prepareHi: ["प्रकरण की पहचान संख्या लिखें", "पक्षकार और वर्तमान स्थिति लिखें", "मौजूदा कागज़ एक फ़ोल्डर में रखें"],
    termIds: ["affidavit", "vakalatnama", "listing"],
    nextEn: "Filing / Submission — your papers go to the court office or filing counter.",
    nextHi: "फ़ाइलिंग — कागज़ न्यायालय कार्यालय / फ़ाइलिंग काउंटर में प्रस्तुत होते हैं।",
    watchForEn: "Whether your matter already has a case number or is a fresh request — the path differs.",
    watchForHi: "क्या प्रकरण में पहले से संख्या है या यह नया निवेदन है — रास्ता अलग होगा।",
    sourceIds: ["ecourts-services", "mphc-official"],
    verificationStatus: "general-guidance",
  },
  {
    id: "filing",
    order: 2,
    titleEn: "Filing / Submission",
    titleHi: "फ़ाइलिंग / प्रस्तुति",
    taglineEn: "Your application and supporting papers are submitted to the court.",
    taglineHi: "आपका आवेदन और सहायक कागज़ न्यायालय में प्रस्तुत किए जाते हैं।",
    meaningEn:
      "Filing is the act of submitting your application and supporting papers to the court's filing office or registry. Filing alone does not mean the court has heard or decided anything yet.",
    meaningHi: "फ़ाइलिंग का अर्थ है आवेदन व सहायक कागज़ न्यायालय कार्यालय में देना। केवल फ़ाइल करने से सुनवाई या निर्णय नहीं हो जाता।",
    happensEn: [
      "Papers are received at the filing counter or registry.",
      "Basic details are entered and an acknowledgement or diary number may be generated as per local practice.",
      "You are told about objections or defects, if any — these must be cured.",
    ],
    happensHi: ["कागज़ फ़ाइलिंग काउंटर / रजिस्ट्री में प्राप्त किए जाते हैं।", "विवरण दर्ज होता है और स्थानीय प्रक्रिया अनुसार पावती / डायरी संख्या मिल सकती है।", "यदि कोई आपत्ति / कमी हो तो बताया जाता है — उसे दूर करना होता है।"],
    prepareEn: ["Application with correct party details", "Supporting affidavit where applicable", "Annexures arranged in order"],
    prepareHi: ["सही पक्षकार विवरण सहित आवेदन", "जहां लागू हो वहां समर्थक शपथपत्र", "अनुलग्नक क्रम से लगाएं"],
    termIds: ["affidavit", "annexure", "vakalatnama", "registry"],
    nextEn: "Registry / Scrutiny — the office checks your papers for completeness.",
    nextHi: "रजिस्ट्री / जांच — कार्यालय कागज़ों की पूर्णता जांचता है।",
    watchForEn: "Filing-counter objections and the acknowledgement you receive — keep it safe.",
    watchForHi: "फ़ाइलिंग काउंटर की आपत्तियां और मिली पावती — संभालकर रखें।",
    sourceIds: ["ecourts-manual", "mp-district-ecourts"],
    verificationStatus: "needs-verification",
  },
  {
    id: "scrutiny",
    order: 3,
    titleEn: "Registry / Scrutiny",
    titleHi: "रजिस्ट्री / जांच",
    taglineEn: "The court office verifies that your filing is complete.",
    taglineHi: "न्यायालय कार्यालय जांचता है कि फ़ाइलिंग पूर्ण है या नहीं।",
    meaningEn:
      "After filing, registry staff check completeness — signatures, copies, annexures, and format as required locally. If something is missing, the filing is returned with objections rather than being placed before the court.",
    meaningHi: "फ़ाइलिंग के बाद रजिस्ट्री पूर्णता जांचती है — हस्ताक्षर, प्रतियां, अनुलग्नक और स्थानीय प्रारूप। कमी हो तो फ़ाइल आपत्ति सहित लौटती है।",
    happensEn: [
      "Your filing is checked against the local checklist.",
      "Defects, if any, are marked and returned for correction within the time the office indicates.",
      "Once complete, the matter is processed toward listing.",
    ],
    happensHi: ["फ़ाइलिंग स्थानीय जांच-सूची से मिलाई जाती है।", "कमी हो तो सुधार हेतु लौटाई जाती है।", "पूर्ण होने पर प्रकरण लिस्टिंग की ओर बढ़ता है।"],
    prepareEn: ["Keep extra signed copies ready", "Note each objection in writing", "Re-file corrections promptly"],
    prepareHi: ["अतिरिक्त हस्ताक्षरित प्रतियां तैयार रखें", "प्रत्येक आपत्ति लिखित में नोट करें", "सुधार शीघ्र पुनः प्रस्तुत करें"],
    termIds: ["registry", "defect", "listing"],
    nextEn: "Listing — your matter is placed in the cause list for a date.",
    nextHi: "लिस्टिंग — मामला कॉज़ लिस्ट में किसी तारीख पर लगता है।",
    watchForEn: "The exact objection wording — fixing the wrong thing causes repeat visits.",
    watchForHi: "आपत्ति का सटीक wording — गलत सुधार से बार-बार जाना पड़ता है।",
    sourceIds: ["ecourts-manual", "mphc-official"],
    verificationStatus: "needs-verification",
  },
  {
    id: "listing",
    order: 4,
    titleEn: "Listing",
    titleHi: "लिस्टिंग",
    taglineEn: "Your matter appears in the cause list for a date.",
    taglineHi: "आपका मामला कॉज़ लिस्ट में किसी तारीख पर आता है।",
    meaningEn:
      "Listing means your matter is scheduled to be called before a court on a given date. The daily cause list shows the order in which matters are expected to be taken up.",
    meaningHi: "लिस्टिंग का अर्थ है मामला निर्धारित तारीख को न्यायालय के समक्ष पुकार हेतु नियत होना। दैनिक कॉज़ लिस्ट में क्रम दिखता है।",
    happensEn: [
      "A date is assigned and the matter appears in the cause list.",
      "You check the cause list a day before and on the hearing morning — positions can shift.",
      "You reach early with your papers arranged in the order you will need them.",
    ],
    happensHi: ["तारीख नियत होती है और मामला कॉज़ लिस्ट में दिखता है।", "एक दिन पहले और सुनवाई की सुबह कॉज़ लिस्ट जांचें — क्रम बदल सकता है।", "कागज़ क्रम से लेकर समय से पहले पहुंचें।"],
    prepareEn: ["Check cause list online and at court", "Arrange papers in calling order", "Note item/serial number if shown"],
    prepareHi: ["कॉज़ लिस्ट ऑनलाइन और न्यायालय में जांचें", "कागज़ पुकार-क्रम में लगाएं", "यदि दिखे तो आइटम / क्रम संख्या नोट करें"],
    termIds: ["cause-list", "listing", "mentioning", "adjournment"],
    nextEn: "Hearing — the matter is called and the court hears the parties as applicable.",
    nextHi: "सुनवाई — मामला पुकारा जाता है और न्यायालय पक्षों को सुनता है।",
    watchForEn: "Cause-list changes on the hearing morning — re-check before entering the courtroom.",
    watchForHi: "सुनवाई की सुबह कॉज़ लिस्ट बदल सकती है — कक्ष में जाने से पहले पुनः जांचें।",
    sourceIds: ["ecourts-services", "mp-district-ecourts"],
    verificationStatus: "general-guidance",
  },
  {
    id: "hearing",
    order: 5,
    titleEn: "Hearing",
    titleHi: "सुनवाई",
    taglineEn: "The matter is called. Know how to be ready and what to observe.",
    taglineHi: "मामला पुकारा जाता है। तैयार रहें और देखें क्या होता है।",
    meaningEn:
      "At the hearing, the matter is called in the courtroom and the court proceeds as it considers appropriate — it may hear the parties, ask for papers, or fix the next step. Your role is to be present, prepared, and able to note what happens.",
    meaningHi: "सुनवाई में मामला कक्ष में पुकारा जाता है और न्यायालय उचित समझे अनुसार आगे बढ़ता है — पक्षों को सुन सकता है, कागज़ मांग सकता है या अगला चरण नियत कर सकता है।",
    happensEn: [
      "Wait for your item to be called; matters are rarely taken strictly on time.",
      "When called, identify your matter clearly and hand up only what is asked for.",
      "Note any date given and any direction the court states — these go into the order.",
    ],
    happensHi: ["अपनी बारी की प्रतीक्षा करें; मामले शायद ही समय पर पुकारे जाते हैं।", "पुकार पर मामला स्पष्ट बताएं और केवल मांगा गया कागज़ दें।", "दी गई तारीख और निर्देश नोट करें — यही आदेश में आएगा।"],
    prepareEn: ["Carry acknowledgement and prior orders", "Keep a one-page note of your current request", "Carry a pen and date diary"],
    prepareHi: ["पावती और पूर्व आदेश साथ रखें", "वर्तमान निवेदन का एक पृष्ठ नोट रखें", "पेन और तारीख डायरी रखें"],
    termIds: ["adjournment", "mentioning", "interim-application", "stay"],
    nextEn: "Court order — whatever the court directed is recorded in writing.",
    nextHi: "न्यायालयीन आदेश — न्यायालय ने जो निर्देश दिया वह लिखित में आता है।",
    watchForEn: "Whether the court gave a next date, asked for a reply/response, or kept the matter for orders.",
    watchForHi: "क्या अगली तारीख मिली, जवाब / प्रत्युत्तर मांगा गया, या मामला आदेश हेतु रखा गया।",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "order",
    order: 6,
    titleEn: "Court Order",
    titleHi: "न्यायालयीन आदेश",
    taglineEn: "Read what the court actually directed — not what anyone assumes.",
    taglineHi: "न्यायालय ने वास्तव में क्या निर्देश दिया — वही पढ़ें, अनुमान नहीं।",
    meaningEn:
      "The order is the written record of what the court directed at that hearing — dates, directions, and conditions if any. Only the signed/uploaded order text counts; oral impressions can be wrong.",
    meaningHi: "आदेश उस सुनवाई में दिए निर्देशों का लिखित रिकॉर्ड है — तारीखें, निर्देश और शर्तें (यदि हों)। केवल हस्ताक्षरित / अपलोडेड आदेश मान्य है।",
    happensEn: [
      "You obtain the order copy from the court or the eCourts/court website as available.",
      "You read operative lines first — dates, directions, and anything you are asked to do.",
      "You match the order to your journey: does it fix a next date, ask for something, or conclude the request?",
    ],
    happensHi: ["आदेश की प्रति न्यायालय या वेबसाइट से प्राप्त करें।", "पहले operative पंक्तियां पढ़ें — तारीखें, निर्देश और आपको क्या करना है।", "आदेश को यात्रा से मिलाएं — क्या अगली तारीख है, कुछ मांगा गया है, या निवेदन निपट गया है?"],
    prepareEn: ["Download or collect the signed order copy", "Highlight dates and directions", "Use the Decoder below to parse it"],
    prepareHi: ["हस्ताक्षरित आदेश की प्रति लें", "तारीखें और निर्देश highlight करें", "नीचे Decoder से समझें"],
    termIds: ["order", "notice", "summons", "stay", "adjournment"],
    nextEn: "Next procedural stage — comply with directions and track the next date.",
    nextHi: "अगला चरण — निर्देशों का पालन करें और अगली तारीख track करें।",
    watchForEn: "Certified vs website copy differences and the exact operative wording.",
    watchForHi: "प्रमाणित बनाम वेबसाइट प्रति का अंतर और operative wording।",
    sourceIds: ["ecourts-services", "mp-district-ecourts"],
    verificationStatus: "general-guidance",
  },
  {
    id: "next-stage",
    order: 7,
    titleEn: "What Happens Next",
    titleHi: "आगे क्या होगा",
    taglineEn: "Turn the order into a to-do list with dates you will not miss.",
    taglineHi: "आदेश को to-do सूची में बदलें — कोई तारीख न छूटे।",
    meaningEn:
      "After the order, your job is compliance and tracking: do what the order asks within the time it states, keep proof, and watch the cause list for the next date. If anything is unclear, get the order clarified rather than guessing.",
    meaningHi: "आदेश के बाद पालन और tracking करें — आदेश जो कहे उसे समय में करें, प्रमाण रखें, अगली तारीख हेतु कॉज़ लिस्ट देखें। अस्पष्ट हो तो अनुमान नहीं, स्पष्टीकरण लें।",
    happensEn: [
      "You list every direction and date from the order as tasks.",
      "You complete filings or appearances in the order's sequence.",
      "You re-check case status and cause list before the next hearing.",
    ],
    happensHi: ["आदेश के प्रत्येक निर्देश व तारीख को कार्य बनाएं।", "आदेश के क्रम में फ़ाइलिंग / उपस्थिति पूरी करें।", "अगली सुनवाई से पहले case status व कॉज़ लिस्ट पुनः जांचें।"],
    prepareEn: ["Make an order-to-task list", "Keep compliance proof filed", "Set two reminders for the next date"],
    prepareHi: ["आदेश से कार्य-सूची बनाएं", "पालन का प्रमाण फ़ाइल में रखें", "अगली तारीख हेतु दो reminder लगाएं"],
    termIds: ["cause-list", "order", "adjournment"],
    nextEn: "Your journey loops: next hearing → next order → next tasks, until the request concludes.",
    nextHi: "यात्रा दोहराती है — अगली सुनवाई → अगला आदेश → अगले कार्य, जब तक निवेदन पूर्ण न हो।",
    watchForEn: "Any compliance deadline inside the order — missing it creates fresh complications.",
    watchForHi: "आदेश के अंदर कोई पालन-समयसीमा — छूटने पर नई जटिलता बनती है।",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
];

export const CHECKLIST: ChecklistItem[] = [
  {
    id: "c-prep-1",
    stageId: "prepare",
    category: "prepare",
    labelEn: "Write down court, parties and current stage",
    labelHi: "न्यायालय, पक्षकार और वर्तमान स्थिति लिखें",
    explainEn: "A one-page note prevents confusion later. Keep names exactly as they appear on existing papers.",
    explainHi: "एक पृष्ठ का नोट बाद की उलझन रोकता है। नाम मौजूदा कागज़ों जैसे ही लिखें।",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "c-prep-2",
    stageId: "prepare",
    category: "documents",
    labelEn: "Collect existing papers in one folder",
    labelHi: "मौजूदा कागज़ एक फ़ोल्डर में रखें",
    explainEn: "Prior orders, notices, IDs and case identifiers — originals plus one photocopy set.",
    explainHi: "पूर्व आदेश, नोटिस, पहचान पत्र व पहचान संख्या — मूल + एक फोटोकॉपी सेट।",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "c-file-1",
    stageId: "filing",
    category: "documents",
    labelEn: "Application with complete party details",
    labelHi: "पूर्ण पक्षकार विवरण सहित आवेदन",
    explainEn: "Names, addresses for service, and case/proceeding identifiers where available. Exact local format varies — verify at the filing counter.",
    explainHi: "नाम, तामील हेतु पते और उपलब्ध पहचान संख्या। सटीक स्थानीय प्रारूप हेतु काउंटर पर जांचें।",
    sourceIds: ["ecourts-manual", "mp-district-ecourts"],
    verificationStatus: "needs-verification",
  },
  {
    id: "c-file-2",
    stageId: "filing",
    category: "documents",
    labelEn: "Supporting affidavit where applicable",
    labelHi: "जहां लागू हो वहां समर्थक शपथपत्र",
    explainEn: "Where the local practice requires facts on affidavit, keep it signed and consistent with the application. Applicability varies — verify.",
    explainHi: "जहां तथ्य शपथपत्र पर आवश्यक हों, हस्ताक्षरित व आवेदन से consistent रखें। लागूता हेतु जांचें।",
    sourceIds: ["ecourts-manual"],
    verificationStatus: "needs-verification",
  },
  {
    id: "c-file-3",
    stageId: "filing",
    category: "documents",
    labelEn: "Annexures in order with page numbers",
    labelHi: "अनुलग्नक क्रम से, पृष्ठ संख्या सहित",
    explainEn: "Number pages continuously so the court can be taken to any page quickly during hearing.",
    explainHi: "पृष्ठों पर लगातार नंबर डालें ताकि सुनवाई में कोई भी पृष्ठ तुरंत दिखाया जा सके।",
    sourceIds: ["ecourts-manual"],
    verificationStatus: "general-guidance",
  },
  {
    id: "c-file-4",
    stageId: "filing",
    category: "prepare",
    labelEn: "Keep the filing acknowledgement safe",
    labelHi: "फ़ाइलिंग पावती संभालकर रखें",
    explainEn: "Diary/acknowledgement number is how you track the filing until a case number or listing appears.",
    explainHi: "डायरी / पावती संख्या से ही फ़ाइलिंग track होती है जब तक संख्या या लिस्टिंग न आए।",
    sourceIds: ["mp-district-ecourts"],
    verificationStatus: "general-guidance",
  },
  {
    id: "c-list-1",
    stageId: "listing",
    category: "before-hearing",
    labelEn: "Check the cause list the evening before and morning of hearing",
    labelHi: "सुनवाई से पूर्व संध्या और सुबह कॉज़ लिस्ट जांचें",
    explainEn: "Positions shift. Re-check on services.ecourts.gov.in and the court display board.",
    explainHi: "क्रम बदलता है। services.ecourts.gov.in व न्यायालय display board पर पुनः जांचें।",
    sourceIds: ["ecourts-services"],
    verificationStatus: "verified",
  },
  {
    id: "c-hear-1",
    stageId: "hearing",
    category: "before-hearing",
    labelEn: "Carry acknowledgement + prior orders + one-page request note",
    labelHi: "पावती + पूर्व आदेश + एक पृष्ठ निवेदन नोट साथ रखें",
    explainEn: "Courts work fast. A single page stating what you are requesting and the current status saves time.",
    explainHi: "न्यायालय त्वरित कार्य करता है। वर्तमान स्थिति व निवेदन का एक पृष्ठ समय बचाता है।",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "c-order-1",
    stageId: "order",
    category: "after-hearing",
    labelEn: "Collect the signed order copy and highlight dates",
    labelHi: "हस्ताक्षरित आदेश लें और तारीखें mark करें",
    explainEn: "Only the order text counts. Oral memory fades — the highlighted copy is your reference.",
    explainHi: "केवल आदेश पाठ मान्य है। मौखिक स्मृति धुंधली होती है — mark की प्रति ही संदर्भ है।",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "c-next-1",
    stageId: "next-stage",
    category: "after-hearing",
    labelEn: "Convert every direction into a dated task with two reminders",
    labelHi: "प्रत्येक निर्देश को तारीख सहित कार्य बनाएं, दो reminder लगाएं",
    explainEn: "Missed compliance dates create fresh complications. Two reminders is the minimum that works.",
    explainHi: "पालन तारीख छूटने पर नई जटिलता बनती है। दो reminder न्यूनतम आवश्यक है।",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "cause-list",
    term: "Cause List",
    hindi: "कॉज़ लिस्ट",
    simpleEn: "The daily list showing which matters will be called before which court.",
    simpleHi: "दैनिक सूची — कौन-सा मामला किस न्यायालय में पुकारा जाएगा।",
    whyEn: "You hear it because your matter's position and date come from this list.",
    whyHi: "आप इसे सुनते हैं क्योंकि तारीख व क्रम इसी सूची से मिलता है।",
    exampleEn: "“Check serial no. 42 in tomorrow's cause list.”",
    sourceIds: ["ecourts-services"],
    verificationStatus: "verified",
  },
  {
    id: "listing",
    term: "Listing",
    hindi: "लिस्टिंग",
    simpleEn: "Placing your matter in the cause list for a date.",
    simpleHi: "मामले को किसी तारीख की कॉज़ लिस्ट में लगाना।",
    whyEn: "Until a matter is listed, it will not be called.",
    whyHi: "जब तक मामला listed नहीं, पुकारा नहीं जाएगा।",
    exampleEn: "“The matter will be listed on Monday.”",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "mentioning",
    term: "Mentioning",
    hindi: "मेंशनिंग",
    simpleEn: "Briefly bringing an urgent listing request before the court, as permitted locally.",
    simpleHi: "स्थानीय अनुमति अनुसार अत्यावश्यक लिस्टिंग निवेदन संक्षेप में रखना।",
    whyEn: "Used when something cannot wait for the normal listing cycle.",
    whyHi: "जब सामान्य चक्र तक इंतज़ार न हो सके तब प्रयुक्त।",
    exampleEn: "“Mention the urgency at 10:30.”",
    sourceIds: ["ecourts-services"],
    verificationStatus: "needs-verification",
  },
  {
    id: "adjournment",
    term: "Adjournment",
    hindi: "स्थगन / तारीख बढ़ना",
    simpleEn: "The hearing is moved to another date.",
    simpleHi: "सुनवाई अगली तारीख पर चली जाती है।",
    whyEn: "Check the next date and what the order says you must do before then.",
    whyHi: "अगली तारीख देखें और आदेश अनुसार तब तक क्या करना है।",
    exampleEn: "“Matter adjourned to the 18th.”",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "affidavit",
    term: "Affidavit",
    hindi: "शपथपत्र",
    simpleEn: "A written statement confirmed on oath, used to place facts before the court.",
    simpleHi: "शपथ पर पुष्ट लिखित कथन — तथ्य न्यायालय समक्ष रखने हेतु।",
    whyEn: "Many applications need facts stated on affidavit, not just plain paper.",
    whyHi: "कई आवेदनों में तथ्य सादे कागज़ पर नहीं, शपथपत्र पर चाहिए होते हैं।",
    exampleEn: "“File the facts by affidavit.”",
    sourceIds: ["ecourts-manual"],
    verificationStatus: "needs-verification",
  },
  {
    id: "vakalatnama",
    term: "Vakalatnama",
    hindi: "वकालतनामा",
    simpleEn: "The document authorising an advocate to appear for a party.",
    simpleHi: "पक्षकार द्वारा अधिवक्ता को पैरवी हेतु अधिकृत करने वाला दस्तावेज़।",
    whyEn: "Without it on record, an advocate generally cannot act for you.",
    whyHi: "रिकॉर्ड पर इसके बिना अधिवक्ता सामान्यतः पैरवी नहीं कर सकता।",
    exampleEn: "“Vakalatnama is on record.”",
    sourceIds: ["ecourts-manual"],
    verificationStatus: "needs-verification",
  },
  {
    id: "annexure",
    term: "Annexure",
    hindi: "अनुलग्नक",
    simpleEn: "A document attached in support of the main application.",
    simpleHi: "मुख्य आवेदन के समर्थन में लगाया गया दस्तावेज़।",
    whyEn: "Courts refer to annexure numbers during hearing — keep them ordered.",
    whyHi: "सुनवाई में अनुलग्नक संख्या से संदर्भ होता है — क्रमबद्ध रखें।",
    exampleEn: "“See Annexure A-3, page 12.”",
    sourceIds: ["ecourts-manual"],
    verificationStatus: "general-guidance",
  },
  {
    id: "registry",
    term: "Registry",
    hindi: "रजिस्ट्री",
    simpleEn: "The court office that receives, checks and processes filings.",
    simpleHi: "न्यायालय कार्यालय — फ़ाइलिंग प्राप्त, जांच व प्रक्रिया करता है।",
    whyEn: "Most filing objections come from the registry, not the judge.",
    whyHi: "अधिकांश फ़ाइलिंग आपत्तियां रजिस्ट्री से आती हैं, न्यायाधीश से नहीं।",
    exampleEn: "“Registry has raised a defect.”",
    sourceIds: ["ecourts-manual"],
    verificationStatus: "general-guidance",
  },
  {
    id: "defect",
    term: "Defect / Objection",
    hindi: "कमी / आपत्ति",
    simpleEn: "Something missing or incorrect in a filing that must be fixed.",
    simpleHi: "फ़ाइलिंग में कोई कमी जिसे सुधारना आवश्यक है।",
    whyEn: "A defective filing is not placed before the court until cured.",
    whyHi: "कमी दूर होने तक फ़ाइलिंग न्यायालय समक्ष नहीं रखी जाती।",
    exampleEn: "“Remove the defect within the time given.”",
    sourceIds: ["ecourts-manual"],
    verificationStatus: "general-guidance",
  },
  {
    id: "order",
    term: "Order",
    hindi: "आदेश",
    simpleEn: "The court's written direction at a stage — dates, instructions, conditions.",
    simpleHi: "न्यायालय का लिखित निर्देश — तारीखें, हिदायतें, शर्तें।",
    whyEn: "Only the order text is authoritative — not summaries or memory.",
    whyHi: "केवल आदेश पाठ प्रामाणिक है — सारांश या स्मृति नहीं।",
    exampleEn: "“As per the order dated 4th…”",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "notice",
    term: "Notice",
    hindi: "नोटिस",
    simpleEn: "A court communication asking a person to appear or respond.",
    simpleHi: "उपस्थित होने या जवाब देने हेतु न्यायालयीन सूचना।",
    whyEn: "A notice always carries a date and a required action — find both first.",
    whyHi: "नोटिस में तारीख व आवश्यक कार्रवाई होती है — पहले वही खोजें।",
    exampleEn: "“Notice issued for the 12th.”",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "summons",
    term: "Summons",
    hindi: "सम्मन",
    simpleEn: "A formal court direction to appear or produce something.",
    simpleHi: "उपस्थित होने या कुछ प्रस्तुत करने का औपचारिक निर्देश।",
    whyEn: "Ignoring a summons has consequences — note the date and purpose immediately.",
    whyHi: "सम्मन की अनदेखी के परिणाम होते हैं — तारीख व उद्देश्य तुरंत नोट करें।",
    exampleEn: "“Summons served for next week.”",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "interim-application",
    term: "Interim Application",
    hindi: "अंतरिम आवेदन",
    simpleEn: "A request for temporary direction while the main matter continues.",
    simpleHi: "मुख्य मामला चलते हुए अस्थायी निर्देश हेतु निवेदन।",
    whyEn: "Bail requests are often heard as interim requests within a proceeding.",
    whyHi: "जमानत निवेदन अक्सर कार्यवाही में अंतरिम निवेदन के रूप में सुना जाता है।",
    exampleEn: "“Interim application for release pending trial.”",
    sourceIds: ["ecourts-manual"],
    verificationStatus: "needs-verification",
  },
  {
    id: "stay",
    term: "Stay",
    hindi: "रोक / स्थगनादेश",
    simpleEn: "A direction pausing a proceeding or action until further orders.",
    simpleHi: "अगले आदेश तक कार्यवाही / कार्रवाई रोकने का निर्देश।",
    whyEn: "If a stay is mentioned, find exactly what is stayed and until when.",
    whyHi: "stay का उल्लेख हो तो पता करें कि ठीक-ठीक क्या और कब तक रोका गया है।",
    exampleEn: "“Further proceedings stayed till the next date.”",
    sourceIds: ["ecourts-services"],
    verificationStatus: "general-guidance",
  },
  {
    id: "bail",
    term: "Bail",
    hindi: "जमानत",
    simpleEn: "Release from custody on conditions the court sets, while the case continues.",
    simpleHi: "न्यायालय द्वारा तय शर्तों पर हिरासत से रिहाई — मामला जारी रहता है।",
    whyEn: "Bail orders always carry conditions — find each one and its consequence for violation.",
    whyHi: "जमानत आदेशों में शर्तें होती हैं — प्रत्येक शर्त व उल्लंघन का परिणाम खोजें।",
    exampleEn: "“Released on bail on furnishing a personal bond of Rs. 50,000.”",
    sourceIds: ["indiacode"],
    verificationStatus: "general-guidance",
  },
  {
    id: "anticipatory-bail",
    term: "Anticipatory Bail",
    hindi: "अग्रिम जमानत",
    simpleEn: "Protection sought before arrest, apprehending arrest in a matter.",
    simpleHi: "गिरफ्तारी की आशंका पर गिरफ्तारी से पहले मांगी गई सुरक्षा।",
    whyEn: "It is sought before custody, so the applicant's cooperation duties matter greatly.",
    whyHi: "यह हिरासत से पहले मांगी जाती है, इसलिए सहयोग-संबंधी शर्तें महत्वपूर्ण होती हैं।",
    exampleEn: "“In the event of arrest, the applicant shall be enlarged on bail.”",
    sourceIds: ["indiacode"],
    verificationStatus: "general-guidance",
  },
];

export interface DemoDoc {
  id: string;
  labelEn: string;
  labelHi: string;
  kind: "order" | "notice";
  fictionalText: string;
}

export const DEMO_DOCS: DemoDoc[] = [
  {
    id: "demo-order-1",
    labelEn: "Demo listing order — fictional example",
    labelHi: "डेमो लिस्टिंग आदेश — काल्पनिक उदाहरण",
    kind: "order",
    fictionalText: `DEMO DOCUMENT — FICTIONAL EXAMPLE. NOT A REAL COURT ORDER.
In the Court of the District & Sessions Court, Sample District (M.P.)
Fictional Case No. BA/1234/2026 | State vs Fictional Accused
Date of order: 04-09-2026
Present: Fictional counsel for applicant. Public Prosecutor for the State.
ORDER
Heard in part. Reply of the prosecution to be filed. List the matter on 18-09-2026 for further hearing.
The applicant shall remain present on the next date through counsel.
Sd/- Fictional Judge`,
  },
  {
    id: "demo-notice-1",
    labelEn: "Demo hearing notice — fictional example",
    labelHi: "डेमो सुनवाई नोटिस — काल्पनिक उदाहरण",
    kind: "notice",
    fictionalText: `DEMO DOCUMENT — FICTIONAL EXAMPLE. NOT A REAL NOTICE.
District Court, Sample District (M.P.)
Fictional Notice No. N/567/2026 dated 28-08-2026
To: Fictional Party, Sample Address
You are required to appear before the court on 18-09-2026 at 11:00 AM in connection with Fictional Case No. BA/1234/2026.
Bring this notice and identity proof. Failure to appear may be dealt with as per procedure.
By order of the Court.`,
  },
];
