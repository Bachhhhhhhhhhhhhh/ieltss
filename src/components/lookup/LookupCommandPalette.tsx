import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Mic, MicOff, ArrowRight, Bookmark, Command, Sparkles,
  FileText, BookMarked, MessageSquare, Quote, Layers, HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLookup } from '../../context/LookupContext';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { knowledgeBase } from '../../data/knowledgeBase';
import { vocabulary } from '../../data/vocabulary';
import { assistantQA } from '../../data/assistant';
import { phraseBank } from '../../data/phraseBank';
import { collocations } from '../../data/collocations';
import { questionTypeGuides } from '../../data/questionTypeGuides';
import { topicVocabulary } from '../../data/topicVocabulary';
import {
  getLookupCatalog, filterLookupResults, parseLookupQuery, formatFilterHint,
  synthesizeSmartAnswer, toBookmarkId, BOOKMARKS_KEY, LEARNING_PATHS,
  type LookupResult, type LookupResultType,
} from '../../utils/lookupSearch';
import type { Page } from '../../types';

const sources = {
  articles: knowledgeBase, vocab: vocabulary, assistant: assistantQA,
  phrases: phraseBank, collocations, guides: questionTypeGuides, topicVocab: topicVocabulary,
};

const typeIcons: Record<LookupResultType, typeof FileText> = {
  article: FileText, vocab: BookMarked, assistant: MessageSquare,
  phrase: Quote, collocation: Layers, guide: HelpCircle,
};

export function LookupCommandPalette() {
  const { t, lang } = useLanguage();
  const { paletteOpen, closePalette, pendingQuery } = useLookup();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [, setBookmarkIds] = useLocalStorage<string[]>(BOOKMARKS_KEY, []);
  const { start: startVoice, stop: stopVoice, listening, supported: voiceSupported } = useVoiceSearch(lang);

  const catalog = useMemo(() => getLookupCatalog(lang, sources), [lang]);
  const parsed = useMemo(() => parseLookupQuery(query), [query]);

  const results = useMemo(() => {
    if (!query.trim() && !parsed.rawFilters.length) return [];
    return filterLookupResults(catalog, {
      query: parsed.text || query,
      type: parsed.type ?? 'all',
      articleCategory: 'all',
      skill: parsed.skill ?? 'all',
      sort: 'relevance',
      browseFeatured: false,
      quality: parsed.quality ?? 'all',
      band: parsed.band,
    }).slice(0, 12);
  }, [catalog, query, parsed]);

  const smart = useMemo(() => synthesizeSmartAnswer(results), [results]);

  useEffect(() => {
    if (!paletteOpen) return;
    const id = window.setTimeout(() => {
      setQuery(pendingQuery);
      setActiveIndex(0);
      inputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(id);
  }, [paletteOpen, pendingQuery]);

  const openInLookup = useCallback((opts: { query?: string; item?: LookupResult }) => {
    closePalette();
    window.dispatchEvent(new CustomEvent('ielts-navigate', { detail: { page: 'lookup' as Page } }));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('ielts-lookup-open', { detail: opts }));
    }, 100);
  }, [closePalette]);

  const toggleBm = useCallback((item: LookupResult) => {
    const id = toBookmarkId(item);
    setBookmarkIds((prev: string[]) => prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]);
  }, [setBookmarkIds]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      openInLookup({ query, item: results[activeIndex] });
    }
  };

  return (
    <AnimatePresence>
      {paletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md"
            onClick={closePalette}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="fixed left-1/2 top-[12%] z-[101] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glow-border rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
                  <Search className="text-accent-teal shrink-0" size={22} />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                    onKeyDown={handleKeyDown}
                    placeholder={t.lookup.palettePlaceholder}
                    className="flex-1 bg-transparent outline-none text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  />
                  {voiceSupported && (
                    <button
                      type="button"
                      onClick={() => listening ? stopVoice() : startVoice((text) => setQuery(text))}
                      className={`p-2 rounded-xl transition-colors ${listening ? 'bg-rose-500 text-white animate-pulse' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}
                      aria-label={t.lookup.voiceSearch}
                    >
                      {listening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                  )}
                  <kbd className="hidden sm:inline text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">ESC</kbd>
                  <button type="button" onClick={closePalette} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X size={18} />
                  </button>
                </div>

                {parsed.rawFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    {parsed.rawFilters.map((f) => (
                      <span key={`${f.key}-${f.value}`} className="text-[10px] px-2 py-1 rounded-full bg-accent-indigo/15 text-accent-indigo font-bold uppercase">
                        {f.key}:{f.value}
                      </span>
                    ))}
                  </div>
                )}

                <div className="max-h-[min(50vh,400px)] overflow-y-auto">
                  {smart && results.length > 0 && (
                    <div className="p-4 border-b border-accent-teal/15 bg-gradient-to-r from-accent-teal/5 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-accent-teal" />
                        <span className="text-xs font-bold text-accent-teal uppercase">{t.lookup.smartInsight}</span>
                        <span className="ml-auto text-[10px] font-bold text-emerald-600">{smart.confidence}%</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">{smart.summary}</p>
                    </div>
                  )}

                  {!query.trim() ? (
                    <div className="p-4 space-y-4">
                      <p className="text-xs text-slate-500">{t.lookup.paletteHint.replace('{hint}', formatFilterHint(lang))}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {LEARNING_PATHS.slice(0, 4).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => openInLookup({ query: p.query })}
                            className="text-left p-3 rounded-xl glass-card hover:border-accent-teal/30 text-sm"
                          >
                            <span className="mr-1">{p.icon}</span> {p.title[lang]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : results.length === 0 ? (
                    <p className="p-8 text-center text-sm text-slate-500">{t.lookup.noResults}</p>
                  ) : (
                    <ul>
                      {results.map((item, i) => {
                        const Icon = typeIcons[item.type];
                        const active = i === activeIndex;
                        return (
                          <li key={`${item.type}-${item.id}`}>
                            <button
                              type="button"
                              onMouseEnter={() => setActiveIndex(i)}
                              onClick={() => openInLookup({ query, item })}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${active ? 'bg-accent-teal/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                            >
                              <Icon size={16} className="text-accent-teal shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{item.title}</p>
                                <p className="text-xs text-slate-500 truncate">{item.snippet}</p>
                              </div>
                              {item.matchPercent != null && (
                                <span className="text-[10px] font-bold text-emerald-600 shrink-0">{item.matchPercent}%</span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); toggleBm(item); }}
                                className="p-1.5 rounded-lg hover:bg-white/50 shrink-0"
                              >
                                <Bookmark size={14} className="text-slate-400" />
                              </button>
                              {active && <ArrowRight size={14} className="text-accent-teal shrink-0" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><Command size={10} /> {t.lookup.paletteFooter}</span>
                  <span>{results.length} {t.lookup.results}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}