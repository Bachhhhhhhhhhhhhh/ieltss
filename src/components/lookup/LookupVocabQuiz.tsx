import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { LookupResult } from '../../utils/lookupSearch';

interface LookupVocabQuizProps {
  items: LookupResult[];
  onClose: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function LookupVocabQuiz({ items, onClose }: LookupVocabQuizProps) {
  const { t } = useLanguage();
  const deck = useMemo(
    () => shuffle(items.filter((i) => i.type === 'vocab' || i.type === 'collocation')).slice(0, 10),
    [items],
  );

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = deck[index];
  const options = useMemo(() => {
    if (!current) return [];
    const distractors = deck
      .filter((d) => d.id !== current.id)
      .map((d) => d.title)
      .slice(0, 3);
    return shuffle([current.title, ...distractors]).slice(0, 4);
  }, [current, deck]);

  const handlePick = useCallback((opt: string) => {
    if (picked || !current) return;
    setPicked(opt);
    if (opt === current.title) setScore((s) => s + 1);
  }, [picked, current]);

  const next = () => {
    if (index + 1 >= deck.length) { setDone(true); return; }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => { setIndex(0); setScore(0); setPicked(null); setDone(false); };

  if (deck.length < 4) return null;

  const pct = Math.round((score / deck.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-card rounded-3xl p-6 border border-accent-indigo/25 shadow-glow-lg"
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-indigo">{t.lookup.quizMode}</span>
          {!done && <span className="text-xs text-slate-500">{index + 1} / {deck.length}</span>}
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} /></button>
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
              <Trophy size={48} className="mx-auto mb-4 text-amber-500" />
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">{score}/{deck.length}</p>
              <p className="text-sm text-slate-500 mb-6">{t.lookup.quizScore.replace('{n}', String(pct))}</p>
              <div className="flex gap-2 justify-center">
                <button type="button" onClick={restart} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-indigo text-white text-sm font-semibold">
                  <RotateCcw size={14} /> {t.lookup.quizRetry}
                </button>
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl glass-card text-sm">{t.common.close}</button>
              </div>
            </motion.div>
          ) : current && (
            <motion.div key={current.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <p className="text-xs text-slate-500 mb-2">{t.lookup.quizPrompt}</p>
              <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                {current.snippet}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {options.map((opt) => {
                  const isCorrect = opt === current.title;
                  const isPicked = picked === opt;
                  let cls = 'glass-card hover:border-accent-indigo/40 hover:text-accent-indigo';
                  if (picked) {
                    if (isCorrect) cls = 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700';
                    else if (isPicked) cls = 'bg-rose-100 dark:bg-rose-950/40 border-rose-300 text-rose-700';
                    else cls = 'opacity-50';
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={!!picked}
                      onClick={() => handlePick(opt)}
                      className={`p-3 rounded-xl border text-sm font-semibold text-left transition-all ${cls}`}
                    >
                      <span className="flex items-center gap-2">
                        {picked && isCorrect && <CheckCircle size={14} />}
                        {picked && isPicked && !isCorrect && <XCircle size={14} />}
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
              {picked && (
                <button type="button" onClick={next} className="w-full py-3 rounded-xl bg-accent-indigo text-white font-semibold text-sm">
                  {index + 1 >= deck.length ? t.lookup.quizFinish : t.lookup.next}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}