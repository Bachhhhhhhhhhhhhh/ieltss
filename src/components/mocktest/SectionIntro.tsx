import { motion } from 'framer-motion';
import { Headphones, BookOpen, PenTool, Mic, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { warmUpSpeechSynthesis } from '../../hooks/useListeningAudio';
import { Button } from '../ui/Button';
import type { Skill } from '../../types';

const skillMeta: Record<Skill, { icon: typeof Headphones; color: string; duration: number }> = {
  listening: { icon: Headphones, color: 'from-teal-500 to-teal-600', duration: 30 },
  reading: { icon: BookOpen, color: 'from-indigo-500 to-indigo-600', duration: 60 },
  writing: { icon: PenTool, color: 'from-purple-500 to-purple-600', duration: 60 },
  speaking: { icon: Mic, color: 'from-rose-500 to-rose-600', duration: 14 },
};

interface SectionIntroProps {
  section: Skill;
  onStart: () => void;
}

export function SectionIntro({ section, onStart }: SectionIntroProps) {
  const { t } = useLanguage();
  const meta = skillMeta[section];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className={`w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-glow-lg`}
        >
          <Icon size={40} className="text-white" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">{t.mock[section]}</h2>
        <div className="flex items-center justify-center gap-2 text-slate-500 mb-6">
          <Clock size={16} />
          <span>{meta.duration} {t.common.minutes}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-8">{t.mock.sectionIntro[section]}</p>
        <Button
          size="lg"
          onClick={() => {
            if (section === 'listening') warmUpSpeechSynthesis();
            onStart();
          }}
        >
          {t.mock.beginSection}
        </Button>
      </div>
    </motion.div>
  );
}