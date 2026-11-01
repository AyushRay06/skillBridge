"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { CadCrosshair } from "./CadAccents";

interface FaqItem {
  id: string;
  index: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: "f1",
    index: "01",
    question: "What is CareerCrew AI?",
    answer:
      "CareerCrew is an autonomous multi-agent AI platform that searches job openings, scores match fit, and compiles ATS-optimized LaTeX resumes, cover letters, and outreach emails for candidates.",
  },
  {
    id: "f2",
    index: "02",
    question: "How does CareerCrew ensure resumes pass ATS filters?",
    answer:
      "Our parser validates resumes against parsing schemas for Greenhouse, Lever, and Workday, ensuring accurate keyword parity, standard section hierarchy, and clean typographic structure.",
  },
  {
    id: "f3",
    index: "03",
    question: "Can I export pure LaTeX and Vector PDF files?",
    answer:
      "Yes. Resumes can be previewed in your browser and exported in both lightweight Vector PDF and compile-ready LaTeX (.tex) format.",
  },
  {
    id: "f4",
    index: "04",
    question: "How does the autonomous crawler and job match work?",
    answer:
      "Agent 01 indexes openings across Greenhouse, Lever, and LinkedIn 24/7. Agent 02 performs cosine match scoring, advancing only openings that match your target profile.",
  },
  {
    id: "f5",
    index: "05",
    question: "Do I have control before an application is submitted?",
    answer:
      "Yes. You can choose Semi-Autonomous mode (requires your 1-click confirmation before submission) or Full Autopilot mode (auto-submits directly to the application queue).",
  },
  {
    id: "f6",
    index: "06",
    question: "Is my personal data encrypted and secure?",
    answer:
      "All candidate data is encrypted with AES-256. We never sell your personal information or use your private resumes to train public AI models.",
  },
];

export default function FaqSection() {
  const [expandedId, setExpandedId] = useState<string | null>("f1");

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
            FAQ
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl">
              Quick answers about CareerCrew AI, resume exports, and autonomous job applications.
            </p>
          </div>

          <div className="font-mono text-xs text-muted-foreground border border-border/80 px-4 py-2 bg-muted/20 self-start md:self-auto">
            INQUIRIES: <strong className="text-foreground">6 QUESTIONS</strong>
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
