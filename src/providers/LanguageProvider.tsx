"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "@/i18n/en.json";
import taTranslations from "@/i18n/ta.json";

type Language = "en" | "ta";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, any> = {
  en: enTranslations,
  ta: taTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("xenstaff_lang") as Language;
    if (saved && (saved === "en" || saved === "ta")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("xenstaff_lang", lang);
  };

  const t = (path: string): string => {
    const keys = path.split(".");
    let current = translations[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = translations["en"];
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return typeof current === "string" ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
