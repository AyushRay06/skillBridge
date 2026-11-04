"use client";

import React from "react";
import { useLandingLanguage } from "@/contexts/LandingLanguageContext";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingLanguageToggleProps {
  className?: string;
  variant?: "pill" | "compact";
}

export function LandingLanguageToggle({
  className,
  variant = "pill",
}: LandingLanguageToggleProps) {
  const { lang, setLang, toggleLang } = useLandingLanguage();

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggleLang}
        className={cn(
          "h-8 px-2.5 inline-flex items-center gap-1.5 font-mono text-xs border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer select-none rounded-none",
          className
        )}
        title={lang === "en" ? "অসমীয়া ভাষালৈ সলনি কৰক" : "Switch to English"}
        aria-label="Language Toggle"
      >
        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-semibold">{lang === "en" ? "অসমীয়া" : "English"}</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center border border-border bg-background p-0.5 select-none font-mono text-xs rounded-none",
        className
      )}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "px-2.5 py-1 transition-all cursor-pointer rounded-none font-medium text-[11px] flex items-center gap-1",
          lang === "en"
            ? "bg-foreground text-background font-bold shadow-2xs"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-pressed={lang === "en"}
      >
        <span>EN</span>
      </button>

      <span className="h-3 w-[1px] bg-border/60 mx-0.5" />

      <button
        type="button"
        onClick={() => setLang("as")}
        className={cn(
          "px-2.5 py-1 transition-all cursor-pointer rounded-none font-medium text-[11px] flex items-center gap-1",
          lang === "as"
            ? "bg-foreground text-background font-bold shadow-2xs"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-pressed={lang === "as"}
      >
        <span>অসমীয়া</span>
      </button>
    </div>
  );
}

export default LandingLanguageToggle;
