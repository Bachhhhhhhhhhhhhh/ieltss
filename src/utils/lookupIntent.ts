import type { LookupResult, LookupResultType } from './lookupSearch';
import type { Skill } from '../types';
import { normalizeQuery } from './lookupNormalize';

export type SearchIntent =
  | 'definition'
  | 'howto'
  | 'vocabulary'
  | 'comparison'
  | 'band'
  | 'question-type'
  | 'general';

export type ResultGroupKey = 'best' | 'answers' | 'guides' | 'vocabulary' | 'phrases' | 'articles';

const INTENT_PATTERNS: { intent: SearchIntent; patterns: RegExp[]; boostTypes: LookupResultType[] }[] = [
  {
    intent: 'band',
    patterns: [/band\s*[56789]/i, /điểm\s*band/i, /scoring/i, /descriptor/i],
    boostTypes: ['article', 'assistant'],
  },
  {
    intent: 'vocabulary',
    patterns: [/vocab/i, /từ vựng/i, /collocation/i, /lexical/i, /word/i, /meaning/i, /nghĩa/i],
    boostTypes: ['vocab', 'collocation', 'phrase'],
  },
  {
    intent: 'question-type',
    patterns: [/true\s*false/i, /not\s*given/i, /tfng/i, /matching/i, /mcq/i, /completion/i, /heading/i],
    boostTypes: ['guide', 'article', 'assistant'],
  },
  {
    intent: 'howto',
    patterns: [/how\s*to/i, /làm\s*sao/i, /cách/i, /strategy/i, /tips?/i, /mẹo/i, /structure/i, /cấu trúc/i],
    boostTypes: ['guide', 'article', 'assistant'],
  },
  {
    intent: 'comparison',
    patterns: [/vs\.?/i, /difference/i, /khác/i, /compare/i, /academic.*general/i],
    boostTypes: ['article', 'assistant'],
  },
  {
    intent: 'definition',
    patterns: [/what\s*is/i, /là\s*gì/i, /meaning\s*of/i, /định nghĩa/i, /\?$/],
    boostTypes: ['assistant', 'article'],
  },
];

export function detectSearchIntent(query: string): SearchIntent {
  const q = query.trim();
  if (!q) return 'general';
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some((p) => p.test(q))) return intent;
  }
  return 'general';
}

export function intentBoost(item: LookupResult, intent: SearchIntent): number {
  const match = INTENT_PATTERNS.find((p) => p.intent === intent);
  if (!match) return 0;
  return match.boostTypes.includes(item.type) ? 22 : 0;
}

export function intentSkillHint(intent: SearchIntent, query: string): Skill | undefined {
  const nq = normalizeQuery(query);
  if (/listen|nghe|audio|accent/.test(nq)) return 'listening';
  if (/read|đọc|passage|tfng|heading/.test(nq)) return 'reading';
  if (/writ|viết|essay|task\s*[12]|letter|chart/.test(nq)) return 'writing';
  if (/speak|nói|cue|fluency|pronunciation/.test(nq)) return 'speaking';
  if (intent === 'vocabulary') return undefined;
  return undefined;
}

export interface GroupedResults {
  key: ResultGroupKey;
  items: LookupResult[];
}

export function groupSearchResults(items: LookupResult[], hasQuery: boolean): GroupedResults[] {
  if (!hasQuery || items.length <= 6) {
    return [{ key: 'best', items }];
  }

  const best = items.slice(0, 1);
  const rest = items.slice(1);
  const buckets: Record<Exclude<ResultGroupKey, 'best'>, LookupResult[]> = {
    answers: [],
    guides: [],
    vocabulary: [],
    phrases: [],
    articles: [],
  };

  for (const item of rest) {
    if (item.type === 'assistant') buckets.answers.push(item);
    else if (item.type === 'guide') buckets.guides.push(item);
    else if (item.type === 'vocab' || item.type === 'collocation') buckets.vocabulary.push(item);
    else if (item.type === 'phrase') buckets.phrases.push(item);
    else if (item.type === 'article') buckets.articles.push(item);
    else buckets.answers.push(item);
  }

  const groups: GroupedResults[] = [{ key: 'best', items: best }];
  for (const key of ['answers', 'guides', 'vocabulary', 'phrases', 'articles'] as const) {
    if (buckets[key].length > 0) groups.push({ key, items: buckets[key] });
  }
  return groups;
}

export function extractQuickAnswer(item: LookupResult): string {
  const text = item.fullText || item.snippet;
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 20);
  if (sentences.length >= 2) return `${sentences[0]} ${sentences[1]}`.trim();
  return clipSentences(text, 320);
}

function clipSentences(text: string, max: number): string {
  const t = text.trim().replace(/\s+/g, ' ');
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export interface SmartAnswer {
  headline: string;
  summary: string;
  bullets: string[];
  sources: { title: string; type: LookupResultType; matchPercent?: number }[];
  confidence: number;
}

export function synthesizeSmartAnswer(items: LookupResult[]): SmartAnswer | null {
  if (items.length === 0) return null;

  const top = items.slice(0, 4);
  const primary = top[0];
  const bullets: string[] = [];

  for (const item of top.slice(1)) {
    const snippet = extractQuickAnswer(item);
    if (snippet.length > 30 && !bullets.includes(snippet)) {
      bullets.push(clipSentences(snippet, 120));
    }
    if (bullets.length >= 3) break;
  }

  const avgScore = top.reduce((s, i) => s + (i.matchPercent ?? 50), 0) / top.length;

  return {
    headline: primary.title,
    summary: extractQuickAnswer(primary),
    bullets,
    sources: top.map((i) => ({ title: i.title, type: i.type, matchPercent: i.matchPercent })),
    confidence: Math.min(99, Math.round(avgScore)),
  };
}