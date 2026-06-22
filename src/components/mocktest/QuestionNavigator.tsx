import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface QuestionNavigatorProps {
  total: number;
  current: number;
  answers: Record<string, string>;
  flagged: Set<string>;
  questionIds: string[];
  onSelect: (index: number) => void;
  compact?: boolean;
}

export function QuestionNavigator({ total, current, answers, flagged, questionIds, onSelect, compact }: QuestionNavigatorProps) {
  const { t } = useLanguage();

  return (
    <div className={`glass-card rounded-2xl ${compact ? 'p-3' : 'p-4'}`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t.mock.questionNav}</p>
      <div className={`grid gap-2 ${compact ? 'grid-cols-8' : 'grid-cols-5 sm:grid-cols-10'}`}>
        {Array.from({ length: total }).map((_, i) => {
          const qId = questionIds[i];
          const answered = !!answers[qId];
          const isFlagged = flagged.has(qId);
          const isCurrent = i === current;
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(i)}
              aria-label={`${t.mock.question} ${i + 1}`}
              aria-current={isCurrent ? 'step' : undefined}
              className={`relative w-full aspect-square rounded-lg text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-accent-teal text-white shadow-glow ring-2 ring-accent-teal/50'
                  : answered
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {i + 1}
              {isFlagged && <Flag size={8} className="absolute -top-1 -right-1 fill-yellow-400 text-yellow-400" />}
            </motion.button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent-teal" /> {t.mock.current}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" /> {t.mock.answered}</span>
        <span className="flex items-center gap-1"><Flag size={10} className="text-yellow-400" /> {t.mock.flagged}</span>
      </div>
    </div>
  );
}