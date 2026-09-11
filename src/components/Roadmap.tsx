"use client";

import { motion } from "framer-motion";
import { STAGES, sourceById, type VerificationStatus } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { ArrowRight, BookOpenCheck, TriangleAlert } from "lucide-react";

export function VerifyBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified")
    return <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10.5px] font-bold text-emerald-800">Source-backed</span>;
  if (status === "general-guidance")
    return <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10.5px] font-bold text-sky-800">General guidance</span>;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10.5px] font-bold text-amber-900">
      <TriangleAlert size={11} /> Needs verification
    </span>
  );
}

export default function Roadmap({ stageId, setStageId }: { stageId: string; setStageId: (id: string) => void }) {
  const { lang, t } = useLang();
  const activeIdx = STAGES.findIndex((s) => s.id === stageId);
  const active = STAGES[activeIdx];

  return (
    <section id="journey" className="relative overflow-hidden bg-[#0b1226] py-24 text-white">
      <div className="pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-[#0E4D4A]/50 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full bg-[#C9A227]/20 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#7ef0dd]">03 · Procedure roadmap</p>
          <h2 className="mt-3 font-serif text-4xl font-black tracking-tight sm:text-5xl">{t("roadmap.title")}</h2>
          <p className="mt-3 max-w-2xl text-[15px] text-white/60">{t("roadmap.sub")}</p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative">
            <div className="absolute bottom-6 left-[27px] top-6 w-[2px] bg-white/10" />
            <motion.div
              className="absolute left-[27px] top-6 w-[2px] origin-top bg-gradient-to-b from-[#C9A227] to-[#7ef0dd]"
              initial={{ height: 0 }}
              whileInView={{ height: `${(activeIdx / (STAGES.length - 1)) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ maxHeight: "calc(100% - 48px)" }}
            />
            <div className="space-y-3">
              {STAGES.map((s, i) => {
                const done = i < activeIdx;
                const isActive = i === activeIdx;
                // Stage 7 is not a court event but the loop-back: after tasks,
                // the journey returns to Listing. Render it distinctly so the
                // line never reads as "step 7 of 7, then backwards".
                const isLoop = s.id === "next-stage";
                return (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    onClick={() => setStageId(s.id)}
                    className={`relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                      isLoop
                        ? "border-dashed border-[#7ef0dd]/45 bg-[#7ef0dd]/[0.05] hover:border-[#7ef0dd]/70 hover:bg-[#7ef0dd]/[0.09]"
                        : ""
                    } ${
                      !isLoop && isActive
                        ? "border-[#C9A227]/70 bg-[#C9A227]/10 shadow-[0_16px_50px_rgba(201,162,39,0.25)]"
                        : !isLoop
                          ? "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
                          : ""
                    }`}
                    style={{ transformPerspective: 800 }}
                  >
                    <span
                      className={`z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[15px] font-black transition ${
                        isLoop
                          ? "bg-[#7ef0dd]/15 text-[#b8fff4]"
                          : isActive
                            ? "bg-[#C9A227] text-[#0a0f22]"
                            : done
                              ? "bg-emerald-400 text-[#06281f]"
                              : "bg-white/10 text-white/60"
                      }`}
                    >
                      {isLoop ? "↻" : done ? "✓" : s.order}
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold">{lang === "en" ? s.titleEn : s.titleHi}</span>
                      <span className="block text-[12.5px] text-white/55">{lang === "en" ? s.taglineEn : s.taglineHi}</span>
                      {isLoop && (
                        <span className="mt-1 inline-block rounded-full bg-[#7ef0dd]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#b8fff4]">
                          {lang === "en" ? "loops back to Listing" : "लिस्टिंग पर वापसी"}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <span className="ml-auto shrink-0 rounded-full bg-[#C9A227] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0a0f22]">
                        {t("stage.youAreHere")}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-[12.5px] leading-relaxed text-white/55">
              {lang === "en"
                ? "Court matters loop: listing → hearing → order → tasks → next listing, until the matter concludes. There is no final step — only the next date."
                : "न्यायालयीन मामले चक्र में चलते हैं: लिस्टिंग → सुनवाई → आदेश → कार्य → अगली लिस्टिंग, जब तक मामला पूर्ण न हो। कोई अंतिम चरण नहीं — केवल अगली तारीख।"}
            </p>
          </div>

          <motion.div
            key={active.id + lang}
            initial={{ opacity: 0, y: 24, rotateX: 4 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="h-fit rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl sm:p-8"
            style={{ transformPerspective: 1000 }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <VerifyBadge status={active.verificationStatus} />
              <span className="text-[11.5px] font-semibold text-white/50">Madhya Pradesh · District Court · Criminal — Bail</span>
            </div>
            <h3 className="mt-4 font-serif text-3xl font-black">
              {active.order}. {lang === "en" ? active.titleEn : active.titleHi}
            </h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">{lang === "en" ? active.meaningEn : active.meaningHi}</p>
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f3d67a]">What normally happens</p>
              <ul className="mt-2 space-y-2">
                {(lang === "en" ? active.happensEn : active.happensHi).map((h) => (
                  <li key={h} className="flex gap-2.5 text-[13.5px] leading-relaxed text-white/75">
                    <ArrowRight size={14} className="mt-1 shrink-0 text-[#C9A227]" /> {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/8 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f3d67a]">What happens next</p>
              <p className="mt-1.5 text-[13.5px] text-white/80">{lang === "en" ? active.nextEn : active.nextHi}</p>
              <p className="mt-2 text-[12.5px] text-white/55">
                <b className="text-white/75">Watch for: </b>
                {lang === "en" ? active.watchForEn : active.watchForHi}
              </p>
            </div>
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                <BookOpenCheck size={13} /> Sources
              </p>
              <div className="mt-2 space-y-1.5">
                {active.sourceIds.map((id) => {
                  const s = sourceById(id);
                  if (!s) return null;
                  return (
                    <a key={id} href={s.url} target="_blank" rel="noreferrer" className="block text-[12.5px] text-[#7ef0dd] hover:underline">
                      {s.title} <span className="text-white/40">· {s.authority}</span>
                    </a>
                  );
                })}
              </div>
              <p className="mt-2 text-[11.5px] text-white/40">Requirements can vary by court / registry / case circumstances. Verify locally where flagged.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
