import type { Achievement } from '../types';

export const achievementsList: Achievement[] = [
  {
    id: 'first-test',
    title: { en: 'First Steps', vi: 'Bước đầu tiên' },
    description: { en: 'Complete your first mock test', vi: 'Hoàn thành bài thi mô phỏng đầu tiên' },
    icon: '🎯',
    condition: (p) => p.totalTests >= 1,
  },
  {
    id: 'band-7',
    title: { en: 'Band 7 Achiever', vi: 'Band 7' },
    description: { en: 'Score Band 7 or above', vi: 'Đạt Band 7 trở lên' },
    icon: '🏆',
    condition: (p) => p.attempts.some((a) => a.overallBand >= 7),
  },
  {
    id: 'streak-7',
    title: { en: 'Week Warrior', vi: 'Chiến binh tuần' },
    description: { en: 'Maintain a 7-day streak', vi: 'Duy trì chuỗi 7 ngày' },
    icon: '🔥',
    condition: (p) => p.streak >= 7,
  },
  {
    id: 'vocab-50',
    title: { en: 'Word Master', vi: 'Bậc thầy từ vựng' },
    description: { en: 'Learn 50 vocabulary words', vi: 'Học 50 từ vựng' },
    icon: '📚',
    condition: (p) => Object.keys(p.vocabProgress).length >= 50,
  },
  {
    id: 'all-skills',
    title: { en: 'Well Rounded', vi: 'Toàn diện' },
    description: { en: 'Practice all four skills', vi: 'Luyện cả 4 kỹ năng' },
    icon: '⭐',
    condition: (p) => Object.values(p.timeSpentBySkill).every((t) => t > 0),
  },
  {
    id: 'perfect-listening',
    title: { en: 'Sharp Ears', vi: 'Tai thính' },
    description: { en: 'Score 100% on listening', vi: 'Đạt 100% phần Nghe' },
    icon: '🎧',
    condition: (p) => p.attempts.some((a) => a.scores.listening >= 9),
  },
];