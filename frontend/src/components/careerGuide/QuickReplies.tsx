"use client";

import React from "react";
import {
  AnimateIcon,
  FileSearch,
  Compass,
  Milestone,
  Briefcase,
  MessageSquareQuote,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from "@/components/animate-ui/icons";
import { cn } from "@/lib/utils";

type IconComponentType = React.ComponentType<{ size?: number; className?: string; animateOnHover?: boolean }>;

interface QuickReplyItem {
  text: string;
  desc?: string;
  icon: IconComponentType;
  colorClasses: string;
  iconColor: string;
  iconBg: string;
}

const COLOR_THEMES = [
  {
    colorClasses: "border-border/80 bg-card/80 hover:bg-muted/80 hover:border-foreground/30 text-foreground",
    iconColor: "text-foreground",
    iconBg: "bg-muted text-foreground",
  },
  {
    colorClasses: "border-border/80 bg-card/80 hover:bg-muted/80 hover:border-foreground/30 text-foreground",
    iconColor: "text-foreground",
    iconBg: "bg-muted text-foreground",
  },
  {
    colorClasses: "border-border/80 bg-card/80 hover:bg-muted/80 hover:border-foreground/30 text-foreground",
    iconColor: "text-foreground",
    iconBg: "bg-muted text-foreground",
  },
  {
    colorClasses: "border-border/80 bg-card/80 hover:bg-muted/80 hover:border-foreground/30 text-foreground",
    iconColor: "text-foreground",
    iconBg: "bg-muted text-foreground",
  },
  {
    colorClasses: "border-border/80 bg-card/80 hover:bg-muted/80 hover:border-foreground/30 text-foreground",
    iconColor: "text-foreground",
    iconBg: "bg-muted text-foreground",
  },
];

const PRESET_QUICK_REPLIES: Record<string, { text: string; desc: string; icon: IconComponentType }[]> = {
  en: [
    { text: "Review my resume", desc: "ATS score audit, keyword gaps & scoring", icon: FileSearch },
    { text: "Career path & counselling", desc: "Interactive assessment or profile-based guidance", icon: Compass },
    { text: "Make me a roadmap", desc: "Step-by-step sequential learning milestones", icon: Milestone },
    { text: "Find me a job", desc: "Target matching positions and openings", icon: Briefcase },
    { text: "Mock interview", desc: "Practice technical and behavioral questions", icon: MessageSquareQuote },
  ],
  hi: [
    { text: "मेरा रिज्यूमे देखें", desc: "एटीएस स्कोर और कमियों की जांच", icon: FileSearch },
    { text: "करियर परामर्श और पथ", desc: "संवादात्मक मूल्यांकन या प्रोफ़ाइल विश्लेषण", icon: Compass },
    { text: "एक रोडमैप बनाएं", desc: "चरण-दर-चरण सीखने की कार्ययोजना", icon: Milestone },
    { text: "मेरे लिए जॉब्स खोजें", desc: "आपकी प्रोफाइल से मेल खाती नौकरियां", icon: Briefcase },
    { text: "मॉक इंटरव्यू लें", desc: "साक्षात्कार अभ्यास और प्रतिक्रिया", icon: MessageSquareQuote },
  ],
  as: [
    { text: "মোৰ ৰিজিউমি পর্যালোচনা কৰক", desc: "এ টি এছ স্কোৰ আৰু দক্ষতা পৰীক্ষা", icon: FileSearch },
    { text: "কেৰিয়াৰ পথ আৰু পৰামৰ্শ", desc: "ব্যক্তিগত বা প্ৰ'ফাইল ভিত্তিক নিৰ্দেশনা", icon: Compass },
    { text: "এটা ৰোডমেপ বনাওক", desc: "পৰ্যায়ক্ৰমিক কেৰিয়াৰ নিৰ্দেশনা", icon: Milestone },
    { text: "মোৰ বাবে চাকৰি বিচাৰক", desc: "প্ৰাসঙ্গিক খালী পদসমূহ চাওক", icon: Briefcase },
    { text: "মক সাক্ষাৎকাৰ", desc: "সাক্ষাৎকাৰৰ অনুশীলন কৰক", icon: MessageSquareQuote },
  ],
};

function inferIcon(text: string): IconComponentType {
  const lower = text.toLowerCase();
  if (lower.includes("resume") || lower.includes("cv") || lower.includes("रिज्यूमे") || lower.includes("ৰিজিউমি")) {
    return FileSearch;
  }
  if (lower.includes("roadmap") || lower.includes("रोडमैप") || lower.includes("ৰোডমেপ") || lower.includes("path")) {
    return Milestone;
  }
  if (
    lower.includes("role") ||
    lower.includes("suit") ||
    lower.includes("career") ||
    lower.includes("counsel") ||
    lower.includes("counselling") ||
    lower.includes("भूमिका") ||
    lower.includes("কেৰিয়াৰ") ||
    lower.includes("परामर्श") ||
    lower.includes("পৰামৰ্শ")
  ) {
    return Compass;
  }
  if (lower.includes("job") || lower.includes("चैकरी") || lower.includes("जॉब") || lower.includes("चাকৰি")) {
    return Briefcase;
  }
  if (lower.includes("interview") || lower.includes("इंटरव्यू") || lower.includes("সাক্ষাৎকাৰ")) {
    return MessageSquareQuote;
  }
  if (lower.includes("choose") || lower.includes("know") || lower.includes("help") || lower.includes("मदद")) {
    return Sparkles;
  }
  return HelpCircle;
}

interface QuickRepliesProps {
  chips?: string[];
  onSelect: (chip: string) => void;
  language: string;
  variant?: "grid" | "compact";
}

export function QuickReplies({
  chips,
  onSelect,
  language,
  variant = "compact",
}: QuickRepliesProps) {
  const langKey = language === "auto" || !language ? "en" : language;
  
  let items: QuickReplyItem[] = [];

  if (chips && chips.length > 0) {
    items = chips.map((chip, idx) => {
      const theme = COLOR_THEMES[idx % COLOR_THEMES.length];
      return {
        text: chip,
        icon: inferIcon(chip),
        ...theme,
      };
    });
  } else {
    const rawList = PRESET_QUICK_REPLIES[langKey] ?? PRESET_QUICK_REPLIES["en"];
    items = rawList.map((preset, idx) => {
      const theme = COLOR_THEMES[idx % COLOR_THEMES.length];
      return {
        text: preset.text,
        desc: preset.desc,
        icon: preset.icon,
        ...theme,
      };
    });
  }

  if (items.length === 0) return null;

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl w-full mx-auto px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <AnimateIcon key={item.text} animateOnHover asChild>
              <button
                type="button"
                onClick={() => onSelect(item.text)}
                className={cn(
                  "group relative flex items-start gap-3 p-3.5 text-left border rounded-none transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 backdrop-blur-xs",
                  item.colorClasses
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-xs shrink-0 transition-transform duration-200 group-hover:scale-110",
                    item.iconBg
                  )}
                >
                  <Icon size={16} className={cn("w-4 h-4", item.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span className="truncate">{item.text}</span>
                    <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground group-hover:text-primary shrink-0 ml-1" />
                  </div>
                  {item.desc && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 leading-normal">
                      {item.desc}
                    </p>
                  )}
                </div>
              </button>
            </AnimateIcon>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto w-full px-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <AnimateIcon key={item.text} animateOnHover asChild>
            <button
              type="button"
              onClick={() => onSelect(item.text)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-full transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98] hover:-translate-y-0.5",
                item.colorClasses
              )}
            >
              <Icon size={14} className={cn("w-3.5 h-3.5 shrink-0", item.iconColor)} />
              <span>{item.text}</span>
            </button>
          </AnimateIcon>
        );
      })}
    </div>
  );
}
