import type {
  Language,
  KnowledgeArticle,
  VocabWord,
  AssistantQA,
  PhraseEntry,
  CollocationEntry,
  QuestionTypeGuide,
  TopicVocabulary,
  TopicVocabItem,
  Skill,
} from '../types';
import { expandQueryTokens } from './lookupSynonyms';
import { normalizeForSearch, normalizeQuery } from './lookupNormalize';
import { detectSearchIntent, intentBoost } from './lookupIntent';
import { getFilterCompletions } from './lookupRefinements';

export { detectSearchIntent, groupSearchResults, extractQuickAnswer, intentSkillHint, synthesizeSmartAnswer } from './lookupIntent';
export type { SearchIntent, ResultGroupKey, GroupedResults, SmartAnswer } from './lookupIntent';
export { parseLookupQuery, formatFilterHint, removeLookupFilter } from './lookupQueryParser';
export type { ParsedLookupQuery } from './lookupQueryParser';
export {
  TRENDING_SEARCHES, getIntentLabel, getRelatedSearches, getFilterCompletions,
  getMatchReason, exportBookmarksJson, STUDY_PROGRESS_KEY,
} from './lookupRefinements';
export type { MatchReasonKey } from './lookupRefinements';

export type LookupResultType = 'article' | 'vocab' | 'assistant' | 'phrase' | 'collocation' | 'guide';
export type ArticleCategory = 'all' | 'format' | 'scoring' | 'tips' | 'preparation' | 'vocabulary';
export type LookupSort = 'relevance' | 'az' | 'type';
export type ResourcesTab = 'knowledge' | 'topicVocab' | 'collocations' | 'questionGuides' | 'phrases';
export type LookupQuality = 'essential' | 'recommended' | 'standard';
export type SkillFilter = Skill | 'all';

export interface LookupResult {
  id: string;
  type: LookupResultType;
  title: string;
  snippet: string;
  category: string;
  tags: string[];
  meta?: string;
  score?: number;
  matchPercent?: number;
  featured?: boolean;
  quality: LookupQuality;
  skill?: Skill;
  searchCorpus: string;
  fullText: string;
}

export interface TextSegment {
  text: string;
  highlight: boolean;
}

export interface LearningPath {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  query: string;
  skill?: Skill;
  icon: string;
  color: string;
  itemIds: string[];
}

export type LookupDetailSection =
  | { kind: 'text'; content: string }
  | { kind: 'article'; sections: { title?: string; body: string }[] }
  | { kind: 'guide'; tips: string; traps: string; strategy: string; example?: string }
  | { kind: 'vocab'; meaning: string; example: string; phonetic?: string; collocation?: string }
  | { kind: 'phrase'; meaning: string; example: string }
  | { kind: 'collocation'; meaning: string; example: string }
  | { kind: 'qa'; answer: string };

export interface LookupDetail {
  heading: string;
  tags: string[];
  sections: LookupDetailSection[];
  copyText: string;
  resourcesTab?: ResourcesTab;
  readingMinutes: number;
  relatedIds: string[];
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'title' | 'topic';
  itemId?: string;
  itemType?: LookupResultType;
}

const SNIPPET_LEN = 180;
const FEATURED_LIMIT = 24;
const MAX_SCORE = 500;

const catalogByLang = new Map<Language, LookupResult[]>();
const topicWordById = new Map<string, { topic: TopicVocabulary; word: TopicVocabItem }>();
let indexesBuilt = false;

const ESSENTIAL_ARTICLES = new Set([
  'kb-1', 'kb-3', 'kb-4', 'kb-5', 'kb-6', 'kb-8', 'kb-19', 'kb-31', 'kb-32',
]);
const ESSENTIAL_GUIDES = new Set(['qtg-1', 'qtg-5', 'qtg-9', 'qtg-13', 'qtg-17']);

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'band7',
    title: { en: 'Path to Band 7', vi: 'Lộ trình Band 7' },
    description: { en: 'Scoring, vocabulary range & writing structure', vi: 'Chấm điểm, từ vựng & cấu trúc Writing' },
    query: 'band 7',
    icon: '🎯',
    color: 'from-amber-500 to-orange-600',
    itemIds: ['kb-8', 'kb-19', 'a10', 'kb-6', 'kb-17', 'qtg-13'],
  },
  {
    id: 'listening',
    title: { en: 'Listening Mastery', vi: 'Luyện Nghe chuyên sâu' },
    description: { en: 'Tips, accents, question types & traps', vi: 'Mẹo, giọng đọc, dạng câu & bẫy' },
    query: 'listening',
    skill: 'listening',
    icon: '🎧',
    color: 'from-teal-500 to-cyan-600',
    itemIds: ['kb-4', 'kb-21', 'kb-30', 'kb-11', 'qtg-1', 'qtg-2', 'a4', 'a17'],
  },
  {
    id: 'reading',
    title: { en: 'Reading Strategies', vi: 'Chiến lược Đọc hiểu' },
    description: { en: 'T/F/NG, time management & skimming', vi: 'T/F/NG, quản lý thời gian & skim' },
    query: 'reading true false',
    skill: 'reading',
    icon: '📖',
    color: 'from-indigo-500 to-violet-600',
    itemIds: ['kb-5', 'kb-22', 'kb-31', 'kb-32', 'kb-12', 'qtg-9', 'qtg-10', 'a11'],
  },
  {
    id: 'writing',
    title: { en: 'Writing Excellence', vi: 'Writing điểm cao' },
    description: { en: 'Task 1 & 2 structure, cohesion & samples', vi: 'Cấu trúc Task 1/2, liên kết & mẫu' },
    query: 'writing task 2',
    skill: 'writing',
    icon: '✍️',
    color: 'from-purple-500 to-fuchsia-600',
    itemIds: ['kb-6', 'kb-13', 'kb-15', 'kb-17', 'kb-33', 'a18', 'a19', 'a26'],
  },
  {
    id: 'speaking',
    title: { en: 'Speaking Fluency', vi: 'Speaking trôi chảy' },
    description: { en: 'Parts 1–3, cue cards & pronunciation', vi: 'Part 1–3, cue card & phát âm' },
    query: 'speaking fluency',
    skill: 'speaking',
    icon: '🎤',
    color: 'from-rose-500 to-pink-600',
    itemIds: ['kb-7', 'kb-16', 'kb-34', 'a7', 'a20', 'a28', 'qtg-17'],
  },
  {
    id: 'vocabulary',
    title: { en: 'Vocabulary Power', vi: 'Từ vựng & Collocation' },
    description: { en: 'Topic words, collocations & lexical resource', vi: 'Từ theo chủ đề, collocation & lexical' },
    query: 'vocabulary collocation',
    icon: '📚',
    color: 'from-emerald-500 to-teal-600',
    itemIds: ['kb-23', 'kb-17', 'kb-18', 'a15', 'a27', 'a12'],
  },
];

function itemKey(type: LookupResultType, id: string): string {
  return `${type}:${id}`;
}

function clip(text: string, max = SNIPPET_LEN): string {
  const t = text.trim().replace(/\s+/g, ' ');
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function inferSkillFromTags(tags: string[], category: string): Skill | undefined {
  const pool = [...tags, category].map((t) => t.toLowerCase());
  if (pool.some((t) => t.includes('listen'))) return 'listening';
  if (pool.some((t) => t.includes('read'))) return 'reading';
  if (pool.some((t) => t.includes('writ') || t.includes('task'))) return 'writing';
  if (pool.some((t) => t.includes('speak') || t.includes('cue'))) return 'speaking';
  return undefined;
}

function buildSearchCorpus(parts: string[]): string {
  return normalizeForSearch(parts.filter(Boolean).join(' '));
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1]
        ? row[j - 1]
        : Math.min(row[j - 1], row[j], prev) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

function fuzzyIncludes(corpus: string, token: string): boolean {
  if (corpus.includes(token)) return true;
  if (token.length < 4) return false;
  const words = corpus.split(/\s+/);
  return words.some((w) => w.length >= 3 && levenshtein(w, token) <= 1);
}

function extractContextSnippet(text: string, tokens: string[], max = SNIPPET_LEN): string {
  const clean = text.trim().replace(/\s+/g, ' ');
  const lower = clean.toLowerCase();
  let anchor = -1;
  for (const token of tokens) {
    const idx = lower.indexOf(token);
    if (idx >= 0) { anchor = idx; break; }
    for (const word of lower.split(/\s+/)) {
      if (levenshtein(word, token) <= 1) {
        anchor = lower.indexOf(word);
        break;
      }
    }
    if (anchor >= 0) break;
  }
  if (anchor < 0) return clip(clean, max);
  const start = Math.max(0, anchor - 50);
  const slice = clean.slice(start, start + max + 20);
  const prefix = start > 0 ? '…' : '';
  const suffix = start + slice.length < clean.length ? '…' : '';
  return clip(`${prefix}${slice}${suffix}`, max + 2);
}

function ensureIndexes(topicVocab: TopicVocabulary[]): void {
  if (indexesBuilt) return;
  for (const topic of topicVocab) {
    for (const w of topic.words) {
      topicWordById.set(`${topic.id}-${w.word}`, { topic, word: w });
    }
  }
  indexesBuilt = true;
}

function tokenizeQuery(q: string): string[] {
  return q.toLowerCase().split(/[\s,.;:!?/]+/).filter((t) => t.length > 1);
}

function normField(field: string): string {
  return normalizeForSearch(field);
}

function fieldScore(token: string, field: string, weight: number): number {
  const f = normField(field);
  const t = normalizeForSearch(token);
  if (f === t) return weight;
  if (f.startsWith(t)) return weight * 0.92;
  if (f.split(/\s+/).some((w) => w === t)) return weight * 0.88;
  if (f.includes(t)) return weight * 0.72;
  if (t.length >= 4 && fuzzyIncludes(f, t)) return weight * 0.45;
  return 0;
}

export function scoreLookupItem(item: LookupResult, query: string): number {
  const rawTokens = tokenizeQuery(query);
  if (rawTokens.length === 0) return item.featured ? 12 : 0;

  const tokens = expandQueryTokens(rawTokens.map(normalizeForSearch));
  const nq = normalizeQuery(query);
  let score = 0;
  let matchedRaw = 0;

  const fields: [string, number][] = [
    [item.title, 120],
    [item.meta ?? '', 55],
    [item.snippet, 35],
    [item.category, 30],
    [item.searchCorpus, 25],
    [item.fullText, 20],
    ...item.tags.map((t) => [t, 45] as [string, number]),
  ];

  for (const raw of rawTokens) {
    const nRaw = normalizeForSearch(raw);
    let tokenScore = 0;
    for (const [field, weight] of fields) {
      tokenScore = Math.max(tokenScore, fieldScore(nRaw, field, weight));
    }
    if (tokenScore === 0) {
      for (const expanded of tokens) {
        if (expanded === nRaw) continue;
        for (const [field, weight] of fields) {
          tokenScore = Math.max(tokenScore, fieldScore(expanded, field, weight * 0.75));
        }
      }
    }
    if (tokenScore > 0) {
      matchedRaw++;
      score += tokenScore;
    } else if (fuzzyIncludes(item.searchCorpus, nRaw)) {
      matchedRaw += 0.5;
      score += 14;
    }
  }

  const coverage = matchedRaw / rawTokens.length;
  if (coverage < 0.34) return 0;
  score *= 0.45 + coverage * 0.55;

  if (nq.length >= 4 && item.searchCorpus.includes(nq)) score += 95;
  if (item.title && normalizeForSearch(item.title).includes(nq)) score += 40;

  const intent = detectSearchIntent(query);
  score += intentBoost(item, intent);

  if (item.quality === 'essential') score += 18;
  if (item.quality === 'recommended') score += 8;
  if (item.featured) score += 5;
  if (item.type === 'guide') score += 6;
  if (item.type === 'article') score += 4;
  if (item.type === 'assistant' && rawTokens.some((t) => normalizeForSearch(item.title).includes(normalizeForSearch(t)))) score += 14;

  return Math.min(score, MAX_SCORE);
}

export function toMatchPercent(score: number): number {
  if (score <= 0) return 0;
  return Math.min(99, Math.round((score / MAX_SCORE) * 100));
}

export function splitHighlight(text: string, query: string): TextSegment[] {
  const q = query.trim();
  if (!q) return [{ text, highlight: false }];

  const tokens = expandQueryTokens(tokenizeQuery(q)).sort((a, b) => b.length - a.length);
  if (tokens.length === 0) return [{ text, highlight: false }];

  const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);

  return parts.filter(Boolean).map((part) => ({
    text: part,
    highlight: tokens.some((t) => part.toLowerCase() === t || part.toLowerCase().includes(t)),
  }));
}

function parseArticleSections(content: string): { title?: string; body: string }[] {
  const lines = content.split('\n');
  const sections: { title?: string; body: string }[] = [];
  let current: { title?: string; body: string } = { body: '' };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current.title || current.body.trim()) sections.push(current);
      current = { title: line.slice(3).trim(), body: '' };
    } else {
      current.body += (current.body ? '\n' : '') + line;
    }
  }
  if (current.title || current.body.trim()) sections.push(current);
  return sections.length ? sections : [{ body: content }];
}

function estimateReadingMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

function resolveQuality(type: LookupResultType, id: string, featured?: boolean): LookupQuality {
  if (type === 'article' && ESSENTIAL_ARTICLES.has(id)) return 'essential';
  if (type === 'guide' && ESSENTIAL_GUIDES.has(id)) return 'essential';
  if (featured) return 'recommended';
  return 'standard';
}

export function buildLookupCatalog(
  lang: Language,
  sources: {
    articles: KnowledgeArticle[];
    vocab: VocabWord[];
    assistant: AssistantQA[];
    phrases: PhraseEntry[];
    collocations: CollocationEntry[];
    guides: QuestionTypeGuide[];
    topicVocab: TopicVocabulary[];
  },
): LookupResult[] {
  ensureIndexes(sources.topicVocab);
  const flashcardWords = new Set(sources.vocab.map((v) => v.word.toLowerCase()));
  const items: LookupResult[] = [];

  for (const a of sources.articles) {
    const fullText = a.content[lang];
    const featured = ESSENTIAL_ARTICLES.has(a.id);
    const corpus = buildSearchCorpus([
      a.title.en, a.title.vi, a.content.en, a.content.vi, a.category, ...a.tags,
    ]);
    items.push({
      id: a.id,
      type: 'article',
      title: a.title[lang],
      snippet: clip(fullText),
      category: a.category,
      tags: a.tags,
      featured,
      quality: resolveQuality('article', a.id, featured),
      skill: inferSkillFromTags(a.tags, a.category),
      searchCorpus: corpus,
      fullText,
    });
  }

  for (const v of sources.vocab) {
    const fullText = `${v.meaning[lang]}\n${v.example[lang]}`;
    const corpus = buildSearchCorpus([
      v.word, v.phonetic, v.meaning.en, v.meaning.vi, v.example.en, v.example.vi, v.category, v.difficulty,
    ]);
    const featured = v.difficulty === 'medium';
    items.push({
      id: v.id,
      type: 'vocab',
      title: v.word,
      snippet: clip(v.meaning[lang]),
      category: 'vocabulary',
      tags: [v.category, v.difficulty],
      meta: v.phonetic,
      featured,
      quality: featured ? 'recommended' : 'standard',
      skill: inferSkillFromTags([v.category], 'vocabulary'),
      searchCorpus: corpus,
      fullText,
    });
  }

  for (const a of sources.assistant) {
    const fullText = a.answer[lang];
    const corpus = buildSearchCorpus([
      a.question.en, a.question.vi, a.answer.en, a.answer.vi, ...a.keywords,
    ]);
    const featured = a.keywords.some((k) => ['band', 'task', 'true', 'listening', 'writing'].includes(k));
    items.push({
      id: a.id,
      type: 'assistant',
      title: a.question[lang],
      snippet: clip(fullText),
      category: 'assistant',
      tags: a.keywords,
      featured,
      quality: featured ? 'recommended' : 'standard',
      skill: inferSkillFromTags(a.keywords, 'assistant'),
      searchCorpus: corpus,
      fullText,
    });
  }

  for (const p of sources.phrases) {
    const fullText = `${p.meaning[lang]}\n${p.example[lang]}`;
    const corpus = buildSearchCorpus([
      p.phrase, p.meaning.en, p.meaning.vi, p.example.en, p.example.vi, p.skill, p.category,
    ]);
    const featured = p.skill === 'writing';
    items.push({
      id: p.id,
      type: 'phrase',
      title: p.phrase,
      snippet: clip(p.meaning[lang]),
      category: p.category,
      tags: [p.skill, p.category],
      featured,
      quality: featured ? 'recommended' : 'standard',
      skill: p.skill === 'all' ? undefined : p.skill,
      searchCorpus: corpus,
      fullText,
    });
  }

  for (const c of sources.collocations) {
    const fullText = `${c.meaning[lang]}\n${c.example[lang]}`;
    const corpus = buildSearchCorpus([
      c.collocation, c.meaning.en, c.meaning.vi, c.example.en, c.example.vi, c.topic, c.pattern,
    ]);
    const featured = ['environment', 'education', 'work', 'health', 'technology'].includes(c.topic);
    items.push({
      id: c.id,
      type: 'collocation',
      title: c.collocation,
      snippet: clip(c.example[lang]),
      category: c.topic,
      tags: [c.pattern, c.topic],
      meta: c.meaning[lang],
      featured,
      quality: featured ? 'recommended' : 'standard',
      searchCorpus: corpus,
      fullText,
    });
  }

  for (const g of sources.guides) {
    const fullText = `${g.tips[lang]}\n${g.traps[lang]}\n${g.strategy[lang]}\n${g.example[lang]}`;
    const corpus = buildSearchCorpus([
      g.title.en, g.title.vi, g.tips.en, g.tips.vi, g.traps.en, g.traps.vi,
      g.strategy.en, g.strategy.vi, g.type, g.skill,
    ]);
    items.push({
      id: g.id,
      type: 'guide',
      title: g.title[lang],
      snippet: clip(g.tips[lang]),
      category: g.skill,
      tags: [g.type, g.skill],
      featured: ESSENTIAL_GUIDES.has(g.id),
      quality: resolveQuality('guide', g.id, true),
      skill: g.skill,
      searchCorpus: corpus,
      fullText,
    });
  }

  for (const topic of sources.topicVocab) {
    for (const w of topic.words) {
      if (flashcardWords.has(w.word.toLowerCase())) continue;
      const fullText = `${w.definition[lang]}\n${w.collocation}\n${w.example[lang]}`;
      const corpus = buildSearchCorpus([
        w.word, w.pos, w.definition.en, w.definition.vi, w.collocation,
        w.example.en, w.example.vi, topic.topicKey, topic.title.en, topic.title.vi,
      ]);
      items.push({
        id: `${topic.id}-${w.word}`,
        type: 'vocab',
        title: w.word,
        snippet: clip(`${w.definition[lang]} · ${w.collocation}`),
        category: topic.topicKey,
        tags: [topic.topicKey, w.pos, 'topic-vocab'],
        meta: w.pos,
        quality: 'standard',
        searchCorpus: corpus,
        fullText,
      });
    }
  }

  return items;
}

export function getLookupCatalog(
  lang: Language,
  sources: Parameters<typeof buildLookupCatalog>[1],
): LookupResult[] {
  let catalog = catalogByLang.get(lang);
  if (!catalog) {
    catalog = buildLookupCatalog(lang, sources);
    catalogByLang.set(lang, catalog);
  }
  return catalog;
}

export function getLearningPathItems(path: LearningPath, catalog: LookupResult[]): LookupResult[] {
  const results: LookupResult[] = [];
  for (const rawId of path.itemIds) {
    const found = catalog.find((i) => i.id === rawId || i.id.endsWith(rawId));
    if (found) results.push(found);
  }
  return results.slice(0, 8);
}

function tagSimilarity(a: LookupResult, b: LookupResult): number {
  const setA = new Set(a.tags.map((t) => t.toLowerCase()));
  let shared = 0;
  for (const t of b.tags) if (setA.has(t.toLowerCase())) shared++;
  let score = shared * 12;
  if (a.category === b.category) score += 15;
  if (a.skill && a.skill === b.skill) score += 20;
  if (a.type === b.type) score += 5;
  return score;
}

export function getRelatedItems(item: LookupResult, catalog: LookupResult[], limit = 5): LookupResult[] {
  return catalog
    .filter((c) => !(c.type === item.type && c.id === item.id))
    .map((c) => ({ item: c, sim: tagSimilarity(item, c) }))
    .filter((x) => x.sim > 8)
    .sort((a, b) => b.sim - a.sim)
    .slice(0, limit)
    .map((x) => x.item);
}

export function getSearchSuggestions(query: string, catalog: LookupResult[], limit = 8): SearchSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const suggestions: SearchSuggestion[] = [];
  const seen = new Set<string>();

  const add = (s: SearchSuggestion) => {
    const key = s.text.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    suggestions.push(s);
  };

  const titleHits = catalog
    .filter((item) => item.title.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStart = a.title.toLowerCase().startsWith(q) ? 0 : 1;
      const bStart = b.title.toLowerCase().startsWith(q) ? 0 : 1;
      return aStart - bStart || (b.quality === 'essential' ? 1 : 0) - (a.quality === 'essential' ? 1 : 0);
    });

  for (const item of titleHits) {
    add({ text: item.title, type: 'title', itemId: item.id, itemType: item.type });
    if (suggestions.length >= limit) break;
  }

  const popular = ['band 7', 'task 2', 'true false not given', 'collocations', 'speaking part 2', 'paraphrase', 'time management'];
  for (const p of popular) {
    if (p.includes(q) || q.includes(p.split(' ')[0])) add({ text: p, type: 'query' });
  }

  for (const fc of getFilterCompletions(query)) {
    add({ text: fc, type: 'topic' });
    if (suggestions.length >= limit) break;
  }

  return suggestions.slice(0, limit);
}

export function getDidYouMean(query: string, catalog: LookupResult[]): string | null {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return null;

  let best = '';
  let bestDist = 4;
  const candidates = new Set<string>();

  for (const item of catalog) {
    if (item.quality !== 'standard') candidates.add(item.title.toLowerCase());
    for (const tag of item.tags.slice(0, 3)) candidates.add(tag.toLowerCase());
  }
  LEARNING_PATHS.forEach((p) => { candidates.add(p.query); });

  for (const c of candidates) {
    const d = levenshtein(q, c);
    if (d < bestDist) { bestDist = d; best = c; }
    if (c.includes(' ') && q.length >= 4) {
      const words = c.split(' ');
      for (const w of words) {
        if (w.length >= 4) {
          const dw = levenshtein(q, w);
          if (dw < bestDist) { bestDist = dw; best = c; }
        }
      }
    }
  }

  return best && best !== q ? best : null;
}

export function getFeaturedBrowseItems(catalog: LookupResult[], limit = FEATURED_LIMIT): LookupResult[] {
  const essential = catalog.filter((i) => i.quality === 'essential');
  const recommended = catalog.filter((i) => i.quality === 'recommended' && !essential.includes(i));
  const picked = [...essential, ...recommended];
  if (picked.length >= limit) return picked.slice(0, limit);

  const seen = new Set(picked.map((i) => itemKey(i.type, i.id)));
  const bySkill: Record<string, LookupResult[]> = {};
  for (const item of catalog) {
    if (seen.has(itemKey(item.type, item.id))) continue;
    const sk = item.skill ?? 'general';
    (bySkill[sk] ??= []).push(item);
  }

  for (const list of Object.values(bySkill)) {
    picked.push(list[0]);
    if (picked.length >= limit) break;
  }

  return picked.slice(0, limit);
}

export function filterLookupResults(
  items: LookupResult[],
  options: {
    query: string;
    type: LookupResultType | 'all';
    articleCategory: ArticleCategory;
    skill: SkillFilter;
    sort: LookupSort;
    browseFeatured?: boolean;
    quality?: LookupQuality | 'all';
    band?: string;
  },
): LookupResult[] {
  const bandSuffix = options.band ? ` band ${options.band}` : '';
  const q = `${options.query.trim()}${bandSuffix}`.trim().toLowerCase();
  const rawTokens = tokenizeQuery(q);
  const isFeaturedBrowse = options.browseFeatured && !q;

  let filtered = items.filter((item) => {
    if (options.type !== 'all' && item.type !== options.type) return false;
    if (options.skill !== 'all' && item.skill !== options.skill) return false;
    if (options.quality && options.quality !== 'all' && item.quality !== options.quality) return false;

    if (options.articleCategory !== 'all') {
      const appliesToArticlesOnly = options.type === 'all' || options.type === 'article';
      if (appliesToArticlesOnly) {
        if (item.type !== 'article') return false;
        if (item.category !== options.articleCategory) return false;
      }
    }
    return true;
  });

  if (isFeaturedBrowse && options.type === 'all' && options.articleCategory === 'all' && options.skill === 'all') {
    return getFeaturedBrowseItems(filtered);
  }

  if (q) {
    filtered = filtered
      .map((item) => {
        const score = scoreLookupItem(item, q);
        const snippet = rawTokens.length > 0
          ? extractContextSnippet(item.fullText || item.snippet, expandQueryTokens(rawTokens))
          : item.snippet;
        return { ...item, score, matchPercent: toMatchPercent(score), snippet };
      })
      .filter((item) => (item.score ?? 0) > 0);
  }

  return sortLookupResults(filtered, options.sort, !!q);
}

export function sortLookupResults(items: LookupResult[], sort: LookupSort, hasQuery: boolean): LookupResult[] {
  const list = [...items];

  if (sort === 'relevance' && hasQuery) {
    return list.sort((a, b) =>
      (b.score ?? 0) - (a.score ?? 0)
      || (a.quality === 'essential' ? -1 : 0) - (b.quality === 'essential' ? -1 : 0)
      || a.title.localeCompare(b.title),
    );
  }

  if (sort === 'type') {
    const order: LookupResultType[] = ['article', 'guide', 'vocab', 'collocation', 'phrase', 'assistant'];
    return list.sort((a, b) => {
      const td = order.indexOf(a.type) - order.indexOf(b.type);
      return td !== 0 ? td : a.title.localeCompare(b.title);
    });
  }

  return list.sort((a, b) => a.title.localeCompare(b.title));
}

export function countByType(items: LookupResult[]): Record<LookupResultType | 'all', number> {
  const counts: Record<LookupResultType | 'all', number> = {
    all: items.length, article: 0, vocab: 0, assistant: 0, phrase: 0, collocation: 0, guide: 0,
  };
  for (const item of items) counts[item.type]++;
  return counts;
}

export function getCategoryDisplayName(
  category: string,
  lang: Language,
  topicVocab: TopicVocabulary[],
  labels: {
    vocabulary: string;
    assistant: string;
    skills: Record<Skill, string>;
    articleCategories: Record<string, string>;
  },
): string {
  if (category === 'vocabulary') return labels.vocabulary;
  if (category === 'assistant') return labels.assistant;
  if (labels.skills[category as Skill]) return labels.skills[category as Skill];
  if (labels.articleCategories[category]) return labels.articleCategories[category];
  const topic = topicVocab.find((t) => t.topicKey === category);
  if (topic) return topic.title[lang];
  return category;
}

export function buildWebLookupUrl(topic: string): string {
  const query = encodeURIComponent(
    `IELTS ${topic} site:ielts.org OR site:cambridgeenglish.org OR site:takeielts.britishcouncil.org`,
  );
  return `https://www.google.com/search?q=${query}`;
}

export function getLookupDetail(
  item: LookupResult,
  lang: Language,
  sources: {
    articles: KnowledgeArticle[];
    vocab: VocabWord[];
    assistant: AssistantQA[];
    phrases: PhraseEntry[];
    collocations: CollocationEntry[];
    guides: QuestionTypeGuide[];
    topicVocab: TopicVocabulary[];
  },
  catalog: LookupResult[],
): LookupDetail {
  const related = getRelatedItems(item, catalog);

  const article = sources.articles.find((a) => a.id === item.id);
  if (article) {
    const content = article.content[lang];
    return {
      heading: article.title[lang],
      tags: article.tags,
      sections: [{ kind: 'article', sections: parseArticleSections(content) }],
      copyText: content,
      resourcesTab: 'knowledge',
      readingMinutes: estimateReadingMinutes(content),
      relatedIds: related.map((r) => itemKey(r.type, r.id)),
    };
  }

  const vocab = sources.vocab.find((v) => v.id === item.id);
  if (vocab) {
    const body = `${vocab.meaning[lang]}\n\n${vocab.example[lang]}`;
    return {
      heading: vocab.word,
      tags: [vocab.category, vocab.difficulty, vocab.phonetic],
      sections: [{ kind: 'vocab', meaning: vocab.meaning[lang], example: vocab.example[lang], phonetic: vocab.phonetic }],
      copyText: `${vocab.word} (${vocab.phonetic})\n${body}`,
      resourcesTab: 'topicVocab',
      readingMinutes: 1,
      relatedIds: related.map((r) => itemKey(r.type, r.id)),
    };
  }

  const qa = sources.assistant.find((a) => a.id === item.id);
  if (qa) {
    return {
      heading: qa.question[lang],
      tags: qa.keywords.slice(0, 6),
      sections: [{ kind: 'qa', answer: qa.answer[lang] }],
      copyText: `Q: ${qa.question[lang]}\nA: ${qa.answer[lang]}`,
      readingMinutes: estimateReadingMinutes(qa.answer[lang]),
      relatedIds: related.map((r) => itemKey(r.type, r.id)),
    };
  }

  const phrase = sources.phrases.find((p) => p.id === item.id);
  if (phrase) {
    return {
      heading: phrase.phrase,
      tags: [phrase.skill, phrase.category],
      sections: [{ kind: 'phrase', meaning: phrase.meaning[lang], example: phrase.example[lang] }],
      copyText: `${phrase.phrase}\n${phrase.meaning[lang]}\n"${phrase.example[lang]}"`,
      resourcesTab: 'phrases',
      readingMinutes: 1,
      relatedIds: related.map((r) => itemKey(r.type, r.id)),
    };
  }

  const col = sources.collocations.find((c) => c.id === item.id);
  if (col) {
    return {
      heading: col.collocation,
      tags: [col.topic, col.pattern],
      sections: [{ kind: 'collocation', meaning: col.meaning[lang], example: col.example[lang] }],
      copyText: `${col.collocation}\n${col.meaning[lang]}\n${col.example[lang]}`,
      resourcesTab: 'collocations',
      readingMinutes: 1,
      relatedIds: related.map((r) => itemKey(r.type, r.id)),
    };
  }

  const guide = sources.guides.find((g) => g.id === item.id);
  if (guide) {
    const text = `${guide.tips[lang]}\n${guide.traps[lang]}\n${guide.strategy[lang]}`;
    return {
      heading: guide.title[lang],
      tags: [guide.skill, guide.type],
      sections: [{
        kind: 'guide',
        tips: guide.tips[lang],
        traps: guide.traps[lang],
        strategy: guide.strategy[lang],
        example: guide.example[lang],
      }],
      copyText: `${guide.title[lang]}\n\nTips: ${guide.tips[lang]}\n\nTraps: ${guide.traps[lang]}\n\nStrategy: ${guide.strategy[lang]}`,
      resourcesTab: 'questionGuides',
      readingMinutes: estimateReadingMinutes(text),
      relatedIds: related.map((r) => itemKey(r.type, r.id)),
    };
  }

  const topicWord = topicWordById.get(item.id);
  if (topicWord) {
    const { topic, word: w } = topicWord;
    const body = `${w.definition[lang]}\n\nCollocation: ${w.collocation}\n\n${w.example[lang]}`;
    return {
      heading: w.word,
      tags: [topic.topicKey, w.pos, topic.title[lang]],
      sections: [{ kind: 'vocab', meaning: w.definition[lang], example: w.example[lang], collocation: w.collocation }],
      copyText: `${w.word}\n${body}`,
      resourcesTab: 'topicVocab',
      readingMinutes: 1,
      relatedIds: related.map((r) => itemKey(r.type, r.id)),
    };
  }

  return {
    heading: item.title,
    tags: item.tags,
    sections: [{ kind: 'text', content: item.snippet }],
    copyText: `${item.title}\n${item.snippet}`,
    readingMinutes: 1,
    relatedIds: related.map((r) => itemKey(r.type, r.id)),
  };
}

export const RECENT_SEARCHES_KEY = 'ielts-lookup-recent';
export const BOOKMARKS_KEY = 'ielts-lookup-bookmarks';
export const RESOURCES_TAB_KEY = 'resources-initial-tab';
export const PRACTICE_SKILL_KEY = 'practice-initial-skill';

export function toBookmarkId(item: LookupResult): string {
  return itemKey(item.type, item.id);
}

export function parseBookmarkId(id: string): { type: LookupResultType; itemId: string } | null {
  const idx = id.indexOf(':');
  if (idx < 0) return null;
  return { type: id.slice(0, idx) as LookupResultType, itemId: id.slice(idx + 1) };
}

export function resolveBookmark(id: string, catalog: LookupResult[]): LookupResult | undefined {
  const parsed = parseBookmarkId(id);
  if (!parsed) return undefined;
  return catalog.find((i) => i.type === parsed.type && i.id === parsed.itemId);
}