import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, ThumbsUp, ThumbsDown, Shuffle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STUDY_PROGRESS_KEY, toBookmarkId, type LookupResult } from '../../utils/lookupSearch';

interface LookupStudyDeckProps {
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

export function LookupStudyDeck({ items, onClose }: LookupStudyDeckProps) {
  const { t, lang } = useLanguage();
  const { speak, isSpeaking } = useSpeech();
  const [progress, setProgress] = useLocalStorage<Record<string, 'know' | 'review'>>(STUDY_PROGRESS_KEY, {});

  const baseDeck = useMemo(
    () => items.filter((i) => i.type === 'vocab' || i.type === 'collocation'),
    [items],
  );
  const [shuffled, setShuffled] = useState(false);
  const deck = useMemo(
    () => (shuffled ? shuffle(baseDeck) : baseDeck),
    [baseDeck, shuffled],
  );

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionKnown, setSessionKnown] = useState(0);

  const deckLen = deck.length;
  const next = useCallback(() => { setFlipped(false); setIndex((i) => (i + 1) % Math.max(deckLen, 1)); }, [deckLen]);
  const prev = useCallback(() => { setFlipped(false); setIndex((i) => (i - 1 + Math.max(deckLen, 1)) % Math.max(deckLen, 1)); }, [deckLen]);

  if (deckLen === 0) return null;

  const card = deck[index % deckLen];
  const cardId = toBookmarkId(card);
  const knownCount = deck.filter((d) => progress[toBookmarkId(d)] === 'know').length;
  const progressPct = Math.round((knownCount / deckLen) * 100);

  const mark = (status: 'know' | 'review') => {
    setProgress((p) => ({ ...p, [cardId]: status }));
    if (status === 'know') setSessionKnown((s) => s + 1);
    next();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card rounded-3xl p-6 border border-accent-teal/20 shadow-glow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-teal">{t.lookup.studyMode}</span>
          <span className="text-xs text-slate-500">{index + 1} / {deck.length}</span>
          <button type="button" onClick={onClose} className="text-xs text-slate-500 hover:text-accent-teal">{t.common.close}</button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>{t.lookup.studyProgress}</span>
            <span>{knownCount}/{deck.length} ({progressPct}%)</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-teal to-accent-indigo"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {sessionKnown > 0 && (
            <p className="text-[10px] text-emerald-600 mt-1">+{sessionKnown} {t.lookup.studyKnownThisSession}</p>
          )}
        </div>

        <div className="perspective-[1000px] min-h-[200px] mb-4">
          <AnimatePresence mode="wait">
            <motion.button
              key={`${card.id}-${flipped}`}
              type="button"
              initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setFlipped((f) => !f)}
              className={`w-full min-h-[200px] rounded-2xl border-2 p-8 flex flex-col items-center justify-center text-center transition-colors ${
                progress[cardId] === 'know'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300/50'
                  : progress[cardId] === 'review'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300/50'
                    : 'bg-gradient-to-br from-accent-teal/10 to-accent-indigo/10 border-accent-teal/25'
              }`}
            >
              {!flipped ? (
                <>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mb-2">{card.title}</p>
                  {card.meta && <p className="text-sm font-mono text-slate-400">{card.meta}</p>}
                  <p className="text-xs text-slate-500 mt-6">{t.lookup.tapToFlip}</p>
                </>
              ) : (
                <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed">{card.snippet}</p>
              )}
            </motion.button>
          </AnimatePresence>
        </div>

        {flipped && (
          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => mark('review')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 text-sm font-semibold">
              <ThumbsDown size={16} /> {t.lookup.studyReview}
            </button>
            <button type="button" onClick={() => mark('know')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 text-sm font-semibold">
              <ThumbsUp size={16} /> {t.lookup.studyKnow}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={prev} className="p-3 rounded-xl glass-card hover:bg-accent-teal/10" aria-label={t.lookup.prev}>
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => speak(card.title, lang === 'vi' ? 'vi-VN' : 'en-US')}
            className={`p-3 rounded-xl ${isSpeaking ? 'bg-accent-teal text-white' : 'glass-card hover:bg-accent-teal/10'}`}
            aria-label={t.lookup.listen}
          >
            <Volume2 size={20} />
          </button>
          <button type="button" onClick={() => { setShuffled((s) => !s); setIndex(0); setFlipped(false); }} className={`p-3 rounded-xl ${shuffled ? 'bg-accent-indigo text-white' : 'glass-card hover:bg-accent-teal/10'}`} aria-label={t.lookup.studyShuffle}>
            <Shuffle size={18} />
          </button>
          <button type="button" onClick={() => setFlipped(false)} className="p-3 rounded-xl glass-card hover:bg-accent-teal/10">
            <RotateCcw size={18} />
          </button>
          <button type="button" onClick={next} className="p-3 rounded-xl glass-card hover:bg-accent-teal/10" aria-label={t.lookup.next}>
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}