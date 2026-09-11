"use client";

import { motion } from "framer-motion";
import { STAGES, SUPPORTED_SCOPE } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { Check, Lock, PlayCircle } from "lucide-react";

export default function JourneySetup({
  stageId,
  setStageId,
  onSampleCase,
}: {
  stageId: string;
  setStageId: (id: string) => void;
  onSampleCase: () => void;
}) {
  const { lang, t } = useLang();
  const row = (label: string, valueEn: string, valueHi: string, locked = true) => (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#101828]/10 bg-white p-4 shadow-sm">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0E4D4A]">{label}</div>
        <div className="mt-0.5 text-[15px] font-bold text-[#101828]">{lang === "en" ? valueEn : valueHi}</div>
      </div>
      {locked ? (
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
          <Check size={12} /> V1
        </span>
      ) : (
        <span className="flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-bold text-stone-500">
          <Lock size={12} /> Soon
        </span>
      )}
    </div>
  );

  return (
    <section id="setup" className="relative bg-[#FAF8F3] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#0E4D4A]">02 · Court setup</p>
          <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-[#101828] sm:text-5xl">{t("setup.title")}</h2>
          <p className="mt-3 max-w-2xl text-[15px] text-[#101828]/65">{t("setup.sub")}</p>
          <button
            onClick={onSampleCase}
            className="group mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#101828] px-6 py-3.5 text-[14px] font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <PlayCircle size={17} className="text-[#f3d67a] transition-transform group-hover:scale-110" />
            {lang === "en" ? "Try a Sample Case — decode a demo order in one click" : "नमूना मामला आज़माएं — एक क्लिक में डेमो आदेश समझें"}
          </button>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {row("State", SUPPORTED_SCOPE.stateEn, SUPPORTED_SCOPE.stateHi)}
          {row("Court", SUPPORTED_SCOPE.courtEn, SUPPORTED_SCOPE.courtHi)}
          {row("Matter", SUPPORTED_SCOPE.matterEn, SUPPORTED_SCOPE.matterHi)}
        </div>
        <div className="mt-4 grid gap-4 rounded-3xl border border-[#101828]/10 bg-white p-5 shadow-sm sm:grid-cols-2">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0E4D4A] sm:col-span-2">Current stage · वर्तमान चरण</div>
          {STAGES.map((s, i) => {
            const active = s.id === stageId;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                onClick={() => setStageId(s.id)}
                className={`group rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 ${
                  active
                    ? "border-[#C9A227] bg-gradient-to-br from-[#fff8e1] to-white shadow-[0_16px_40px_rgba(201,162,39,0.25)]"
                    : "border-[#101828]/10 bg-[#FAF8F3] hover:border-[#0E4D4A]/40 hover:shadow-lg"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-8 w-8 place-items-center rounded-xl text-[13px] font-black ${active ? "bg-[#101828] text-[#f3d67a]" : "bg-[#101828]/8 text-[#101828]/60"}`}>
                    {s.order}
                  </span>
                  {active && <span className="rounded-full bg-[#101828] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f3d67a]">{t("stage.youAreHere")}</span>}
                </div>
                <div className="mt-3 text-[15px] font-bold text-[#101828]">{lang === "en" ? s.titleEn : s.titleHi}</div>
                <div className="mt-1 text-[13px] leading-relaxed text-[#101828]/60">{lang === "en" ? s.taglineEn : s.taglineHi}</div>
              </motion.button>
            );
          })}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-dashed border-[#101828]/20 bg-white/60 p-4 text-[13px] text-[#101828]/60">
            Other states / High Court / Supreme Court selections show: <b>“Coming Soon — not answered as verified.”</b>
          </div>
          <div className="rounded-2xl border border-dashed border-[#101828]/20 bg-white/60 p-4 text-[13px] text-[#101828]/60">
            Civil, family & consumer journeys use the same engine later — roadmap on the Scope section.
          </div>
        </div>
      </div>
    </section>
  );
}
