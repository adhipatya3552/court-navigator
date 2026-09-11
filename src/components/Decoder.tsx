"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DEMO_DOCS, GLOSSARY, STAGES } from "@/lib/data";
import { decodeDocument, type DecodedDoc } from "@/lib/decoder";
import { aiExplain, aiExtract, type AiResult } from "@/lib/aiClient";
import type { AIExtraction } from "@/lib/safety";
import { useLang } from "@/lib/i18n";
import { FileUp, ScanText, TriangleAlert, BadgeCheck, Sparkles, ListChecks, Eye } from "lucide-react";

export default function Decoder({ onStageFound, demoNonce }: { onStageFound: (id: string) => void; demoNonce: number }) {
  const { lang, t } = useLang();
  const [text, setText] = useState(DEMO_DOCS[0].fictionalText);
  const [result, setResult] = useState<DecodedDoc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState<AiResult | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiOffline, setAiOffline] = useState(false);
  const [struct, setStruct] = useState<{ extraction: AIExtraction; provider: string; model: string } | null>(null);

  const run = useCallback(
    (input: string) => {
    setBusy(true);
    setError(null);
    setResult(null);
    setAi(null);
    setAiOffline(false);
    setStruct(null);
    window.setTimeout(() => {
      const out = decodeDocument(input);
      if ("error" in out) {
        setError(out.error);
        setBusy(false);
        return;
      }
      setResult(out);
      setBusy(false);
      onStageFound(out.mappedStageId);
      // AI layers (grounded in the deterministic extraction). Offline path stays fully usable.
      const stage = STAGES.find((s) => s.id === out.mappedStageId);
      const corpus = [
        `Stage: ${stage?.titleEn ?? out.mappedStageId} — ${stage?.meaningEn ?? ""}`,
        `Next: ${lang === "en" ? out.nextEn : out.nextHi}`,
        `Dates: ${out.dates.join(", ") || "none"}`,
        `Terms: ${out.termsFound.map((t) => t.term).join(", ") || "none"}`,
        `Valid stage ids: prepare, filing, scrutiny, listing, hearing, order, next-stage`,
      ].join("\n");
      setAiBusy(true);
      aiExplain("decode", input, corpus, lang).then((r) => {
        setAiBusy(false);
        if (r) setAi(r);
        else setAiOffline(true);
      });
      aiExtract(input, corpus, lang).then((r) => {
        if (r) setStruct(r);
      });
    }, 650);
    },
    [lang, onStageFound]
  );

  // "Try a Sample Case" trigger: parent bumps demoNonce → load + decode demo order.
  // Deferred via timeout so state updates don't run synchronously in the effect;
  // handledNonce keeps lang/prop changes from re-firing a consumed trigger.
  const handledNonce = useRef(0);
  useEffect(() => {
    if (demoNonce === 0 || demoNonce === handledNonce.current) return;
    handledNonce.current = demoNonce;
    const t = window.setTimeout(() => {
      setText(DEMO_DOCS[0].fictionalText);
      run(DEMO_DOCS[0].fictionalText);
    }, 0);
    return () => window.clearTimeout(t);
  }, [demoNonce, run]);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large (over 5 MB). Please paste the readable text instead.");
      return;
    }
    if (/\.pdf$/i.test(f.name)) {
      setBusy(true);
      setError(null);
      setResult(null);
      setAi(null);
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        const buf = await f.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: buf }).promise;
        const pages: string[] = [];
        const n = Math.min(pdf.numPages, 10);
        for (let i = 1; i <= n; i++) {
          const page = await pdf.getPage(i);
          const tc = await page.getTextContent();
          pages.push(tc.items.map((it) => ("str" in it ? (it.str as string) : "")).join(" "));
        }
        const content = pages.join("\n").replace(/[ \t]+/g, " ").trim().slice(0, 12000);
        if (content.length < 40) {
          setBusy(false);
          setError("This document appears image-based (scanned) and could not be reliably read. Please paste the readable text, or use a demo document.");
          return;
        }
        setText(content);
        setBusy(false);
        run(content);
      } catch {
        setBusy(false);
        setError("Could not read this PDF reliably. Please paste the readable text, or use a demo document.");
      }
      return;
    }
    if (!/\.(txt|md)$/i.test(f.name)) {
      setError("V1 reads pasted text, PDFs with selectable text, and .txt / .md files. For photos or other formats, please paste the readable text.");
      return;
    }
    const content = await f.text();
    setText(content.slice(0, 12000));
    run(content.slice(0, 12000));
  };

  return (
    <section id="decoder" className="relative overflow-hidden bg-[#0b1226] py-24 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-[#0E4D4A]/40 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#7ef0dd]">06 · Decoder</p>
          <h2 className="mt-3 font-serif text-4xl font-black tracking-tight sm:text-5xl">{t("decoder.title")}</h2>
          <p className="mt-3 max-w-2xl text-[15px] text-white/60">
            {lang === "en"
              ? "Upload or paste an order, notice or summons. The decoder extracts what it can, explains terms, maps you to the journey — and says what it cannot infer."
              : "आदेश, नोटिस या सम्मन अपलोड करें या paste करें। डिकोडर निष्कर्ष, शब्दावली व यात्रा-मैपिंग देता है — और बताता है जो अनुमान नहीं लगाया जा सकता।"}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="flex flex-wrap gap-2">
              {DEMO_DOCS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setText(d.fictionalText); setResult(null); setError(null); }}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12.5px] font-semibold text-white/75 transition hover:border-[#C9A227]/60 hover:text-white"
                >
                  {lang === "en" ? d.labelEn : d.labelHi}
                </button>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="mt-4 w-full resize-y rounded-2xl border border-white/10 bg-[#070b18] p-4 font-mono text-[12.5px] leading-relaxed text-white/85 outline-none transition focus:border-[#C9A227]/60"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => run(text)}
                disabled={busy}
                className="flex items-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-3.5 text-[14px] font-bold text-[#0a0f22] transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50"
              >
                <ScanText size={16} /> {busy ? "Decoding…" : "Decode document"}
              </button>
              <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-semibold transition hover:border-white/40 hover:bg-white/10">
                <FileUp size={16} /> Upload .txt / PDF
                <input type="file" accept=".txt,.md,.pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            </div>
            {error && (
              <div className="mt-4 flex gap-2.5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-[13.5px] text-amber-100">
                <TriangleAlert size={16} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            {!result && !busy && (
              <div className="grid h-full min-h-[280px] place-items-center rounded-2xl border border-dashed border-white/15 p-8 text-center text-[13.5px] text-white/50">
                Run the decoder on a demo document to see: document type, dates, terms, journey mapping and “what happens next”.
              </div>
            )}
            {busy && (
              <div className="space-y-3">
                {[90, 70, 80].map((w, i) => (
                  <motion.div key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }} className="h-5 rounded-lg bg-white/10" style={{ width: `${w}%` }} />
                ))}
                <p className="text-[12.5px] text-white/50">Extracting dates, terms and procedural signals…</p>
              </div>
            )}
            {result && (
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-300/15 px-3 py-1.5 text-[11.5px] font-bold text-emerald-200">
                    <BadgeCheck size={13} /> Appears to be: {result.docType} · {result.docTypeConfidence} signal
                  </span>
                  <span className="rounded-full bg-[#C9A227]/15 px-3 py-1.5 text-[11.5px] font-bold text-[#f3d67a]">
                    {lang === "en" ? "Maps to journey stage → " : "यात्रा-चरण → "}
                    {(() => {
                      const st = STAGES.find((s) => s.id === result.mappedStageId);
                      return st ? (lang === "en" ? st.titleEn : st.titleHi) : result.mappedStageId;
                    })()}
                  </span>
                </div>
                {(lang === "en" ? result.signalsEn : result.signalsHi).length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/45">
                      <Eye size={13} /> Why this mapping?
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {(lang === "en" ? result.signalsEn : result.signalsHi).map((s) => {
                        const decisive = s === (lang === "en" ? result.decisiveEn : result.decisiveHi) && result.decisiveEn !== "";
                        return (
                          <li key={s} className={`flex gap-1.5 text-[12.5px] ${decisive ? "font-semibold text-[#b8fff4]" : "text-white/45"}`}>
                            <span aria-hidden>{decisive ? "✓" : "•"}</span>
                            <span>
                              {s}
                              {decisive && (
                                <span className="ml-1.5 rounded-full bg-[#7ef0dd]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#b8fff4]">
                                  {lang === "en" ? "deciding signal" : "निर्णायक संकेत"}
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    {struct && (
                      <p className="mt-2 text-[12px] text-[#b8fff4]">
                        Structured AI extraction {struct.extraction.stageHypothesis === result.mappedStageId ? "agrees" : "differs (deterministic mapping kept)"} — stage “{struct.extraction.stageHypothesis}”, {struct.extraction.confidence} confidence · via {struct.provider}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-[14px] leading-relaxed text-white/80">{lang === "en" ? result.summaryEn : result.summaryHi}</p>
                {(lang === "en" ? result.scopeNoteEn : result.scopeNoteHi) && (
                  <div className="flex gap-2.5 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-4 text-[13px] leading-relaxed text-amber-100">
                    <TriangleAlert size={16} className="mt-0.5 shrink-0" />
                    {lang === "en" ? result.scopeNoteEn : result.scopeNoteHi}
                  </div>
                )}
                <div className="rounded-2xl border border-[#7ef0dd]/25 bg-[#7ef0dd]/[0.06] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#b8fff4]">
                    <Sparkles size={13} /> {lang === "en" ? "What does it mean?" : "इसका अर्थ क्या है?"}
                  </p>
                  {aiBusy && <p className="mt-1.5 animate-pulse text-[13px] text-white/55">Asking the model (grounded in the extraction above)…</p>}
                  {ai && (
                    <>
                      <p className="mt-1.5 whitespace-pre-line text-[13.5px] leading-relaxed text-white/85">{ai.text}</p>
                      <p className="mt-2 text-[11px] text-white/40">via {ai.provider} · {ai.model} · explanation only — extraction above is deterministic</p>
                    </>
                  )}
                  {!aiBusy && !ai && aiOffline && (
                    <p className="mt-1.5 text-[12.5px] text-white/50">AI unavailable (offline path) — the deterministic explanation above is the complete result.</p>
                  )}
                </div>
                <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <summary className="cursor-pointer text-[11px] font-bold uppercase tracking-widest text-white/45 transition hover:text-white/70">
                    {lang === "en" ? "Extraction details" : "निष्कर्षण विवरण"}
                  </summary>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/[0.05] p-4">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">Dates found</p>
                      <p className="mt-1.5 text-[13.5px] text-white/80">{result.dates.length ? result.dates.join(" · ") : "— none extracted"}</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.05] p-4">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">Case refs found</p>
                      <p className="mt-1.5 text-[13.5px] text-white/80">{result.caseRefs.length ? result.caseRefs.join(" · ") : "— none extracted"}</p>
                    </div>
                  </div>
                  {result.termsFound.length > 0 && (
                    <div className="mt-3 rounded-2xl bg-white/[0.05] p-4">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">Terms detected</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {result.termsFound.map((term) => {
                          const g = GLOSSARY.find((x) => x.id === term.id);
                          return (
                            <a
                              key={term.id}
                              href={`#glossary-${term.id}`}
                              title={`${g ? (lang === "en" ? g.simpleEn : g.simpleHi) : ""} — ${lang === "en" ? "open in glossary" : "glossary में खोलें"}`}
                              className="rounded-full border border-[#7ef0dd]/30 bg-[#7ef0dd]/10 px-3 py-1.5 text-[12px] font-semibold text-[#b8fff4] transition hover:border-[#7ef0dd]/60 hover:bg-[#7ef0dd]/20"
                            >
                              {term.term} →
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </details>
                <div className="rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/8 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#f3d67a]">What appears to happen next</p>
                  <p className="mt-1.5 text-[13.5px] text-white/85">{lang === "en" ? result.nextEn : result.nextHi}</p>
                  <a href="#checklist" className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-bold text-white transition hover:bg-white/20">
                    <ListChecks size={13} /> Checklist updated for this stage ↓
                  </a>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">Cannot safely be inferred</p>
                  <ul className="mt-1.5 space-y-1.5">
                    {(lang === "en" ? result.unknownsEn : result.unknownsHi).map((u) => (
                      <li key={u} className="flex gap-2 text-[12.5px] text-white/60">
                        <TriangleAlert size={13} className="mt-0.5 shrink-0 text-amber-300" /> {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-[11.5px] text-white/40">{lang === "en" ? result.safetyEn : result.safetyHi}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
