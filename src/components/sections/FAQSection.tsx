import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../ui/SectionHeader';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function FAQSection() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding max-w-4xl mx-auto">
      <SectionHeader badge={t.home.faqBadge} title={t.home.faqTitle} subtitle={t.home.faqSubtitle} />
      <div ref={ref} className="space-y-3">
        {t.home.faqItems.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center shrink-0">
                  <HelpCircle size={18} className="text-accent-teal" />
                </div>
                <span className="flex-1 font-bold text-slate-900 dark:text-white">{item.q}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={20} className="text-slate-400" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="px-6 pb-5 pl-[4.5rem] text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}