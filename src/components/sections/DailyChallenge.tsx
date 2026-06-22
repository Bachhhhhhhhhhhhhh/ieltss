import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { getTodayChallenge } from '../../data/dailyChallenges';
import { fireConfetti } from '../../utils/confetti';
import { SectionHeader } from '../ui/SectionHeader';

export function DailyChallenge() {
  const { t, bt } = useLanguage();
  const { progress, completeDailyChallenge } = useProgress();
  const challenge = getTodayChallenge();
  const today = new Date().toISOString().split('T')[0];
  const completed = progress.dailyChallengeCompleted.includes(today);
  const [answer, setAnswer] = useState<string | null>(null);

  const handleAnswer = (optId: string) => {
    setAnswer(optId);
    if (optId === challenge.correctAnswer) {
      completeDailyChallenge(today);
      fireConfetti();
    }
  };

  return (
    <section className="section-padding bg-gradient-to-b from-transparent via-accent-teal/5 to-transparent">
      <div className="max-w-xl mx-auto">
        <SectionHeader badge={t.daily.title} title={t.daily.title} subtitle={t.daily.subtitle} />

        <motion.div layout className="glow-border rounded-3xl">
          <div className="glass-card rounded-3xl p-8">
            {completed ? (
              <div className="text-center py-6">
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }}>
                  <Trophy size={64} className="text-yellow-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold gradient-text">{t.daily.complete}</h3>
                <p className="text-sm text-slate-500 mt-3">{t.daily.tryAgain}</p>
                <p className="text-sm font-semibold text-accent-teal mt-2">{t.daily.streak}: {progress.streak} 🔥</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <Zap size={20} className="text-yellow-500" />
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500">{challenge.skill}</span>
                </div>
                <p className="text-lg font-semibold mb-8 leading-relaxed">{bt(challenge.question)}</p>
                <div className="space-y-3">
                  {challenge.options?.map((opt, i) => (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ x: 6 }}
                      disabled={answer !== null}
                      onClick={() => handleAnswer(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                        answer === opt.id
                          ? opt.id === challenge.correctAnswer
                            ? 'border-green-500 bg-green-500/10 shadow-lg'
                            : 'border-red-500 bg-red-500/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-accent-teal hover:shadow-glow'
                      }`}
                    >
                      {bt(opt.text)}
                    </motion.button>
                  ))}
                </div>
                {answer && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm leading-relaxed">
                    {bt(challenge.explanation)}
                  </motion.p>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}