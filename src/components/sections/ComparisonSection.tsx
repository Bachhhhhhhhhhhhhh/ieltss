import { Check, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../ui/SectionHeader';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function ComparisonSection() {
  const { t } = useLanguage();
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-teal/5 to-transparent" />
      <div ref={ref} className="relative max-w-5xl mx-auto">
        <SectionHeader
          badge={t.home.compareBadge}
          title={t.home.compareTitle}
          subtitle={t.home.compareSubtitle}
        />
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-100/80 dark:bg-slate-800/80 text-sm font-bold">
            <div className="p-4 sm:p-5 text-slate-500">{t.home.compareFeature}</div>
            <div className="p-4 sm:p-5 text-center text-slate-500">{t.home.compareOthers}</div>
            <div className="p-4 sm:p-5 text-center gradient-text">{t.brand.name}</div>
          </div>
          {t.home.compareRows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-t border-slate-200/50 dark:border-slate-700/50 ${i % 2 === 0 ? 'bg-white/30 dark:bg-slate-900/30' : ''}`}
            >
              <div className="p-4 sm:p-5 text-sm font-medium text-slate-700 dark:text-slate-300">{row.feature}</div>
              <div className="p-4 sm:p-5 flex justify-center">
                {row.others ? <Check size={20} className="text-slate-400" /> : <X size={20} className="text-red-400/70" />}
              </div>
              <div className="p-4 sm:p-5 flex justify-center">
                <Check size={20} className="text-accent-teal" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}