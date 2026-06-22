import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from './Modal';

export function KeyboardShortcuts() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const shortcuts = [
    { key: '?', desc: t.shortcuts.help },
    { key: 'N', desc: t.shortcuts.next },
    { key: 'P', desc: t.shortcuts.prev },
    { key: 'F', desc: t.shortcuts.flag },
    { key: 'Esc', desc: t.shortcuts.close },
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        aria-label={t.shortcuts.title}
        className="fixed bottom-20 lg:bottom-8 left-6 z-40 hidden sm:flex items-center gap-2 px-3 py-2 rounded-full glass-card text-xs font-medium text-slate-500 hover:text-accent-teal transition-colors"
      >
        <Keyboard size={14} /> ?
      </motion.button>

      <AnimatePresence>
        {open && (
          <Modal isOpen={open} onClose={() => setOpen(false)} title={t.shortcuts.title} size="sm">
            <div className="space-y-3">
              {shortcuts.map((s) => (
                <div key={s.key} className="flex items-center justify-between py-2 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{s.desc}</span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-accent-teal">{s.key}</kbd>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}