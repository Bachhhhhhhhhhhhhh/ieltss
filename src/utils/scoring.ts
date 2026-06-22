import type { Skill } from '../types';
import { bandDescriptors } from '../data/bandDescriptors';

function roundBand(band: number): number {
  return Math.round(Math.max(4, Math.min(9, band)) * 2) / 2;
}

function nearestDescriptor(band: number, skill: 'writing' | 'speaking') {
  const sorted = [...bandDescriptors].sort((a, b) => Math.abs(a.band - band) - Math.abs(b.band - band));
  return sorted[0]?.[skill];
}

/** Official-style raw score → band conversion for 40-question Listening/Reading */
const IELTS_40_BAND_TABLE: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [12, 4.5], [9, 4], [6, 3.5], [4, 3], [2, 2.5], [0, 0],
];

export function calculateBand(correct: number, total: number): number {
  if (total === 0) return 0;
  if (total === 40) return calculateBandFromRaw(correct);
  const percentage = correct / total;
  if (percentage >= 0.95) return 9;
  if (percentage >= 0.87) return 8.5;
  if (percentage >= 0.8) return 8;
  if (percentage >= 0.7) return 7.5;
  if (percentage >= 0.6) return 7;
  if (percentage >= 0.5) return 6.5;
  if (percentage >= 0.4) return 6;
  if (percentage >= 0.3) return 5.5;
  if (percentage >= 0.2) return 5;
  return 4.5;
}

export function calculateBandFromRaw(correct: number): number {
  const score = Math.max(0, Math.min(40, Math.round(correct)));
  for (const [minCorrect, band] of IELTS_40_BAND_TABLE) {
    if (score >= minCorrect) return band;
  }
  return 0;
}

export function calculateOverallBand(scores: Record<Skill, number>): number {
  const values = Object.values(scores).filter((s) => s > 0);
  if (values.length === 0) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(avg * 2) / 2;
}

export function evaluateWriting(text: string, minWords: number): {
  band: number;
  feedback: { category: string; score: number; comment: string }[];
  suggestions: string[];
  descriptorKey?: string;
} {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? words / sentences.length : 0;
  const paragraphs = text.split('\n\n').filter((p) => p.trim());
  const hasParagraphs = paragraphs.length >= 2;
  const complexWords = text.match(/\b\w{8,}\b/g)?.length ?? 0;
  const complexRatio = words > 0 ? complexWords / words : 0;
  const linkers = (text.match(/\b(however|therefore|furthermore|moreover|although|whereas|in contrast|on the other hand|consequently)\b/gi) ?? []).length;
  const hasOverview = /\b(overall|in summary|in general|the main trend|the most significant)\b/i.test(text);

  const taskScore = words >= minWords * 1.2 && hasOverview ? 7.5 : words >= minWords ? 7 : words >= minWords * 0.7 ? 5.5 : 5;
  const coherenceScore = hasParagraphs && linkers >= 2 ? 7 : hasParagraphs ? 6.5 : 5.5;
  const lexicalScore = complexRatio > 0.12 ? 7.5 : complexRatio > 0.08 ? 7 : 6;
  const grammarScore = avgSentenceLength > 14 && sentences.length >= 4 ? 7 : avgSentenceLength > 10 ? 6.5 : 6;

  const band = roundBand((taskScore + coherenceScore + lexicalScore + grammarScore) / 4);

  const feedback = [
    { category: 'taskAchievement', score: taskScore, comment: words >= minWords ? 'wordCountGood' : 'wordCountLow' },
    { category: 'coherence', score: coherenceScore, comment: hasParagraphs ? 'paragraphsGood' : 'suggestion3' },
    { category: 'lexical', score: lexicalScore, comment: complexRatio > 0.08 ? 'vocabGood' : 'suggestion2' },
    { category: 'grammar', score: grammarScore, comment: avgSentenceLength > 12 ? 'grammarGood' : 'suggestion1' },
  ];

  const suggestions: string[] = [];
  if (words < minWords) suggestions.push('suggestion4');
  if (!hasParagraphs) suggestions.push('suggestion3');
  if (complexRatio <= 0.08) suggestions.push('suggestion2');
  if (avgSentenceLength <= 12) suggestions.push('suggestion1');
  if (!hasOverview && minWords >= 150) suggestions.push('suggestionOverview');
  if (linkers < 2) suggestions.push('suggestion5');
  if (suggestions.length === 0) suggestions.push('suggestionKeep');

  return { band, feedback, suggestions, descriptorKey: nearestDescriptor(band, 'writing')?.en };
}

export function evaluateSpeaking(transcript: string, durationSecs = 0): {
  band: number;
  feedback: { category: string; score: number; comment: string }[];
  suggestions: string[];
  descriptorKey?: string;
} {
  const words = countWords(transcript);
  const sentences = transcript.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const fillers = (transcript.match(/\b(um|uh|er|like|you know|kind of|sort of)\b/gi) ?? []).length;
  const discourseMarkers = (transcript.match(/\b(because|although|however|for example|in my opinion|actually|generally)\b/gi) ?? []).length;

  const fluencyScore = words >= 120 && fillers <= 3 ? 7 : words >= 80 && fillers <= 5 ? 6.5 : words >= 50 ? 6 : words >= 25 ? 5.5 : 5;
  const lexicalScore = words >= 80 && discourseMarkers >= 2 ? 7 : words >= 40 ? 6.5 : 6;
  const grammarScore = sentences.length >= 6 ? 7 : sentences.length >= 3 ? 6.5 : 6;
  const pronunciationScore = durationSecs > 0 && words / durationSecs > 1.5 ? 7 : words >= 60 ? 6.5 : 6;

  const band = roundBand((fluencyScore + lexicalScore + grammarScore + pronunciationScore) / 4);

  const feedback = [
    { category: 'fluency', score: fluencyScore, comment: fillers <= 3 ? 'fluencyGood' : 'fluencyHesitation' },
    { category: 'lexical', score: lexicalScore, comment: discourseMarkers >= 2 ? 'vocabGood' : 'suggestion2' },
    { category: 'grammar', score: grammarScore, comment: sentences.length >= 4 ? 'grammarGood' : 'suggestion1' },
    { category: 'pronunciation', score: pronunciationScore, comment: words >= 60 ? 'speakingLengthGood' : 'speakingLengthLow' },
  ];

  const suggestions: string[] = [];
  if (words < 80) suggestions.push('speakingExpand');
  if (fillers > 4) suggestions.push('speakingFillers');
  if (discourseMarkers < 2) suggestions.push('speakingLinkers');
  if (sentences.length < 4) suggestions.push('suggestion1');
  if (suggestions.length === 0) suggestions.push('suggestionKeep');

  return { band, feedback, suggestions, descriptorKey: nearestDescriptor(band, 'speaking')?.en };
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isAnswerCorrect(
  userAnswer: string | undefined,
  correct: string,
  type: 'mcq' | 'fill-in' | 'true-false-ng' | 'yes-no-ng',
): boolean {
  if (!userAnswer?.trim()) return false;
  if (type === 'mcq') return userAnswer === correct;
  return normalizeAnswer(userAnswer) === normalizeAnswer(correct);
}