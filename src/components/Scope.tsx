"use client";

import { motion } from "framer-motion";
import { SOURCES } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { ShieldCheck, MapPinned, LibraryBig } from "lucide-react";

export default function Scope() {
  const { lang, t } = useLang();
  return (
    <section id="scope" className="bg-[#FAF8F3] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#0E4D4A]">09 · Trust</p>
          <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-[#101828] sm:text-5xl">{t("scope.title")}</h2>
        </motion.div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6">
            <p className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-emerald-800"><MapPinned size={15} /> Supported in V1</p>
            <ul className="mt-3 space-y-2 text-[14px] font-medium text-emerald-950">
              <li>✓ Madhya Pradesh</li>
              <li>✓ District / Trial Court</li>
              <li>✓ Criminal — Bail navigation</li>
              <li>✓ 7-stage roadmap + checklist + glossary + decoder</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-[#101828]/10 bg-white p-6">
            <p className="text-[13px] font-black uppercase tracking-widest text-[#101828]/60">Coming soon (not faked)</p>
            <ul className="mt-3 space-y-2 text-[14px] text-[#101828]/70">
              <li>· Civil · Family · Consumer</li>
              <li>· Criminal beyond bail</li>
              <li>· High Court · Supreme Court · Other states</li>
              <li>· More languages · Reminders · Cause-list sync</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-[#101828]/10 bg-[#0b1226] p-6 text-white">
            <p className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-[#f3d67a]"><ShieldCheck size={15} /> Safety boundary</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/70">
              {lang === "en"
                ? "AI explains. Sources establish. Rules structure. Humans decide. No outcome prediction, no litigation strategy, no invented sections or deadlines."
                : "AI समझाता है। स्रोत स्थापित करते हैं। नियम संरचना देते हैं। निर्णय मानव लेता है। परिणाम, रणनीति, मनगढ़ंत धारा / समयसीमा नहीं।"}
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-3xl border border-[#101828]/10 bg-white p-6 sm:p-8">
          <p className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-[#101828]/60"><LibraryBig size={15} /> Source registry — primary & official only</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {SOURCES.map((s, i) => (
              <motion.a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                className="group rounded-2xl border border-[#101828]/10 bg-[#FAF8F3] p-4 transition hover:-translate-y-0.5 hover:border-[#0E4D4A]/40 hover:shadow-lg"
              >
                <p className="text-[13.5px] font-bold text-[#101828] group-hover:text-[#0E4D4A]">{s.title}</p>
                <p className="mt-1 text-[12px] text-[#101828]/55">{s.authority} · {s.jurisdiction}</p>
                <p className="mt-1.5 text-[12px] italic text-[#101828]/50">{s.applicability}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
