"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { LandingLang, LandingTranslations, LANDING_TRANSLATIONS } from "@/lib/landingTranslations";

interface LandingLanguageContextType {
  lang: LandingLang;
  setLang: (lang: LandingLang) => void;
  toggleLang: () => void;
  t: LandingTranslations;
}

const LandingLanguageContext = createContext<LandingLanguageContextType | undefined>(undefined);

export function LandingLanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LandingLang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("careercrew_lang") as LandingLang | null;
      if (stored === "as" || stored === "en") {
        setLangState(stored);
      }
    } catch {
      // LocalStorage unavailable
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: LandingLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("careercrew_lang", newLang);
      document.documentElement.lang = newLang;
    } catch {
      // Ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "as" : "en");
  };

  const t = useMemo(() => {
    return LANDING_TRANSLATIONS[lang] || LANDING_TRANSLATIONS.en;
  }, [lang]);

  return (
    <LandingLanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LandingLanguageContext.Provider>
  );
}

export function useLandingLanguage(): LandingLanguageContextType {
  const context = useContext(LandingLanguageContext);
  if (!context) {
    // Graceful fallback if called outside provider
    return {
      lang: "en",
      setLang: () => {},
      toggleLang: () => {},
      t: LANDING_TRANSLATIONS.en,
    };
  }
  return context;
}
