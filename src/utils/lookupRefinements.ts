import type { Language } from '../types';
import type { LookupResult, LookupResultType } from './lookupSearch';
import type { SearchIntent } from './lookupIntent';
import { normalizeForSearch } from './lookupNormalize';

export const TRENDING_SEARCHES: Record<Language, string[]> = {
  en: [
    'band 7 descriptors',
    'true false not given',
    'writing task 2 structure',
    'speaking part 2 cue card',
    'skill:reading type:guide',
    'collocations academic',
    'paraphrasing tips',
    'time management reading',
  ],
  vi: [
    'band 7 là gì',
    'true false not given',
    'cấu trúc writing task 2',
    'speaking part 2',
    'skill:reading type:guide',
    'collocation học thuật',
    'mẹo paraphrase',
    'quản lý thời gian đọc',
  ],
};

const INTENT_LABELS: Record<SearchIntent, Record<Language, string>> = {
  definition: { en: 'Definition', vi: 'Định nghĩa' },
  howto: { en: 'How-to', vi: 'Hướng dẫn' },
  vocabulary: { en: 'Vocabulary', vi: 'Từ vựng' },
  comparison: { en: 'Comparison', vi: 'So sánh' },
  band: { en: 'Band score', vi: 'Điểm band' },
  'question-type': { en: 'Question type', vi: 'Dạng câu hỏi' },
  general: { en: 'General', vi: 'Tổng quát' },
};

const REFINEMENTS: Record<SearchIntent, Record<Language, string[]>> = {
  definition: {
    en: ['examples', 'band descriptors', 'type:assistant', 'skill:writing'],
    vi: ['ví dụ', 'band descriptors', 'type:assistant', 'skill:writing'],
  },
  howto: {
    en: ['tips', 'strategy', 'type:guide', 'common mistakes'],
    vi: ['mẹo', 'chiến lược', 'type:guide', 'lỗi thường gặp'],
  },
  vocabulary: {
    en: ['collocations', 'type:vocab', 'topic words', 'quality:essential'],
    vi: ['collocation', 'type:vocab', 'từ theo chủ đề', 'quality:essential'],
  },
  comparison: {
    en: ['academic vs general', 'task 1 vs task 2', 'band difference'],
    vi: ['academic vs general', 'task 1 vs task 2', 'khác band'],
  },
  band: {
    en: ['band 7', 'band 8', 'descriptors', 'scoring criteria'],
    vi: ['band 7', 'band 8', 'tiêu chí chấm', 'descriptor'],
  },
  'question-type': {
    en: ['type:guide', 'traps', 'strategy', 'examples'],
    vi: ['type:guide', 'bẫy', 'chiến lược', 'ví dụ'],
  },
  general: {
    en: ['skill:listening', 'skill:writing', 'type:guide', 'band 7'],
    vi: ['skill:listening', 'skill:writing', 'type:guide', 'band 7'],
  },
};

const FILTER_COMPLETIONS: Record<string, string[]> = {
  skill: ['listening', 'reading', 'writing', 'speaking'],
  type: ['article', 'vocab', 'guide', 'phrase', 'collocation', 'assistant'],
  band: ['6', '7', '8', '9'],
  quality: ['essential', 'recommended'],
};

export function getIntentLabel(intent: SearchIntent, lang: Language): string {
  return INTENT_LABELS[intent][lang];
}

export function getRelatedSearches(query: string, intent: SearchIntent, lang: Language): string[] {
  const base = query.trim();
  const seeds = REFINEMENTS[intent][lang];
  const results: string[] = [];
  const seen = new Set<string>();

  const add = (q: string) => {
    const key = q.toLowerCase();
    if (!key || seen.has(key) || key === base.toLowerCase()) return;
    seen.add(key);
    results.push(q);
  };

  if (base) {
    for (const s of seeds) {
      if (s.includes(':')) add(`${base} ${s}`.trim());
      else add(`${base} ${s}`.trim());
    }
  }
  for (const s of seeds) add(s);
  for (const t of TRENDING_SEARCHES[lang].slice(0, 3)) add(t);

  return results.slice(0, 6);
}

export function getFilterCompletions(query: string): string[] {
  const m = query.match(/\b(skill|type|band|quality):(\w*)$/i);
  if (!m) return [];
  const key = m[1].toLowerCase();
  const partial = m[2].toLowerCase();
  const options = FILTER_COMPLETIONS[key] ?? [];
  const prefix = query.slice(0, m.index! + m[1].length + 1);
  return options
    .filter((o) => o.startsWith(partial))
    .map((o) => `${prefix}${o}`);
}

export type MatchReasonKey = 'title' | 'tag' | 'category' | 'content' | 'essential';

export function getMatchReason(item: LookupResult, query: string): MatchReasonKey | null {
  const tokens = query.trim().toLowerCase().split(/[\s,.;:!?/]+/).filter((t) => t.length > 1);
  if (tokens.length === 0) return item.quality === 'essential' ? 'essential' : null;

  const title = normalizeForSearch(item.title);
  if (tokens.some((t) => title.includes(normalizeForSearch(t)))) return 'title';

  const tags = item.tags.map((t) => normalizeForSearch(t));
  if (tokens.some((t) => tags.some((tag) => tag.includes(normalizeForSearch(t))))) return 'tag';

  const cat = normalizeForSearch(item.category);
  if (tokens.some((t) => cat.includes(normalizeForSearch(t)))) return 'category';

  if (item.quality === 'essential') return 'essential';
  return 'content';
}

export function exportBookmarksJson(ids: string[], catalog: LookupResult[]): string {
  const items = ids
    .map((id) => {
      const idx = id.indexOf(':');
      if (idx < 0) return null;
      const type = id.slice(0, idx) as LookupResultType;
      const itemId = id.slice(idx + 1);
      return catalog.find((i) => i.type === type && i.id === itemId) ?? null;
    })
    .filter(Boolean) as LookupResult[];

  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    count: items.length,
    bookmarks: items.map((i) => ({
      id: i.id,
      type: i.type,
      title: i.title,
      category: i.category,
      quality: i.quality,
    })),
  }, null, 2);
}

export const STUDY_PROGRESS_KEY = 'ielts-lookup-study-progress';