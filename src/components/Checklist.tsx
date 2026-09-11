"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CHECKLIST, STAGES } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { VerifyBadge } from "./Roadmap";
import { ListChecks } from "lucide-react";

export default function Checklist({ stageId }: { stageId: string }) {
  const { lang, t } = useLang();
  const [done, setDone] = useState<Set<string>>(new Set(["c-prep-1"]));
  const [filter, setFilter] = useState<string>("current");

  const items = useMemo(() => (filter === "current" ? CHECKLIST.filter((c) => c.stageId === stageId) : CHECKLIST), [filter, stageId]);
  const pct = items.length === 0 ? 0 : Math.round((items.filter((i) => done.has(i.id)).length / items.length) * 100);
  const stage = STAGES.find((s) => s.id === stageId);

  return (
    <section id="checklist" className="bg-[#FAF8F3] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#0E4D4A]">04 · Checklist</p>
          <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-[#101828] sm:text-5xl">{t("checklist.title")}</h2>
          <p className="mt-3 max-w-2xl text-[15px] text-[#101828]/65">
            {lang === "en" ? `For stage: ${stage?.titleEn}. Every item carries its source — nothing is asserted without provenance.` : `चरण हेतु: ${stage?.titleHi}। प्रत्येक बिंदु के साथ स्रोत है।`}
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#101828]/10 bg-white px-5 py-3 shadow-sm">
            <span className="relative grid h-12 w-12 place-items-center rounded-full bg-[#101828] text-[13px] font-black text-[#f3d67a]">
              {pct}%
              <svg className="absolute inset-0 h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#C9A227" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 125.6} 125.6`} />
              </svg>
            </span>
            <span className="text-[13px] font-semibold text-[#101828]/70">
              {done.size} of {items.length} done
            </span>
          </div>
          <div className="flex rounded-full border border-[#101828]/10 bg-white p-1 text-[13px] font-semibold">
            {(["current", "all"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 transition ${filter === f ? "bg-[#101828] text-white" : "text-[#101828]/60 hover:text-[#101828]"}`}>
                {f === "current" ? "This stage" : "All stages"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {items.map((c, i) => {
            const checked = done.has(c.id);
            return (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                onClick={() => setDone((d) => { const n = new Set(d); if (n.has(c.id)) n.delete(c.id); else n.add(c.id); return n; })}
                className={`rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  checked ? "border-emerald-300 bg-emerald-50/70" : "border-[#101828]/10 bg-white shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border text-[13px] font-black transition ${checked ? "border-emerald-500 bg-emerald-500 text-white" : "border-[#101828]/25 text-transparent"}`}>
                    ✓
                  </span>
                  <span>
                    <span className={`block text-[14.5px] font-bold ${checked ? "text-emerald-900 line-through" : "text-[#101828]"}`}>
                      {lang === "en" ? c.labelEn : c.labelHi}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-[#101828]/60">{lang === "en" ? c.explainEn : c.explainHi}</span>
                    <span className="mt-2.5 flex flex-wrap items-center gap-2">
                      <VerifyBadge status={c.verificationStatus} />
                      <span className="rounded-full bg-[#101828]/5 px-2.5 py-1 text-[10.5px] font-bold text-[#101828]/55">
                        {["filing", "scrutiny", "listing"].includes(c.stageId) ? "MP District Courts" : "General process literacy"}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#101828]/40">{c.category.replace("-", " ")}</span>
                    </span>
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
        <p className="mt-5 flex items-center gap-2 text-[12.5px] text-[#101828]/55">
          <ListChecks size={14} /> Never invent a checklist item. Items flagged “Needs verification” must be confirmed with the court / registry.
        </p>
      </div>
    </section>
  );
}
