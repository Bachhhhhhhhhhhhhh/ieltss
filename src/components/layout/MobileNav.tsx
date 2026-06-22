import { motion } from 'framer-motion';
import { Home, BookOpen, ClipboardList, Search, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { Page } from '../../types';

interface MobileNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const items: { key: Page; icon: typeof Home; labelKey: keyof typeof import('../../i18n/en').en.nav }[] = [
  { key: 'home', icon: Home, labelKey: 'home' },
  { key: 'practice', icon: BookOpen, labelKey: 'practice' },
  { key: 'mock', icon: ClipboardList, labelKey: 'mock' },
  { key: 'lookup', icon: Search, labelKey: 'lookup' },
  { key: 'dashboard', icon: BarChart3, labelKey: 'dashboard' },
];

export function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
      <div className="glass-card rounded-2xl px-2 py-2 shadow-glow-lg border border-white/20">
        <div className="flex items-center justify-around">
          {items.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.key;
            return (
              <motion.button
                key={item.key}
                whileTap={{ scale: 0.85 }}
                onClick={() => onNavigate(item.key)}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                  active ? 'text-white' : 'text-slate-500'
                }`}
                aria-label={t.nav[item.labelKey]}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <motion.div
                    layoutId="mobile-pill"
                    className="absolute inset-0 bg-gradient-to-r from-accent-teal to-teal-600 rounded-xl shadow-glow"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={20} className="relative z-10" />
                <span className="text-[9px] font-bold relative z-10">{t.nav[item.labelKey]}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}