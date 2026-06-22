import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, BookOpen, ClipboardList, Headphones, Mic, PenTool } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../ui/SectionHeader';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const tabIcons = [ClipboardList, Headphones, BookOpen, PenTool, Mic, BarChart3];

export function ProductShowcase() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const ref = useScrollReveal<HTMLDivElement>();
  const tabs = t.home.showcaseTabs;
  const preview = tabs[active];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-40" />
      <div ref={ref} className="relative max-w-7xl mx-auto">
        <SectionHeader
          badge={t.home.showcaseBadge}
          title={t.home.showcaseTitle}
          subtitle={t.home.showcaseSubtitle}
        />

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {tabs.map((tab, i) => {
              const Icon = tabIcons[i];
              const isActive = active === i;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all shrink-0 min-w-[200px] lg:min-w-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-accent-teal/15 to-accent-indigo/10 border border-accent-teal/30 text-accent-teal shadow-glow'
                      : 'bg-white/50 dark:bg-slate-800/50 border border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-accent-teal text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{tab.label}</p>
                    <p className="text-xs opacity-70 mt-0.5 hidden sm:block">{tab.hint}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="premium-border rounded-3xl">
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-premium">
              <div className="browser-chrome">
                <span className="browser-dot bg-red-400" />
                <span className="browser-dot bg-yellow-400" />
                <span className="browser-dot bg-green-400" />
                <span className="ml-3 text-xs text-slate-500 font-mono">ielts-mastery.app/{preview.id}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="p-6 sm:p-10 min-h-[320px] relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${preview.gradient} opacity-10`} />
                  <div className="relative">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent-teal mb-3">{preview.label}</p>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">{preview.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-lg">{preview.desc}</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {preview.stats.map((stat, j) => (
                        <div key={j} className="glass-card rounded-2xl p-4 text-center">
                          <p className="text-2xl font-black gradient-text">{stat.value}</p>
                          <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}