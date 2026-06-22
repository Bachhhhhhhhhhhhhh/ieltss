import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { UserProgress, TestAttempt, Skill, ContactMessage } from '../types';
import { loadProgress, saveProgress } from '../utils/storage';
import { achievementsList } from '../data/achievements';

interface ProgressContextType {
  progress: UserProgress;
  recordTestAttempt: (attempt: TestAttempt) => void;
  updateVocabProgress: (wordId: string, level: number) => void;
  addTimeSpent: (skill: Skill, minutes: number) => void;
  completeDailyChallenge: (date: string) => void;
  saveContactMessage: (msg: Omit<ContactMessage, 'id' | 'date'>) => void;
  updateStreak: () => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

function checkAchievements(progress: UserProgress): string[] {
  const unlocked = [...progress.achievements];
  achievementsList.forEach((a) => {
    if (!unlocked.includes(a.id) && a.condition(progress)) {
      unlocked.push(a.id);
    }
  });
  return unlocked;
}

function updateStreakLogic(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let streak = progress.streak;
  if (progress.lastActiveDate === today) return progress;
  if (progress.lastActiveDate === yesterday) streak += 1;
  else streak = 1;
  return { ...progress, streak, lastActiveDate: today };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const updateStreak = useCallback(() => {
    setProgress((prev) => {
      const updated = updateStreakLogic(prev);
      return { ...updated, achievements: checkAchievements(updated) };
    });
  }, []);

  const recordTestAttempt = useCallback((attempt: TestAttempt) => {
    setProgress((prev) => {
      const attempts = [attempt, ...prev.attempts].slice(0, 50);
      const totalTests = attempts.length;
      const averageBand = attempts.reduce((s, a) => s + a.overallBand, 0) / totalTests;
      const skillBands = { ...prev.skillBands };
      (Object.keys(attempt.scores) as Skill[]).forEach((skill) => {
        const skillAttempts = attempts.map((a) => a.scores[skill]).filter((s) => s > 0);
        skillBands[skill] = skillAttempts.length
          ? Math.round((skillAttempts.reduce((a, b) => a + b, 0) / skillAttempts.length) * 2) / 2
          : 0;
      });

      const timeSpentBySkill = { ...prev.timeSpentBySkill };
      if (attempt.timeBySkill) {
        (Object.keys(attempt.timeBySkill) as Skill[]).forEach((skill) => {
          const secs = attempt.timeBySkill![skill];
          if (secs > 0) timeSpentBySkill[skill] += Math.max(1, Math.round(secs / 60));
        });
      } else if (attempt.timeSpent > 0) {
        const minsPerSkill = Math.max(1, Math.round(attempt.timeSpent / 4 / 60));
        (['listening', 'reading', 'writing', 'speaking'] as Skill[]).forEach((skill) => {
          timeSpentBySkill[skill] += minsPerSkill;
        });
      }

      const updated: UserProgress = {
        ...updateStreakLogic(prev),
        attempts,
        totalTests,
        averageBand: Math.round(averageBand * 2) / 2,
        skillBands,
        timeSpentBySkill,
      };
      updated.achievements = checkAchievements(updated);
      return updated;
    });
  }, []);

  const updateVocabProgress = useCallback((wordId: string, level: number) => {
    setProgress((prev) => ({
      ...prev,
      vocabProgress: {
        ...prev.vocabProgress,
        [wordId]: { level, lastReviewed: new Date().toISOString() },
      },
    }));
  }, []);

  const addTimeSpent = useCallback((skill: Skill, minutes: number) => {
    setProgress((prev) => ({
      ...prev,
      timeSpentBySkill: {
        ...prev.timeSpentBySkill,
        [skill]: prev.timeSpentBySkill[skill] + minutes,
      },
    }));
  }, []);

  const completeDailyChallenge = useCallback((date: string) => {
    setProgress((prev) => {
      if (prev.dailyChallengeCompleted.includes(date)) return prev;
      const updated = {
        ...updateStreakLogic(prev),
        dailyChallengeCompleted: [...prev.dailyChallengeCompleted, date],
      };
      updated.achievements = checkAchievements(updated);
      return updated;
    });
  }, []);

  const saveContactMessage = useCallback((msg: Omit<ContactMessage, 'id' | 'date'>) => {
    setProgress((prev) => ({
      ...prev,
      contactMessages: [
        { ...msg, id: crypto.randomUUID(), date: new Date().toISOString() },
        ...prev.contactMessages,
      ],
    }));
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        recordTestAttempt,
        updateVocabProgress,
        addTimeSpent,
        completeDailyChallenge,
        saveContactMessage,
        updateStreak,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}