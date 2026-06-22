import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ExternalLink, BookOpen, FileText, BookMarked,
  MessageSquare, Layers, HelpCircle, Quote, X, ChevronLeft, ChevronRight,
  Star, Zap, TrendingUp, Bookmark, Dumbbell, Clock, Mic, MicOff,
  Share2, Sparkles, GraduationCap, Command, Brain, Download, Flame, Filter,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAssistant } from '../../context/AssistantContext';
import { useLookup } from '../../context/LookupContext';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { knowledgeBase } from '../../data/knowledgeBase';
import { vocabulary } from '../../data/vocabulary';
import { assistantQA } from '../../data/assistant';
import { phraseBank } from '../../data/phraseBank';
import { collocations } from '../../data/collocations';
import { questionTypeGuides } from '../../data/questionTypeGuides';
import { topicVocabulary } from '../../data/topicVocabulary';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { LookupDetailContent } from '../lookup/LookupDetailContent';
import { LookupStudyDeck } from '../lookup/LookupStudyDeck';
import { LookupVocabQuiz } from '../lookup/LookupVocabQuiz';
import {
  getLookupCatalog, filterLookupResults, buildWebLookupUrl, getLookupDetail,
  splitHighlight, countByType, getCategoryDisplayName, getSearchSuggestions,
  getDidYouMean, getLearningPathItems, getRelatedItems, groupSearchResults,
  synthesizeSmartAnswer, parseLookupQuery, removeLookupFilter,
  detectSearchIntent, intentSkillHint, getIntentLabel, getRelatedSearches,
  getMatchReason, exportBookmarksJson, TRENDING_SEARCHES,
  LEARNING_PATHS, RECENT_SEARCHES_KEY, BOOKMARKS_KEY, RESOURCES_TAB_KEY, PRACTICE_SKILL_KEY,
  toBookmarkId, resolveBookmark,
  type LookupResult, type LookupResultType, type ArticleCategory, type LookupSort,
  type SkillFilter, type LearningPath, type ResultGroupKey, type MatchReasonKey,
} from '../../utils/lookupSearch';
import { toast } from 'sonner';
import type { Page, Skill } from '../../types';
import { SectionHeader } from '../ui/SectionHeader';
import { GlowCard } from '../ui/GlowCard';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

const PAGE_SIZE = 18;
const MAX_RECENT = 8;
const GROUPED_LIMIT = 48;

const typeIcons: Record<LookupResultType, typeof FileText> = {
  article: FileText, vocab: BookMarked, assistant: MessageSquare,
  phrase: Quote, collocation: Layers, guide: HelpCircle,
};

const sources = {
  articles: knowledgeBase, vocab: vocabulary, assistant: assistantQA,
  phrases: phraseBank, collocations, guides: questionTypeGuides, topicVocab: topicVocabulary,
};

function HighlightedText({ text, query }: { text: string; query: string }) {
  const segments = useMemo(() => splitHighlight(text, query), [text, query]);
  return (
    <>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark key={i} className="bg-accent-teal/25 text-accent-teal dark:text-teal-300 rounded px-0.5 font-semibold">{seg.text}</mark>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

function LearningPathCard({ path, lang, onSelect }: { path: LearningPath; lang: 'en' | 'vi'; onSelect: (p: LearningPath) => void }) {
  return (
    <motion.button type="button" whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(path)}
      className={`text-left p-5 rounded-2xl bg-gradient-to-br ${path.color} text-white shadow-lg hover:shadow-xl w-full`}>
      <span className="text-2xl mb-3 block">{path.icon}</span>
      <h3 className="font-bold text-base mb-1">{path.title[lang]}</h3>
      <p className="text-xs text-white/80">{path.description[lang]}</p>
    </motion.button>
  );
}

export function LookupSection() {
  const { t, lang } = useLanguage();
  const { openAssistant, openAssistantWithQuestion } = useAssistant();
  const { openPalette } = useLookup();
  const { start: startVoice, stop: stopVoice, listening, supported: voiceSupported } = useVoiceSearch(lang);
  const isWide = useMediaQuery('(min-width: 1280px)');
  const searchRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(() => {
    const m = window.location.hash.match(/q=([^&]+)/);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  });
  const [typeFilter, setTypeFilter] = useState<LookupResultType | 'all'>('all');
  const [articleCategory, setArticleCategory] = useState<ArticleCategory>('all');
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all');
  const [sort, setSort] = useState<LookupSort>('relevance');
  const [browseAll, setBrowseAll] = useState(() => !!window.location.hash.match(/q=([^&]+)/));
  const [activePath, setActivePath] = useState<string | null>(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [focusedItem, setFocusedItem] = useState<LookupResult | null>(null);
  const [selected, setSelected] = useState<LookupResult | null>(null);
  const [keyboardIndex, setKeyboardIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(RECENT_SEARCHES_KEY, []);
  const [bookmarkIds, setBookmarkIds] = useLocalStorage<string[]>(BOOKMARKS_KEY, []);
  const [studyMode, setStudyMode] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [shareOk, setShareOk] = useState(false);

  const parsed = useMemo(() => parseLookupQuery(query), [query]);
  const debouncedText = useDebouncedValue(parsed.text, 200);
  const isSearching = debouncedText.trim().length > 0 || parsed.rawFilters.length > 0;
  const isFeaturedBrowse = !isSearching && !browseAll && !activePath && !showBookmarksOnly
    && typeFilter === 'all' && articleCategory === 'all' && skillFilter === 'all';

  const catalog = useMemo(() => getLookupCatalog(lang, sources), [lang]);
  const searchIntent = useMemo(() => detectSearchIntent(debouncedText), [debouncedText]);
  const intentSkill = useMemo(() => intentSkillHint(searchIntent, debouncedText) ?? undefined, [searchIntent, debouncedText]);
  const effectiveType = parsed.type ?? typeFilter;
  const effectiveSkill = parsed.skill ?? skillFilter;

  const categoryLabels = useMemo(() => ({
    vocabulary: t.lookup.vocabulary, assistant: t.lookup.qa,
    skills: { listening: t.practice.listening, reading: t.practice.reading, writing: t.practice.writing, speaking: t.practice.speaking } as Record<Skill, string>,
    articleCategories: { format: t.lookup.format, scoring: t.lookup.scoring, tips: t.lookup.tips, preparation: t.lookup.preparation, vocabulary: t.lookup.vocabulary },
  }), [t]);

  const displayCategory = useCallback(
    (cat: string) => getCategoryDisplayName(cat, lang, topicVocabulary, categoryLabels),
    [lang, categoryLabels],
  );

  const typeLabel = (type: LookupResultType) => ({
    article: t.lookup.articles, vocab: t.lookup.vocabulary, assistant: t.lookup.qa,
    phrase: t.lookup.phrases, collocation: t.lookup.collocations, guide: t.lookup.guides,
  })[type];

  const groupLabel = (key: ResultGroupKey) => ({
    best: t.lookup.groupBest, answers: t.lookup.groupAnswers, guides: t.lookup.groupGuides,
    vocabulary: t.lookup.groupVocabulary, phrases: t.lookup.groupPhrases, articles: t.lookup.groupArticles,
  })[key];

  const effectiveSort: LookupSort = isSearching ? sort : (sort === 'relevance' ? 'az' : sort);

  const pathItems = useMemo(() => {
    if (!activePath) return null;
    const path = LEARNING_PATHS.find((p) => p.id === activePath);
    return path ? getLearningPathItems(path, catalog) : null;
  }, [activePath, catalog]);

  const baseFiltered = useMemo(() => {
    if (showBookmarksOnly) {
      return bookmarkIds.map((id) => resolveBookmark(id, catalog)).filter(Boolean) as LookupResult[];
    }
    if (pathItems) return pathItems;
    return filterLookupResults(catalog, {
      query: debouncedText, type: effectiveType, articleCategory, skill: effectiveSkill,
      sort: effectiveSort, browseFeatured: !browseAll,
      quality: parsed.quality ?? 'all', band: parsed.band,
    });
  }, [catalog, debouncedText, effectiveType, articleCategory, effectiveSkill, effectiveSort, browseAll, pathItems, showBookmarksOnly, bookmarkIds, parsed]);

  const useGroupedView = isSearching && baseFiltered.length > 5 && !pathItems && !showBookmarksOnly;
  const groupedResults = useMemo(
    () => (useGroupedView ? groupSearchResults(baseFiltered.slice(0, GROUPED_LIMIT), true) : null),
    [useGroupedView, baseFiltered],
  );

  const flatDisplayItems = useMemo(() => {
    if (groupedResults) return groupedResults.flatMap((g) => g.items);
    const start = (Math.min(page, Math.max(1, Math.ceil(baseFiltered.length / PAGE_SIZE))) - 1) * PAGE_SIZE;
    return baseFiltered.slice(start, start + PAGE_SIZE);
  }, [groupedResults, baseFiltered, page]);

  const smartAnswer = useMemo(() => (isSearching ? synthesizeSmartAnswer(baseFiltered.slice(0, 5)) : null), [isSearching, baseFiltered]);
  const vocabCount = baseFiltered.filter((i) => i.type === 'vocab' || i.type === 'collocation').length;
  const relatedSearches = useMemo(
    () => (isSearching ? getRelatedSearches(debouncedText, searchIntent, lang) : []),
    [isSearching, debouncedText, searchIntent, lang],
  );
  const trendingSearches = TRENDING_SEARCHES[lang];

  const matchReasonLabel = useCallback((key: MatchReasonKey) => ({
    title: t.lookup.matchTitle, tag: t.lookup.matchTag, category: t.lookup.matchCategory,
    content: t.lookup.matchContent, essential: t.lookup.matchEssential,
  })[key], [t]);

  const suggestions = useMemo(() => (query.trim().length >= 2 ? getSearchSuggestions(query, catalog) : []), [query, catalog]);
  const didYouMean = useMemo(() => (isSearching && baseFiltered.length === 0 ? getDidYouMean(debouncedText, catalog) : null), [isSearching, baseFiltered.length, debouncedText, catalog]);

  const typeCounts = useMemo(() => {
    const items = filterLookupResults(catalog, {
      query: debouncedText, type: 'all', articleCategory, skill: effectiveSkill, sort: 'relevance', browseFeatured: false,
    });
    return countByType(items);
  }, [catalog, debouncedText, articleCategory, effectiveSkill]);

  const totalPages = Math.max(1, Math.ceil(baseFiltered.length / PAGE_SIZE));

  const activeItem = focusedItem ?? selected;
  const detail = useMemo(
    () => (activeItem ? getLookupDetail(activeItem, lang, sources, catalog) : null),
    [activeItem, lang, catalog],
  );
  const relatedItems = useMemo(
    () => (activeItem ? getRelatedItems(activeItem, catalog, 5) : []),
    [activeItem, catalog],
  );

  const isBookmarked = useCallback((item: LookupResult) => bookmarkIds.includes(toBookmarkId(item)), [bookmarkIds]);

  const toggleBookmark = useCallback((item: LookupResult) => {
    const id = toBookmarkId(item);
    setBookmarkIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]);
  }, [setBookmarkIds]);

  const openItem = useCallback((item: LookupResult, index?: number) => {
    setFocusedItem(item);
    if (index != null) setKeyboardIndex(index);
    if (!isWide) setSelected(item);
  }, [isWide]);

  const saveRecentSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) return;
    setRecentSearches((prev) => [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, MAX_RECENT));
  }, [setRecentSearches]);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value); setPage(1); setActivePath(null); setShowSuggestions(true);
    if (value.trim()) setBrowseAll(true);
  }, []);

  const handlePathSelect = useCallback((path: LearningPath) => {
    setActivePath(path.id); setQuery(path.query); setSkillFilter(path.skill ?? 'all');
    setBrowseAll(true); setPage(1); setTypeFilter('all'); setArticleCategory('all'); setShowBookmarksOnly(false);
  }, []);

  const resetFilters = useCallback(() => {
    setQuery(''); setTypeFilter('all'); setArticleCategory('all'); setSkillFilter('all');
    setSort('relevance'); setBrowseAll(false); setActivePath(null); setShowBookmarksOnly(false); setPage(1);
  }, []);

  const goToPractice = useCallback((skill: Skill) => {
    sessionStorage.setItem(PRACTICE_SKILL_KEY, skill);
    window.dispatchEvent(new CustomEvent('ielts-navigate', { detail: { page: 'practice' as Page } }));
  }, []);

  const goToResources = useCallback((tab: string) => {
    sessionStorage.setItem(RESOURCES_TAB_KEY, tab);
    window.dispatchEvent(new CustomEvent('ielts-navigate', { detail: { page: 'resources' as Page } }));
    setSelected(null); setFocusedItem(null);
  }, []);

  const copyDetail = useCallback(async () => {
    if (!detail) return;
    try {
      await navigator.clipboard.writeText(detail.copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  }, [detail]);

  const primaryMatch = baseFiltered[0] ?? null;
  const practiceSkill = intentSkill ?? (effectiveSkill !== 'all' ? effectiveSkill : primaryMatch?.skill);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA';
      if (e.key === '/' && !typing && !selected) { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'Escape') {
        if (selected) { setSelected(null); setFocusedItem(null); }
        else if (showSuggestions) setShowSuggestions(false);
        else if (query) handleQueryChange('');
      }
      if (!typing && flatDisplayItems.length > 0 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const next = e.key === 'ArrowDown'
          ? Math.min(keyboardIndex + 1, flatDisplayItems.length - 1)
          : Math.max(keyboardIndex - 1, 0);
        setKeyboardIndex(next);
        openItem(flatDisplayItems[next], next);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, query, showSuggestions, handleQueryChange, flatDisplayItems, keyboardIndex, openItem]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => { if (debouncedText.trim()) saveRecentSearch(debouncedText); }, [debouncedText, saveRecentSearch]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const { query: q, item } = (e as CustomEvent<{ query?: string; item?: LookupResult }>).detail ?? {};
      if (q) handleQueryChange(q);
      if (item) setTimeout(() => openItem(item), 150);
    };
    window.addEventListener('ielts-lookup-open', onOpen);
    return () => window.removeEventListener('ielts-lookup-open', onOpen);
  }, [handleQueryChange, openItem]);

  const removeFilter = useCallback((key: string, value: string) => {
    handleQueryChange(removeLookupFilter(query, key, value));
  }, [query, handleQueryChange]);

  const exportBookmarks = useCallback(async () => {
    if (bookmarkIds.length === 0) return;
    const json = exportBookmarksJson(bookmarkIds, catalog);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts-lookup-bookmarks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t.lookup.exported);
  }, [bookmarkIds, catalog, t]);

  const shareSearch = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}#lookup?q=${encodeURIComponent(query || debouncedText)}`;
    window.location.hash = `lookup?q=${encodeURIComponent(query || debouncedText)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareOk(true);
      toast.success(t.lookup.linkCopied);
      setTimeout(() => setShareOk(false), 2000);
    } catch { toast.error(t.lookup.copyFailed); }
  }, [query, debouncedText, t]);

  const renderCard = (item: LookupResult, index: number, compact?: boolean) => {
    const Icon = typeIcons[item.type];
    const isActive = focusedItem?.id === item.id && focusedItem?.type === item.type;
    const isKb = keyboardIndex === index;
    const matchReason = isSearching ? getMatchReason(item, debouncedText) : null;
    return (
      <motion.div key={`${item.type}-${item.id}`} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <GlowCard
          glow={item.type === 'vocab' ? 'indigo' : 'teal'}
          onClick={() => openItem(item, index)}
          className={`cursor-pointer group h-full transition-all ${isActive || isKb ? 'ring-2 ring-accent-teal shadow-glow' : ''} ${compact ? 'p-3' : ''}`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <Icon size={compact ? 16 : 18} className="text-accent-teal shrink-0" />
            <div className="flex flex-wrap gap-1 justify-end">
              {isSearching && item.matchPercent != null && item.matchPercent >= 35 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 font-bold">{item.matchPercent}%</span>
              )}
              {item.quality === 'essential' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center gap-0.5"><Star size={8} /></span>}
              {item.quality === 'recommended' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center gap-0.5"><Zap size={8} /></span>}
            </div>
          </div>
          <h3 className={`font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 group-hover:text-accent-teal ${compact ? 'text-sm' : ''}`}>
            <HighlightedText text={item.title} query={debouncedText} />
          </h3>
          {!compact && item.meta && <p className="text-xs text-slate-400 mb-1 font-mono">{item.meta}</p>}
          <p className={`text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}>
            <HighlightedText text={item.snippet} query={debouncedText} />
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[10px] font-bold uppercase text-accent-teal">{typeLabel(item.type)}</span>
              {matchReason && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{matchReasonLabel(matchReason)}</span>
              )}
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); toggleBookmark(item); }} className="p-1 rounded-lg hover:bg-accent-teal/10" aria-label={t.lookup.save}>
              <Bookmark size={14} className={isBookmarked(item) ? 'fill-accent-teal text-accent-teal' : 'text-slate-400'} />
            </button>
          </div>
        </GlowCard>
      </motion.div>
    );
  };

  const activePathData = LEARNING_PATHS.find((p) => p.id === activePath);

  return (
    <section className="section-padding max-w-7xl mx-auto relative">
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
      <div className="relative">
        <SectionHeader badge={t.lookup.knowledgeBase} title={t.lookup.title} subtitle={t.lookup.subtitle} />

        {/* Search hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mb-8">
          <div ref={searchBoxRef} className="relative glow-border rounded-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-accent-teal" size={22} />
            <input ref={searchRef} type="search" value={query} onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              placeholder={t.lookup.searchPlaceholder} aria-label={t.lookup.searchPlaceholder}
              className="w-full pl-14 pr-48 py-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 outline-none text-lg" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {voiceSupported && (
                <button
                  type="button"
                  onClick={() => listening ? stopVoice() : startVoice((text) => handleQueryChange(text))}
                  className={`p-2 rounded-xl transition-colors ${listening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  aria-label={t.lookup.voiceSearch}
                >
                  {listening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}
              {isSearching && (
                <button type="button" onClick={shareSearch} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={t.lookup.shareSearch}>
                  <Share2 size={16} className={shareOk ? 'text-accent-teal' : ''} />
                </button>
              )}
              <button type="button" onClick={() => openPalette(query)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:block" aria-label={t.lookup.openPalette}>
                <Command size={16} />
              </button>
              {query && (
                <button type="button" onClick={() => handleQueryChange('')} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={t.lookup.clearSearch}>
                  <X size={16} />
                </button>
              )}
              <span className="px-2.5 py-1 rounded-full bg-accent-teal/10 text-accent-teal text-xs font-bold min-w-[2rem] text-center">{baseFiltered.length}</span>
            </div>
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute z-30 top-full left-0 right-0 mt-2 glass-card rounded-xl border border-accent-teal/20 overflow-hidden shadow-glow max-h-64 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <button key={`${s.text}-${i}`} type="button" onClick={() => {
                      if (s.itemId && s.itemType) {
                        const item = catalog.find((c) => c.id === s.itemId && c.type === s.itemType);
                        if (item) { openItem(item); setShowSuggestions(false); return; }
                      }
                      handleQueryChange(s.text); setShowSuggestions(false);
                    }} className="w-full text-left px-4 py-3 text-sm hover:bg-accent-teal/10 flex gap-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      {s.type === 'topic' ? <Filter size={14} className="text-accent-indigo shrink-0 mt-0.5" /> : <Search size={14} className="text-accent-teal shrink-0 mt-0.5" />}
                      <span className={s.type === 'topic' ? 'font-mono text-accent-indigo' : ''}>{s.text}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">{t.lookup.searchShortcut}</p>
          {parsed.rawFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 justify-center items-center">
              {parsed.rawFilters.map((f) => (
                <button
                  key={`${f.key}-${f.value}`}
                  type="button"
                  onClick={() => removeFilter(f.key, f.value)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-accent-indigo/15 text-accent-indigo font-bold uppercase hover:bg-accent-indigo/25 flex items-center gap-1"
                  title={t.lookup.removeFilter}
                >
                  {f.key}:{f.value} <X size={10} />
                </button>
              ))}
            </div>
          )}
          {!isSearching && (
            <div className="flex flex-wrap gap-2 mt-3 justify-center items-center">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Flame size={12} className="text-orange-500" /> {t.lookup.trending}:</span>
              {trendingSearches.slice(0, 5).map((s) => (
                <button key={s} type="button" onClick={() => handleQueryChange(s)} className="text-xs px-3 py-1 rounded-full glass-card text-slate-500 hover:text-accent-teal">{s}</button>
              ))}
            </div>
          )}
          {!isSearching && recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 justify-center items-center">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {t.lookup.recentSearches}:</span>
              {recentSearches.map((s) => (
                <button key={s} type="button" onClick={() => handleQueryChange(s)} className="text-xs px-3 py-1 rounded-full glass-card text-slate-500 hover:text-accent-teal">{s}</button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Smart Insight */}
        {smartAnswer && isSearching && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 max-w-4xl mx-auto">
            <div className="glow-border rounded-2xl p-6 bg-gradient-to-br from-accent-teal/5 via-white to-accent-indigo/5 dark:from-accent-teal/10 dark:via-slate-900 dark:to-accent-indigo/10">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Sparkles size={18} className="text-accent-teal" />
                <span className="text-xs font-bold uppercase tracking-wider text-accent-teal">{t.lookup.smartInsight}</span>
                {searchIntent !== 'general' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-indigo/15 text-accent-indigo font-bold flex items-center gap-1">
                    <Brain size={10} /> {getIntentLabel(searchIntent, lang)}
                  </span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold ml-auto">{smartAnswer.confidence}% {t.lookup.match}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{smartAnswer.headline}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-[1.8] text-[15px] mb-3">
                <HighlightedText text={smartAnswer.summary} query={debouncedText} />
              </p>
              {smartAnswer.bullets.length > 0 && (
                <ul className="space-y-1.5 mb-4 text-sm text-slate-600 dark:text-slate-400">
                  {smartAnswer.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2"><span className="text-accent-teal shrink-0">•</span><span>{b}</span></li>
                  ))}
                </ul>
              )}
              {smartAnswer.sources.length > 1 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] text-slate-500 uppercase font-bold w-full">{t.lookup.sources}</span>
                  {smartAnswer.sources.map((s, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full glass-card text-slate-500">{s.title}</span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {primaryMatch && <Button size="sm" variant="primary" onClick={() => openItem(primaryMatch)}>{t.lookup.readFull}</Button>}
                <Button size="sm" variant="outline" onClick={() => openAssistantWithQuestion(smartAnswer.headline)}>{t.lookup.askAssistant}</Button>
                {practiceSkill && (
                  <Button size="sm" variant="secondary" onClick={() => goToPractice(practiceSkill)}><Dumbbell size={14} /> {t.lookup.practiceSkill}</Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {relatedSearches.length > 0 && isSearching && (
          <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-3xl mx-auto">
            <span className="text-xs text-slate-500 w-full text-center mb-1">{t.lookup.relatedSearches}</span>
            {relatedSearches.map((s) => (
              <button key={s} type="button" onClick={() => handleQueryChange(s)} className="text-xs px-3 py-1.5 rounded-full glass-card hover:text-accent-teal hover:border-accent-teal/30">{s}</button>
            ))}
          </div>
        )}

        {/* Result breakdown */}
        {isSearching && baseFiltered.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {(['article', 'guide', 'vocab', 'collocation', 'phrase', 'assistant'] as LookupResultType[]).map((tp) => {
              const n = baseFiltered.filter((i) => i.type === tp).length;
              if (n === 0) return null;
              return (
                <button key={tp} type="button" onClick={() => { setTypeFilter(tp); setPage(1); }}
                  className="text-xs px-3 py-1.5 rounded-full glass-card hover:text-accent-teal font-medium">
                  {typeLabel(tp)}: <strong>{n}</strong>
                </button>
              );
            })}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <Button size="sm" variant={showBookmarksOnly ? 'primary' : 'outline'} onClick={() => { setShowBookmarksOnly((v) => !v); setPage(1); }}>
            <Bookmark size={14} /> {t.lookup.saved} ({bookmarkIds.length})
          </Button>
          {vocabCount >= 3 && (
            <>
              <Button size="sm" variant={studyMode ? 'primary' : 'outline'} onClick={() => setStudyMode(true)}>
                <GraduationCap size={14} /> {t.lookup.studyMode} ({vocabCount})
              </Button>
              <Button size="sm" variant={quizMode ? 'primary' : 'outline'} onClick={() => setQuizMode(true)}>
                <Brain size={14} /> {t.lookup.quizMode}
              </Button>
            </>
          )}
          {bookmarkIds.length > 0 && (
            <Button size="sm" variant="outline" onClick={exportBookmarks}>
              <Download size={14} /> {t.lookup.exportBookmarks}
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => openPalette(query)}><Command size={14} /> {t.lookup.openPalette}</Button>
          <Button size="sm" variant="outline" onClick={() => window.open(buildWebLookupUrl(query || 'ielts'), '_blank', 'noopener')}><ExternalLink size={14} /> {t.lookup.webLookup}</Button>
          <Button size="sm" variant="outline" onClick={openAssistant}><BookOpen size={14} /> {t.lookup.assistant}</Button>
        </div>

        {/* Learning paths */}
        {!isSearching && !browseAll && !activePath && !showBookmarksOnly && (
          <div className="mb-10">
            <h3 className="font-bold text-center mb-4 flex items-center justify-center gap-2"><TrendingUp size={18} className="text-accent-teal" />{t.lookup.learningPaths}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {LEARNING_PATHS.map((path) => <LearningPathCard key={path.id} path={path} lang={lang} onSelect={handlePathSelect} />)}
            </div>
          </div>
        )}

        {activePathData && (
          <p className="text-center text-sm mb-4">
            <span className="font-semibold text-accent-teal">{activePathData.icon} {activePathData.title[lang]}</span>
            {' · '}
            <button type="button" onClick={() => { setActivePath(null); setQuery(''); }} className="text-slate-500 underline text-xs">{t.lookup.exitPath}</button>
          </p>
        )}

        {/* Filters row */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {(['all', 'listening', 'reading', 'writing', 'speaking'] as SkillFilter[]).map((sk) => (
            <button key={sk} type="button" onClick={() => { setSkillFilter(sk); setPage(1); setShowBookmarksOnly(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${skillFilter === sk ? 'bg-accent-indigo text-white' : 'glass-card text-slate-500'}`}>
              {sk === 'all' ? t.lookup.all : t.practice[sk]}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 justify-center">
          {(['all', 'article', 'vocab', 'assistant', 'phrase', 'collocation', 'guide'] as const).map((key) => (
            <button key={key} type="button" onClick={() => { setTypeFilter(key); setPage(1); setActivePath(null); if (key !== 'all') setBrowseAll(true); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${typeFilter === key ? 'bg-accent-teal text-white' : 'glass-card text-slate-500'}`}>
              {key === 'all' ? t.lookup.all : typeLabel(key)} ({typeCounts[key]})
            </button>
          ))}
          <select value={sort} onChange={(e) => { setSort(e.target.value as LookupSort); setPage(1); }} className="text-xs px-2 py-1.5 rounded-xl glass-card outline-none" aria-label={t.lookup.sortBy}>
            <option value="relevance" disabled={!isSearching}>{t.lookup.sortRelevance}</option>
            <option value="az">{t.lookup.sortAZ}</option>
            <option value="type">{t.lookup.sortType}</option>
          </select>
        </div>

        {isFeaturedBrowse && (
          <p className="text-center text-sm text-slate-500 mb-4">
            {t.lookup.featuredHint}
            {' · '}
            <button type="button" onClick={() => { setBrowseAll(true); setPage(1); }} className="text-accent-teal font-semibold hover:underline">
              {t.lookup.browseAll.replace('{n}', String(catalog.length))}
            </button>
          </p>
        )}

        {/* Main split layout */}
        <div className={`${isWide && focusedItem ? 'xl:grid xl:grid-cols-5 xl:gap-8' : ''}`}>
          <div className={isWide && focusedItem ? 'xl:col-span-2' : ''}>
            {flatDisplayItems.length > 0 ? (
              groupedResults ? (
                <div className="space-y-8">
                  {groupedResults.map((group) => (
                    <div key={group.key}>
                      {group.key !== 'best' && (
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-8 h-px bg-accent-teal/30" />{groupLabel(group.key)}
                        </h3>
                      )}
                      <div className={`grid gap-4 ${group.key === 'best' ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                        {group.items.map((item) => renderCard(item, flatDisplayItems.indexOf(item), group.key !== 'best'))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flatDisplayItems.map((item, i) => renderCard(item, i))}
                </div>
              )
            ) : (
              <div className="text-center py-16 text-slate-500">
                <Search size={40} className="mx-auto mb-3 opacity-25" />
                <p className="font-medium">{t.lookup.noResults}</p>
                {didYouMean && (
                  <p className="text-sm mt-3">{t.lookup.didYouMean} <button type="button" onClick={() => handleQueryChange(didYouMean)} className="text-accent-teal font-semibold underline">{didYouMean}</button></p>
                )}
                <Button variant="outline" className="mt-4" onClick={resetFilters}>{t.lookup.resetFilters}</Button>
              </div>
            )}

            {!groupedResults && totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={16} /></Button>
                <span className="text-sm text-slate-500">{page} / {totalPages}</span>
                <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></Button>
              </div>
            )}
          </div>

          {/* Desktop preview panel */}
          {isWide && focusedItem && detail && (
            <div className="hidden xl:block xl:col-span-3">
              <div className="sticky top-24 glass-card rounded-2xl p-6 max-h-[calc(100vh-8rem)] overflow-y-auto border border-accent-teal/15">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white pr-4">{detail.heading}</h2>
                  <button type="button" onClick={() => setFocusedItem(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"><X size={18} /></button>
                </div>
                <LookupDetailContent
                  item={focusedItem} detail={detail} query={debouncedText}
                  typeLabel={typeLabel(focusedItem.type)} categoryLabel={displayCategory(focusedItem.category)}
                  copied={copied} bookmarked={isBookmarked(focusedItem)} relatedItems={relatedItems}
                  onCopy={copyDetail} onBookmark={() => toggleBookmark(focusedItem)}
                  onAskAssistant={() => openAssistantWithQuestion(focusedItem.title)}
                  onGoResources={detail.resourcesTab ? () => goToResources(detail.resourcesTab!) : undefined}
                  onSelectRelated={(r) => openItem(r)} compact
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile modal */}
      <Modal isOpen={!!selected && !isWide} onClose={() => { setSelected(null); setFocusedItem(null); }} title={detail?.heading ?? ''} size="lg">
        {selected && detail && (
          <LookupDetailContent
            item={selected} detail={detail} query={debouncedText}
            typeLabel={typeLabel(selected.type)} categoryLabel={displayCategory(selected.category)}
            copied={copied} bookmarked={isBookmarked(selected)} relatedItems={relatedItems}
            onCopy={copyDetail} onBookmark={() => toggleBookmark(selected)}
            onAskAssistant={() => { openAssistantWithQuestion(selected.title); setSelected(null); }}
            onGoResources={detail.resourcesTab ? () => goToResources(detail.resourcesTab!) : undefined}
            onSelectRelated={(r) => { setSelected(r); setFocusedItem(r); }}
          />
        )}
      </Modal>

      {studyMode && (
        <LookupStudyDeck items={baseFiltered} onClose={() => setStudyMode(false)} />
      )}
      {quizMode && (
        <LookupVocabQuiz items={baseFiltered} onClose={() => setQuizMode(false)} />
      )}
    </section>
  );
}