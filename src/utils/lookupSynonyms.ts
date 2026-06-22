/** IELTS-specific query expansion — maps shorthand & Vietnamese to canonical search terms */
export const LOOKUP_SYNONYMS: Record<string, string[]> = {
  tfng: ['true false not given', 'true/false/not given', 't/f/ng'],
  ynng: ['yes no not given', 'yes/no/not given', 'y/n/ng'],
  'true false': ['true false not given', 'tfng'],
  'not given': ['true false not given', 'yes no not given'],
  band: ['band score', 'scoring', 'điểm band'],
  'band 7': ['band 7', 'achieve band 7', 'band 6 vs band 7'],
  'band 6': ['band 6 vs band 7', 'band score'],
  task1: ['task 1', 'writing task 1', 'chart', 'graph'],
  task2: ['task 2', 'writing task 2', 'essay'],
  'task 1': ['writing task 1 academic', 'chart', 'graph', 'letter'],
  'task 2': ['writing task 2 structure', 'essay', 'opinion'],
  listening: ['listening tips', 'listening accent', 'nghe'],
  reading: ['reading strategies', 'reading question types', 'đọc'],
  writing: ['writing task 2', 'coherence', 'essay', 'viết'],
  speaking: ['speaking fluency', 'speaking part 2', 'cue card', 'nói'],
  collocation: ['collocations', 'lexical resource'],
  paraphrase: ['paraphrasing', 'đồng nghĩa'],
  paraphrasing: ['paraphrase', 'paraphrasing techniques'],
  overview: ['writing task 1', 'task achievement'],
  mock: ['mock test', 'practice test', 'mô phỏng'],
  nghe: ['listening', 'listening tips', 'mẹo nghe'],
  đọc: ['reading', 'reading strategies'],
  viết: ['writing', 'writing task 2'],
  nói: ['speaking', 'speaking fluency'],
  'mẹo nghe': ['listening tips', 'listening'],
  'điểm band': ['band score', 'scoring'],
  'bài luận': ['task 2', 'essay', 'writing task 2'],
  'biểu đồ': ['task 1', 'chart', 'graph'],
  vocabulary: ['vocabulary topics', 'lexical resource', 'từ vựng'],
  'từ vựng': ['vocabulary', 'topic vocabulary'],
  grammar: ['grammar', 'complex sentences', 'ngữ pháp'],
  'ngữ pháp': ['grammar'],
  accent: ['listening accent', 'accents'],
  spelling: ['listening mistakes', 'form completion'],
  time: ['time management', 'quản lý thời gian'],
  osr: ['one skill retake', 'retake'],
  ukvi: ['ukvi', 'visa'],
  academic: ['academic vs general', 'academic ielts'],
  general: ['academic vs general', 'general training'],
  heading: ['matching headings', 'reading'],
  matching: ['matching headings', 'matching information'],
  essay: ['task 2', 'writing task 2 structure', 'essay types'],
  cue: ['cue card', 'speaking part 2'],
  fluency: ['speaking fluency', 'fluency tips'],
  coherence: ['coherence cohesion', 'coherence cohesion phrases'],
  cohesion: ['coherence cohesion', 'linking phrases'],
  distractor: ['listening mistakes', 'traps', 'mcq'],
};

export function expandQueryTokens(tokens: string[]): string[] {
  const expanded = new Set<string>();
  for (const raw of tokens) {
    const t = raw.toLowerCase().trim();
    if (!t) continue;
    expanded.add(t);
    const syns = LOOKUP_SYNONYMS[t];
    if (syns) syns.forEach((s) => expanded.add(s.toLowerCase()));
    const phraseKey = Object.keys(LOOKUP_SYNONYMS).find((k) => t.includes(k));
    if (phraseKey) LOOKUP_SYNONYMS[phraseKey].forEach((s) => expanded.add(s.toLowerCase()));
  }
  return [...expanded];
}