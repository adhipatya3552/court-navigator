"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { assistantReply } from "@/lib/decoder";
import { aiExplain } from "@/lib/aiClient";
import { STRATEGY_RE } from "@/lib/safety";
import { GLOSSARY } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { MessageCircleHeart, Send } from "lucide-react";

const CHIPS = ["What does listing mean?", "What happens next after filing?", "Which courts are supported?", "I got an adjournment — what now?"];

export default function Assistant() {
  const { lang, t } = useLang();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<{ q: string; a: string; via?: string }[]>([
    { q: "What does listing mean?", a: "" },
  ]);
  const shown = log.map((m) => {
    if (m.a) return m;
    const r = assistantReply(m.q);
    return { ...m, a: lang === "en" ? r.en : r.hi, via: "offline corpus" };
  });

  const ask = (text: string) => {
    const query = text.trim();
    if (!query || busy) return;
    // Pasted documents (>300 chars) go through the decode path, not the Q&A
    // path, so narrative mentions ("released on bail") are never refused.
    const isDoc = query.length > 300;
    // Strategy/outcome questions are refused locally — no model call, no quota spent.
    if (!isDoc && STRATEGY_RE.test(query)) {
      const r = assistantReply(query);
      setLog((l) => [...l, { q: query, a: lang === "en" ? r.en : r.hi, via: "guardrail" }]);
      setQ("");
      return;
    }
    setBusy(true);
    setLog((l) => [...l, { q: query, a: "", via: "thinking…" }]);
    const words = query.toLowerCase().split(/[^a-z]+/);
    const hits = GLOSSARY.filter((g) =>
      words.some((w) => w.length > 3 && (g.term.toLowerCase().includes(w) || g.id.replace(/-/g, " ").includes(w)))
    ).slice(0, 5);
    const corpus = isDoc
      ? "MP District Courts bail journey stages: prepare, filing, scrutiny, listing, hearing, order, next-stage. Explain pasted documents procedurally."
      : (hits.length ? hits : GLOSSARY.slice(0, 6))
          .map((g) => `${g.term} (${g.hindi}): ${lang === "en" ? g.simpleEn : g.simpleHi}`)
          .join("\n");
    aiExplain(isDoc ? "decode" : "answer", query, corpus, lang).then((r) => {
      setBusy(false);
      setLog((l) => {
        const n = [...l];
        const i = n.map((m) => m.q).lastIndexOf(query);
        if (i >= 0) {
          if (r) n[i] = { q: query, a: r.text, via: `AI · ${r.provider}` };
          else {
            const d = assistantReply(query);
            n[i] = { q: query, a: lang === "en" ? d.en : d.hi, via: "offline corpus" };
          }
        }
        return n;
      });
    });
    setQ("");
  };

  return (
    <section id="assistant" className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }} className="text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#0E4D4A]">08 · Assistant</p>
          <h2 className="mt-3 flex items-center justify-center gap-2 font-serif text-4xl font-black tracking-tight text-[#101828]">
            <MessageCircleHeart size={30} className="text-[#0E4D4A]" /> {t("assistant.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[14px] text-[#101828]/60">Structured answers from the verified corpus — never strategy, never outcome prediction.</p>
        </motion.div>
        <div className="mt-8 rounded-3xl border border-[#101828]/10 bg-[#FAF8F3] p-5 shadow-sm sm:p-6">
          <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
            {shown.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-[#101828] px-4 py-2.5 text-[13.5px] font-medium text-white">{m.q}</div>
                <div className="mt-2 w-fit max-w-[92%] rounded-2xl rounded-bl-md border border-[#101828]/10 bg-white px-4 py-3 shadow-sm">
                  <p className="text-[13.5px] leading-relaxed text-[#101828]/80">{m.a}</p>
                  {m.via && <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-[#101828]/35">{m.via}</p>}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button key={c} onClick={() => ask(c)} className="rounded-full border border-[#101828]/12 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#101828]/70 transition hover:border-[#0E4D4A]/50 hover:text-[#0E4D4A]">
                {c}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="mt-3 flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "en" ? "Ask about a stage or term — not strategy…" : "चरण या शब्द पूछें — रणनीति नहीं…"}
              className="flex-1 rounded-2xl border border-[#101828]/15 bg-white px-4 py-3.5 text-[14px] outline-none transition focus:border-[#0E4D4A] focus:ring-4 focus:ring-[#0E4D4A]/10"
            />
            <button type="submit" className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-[#0E4D4A] text-white transition hover:-translate-y-0.5 hover:brightness-110" aria-label="Send">
              <Send size={17} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
