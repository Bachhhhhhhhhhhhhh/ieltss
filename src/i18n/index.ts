import { en, type TranslationKeys } from './en';
import { vi } from './vi';
import type { Language } from '../types';

const translations: Record<Language, TranslationKeys> = { en, vi };

export function getTranslation(lang: Language): TranslationKeys {
  return translations[lang];
}

export { en, vi };
export type { TranslationKeys };