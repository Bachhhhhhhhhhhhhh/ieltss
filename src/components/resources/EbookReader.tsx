import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, List, Download, ZoomIn, ZoomOut,
  BookOpen, CheckCircle2, Lightbulb, PenLine, Library, ClipboardList, Eye, EyeOff,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { DigitalBook, DigitalSection, BookResource } from '../../types';

interface EbookReaderProps {
  book: BookResource;
  digital: DigitalBook;
  onClose: () => void;
}

const sectionIcons = {
  text: BookOpen,
  tip: Lightbulb,
  vocabulary: Library,
  sample: PenLine,
  exercise: ClipboardList,
  checklist: CheckCircle2,
};

const fontSizes = ['text-sm', 'text-base', 'text-lg', 'text-xl'] as const;

export function EbookReader({ book, digital, onClose }: EbookReaderProps) {
  const { t, bt } = useLanguage();
  const [chapterIdx, setChapterIdx] = useState(0);
  const [tocOpen, setTocOpen] = useState(true);
  const [fontIdx, setFontIdx] = useState(1);
  const [revealedExercises, setRevealedExercises] = useState<Set<string>>(new Set());
  const [showVi, setShowVi] = useState(true);

  const chapter = digital.chapters[chapterIdx];
  const progress = ((chapterIdx + 1) / digital.chapters.length) * 100;

  const downloadBook = useCallback(() => {
    const lines: string[] = [
      bt(book.title),
      `${book.author}${book.publisher ? ` · ${book.publisher}` : ''}`,
      '='.repeat(60),
      '',
    ];
    digital.chapters.forEach((ch) => {
      lines.push(`Chapter ${ch.number}: ${bt(ch.title)}`, '');
      ch.sections.forEach((sec) => {
        lines.push(`## ${bt(sec.title)}`, bt(sec.content), '');
        sec.vocabulary?.forEach((v) => lines.push(`${v.word} (${v.pos}): ${bt(v.definition)}`, bt(v.example)));
        sec.exercises?.forEach((ex, i) => {
          lines.push(`Q${i + 1}: ${bt(ex.question)}`, `A: ${bt(ex.answer)}`, '');
        });
      });
      lines.push('');
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.id}-softcopy.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [book, digital, bt]);

  const toggleExercise = (id: string) => {
    setRevealedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderSection = (sec: DigitalSection) => {
    const Icon = sectionIcons[sec.type];
    const content = showVi ? `${bt(sec.content)}\n\n🇻🇳 ${sec.content.vi}` : bt(sec.content);

    return (
      <div key={sec.id} className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent-teal/10 flex items-center justify-center">
            <Icon size={16} className="text-accent-teal" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white">{bt(sec.title)}</h4>
          <span className="text-[10px] uppercase font-bold text-slate-400 ml-auto">{sec.type}</span>
        </div>

        <div className={`text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line ${fontSizes[fontIdx]}`}>
          {content}
        </div>

        {sec.vocabulary && sec.vocabulary.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left text-xs uppercase text-slate-500">
                  <th className="p-3">Word</th>
                  <th className="p-3">POS</th>
                  <th className="p-3">{t.resources.meaning}</th>
                  <th className="p-3">Example</th>
                </tr>
              </thead>
              <tbody>
                {sec.vocabulary.map((v) => (
                  <tr key={v.word} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="p-3 font-bold text-accent-indigo">{v.word}</td>
                    <td className="p-3 text-xs text-slate-400">{v.pos}</td>
                    <td className="p-3">{bt(v.definition)}</td>
                    <td className="p-3 italic text-slate-500">{bt(v.example)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {sec.exercises && sec.exercises.length > 0 && (
          <div className="mt-4 space-y-3">
            {sec.exercises.map((ex, i) => {
              const exId = `${sec.id}-ex${i}`;
              const revealed = revealedExercises.has(exId);
              return (
                <div key={exId} className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/80">
                  <p className="font-semibold text-sm mb-2">{bt(ex.question)}</p>
                  <button
                    type="button"
                    onClick={() => toggleExercise(exId)}
                    className="text-xs font-bold text-accent-teal flex items-center gap-1 hover:underline"
                  >
                    {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
                    {revealed ? t.resources.hideAnswer : t.resources.showAnswer}
                  </button>
                  <AnimatePresence>
                    {revealed && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-green-700 dark:text-green-400 mt-2 pl-3 border-l-2 border-green-500"
                      >
                        {bt(ex.answer)}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const chapterList = useMemo(() => digital.chapters, [digital.chapters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-slate-900/95 backdrop-blur-md flex flex-col"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/50 bg-slate-900/80 shrink-0">
        <button type="button" onClick={() => setTocOpen(!tocOpen)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 lg:hidden" aria-label="TOC">
          <List size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white truncate">{bt(book.title)}</p>
          <p className="text-xs text-slate-400 truncate">{book.author} · {t.resources.softCopy} · {digital.pageEstimate} {t.resources.pages}</p>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <button type="button" onClick={() => setFontIdx((i) => Math.max(0, i - 1))} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300" aria-label="Smaller font">
            <ZoomOut size={18} />
          </button>
          <button type="button" onClick={() => setFontIdx((i) => Math.min(fontSizes.length - 1, i + 1))} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300" aria-label="Larger font">
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            onClick={() => setShowVi(!showVi)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${showVi ? 'bg-accent-teal text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            VI
          </button>
          <button type="button" onClick={downloadBook} className="p-2 rounded-lg hover:bg-slate-800 text-accent-teal" aria-label={t.resources.downloadSoftCopy}>
            <Download size={18} />
          </button>
        </div>
        <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300" aria-label={t.common.close}>
          <X size={22} />
        </button>
      </div>

      {/* Progress */}
      <div className="h-1 bg-slate-800 shrink-0">
        <motion.div className="h-full bg-gradient-to-r from-accent-teal to-accent-indigo" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* TOC Sidebar */}
        <aside
          className={`${tocOpen ? 'flex' : 'hidden'} lg:flex flex-col w-72 shrink-0 border-r border-slate-700/50 bg-slate-900/60 overflow-y-auto`}
        >
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-accent-teal mb-3">{t.resources.tableOfContents}</p>
                {chapterList.map((ch, i) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => { setChapterIdx(i); if (window.innerWidth < 1024) setTocOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 text-sm transition-all ${
                      chapterIdx === i ? 'bg-accent-teal/20 text-accent-teal font-bold' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs opacity-60 mr-2">{ch.number}.</span>
                    {bt(ch.title)}
                  </button>
                ))}
              </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-10">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${digital.coverGradient} text-white mb-4`}>
              {t.resources.chapter} {chapter.number} / {digital.chapters.length}
            </div>
            <h2 className="font-display text-3xl font-extrabold text-white mb-8">{bt(chapter.title)}</h2>
            {chapter.sections.map(renderSection)}
          </div>
        </main>
      </div>

      {/* Chapter nav */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50 bg-slate-900/80 shrink-0">
        <button
          type="button"
          disabled={chapterIdx <= 0}
          onClick={() => setChapterIdx((i) => i - 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
        >
          <ChevronLeft size={18} /> {t.mock.previous}
        </button>
        <span className="text-sm text-slate-400">{chapterIdx + 1} / {digital.chapters.length}</span>
        <button
          type="button"
          disabled={chapterIdx >= digital.chapters.length - 1}
          onClick={() => setChapterIdx((i) => i + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-teal text-white disabled:opacity-40 hover:bg-teal-600"
        >
          {t.mock.next} <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}