"use client";

import { useState } from "react";
import { Delete, X, Space, Eraser, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssameseKeyboardProps {
  onInsert: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSpace: () => void;
  onClose: () => void;
}

// ─── Assamese Character Datasets ─────────────────────────────────────────────

// স্বৰবৰ্ণ (Vowels)
const SWARABARNA = ["অ", "আ", "ই", "ঈ", "উ", "ঊ", "ঋ", "এ", "ঐ", "ও", "ঔ"];

// মাত্ৰা (Vowel Signs / Diacritics)
const MATRAS = [
  { sign: "া", label: "া (আ)", name: "আ-কাৰ" },
  { sign: "ি", label: "ি (ই)", name: "হ্ৰস্ব ই-কাৰ" },
  { sign: "ী", label: "ী (ঈ)", name: "দীৰ্ঘ ঈ-কাৰ" },
  { sign: "ু", label: "ু (উ)", name: "হ্ৰস্ব উ-কাৰ" },
  { sign: "ূ", label: "ূ (ঊ)", name: "দীৰ্ঘ ঊ-কাৰ" },
  { sign: "ৃ", label: "ৃ (ঋ)", name: "ঋ-কাৰ" },
  { sign: "ে", label: "ে (এ)", name: "এ-কাৰ" },
  { sign: "ৈ", label: "ৈ (ঐ)", name: "ঐ-কাৰ" },
  { sign: "ো", label: "ো (ও)", name: "ও-কাৰ" },
  { sign: "ৌ", label: "ৌ (ঔ)", name: "ঔ-কাৰ" },
];

// বিশেষ চিহ্ন আৰু বিৰাম চিহ্ন (Special signs, Virama, Punctuation)
const SPECIAL_SIGNS = [
  { sign: "্", label: "্ (হসন্ত)", desc: "যুক্তাক্ষৰ গঢ়িবলৈ" },
  { sign: "ং", label: "ং (অনুস্বাৰ)", desc: "অনুস্বাৰ" },
  { sign: "ঃ", label: "ঃ (বিসৰ্গ)", desc: "বিসৰ্গ" },
  { sign: "ঁ", label: "ঁ (চন্দ্ৰবিন্দু)", desc: "চন্দ্ৰবিন্দু" },
  { sign: "ৎ", label: "ৎ (খণ্ড-ত)", desc: "খণ্ড ত" },
  { sign: "ঽ", label: "ঽ (অৱগ্ৰহ)", desc: "অৱগ্ৰহ" },
  { sign: "।", label: "। (দাৰী)", desc: "দাৰী" },
  { sign: "॥", label: "॥ (দ্বিদাৰী)", desc: "দ্বিদাৰী" },
  { sign: "?", label: "? (প্ৰশ্নবোধক)", desc: "প্ৰশ্নচিহ্ন" },
  { sign: ",", label: ", (কমা)", desc: "কমা" },
];

// ব্যঞ্জনবৰ্ণ (Consonants)
const BYANJANBARNA = [
  ["ক", "খ", "গ", "ঘ", "ঙ"],
  ["চ", "ছ", "জ", "ঝ", "ঞ"],
  ["ট", "ঠ", "ড", "ঢ", "ণ"],
  ["ত", "থ", "দ", "ধ", "ন"],
  ["প", "ফ", "ব", "ভ", "ম"],
  ["য", "ৰ", "ল", "ৱ"],
  ["শ", "ষ", "স", "হ"],
  ["ক্ষ", "ড়", "ঢ়", "য়"],
];

// যুক্তাক্ষৰ (Common Compound / Conjunct Characters)
const JUKTAKHYOR = [
  "ক্ত", "ক্ষ", "জ্ঞ", "ঙ্ক", "ঙ্গ", "ঞ্চ", "ঞ্জ", "ট্ট", 
  "ণ্ড", "ত্ত", "ত্ম", "ত্র", "দ্ধ", "ন্ত", "ন্দ", "ম্প", 
  "ম্ভ", "ৰ্ম", "প্ৰ", "শ্ৰ", "ষ্ট", "ষ্ঠ", "স্প", "স্ন", 
  "স্ম", "হ্ম", "হ্ল", "হ্ন"
];

// সংখ্যা (Assamese Numerals)
const NUMERALS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

// সাধাৰণ কেৰিয়াৰ বাক্য / শব্দ (Quick Phrases & Career Prompts)
const QUICK_PHRASES = [
  "নমস্কাৰ",
  "কেৰিয়াৰ গাইড",
  "ৰিজ্যুমে পৰীক্ষা কৰক",
  "মোৰ বাবে কোনটো পদ উপযুক্ত?",
  "এটা ৰোডমেপ বনাওক",
  "মক সাক্ষাৎকাৰ আৰম্ভ কৰক",
  "চাকৰি সন্ধান কৰক",
  "দক্ষতা বৃদ্ধি",
  "শিক্ষাগত অৰ্হতা",
  "সহায় কৰক",
  "ধন্যবাদ",
];

type TabType = "all" | "swara_matra" | "byanjan" | "juktakhyor" | "phrases";

export function AssameseKeyboard({
  onInsert,
  onBackspace,
  onClear,
  onSpace,
  onClose,
}: AssameseKeyboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  return (
    <div className="border-t border-border/70 bg-card/95 backdrop-blur-md p-2.5 sm:p-3 transition-all select-none animate-in fade-in slide-in-from-bottom-2 duration-150">
      {/* Top Header: Tabs & Close */}
      <div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b border-border/40 text-xs">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-sans font-medium transition-colors rounded-none border cursor-pointer whitespace-nowrap",
              activeTab === "all"
                ? "bg-foreground text-background border-foreground font-semibold shadow-xs"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            পূৰ্ণাঙ্গ (All)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("swara_matra")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-sans font-medium transition-colors rounded-none border cursor-pointer whitespace-nowrap",
              activeTab === "swara_matra"
                ? "bg-foreground text-background border-foreground font-semibold shadow-xs"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            স্বৰবৰ্ণ & মাত্ৰা
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("byanjan")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-sans font-medium transition-colors rounded-none border cursor-pointer whitespace-nowrap",
              activeTab === "byanjan"
                ? "bg-foreground text-background border-foreground font-semibold shadow-xs"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            ব্যঞ্জনবৰ্ণ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("juktakhyor")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-sans font-medium transition-colors rounded-none border cursor-pointer whitespace-nowrap",
              activeTab === "juktakhyor"
                ? "bg-foreground text-background border-foreground font-semibold shadow-xs"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            যুক্তাক্ষৰ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("phrases")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-sans font-medium transition-colors rounded-none border cursor-pointer whitespace-nowrap flex items-center gap-1",
              activeTab === "phrases"
                ? "bg-foreground text-background border-foreground font-semibold shadow-xs"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>সাধাৰণ শব্দ</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer shrink-0 ml-1"
          title="Close Assamese keyboard (কিবৰ্ড বন্ধ কৰক)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard Grid Content */}
      <div className="space-y-2 min-h-[135px] max-h-[220px] overflow-y-auto pr-0.5 scrollbar-thin">
        {/* TAB 1: ALL-IN-ONE (Most convenient everyday typing layout) */}
        {activeTab === "all" && (
          <div className="space-y-1.5">
            {/* Quick Matras & Special Signs Ribbon */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-border/30">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider shrink-0 px-1">
                মাত্ৰা:
              </span>
              {MATRAS.map((m) => (
                <button
                  key={m.sign}
                  type="button"
                  onClick={() => onInsert(m.sign)}
                  className="h-8 min-w-[28px] px-1.5 font-sans text-sm font-semibold border border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/20 text-foreground transition-all active:scale-95 cursor-pointer shrink-0 flex items-center justify-center"
                  title={m.name}
                >
                  {m.sign}
                </button>
              ))}
              <div className="w-[1px] h-6 bg-border mx-0.5 shrink-0" />
              {SPECIAL_SIGNS.slice(0, 5).map((s) => (
                <button
                  key={s.sign}
                  type="button"
                  onClick={() => onInsert(s.sign)}
                  className="h-8 min-w-[28px] px-1.5 font-sans text-sm font-semibold border border-violet-500/40 bg-violet-500/5 hover:bg-violet-500/20 text-foreground transition-all active:scale-95 cursor-pointer shrink-0 flex items-center justify-center"
                  title={s.label}
                >
                  {s.sign}
                </button>
              ))}
            </div>

            {/* Vowels Row */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider shrink-0 w-10">
                স্বৰ:
              </span>
              <div className="flex items-center gap-1 flex-wrap flex-1">
                {SWARABARNA.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => onInsert(char)}
                    className="h-8 min-w-[30px] px-1.5 font-sans text-sm font-medium border border-border/70 bg-muted/20 hover:bg-muted/80 text-foreground transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Consonants Matrix */}
            <div className="space-y-1 pt-0.5">
              {BYANJANBARNA.map((row, idx) => (
                <div key={idx} className="flex items-center gap-1 flex-wrap">
                  {row.map((char) => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => onInsert(char)}
                      className="h-8 flex-1 min-w-[30px] max-w-[48px] px-1 font-sans text-sm font-medium border border-border/70 bg-card hover:bg-muted/80 text-foreground transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-2xs"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Numerals Bar */}
            <div className="flex items-center gap-1 pt-1 border-t border-border/30">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider shrink-0 w-10">
                সংখ্যা:
              </span>
              <div className="flex items-center gap-1 flex-wrap flex-1">
                {NUMERALS.map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => onInsert(digit)}
                    className="h-7 min-w-[28px] px-1.5 font-mono text-xs font-semibold border border-border/50 bg-muted/10 hover:bg-muted/60 text-foreground transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                  >
                    {digit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SWARA & MATRA */}
        {activeTab === "swara_matra" && (
          <div className="space-y-3">
            <div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                স্বৰবৰ্ণ (Vowels):
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                {SWARABARNA.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => onInsert(char)}
                    className="h-9 font-sans text-base font-medium border border-border/70 bg-card hover:bg-muted/80 text-foreground transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                কাৰ / মাত্ৰা (Vowel Signs):
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {MATRAS.map((m) => (
                  <button
                    key={m.sign}
                    type="button"
                    onClick={() => onInsert(m.sign)}
                    className="h-10 flex flex-col items-center justify-center border border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/20 text-foreground transition-all active:scale-95 cursor-pointer p-0.5"
                    title={m.name}
                  >
                    <span className="font-sans text-base font-semibold">{m.sign}</span>
                    <span className="text-[9px] font-mono text-muted-foreground truncate max-w-full">
                      {m.name.slice(0, 5)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                বিশেষ চিহ্ন আৰু বিৰাম চিহ্ন (Diacritics & Punctuation):
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {SPECIAL_SIGNS.map((s) => (
                  <button
                    key={s.sign}
                    type="button"
                    onClick={() => onInsert(s.sign)}
                    className="h-9 flex flex-col items-center justify-center border border-violet-500/50 bg-violet-500/5 hover:bg-violet-500/20 text-foreground transition-all active:scale-95 cursor-pointer p-0.5"
                    title={s.desc}
                  >
                    <span className="font-sans text-sm font-semibold">{s.sign}</span>
                    <span className="text-[8px] font-mono text-muted-foreground truncate max-w-full">
                      {s.label.split(" ")[1]?.replace(/[()]/g, "") || s.sign}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BYANJANBARNA */}
        {activeTab === "byanjan" && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
              ব্যঞ্জনবৰ্ণ (Consonants):
            </div>
            {BYANJANBARNA.map((row, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                {row.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => onInsert(char)}
                    className="h-9 flex-1 min-w-[34px] font-sans text-base font-medium border border-border/70 bg-card hover:bg-muted text-foreground transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: JUKTAKHYOR */}
        {activeTab === "juktakhyor" && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                সাধাৰণ যুক্তাক্ষৰসমূহ (Compound Letters):
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                টিপ: যিকোনো বৰ্ণ + ্ (হসন্ত) + বৰ্ণ দিও যুক্তাক্ষৰ হয়
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {JUKTAKHYOR.map((conj) => (
                <button
                  key={conj}
                  type="button"
                  onClick={() => onInsert(conj)}
                  className="h-9 font-sans text-base font-semibold border border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/20 text-foreground transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
                >
                  {conj}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: QUICK PHRASES */}
        {activeTab === "phrases" && (
          <div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              চমু কেৰিয়াৰ প্ৰশ্ন আৰু শব্দ (1-Click Career Prompts):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {QUICK_PHRASES.map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => onInsert(phrase)}
                  className="p-2 text-left font-sans text-xs border border-border/70 bg-muted/20 hover:bg-muted text-foreground transition-all active:scale-98 cursor-pointer flex items-center justify-between group"
                >
                  <span className="truncate">{phrase}</span>
                  <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground shrink-0 ml-1">
                    + যোগ
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Actions (Persistent across all tabs) */}
      <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-border/50 text-xs">
        {/* Hasanta Quick Button (Essential for Assamese compounding) */}
        <button
          type="button"
          onClick={() => onInsert("্")}
          className="h-8 px-2.5 font-sans font-semibold border border-violet-500/60 bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          title="হসন্ত / Virama (যেনে: ক + ্ + ত = ক্ত)"
        >
          <span className="text-sm">্</span>
          <span className="text-[10px] font-mono font-medium hidden sm:inline">হসন্ত</span>
        </button>

        {/* Dari / Punctuation */}
        <button
          type="button"
          onClick={() => onInsert("।")}
          className="h-8 min-w-[32px] px-2 font-sans font-semibold border border-border/70 bg-muted/20 hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center justify-center shrink-0"
          title="দাৰী (।)"
        >
          ।
        </button>

        {/* Spacebar */}
        <button
          type="button"
          onClick={onSpace}
          className="h-8 flex-1 border border-border/70 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1.5 font-mono text-xs shadow-2xs"
          title="Insert Space (স্পেচ)"
        >
          <Space className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">স্পেচ (Space)</span>
        </button>

        {/* Backspace */}
        <button
          type="button"
          onClick={onBackspace}
          className="h-8 px-2.5 sm:px-3 border border-border/70 bg-muted/30 hover:bg-muted/80 text-foreground transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono shrink-0"
          title="Backspace (মচাক)"
        >
          <Delete className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">মচাক</span>
        </button>

        {/* Clear All */}
        <button
          type="button"
          onClick={onClear}
          className="h-8 px-2 border border-border/70 hover:border-destructive/50 bg-muted/10 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono shrink-0"
          title="Clear text (পৰিষ্কাৰ)"
        >
          <Eraser className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
