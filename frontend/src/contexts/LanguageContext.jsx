import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../lib/translations";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("bbp_lang") || "hi");

  useEffect(() => {
    localStorage.setItem("bbp_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => translations[lang]?.[key] ?? translations.hi[key] ?? key;

  const toggle = () => setLang((prev) => (prev === "hi" ? "en" : "hi"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
};
