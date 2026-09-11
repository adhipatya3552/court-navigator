"use client";

import { useState } from "react";
import { LanguageProvider } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import JourneySetup from "@/components/JourneySetup";
import Roadmap from "@/components/Roadmap";
import Checklist from "@/components/Checklist";
import Glossary from "@/components/Glossary";
import Decoder from "@/components/Decoder";
import NextStep from "@/components/NextStep";
import Assistant from "@/components/Assistant";
import Faq from "@/components/Faq";
import Scope from "@/components/Scope";
import Footer from "@/components/Footer";
import Onboarding from "@/components/Onboarding";
import HelpMenu from "@/components/HelpMenu";

export default function Page() {
  const [stageId, setStageId] = useState("filing");
  const [demoNonce, setDemoNonce] = useState(0);
  const runSampleCase = () => {
    setStageId("filing");
    setDemoNonce((n) => n + 1);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelector("#decoder")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };
  return (
    <LanguageProvider>
      <SmoothScroll />
      <Nav />
      <Onboarding />
      <HelpMenu />
      <main>
        <Hero />
        <div className="border-y border-[#101828]/10 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-4 text-[12.5px] font-semibold text-[#101828]/60 sm:px-6">
            <span>01 · Land → <b className="text-[#101828]">Start Court Navigation</b></span>
            <span>02 · Setup → <b className="text-[#101828]">MP · District · Criminal · Bail</b></span>
            <span>03 · Roadmap → <b className="text-[#101828]">You are here</b></span>
            <span>04 · Decoder → <b className="text-[#101828]">What happens next?</b></span>
          </div>
        </div>
        <JourneySetup stageId={stageId} setStageId={setStageId} onSampleCase={runSampleCase} />
        <Roadmap stageId={stageId} setStageId={setStageId} />
        <Checklist stageId={stageId} />
        <Glossary />
        <Decoder onStageFound={setStageId} demoNonce={demoNonce} />
        <NextStep stageId={stageId} setStageId={setStageId} />
        <Assistant />
        <Faq />
        <Scope />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
