"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, FileScan, ShieldCheck, Sparkles, CircleHelp } from "lucide-react";
import { useRef } from "react";
import Scene3D from "./Scene3D";
import { useLang } from "@/lib/i18n";
import { openOnboarding } from "@/lib/onboard";

export default function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#070b18]">
      <Scene3D />
      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-36 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-1.5 text-[12px] font-semibold tracking-wide text-[#f3d67a]"
        >
          <Sparkles size={13} />
          {t("hero.badge")}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl font-serif text-[42px] font-black leading-[1.02] tracking-tight text-white sm:text-[72px]"
        >
          {t("hero.titleA")}
          <span className="block bg-gradient-to-r from-[#f3d67a] via-[#C9A227] to-[#7ef0dd] bg-clip-text text-transparent">
            {t("hero.titleB")}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-lg"
        >
          {t("hero.sub")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href="#setup"
            className="group flex items-center gap-2 rounded-2xl bg-[#C9A227] px-7 py-4 text-[15px] font-bold text-[#0a0f22] shadow-[0_18px_50px_rgba(201,162,39,0.45)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            {t("hero.cta1")}
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#decoder"
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-4 text-[15px] font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
          >
            <FileScan size={17} />
            {t("hero.cta2")}
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-white/55"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#7ef0dd]" />
            {t("hero.note")}
          </span>
          <span className="flex items-center gap-2">
            <span className="text-white/45">{t("hero.firstTime")}</span>
            <button
              onClick={openOnboarding}
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 font-semibold text-white transition hover:border-[#C9A227]/60 hover:text-[#f3d67a]"
            >
              <CircleHelp size={13} />
              {t("hero.howItWorks")}
            </button>
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            ["7", "Stages mapped"],
            ["10", "Checklist items"],
            ["16", "Glossary terms"],
            ["7", "Official sources"],
          ].map(([n, l]) => (
            <div
              key={l}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition hover:border-[#C9A227]/50 hover:bg-white/[0.07]"
            >
              <div className="font-serif text-3xl font-black text-[#f3d67a]">{n}</div>
              <div className="mt-1 text-[12px] font-medium text-white/60">{l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-6">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="h-10 w-6 rounded-full border border-white/25 p-1.5"
        >
          <div className="h-2 w-2 rounded-full bg-[#C9A227]" />
        </motion.div>
      </div>
    </section>
  );
}
