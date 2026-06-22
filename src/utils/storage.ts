import type { UserProgress } from '../types';

const STORAGE_KEY = 'ielts-mastery-progress';
const THEME_KEY = 'ielts-mastery-theme';
const LANG_KEY = 'ielts-mastery-lang';

export const defaultProgress: UserProgress = {
  name: 'Truong The Bach',
  targetBand: 7,
  onboardingComplete: false,
  streak: 0,
  lastActiveDate: '',
  totalTests: 0,
  averageBand: 0,
  skillBands: { listening: 0, reading: 0, writing: 0, speaking: 0 },
  timeSpentBySkill: { listening: 0, reading: 0, writing: 0, speaking: 0 },
  attempts: [],
  vocabProgress: {},
  achievements: [],
  dailyChallengeCompleted: [],
  contactMessages: [],
};

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { ...defaultProgress };
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function loadTheme(): 'light' | 'dark' {
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'dark';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadLanguage(): 'en' | 'vi' {
  return (localStorage.getItem(LANG_KEY) as 'en' | 'vi') || 'vi';
}

export function saveLanguage(lang: 'en' | 'vi'): void {
  localStorage.setItem(LANG_KEY, lang);
}

export function exportProgressJSON(progress: UserProgress): void {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ielts-mastery-progress-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}