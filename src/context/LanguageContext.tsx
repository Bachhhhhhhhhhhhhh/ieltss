import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Language, BilingualText } from '../types';
import { getTranslation, type TranslationKeys } from '../i18n';
import { loadLanguage, saveLanguage } from '../utils/storage';

interface LanguageContextType {
  lang: Language;
  t: TranslationKeys;
  setLang: (lang: Language) => void;
  bt: (text: BilingualText) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(loadLanguage);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    saveLanguage(l);
  }, []);

  const bt = useCallback((text: BilingualText) => text[lang], [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t: getTranslation(lang), setLang, bt }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}