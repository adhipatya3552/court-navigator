"use client";

import { motion } from "framer-motion";
import { Scale, Languages, Map } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function Nav() {
  const { lang, setLang, t } = useLang();
  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070b18]/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#7a5f10] text-[#0a0f22] shadow-[0_8px_30px_rgba(201,162,39,0.35)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            <Scale size={20} strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-tight text-white">{t("nav.product")}</span>
            <span className="block text-[11px] font-medium tracking-wide text-white/55">{t("nav.tag")}</span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 text-[13px] font-medium text-white/70 md:flex">
          {[
            ["#journey", "Roadmap"],
            ["#checklist", "Checklist"],
            ["#glossary", "Glossary"],
            ["#decoder", "Decoder"],
            ["#next", "Next"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full px-3.5 py-2 transition hover:bg-white/10 hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[12px] font-semibold text-white transition hover:border-[#C9A227]/60 hover:text-[#f3d67a]"
            aria-label="Toggle language"
          >
            <Languages size={14} />
            {lang === "en" ? "हिंदी" : "English"}
          </button>
          <a
            href="#journey"
            className="hidden items-center gap-2 rounded-full bg-[#C9A227] px-4 py-2 text-[12px] font-bold text-[#0a0f22] shadow-[0_8px_24px_rgba(201,162,39,0.4)] transition hover:brightness-110 sm:flex"
          >
            <Map size={14} />
            {t("nav.start")}
          </a>
        </div>
      </div>
    </motion.header>
  );
}
