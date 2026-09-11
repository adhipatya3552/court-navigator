"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Map as MapIcon, FileScan, BellRing, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { ONBOARD_EVENT, markOnboarded, onboardComplete } from "@/lib/onboard";

const STEPS = [
  { icon: MapPin, en: ["Tell us about your case", "Choose your state, court, matter and current stage."], hi: ["अपना मामला बताएं", "राज्य, न्यायालय, मामला और वर्तमान चरण चुनें।"] },
  { icon: MapIcon, en: ["See where you are", "Court Navigator places you on a simple procedural roadmap."], hi: ["देखें आप कहां हैं", "कोर्ट नेविगेटर आपको सरल यात्रा-मानचित्र पर रखता है।"] },
  { icon: FileScan, en: ["Have a court document?", "Upload or paste an order, notice or summons — we identify useful procedural clues."], hi: ["न्यायालयीन दस्तावेज़ है?", "आदेश, नोटिस या सम्मन अपलोड/paste करें — हम उपयोगी संकेत पहचानते हैं।"] },
  { icon: BellRing, en: ["Understand what comes next", "See what to prepare, what to watch for, and where each fact came from."], hi: ["समझें आगे क्या होगा", "क्या तैयार करें, किस पर ध्यान दें, और प्रत्येक तथ्य कहां से आया — देखें।"] },
];

export default function Onboarding() {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onboardComplete()) {
      const tId = window.setTimeout(() => setOpen(true), 900);
      return () => window.clearTimeout(tId);
    }
  }, []);

  useEffect(() => {
    const opener = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener(ONBOARD_EVENT, opener);
    return () => window.removeEventListener(ONBOARD_EVENT, opener);
  }, []);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open, step]);

  const close = useCallback((complete: boolean) => {
    if (complete) markOnboarded();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const finish = () => {
    close(true);
    document.querySelector("#setup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-[#070b18]/70 p-4 backdrop-blur-sm"
          onClick={() => close(true)}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={t("onboard.title")}
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-[#FAF8F3] p-7 shadow-2xl outline-none sm:p-8"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0E4D4A]">{t("onboard.title")}</p>
              <button
                onClick={() => close(true)}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#101828]/50 transition hover:bg-[#101828]/5 hover:text-[#101828]"
              >
                <X size={17} />
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step + lang}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28 }}
                className="mt-5"
              >
                {(() => {
                  const S = STEPS[step];
                  const Icon = S.icon;
                  const [title, body] = lang === "en" ? S.en : S.hi;
                  return (
                    <>
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#101828] text-[#f3d67a]">
                        <Icon size={24} />
                      </span>
                      <h3 className="mt-4 font-serif text-2xl font-black text-[#101828]">{title}</h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-[#101828]/65">{body}</p>
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex items-center justify-center gap-2" aria-hidden>
              {STEPS.map((_, i) => (
                <span key={i} className={`h-2 rounded-full transition-all ${i === step ? "w-7 bg-[#C9A227]" : "w-2 bg-[#101828]/15"}`} />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => close(true)}
                className="rounded-full px-4 py-2.5 text-[13px] font-semibold text-[#101828]/55 transition hover:text-[#101828]"
              >
                {t("onboard.skip")}
              </button>
              <div className="flex gap-2">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-full border border-[#101828]/15 px-5 py-2.5 text-[13px] font-bold text-[#101828] transition hover:border-[#101828]/35"
                  >
                    {t("onboard.back")}
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="rounded-full bg-[#101828] px-6 py-2.5 text-[13px] font-bold text-white transition hover:brightness-125"
                  >
                    {t("onboard.next")}
                  </button>
                ) : (
                  <button
                    onClick={finish}
                    className="rounded-full bg-[#C9A227] px-6 py-2.5 text-[13px] font-bold text-[#0a0f22] transition hover:brightness-110"
                  >
                    {t("onboard.start")}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
