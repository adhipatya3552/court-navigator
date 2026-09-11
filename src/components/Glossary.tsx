"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GLOSSARY } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { Search } from "lucide-react";
import { VerifyBadge } from "./Roadmap";

export default function Glossary() {
  const { lang, t } = useLang();
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return GLOSSARY;
    return GLOSSARY.filter((g) => `${g.term} ${g.hindi} ${g.simpleEn} ${g.simpleHi}`.toLowerCase().includes(needle));
  }, [q]);

  return (
    <section id="glossary" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#0E4D4A]">05 · Glossary</p>
          <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-[#101828] sm:text-5xl">{t("glossary.title")}</h2>
        </motion.div>
        <div className="relative mt-8 max-w-xl">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#101828]/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "en" ? "Search: cause list, affidavit, adjournment…" : "खोजें: कॉज़ लिस्ट, शपथपत्र, स्थगन…"}
            className="w-full rounded-2xl border border-[#101828]/15 bg-[#FAF8F3] py-4 pl-11 pr-4 text-[14.5px] text-[#101828] outline-none transition focus:border-[#0E4D4A] focus:ring-4 focus:ring-[#0E4D4A]/10"
          />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
              className="group rounded-2xl border border-[#101828]/10 bg-[#FAF8F3] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A227]/60 hover:shadow-xl"
              style={{ transformPerspective: 700 }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[16px] font-black text-[#101828]">{g.term}</div>
                  <div className="text-[13px] font-semibold text-[#0E4D4A]">{g.hindi}</div>
                </div>
                <VerifyBadge status={g.verificationStatus} />
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-[#101828]/75">{lang === "en" ? g.simpleEn : g.simpleHi}</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[#101828]/55">
                <b className="text-[#101828]/75">For you: </b>
                {lang === "en" ? g.whyEn : g.whyHi}
              </p>
              <p className="mt-2 rounded-xl bg-white p-2.5 text-[12px] italic text-[#101828]/60">{g.exampleEn}</p>
            </motion.div>
          ))}
          {results.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-[#101828]/20 p-8 text-center text-[14px] text-[#101828]/55">
              No term found. Try “list”, “order”, “affidavit” — or ask the assistant below.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
