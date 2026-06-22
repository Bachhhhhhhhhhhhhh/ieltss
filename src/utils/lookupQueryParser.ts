import type { Skill } from '../types';
import type { LookupResultType, LookupQuality } from './lookupSearch';

export interface ParsedLookupQuery {
  text: string;
  skill?: Skill;
  type?: LookupResultType;
  band?: string;
  quality?: LookupQuality;
  rawFilters: { key: string; value: string }[];
}

const SKILL_MAP: Record<string, Skill> = {
  listening: 'listening', reading: 'reading', writing: 'writing', speaking: 'speaking',
  nghe: 'listening', doc: 'reading', đọc: 'reading', viết: 'writing', nói: 'speaking',
};

const TYPE_MAP: Record<string, LookupResultType> = {
  article: 'article', articles: 'article',
  vocab: 'vocab', vocabulary: 'vocab',
  qa: 'assistant', assistant: 'assistant',
  phrase: 'phrase', phrases: 'phrase',
  collocation: 'collocation', collocations: 'collocation',
  guide: 'guide', guides: 'guide',
};

export function parseLookupQuery(raw: string): ParsedLookupQuery {
  const result: ParsedLookupQuery = { text: raw, rawFilters: [] };
  let text = raw;

  const re = /\b(skill|type|band|quality):(\S+)/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2].toLowerCase();
    result.rawFilters.push({ key, value });
    text = text.replace(match[0], ' ');

    if (key === 'skill') result.skill = SKILL_MAP[value] ?? (value as Skill);
    if (key === 'type') result.type = TYPE_MAP[value];
    if (key === 'band') result.band = value;
    if (key === 'quality' && (value === 'essential' || value === 'recommended')) {
      result.quality = value;
    }
  }

  result.text = text.replace(/\s+/g, ' ').trim();
  return result;
}

export function formatFilterHint(lang: 'en' | 'vi'): string {
  return lang === 'vi'
    ? 'skill:listening type:guide band:7'
    : 'skill:listening type:guide band:7';
}

export function removeLookupFilter(raw: string, key: string, value?: string): string {
  const pattern = value
    ? new RegExp(`\\b${key}:${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    : new RegExp(`\\b${key}:\\S+`, 'gi');
  return raw.replace(pattern, '').replace(/\s+/g, ' ').trim();
}