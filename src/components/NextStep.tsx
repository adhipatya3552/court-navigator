"use client";

import { motion } from "framer-motion";
import { STAGES, CHECKLIST, GLOSSARY, sourceById } from "@/lib/data";
import { resolveNext, kindLabel, stageName } from "@/lib/journey";
import { useLang } from "@/lib/i18n";
import { ArrowRight, BellRing, PackageCheck, Ear, GitBranch, HelpCircle } from "lucide-react";

export default function NextStep({ stageId, setStageId }: { stageId: string; setStageId: (id: string) => void }) {
  const { lang, t } = useLang();
  const idx = STAGES.findIndex((s) => s.id === stageId);
  const cur = STAGES[idx];
  const res = resolveNext(stageId);
  const goTarget = res.nextStageId ?? STAGES[Math.min(idx + 1, STAGES.length - 1)].id;
  const prep = CHECKLIST.filter((c) => c.stageId === cur.id).slice(0, 3);
  const terms = cur.termIds.map((id) => GLOSSARY.find((g) => g.id === id)).filter(Boolean);

  return (
    <section id="next" className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F3] to-[#f1e9d2] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#0E4D4A]">07 · Next step</p>
          <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-[#101828] sm:text-5xl">{t("next.title")}</h2>
        </motion.div>

        <motion.div
          key={cur.id + lang}
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 overflow-hidden rounded-[28px] border border-[#101828]/10 bg-[#0b1226] text-white shadow-[0_30px_80px_rgba(11,18,38,0.35)]"
          style={{ transformPerspective: 1200 }}
        >
          <div className="grid md:grid-cols-[1fr_1fr]">
            <div className="border-b border-white/10 p-7 sm:p-9 md:border-b-0 md:border-r">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3d67a]">{t("stage.youAreHere")}</p>
              <h3 className="mt-2 font-serif text-3xl font-black">
                {cur.order}. {lang === "en" ? cur.titleEn : cur.titleHi}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/65">{lang === "en" ? cur.meaningEn : cur.meaningHi}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setStageId(goTarget)}
                  disabled={!res.nextStageId}
                  className="group flex items-center gap-2 rounded-2xl bg-[#C9A227] px-5 py-3 text-[13.5px] font-bold text-[#0a0f22] transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-40"
                >
                  {lang === "en" ? `Go to: ${stageName(goTarget, "en")}` : `जाएं: ${stageName(goTarget, "hi")}`}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              {res.alternatives.length > 0 && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/45">
                    <GitBranch size={13} /> Or, depending on what happens:
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {res.alternatives.map((a) => (
                      <li key={a.stageId}>
                        <button onClick={() => setStageId(a.stageId)} className="text-left text-[13px] text-[#7ef0dd] hover:underline">
                          → {stageName(a.stageId, lang)}
                        </button>
                        <span className="text-[12.5px] text-white/50"> — {lang === "en" ? a.whenEn : a.whenHi}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="p-7 sm:p-9">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7ef0dd]">Next likely procedural step</p>
                <span className={`rounded-full px-3 py-1 text-[10.5px] font-black uppercase tracking-wider ${
                  res.kind === "typical" ? "bg-emerald-300/15 text-emerald-200"
                  : res.kind === "conditional" ? "bg-amber-300/15 text-amber-200"
                  : res.kind === "order-dependent" ? "bg-sky-300/15 text-sky-200"
                  : "bg-red-300/15 text-red-200"
                }`}>{kindLabel(res.kind, lang)}</span>
              </div>
              <p className="mt-2 text-[15px] font-semibold leading-relaxed">{lang === "en" ? cur.nextEn : cur.nextHi}</p>
              <p className="mt-2 flex gap-1.5 text-[12.5px] leading-relaxed text-white/55">
                <HelpCircle size={14} className="mt-0.5 shrink-0" />
                <span><b className="text-white/75">Why this? </b>{lang === "en" ? res.reasonEn : res.reasonHi}</span>
              </p>
              <div className="mt-5 space-y-3">
                <div className="flex gap-3 rounded-2xl bg-white/[0.05] p-4">
                  <PackageCheck size={17} className="mt-0.5 shrink-0 text-[#f3d67a]" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">Prepare</p>
                    <ul className="mt-1 space-y-1">
                      {prep.map((p) => (
                        <li key={p.id} className="text-[13px] text-white/80">✓ {lang === "en" ? p.labelEn : p.labelHi}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl bg-white/[0.05] p-4">
                  <Ear size={17} className="mt-0.5 shrink-0 text-[#7ef0dd]" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">You may hear</p>
                    <p className="mt-1.5 flex flex-wrap gap-x-1.5 gap-y-1 text-[13px] text-white/80">
                      {terms.map((x, i) => (
                        <span key={x!.id}>
                          <a href={`#glossary-${x!.id}`} className="text-[#7ef0dd] hover:underline" title={lang === "en" ? "What does this mean? — open glossary" : "इसका अर्थ? — glossary खोलें"}>
                            {x!.term}
                          </a>
                          {i < terms.length - 1 && <span className="text-white/35"> · </span>}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl bg-white/[0.05] p-4">
                  <BellRing size={17} className="mt-0.5 shrink-0 text-amber-300" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">Watch for</p>
                    <p className="mt-1 text-[13px] text-white/80">{lang === "en" ? cur.watchForEn : cur.watchForHi}</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[11.5px] text-white/40">
                Source: {(cur.sourceIds.map((id) => sourceById(id)?.authority).filter(Boolean) as string[]).join(" · ")}. Never certain where procedure depends on court discretion or unseen orders.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
