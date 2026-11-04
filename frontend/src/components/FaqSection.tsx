"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { CadCrosshair } from "./CadAccents";
import { useLandingLanguage } from "@/contexts/LandingLanguageContext";

interface FaqItem {
  id: string;
  index: string;
  question: string;
  answer: string;
}

export default function FaqSection() {
  const { t } = useLandingLanguage();
  const [expandedId, setExpandedId] = useState<string | null>("f1");

  const faqs: FaqItem[] = (t.faq?.items || []).map((item, idx) => ({
    id: `f${idx + 1}`,
    index: String(idx + 1).padStart(2, "0"),
    question: item.q,
    answer: item.a,
  }));

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative bg-background text-foreground w-full"
    >
      {/* Header */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs font-black tracking-tighter text-foreground opacity-70">
            ///
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {t.faq.sectionTag}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              {t.faq.heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl">
              {t.faq.subheading}
            </p>
          </div>

          <div className="font-mono text-xs text-muted-foreground border border-border/80 px-4 py-2 bg-muted/20 self-start md:self-auto">
            INQUIRIES: <strong className="text-foreground">{faqs.length} QUESTIONS</strong>
          </div>
        </div>
      </div>

      {/* Clean, Minimal FAQ Accordion Frame with Straight Hairlines */}
      <div className="border-t border-b border-border/80 w-full relative">
        <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 relative">
          <div className="border-x border-b border-border/80 divide-y divide-border/80 relative bg-background">
            {faqs.map((faq) => {
              const isOpen = expandedId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`transition-colors duration-200 ${
                    isOpen ? "bg-muted/15" : "hover:bg-muted/10"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between gap-4 p-6 sm:p-7 text-left focus:outline-none cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <span className="font-mono text-xs font-bold text-muted-foreground shrink-0 border border-border/80 px-2.5 py-1 bg-muted/20 transition-colors group-hover:border-foreground/50">
                        {faq.index}
                      </span>
                      <span className="text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-foreground/80">
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`shrink-0 flex items-center justify-center h-7 w-7 border transition-all duration-300 ${
                        isOpen
                          ? "border-foreground bg-foreground text-background"
                          : "border-border/80 text-muted-foreground group-hover:border-foreground/60 group-hover:text-foreground"
                      }`}
                    >
                      <Plus
                        className={`h-4 w-4 transition-transform duration-300 ease-out ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  {/* Smooth Grid Accordion Expansion */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0">
                        <div className="border border-border/80 border-l-2 border-l-zinc-600 dark:border-l-zinc-400 bg-muted/10 p-5 transition-all duration-300">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Corner CAD Crosshair (+) Markers */}
            <CadCrosshair className="absolute -top-2 -left-2" />
            <CadCrosshair className="absolute -top-2 -right-2" />
            <CadCrosshair className="absolute -bottom-2 -left-2" />
            <CadCrosshair className="absolute -bottom-2 -right-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
