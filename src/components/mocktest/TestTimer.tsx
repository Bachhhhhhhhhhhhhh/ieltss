import { motion } from 'framer-motion';
import { Clock, Pause, Play, AlertTriangle } from 'lucide-react';
import { formatTime } from '../../utils/scoring';
import { useLanguage } from '../../context/LanguageContext';

interface TestTimerProps {
  timeLeft: number;
  totalTime: number;
  paused: boolean;
  onTogglePause: () => void;
}

export function TestTimer({ timeLeft, totalTime, paused, onTogglePause }: TestTimerProps) {
  const { t } = useLanguage();
  const pct = (timeLeft / totalTime) * 100;
  const isLow = timeLeft < 300;
  const isCritical = timeLeft < 60;

  return (
    <div className={`glass-card rounded-2xl p-4 flex items-center gap-4 transition-colors ${isCritical ? 'border-red-500/50 bg-red-500/5' : isLow ? 'border-yellow-500/30' : ''}`}>
      <div className="relative w-14 h-14">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="3" />
          <motion.circle
            cx="18" cy="18" r="15.5" fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className={isCritical ? 'stroke-red-500' : isLow ? 'stroke-yellow-500' : 'stroke-accent-teal'}
            strokeDasharray={`${pct * 0.974} 100`}
            initial={false}
            animate={{ strokeDasharray: `${pct * 0.974} 100` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <Clock size={16} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isCritical ? 'text-red-500' : 'text-accent-teal'}`} />
      </div>

      <div className="flex-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t.mock.timeRemaining}</p>
        <p className={`text-2xl font-mono font-bold ${isCritical ? 'text-red-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
          {formatTime(timeLeft)}
        </p>
      </div>

      {isCritical && <AlertTriangle size={20} className="text-red-500 animate-pulse" />}

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onTogglePause}
        className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        aria-label={paused ? t.mock.resume : t.mock.pause}
      >
        {paused ? <Play size={20} /> : <Pause size={20} />}
      </motion.button>
    </div>
  );
}