"use client";

import { useLang } from "@/lib/i18n";
import { Scale } from "lucide-react";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-[#070b18] py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#7a5f10] text-[#0a0f22]">
            <Scale size={19} />
          </span>
          <div>
            <p className="text-[14px] font-bold">Court Navigator · ILTN × vibecode.law Vibeathon 2026</p>
            <p className="text-[12px] text-white/50">MP District Courts · Criminal — Bail navigation · Demo prototype</p>
          </div>
        </div>
        <p className="max-w-xl text-[12px] leading-relaxed text-white/50">{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}
