"use client";

import React from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ta" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#DFDFE2] bg-[#FEFEFE] hover:bg-[#F4F4F4] text-xs font-medium text-[#202B28] transition shadow-2xs"
      title="Toggle Language"
    >
      <Globe className="w-3.5 h-3.5 text-[#708A83]" />
      <span>{language === "en" ? "தமிழ்" : "English"}</span>
    </button>
  );
}
