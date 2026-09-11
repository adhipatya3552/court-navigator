import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const serif = Fraunces({ variable: "--font-serif", subsets: ["latin"], weight: ["400", "700", "900"] });
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Court Navigator — You know your case. We help you navigate the procedure.",
  description:
    "Procedural guidance for MP District Court bail navigation: roadmap, checklist, glossary, document decoder and what-happens-next. ILTN x vibecode.law Vibeathon 2026 prototype.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FAF8F3] font-sans text-[#101828]">{children}</body>
    </html>
  );
}
