"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { FAQ_ITEMS } from "@/lib/help";

export default function Faq() {
  const { lang, t } = useLang();
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#0E4D4A]">09 · FAQ</p>
          <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-[#101828] sm:text-5xl">{t("faq.title")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-[14px] text-[#101828]/60">{t("faq.sub")}</p>
        </motion.div>
        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((f, i) => {
            const open = openId === f.id;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.25) }}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  open ? "border-[#0E4D4A]/35 bg-[#FAF8F3]" : "border-[#101828]/10 bg-white hover:border-[#101828]/25"
                }`}
              >
                <button
                  onClick={() => setOpenId(open ? null : f.id)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${f.id}`}
                  className="flex min-h-[56px] w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-[15px] font-bold text-[#101828]">{lang === "en" ? f.qEn : f.qHi}</span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-lg font-light ${
                      open ? "bg-[#0E4D4A] text-white" : "bg-[#101828]/5 text-[#101828]/60"
                    }`}
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>
                <div id={`faq-panel-${f.id}`} hidden={!open}>
                  <p className="px-5 pb-5 text-[14px] leading-relaxed text-[#101828]/70">{lang === "en" ? f.aEn : f.aHi}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
