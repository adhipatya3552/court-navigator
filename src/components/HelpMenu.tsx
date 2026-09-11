"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, X, GraduationCap } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { HELP_TOPICS } from "@/lib/help";
import { openOnboarding } from "@/lib/onboard";

export default function HelpMenu() {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setTopic(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="w-[300px] overflow-hidden rounded-2xl border border-[#101828]/10 bg-white shadow-2xl"
            role="menu"
            aria-label={t("help.label")}
          >
            <button
              onClick={openOnboarding}
              className="flex w-full items-center gap-2.5 border-b border-[#101828]/8 bg-[#FAF8F3] px-4 py-3.5 text-left transition hover:bg-[#f1e9d2]"
            >
              <GraduationCap size={17} className="shrink-0 text-[#0E4D4A]" />
              <span className="text-[13.5px] font-bold text-[#101828]">{t("hero.howItWorks")}</span>
            </button>
            {HELP_TOPICS.map((h) => (
              <div key={h.id} className="border-b border-[#101828]/6 last:border-0">
                <button
                  onClick={() => setTopic(topic === h.id ? null : h.id)}
                  aria-expanded={topic === h.id}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-[13.5px] font-semibold text-[#101828]/80 transition hover:bg-[#FAF8F3] hover:text-[#101828]"
                >
                  {lang === "en" ? h.titleEn : h.titleHi}
                  <span className="text-[#101828]/35">{topic === h.id ? "−" : "+"}</span>
                </button>
                {topic === h.id && (
                  <div className="px-4 pb-3.5">
                    <p className="text-[12.5px] leading-relaxed text-[#101828]/65">{lang === "en" ? h.bodyEn : h.bodyHi}</p>
                    {h.href && (
                      <a
                        href={h.href}
                        onClick={() => setOpen(false)}
                        className="mt-1.5 inline-block text-[12.5px] font-bold text-[#0E4D4A] hover:underline"
                      >
                        {lang === "en" ? "Take me there →" : "वहां ले चलें →"}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => {
          setOpen((o) => !o);
          setTopic(null);
        }}
        aria-label={t("help.label")}
        aria-expanded={open}
        className="grid h-12 w-12 place-items-center rounded-full bg-[#101828] text-[#f3d67a] shadow-[0_12px_32px_rgba(11,18,38,0.45)] transition hover:scale-105 hover:brightness-125"
      >
        {open ? <X size={20} /> : <HelpCircle size={22} />}
      </button>
    </div>
  );
}
