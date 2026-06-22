import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, User, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLookup } from '../../context/LookupContext';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import type { Page } from '../../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { key: Page; labelKey: keyof typeof import('../../i18n/en').en.nav }[] = [
  { key: 'home', labelKey: 'home' },
  { key: 'practice', labelKey: 'practice' },
  { key: 'mock', labelKey: 'mock' },
  { key: 'lookup', labelKey: 'lookup' },
  { key: 'resources', labelKey: 'resources' },
  { key: 'about', labelKey: 'about' },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { progress } = useProgress();
  const { openPalette } = useLookup();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-[2px] left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl shadow-lg shadow-black/5 border-b border-slate-200/30 dark:border-slate-700/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => onNavigate('home')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center text-white font-bold text-sm shadow-glow ring-2 ring-white/20">IM</div>
            <div className="hidden sm:block text-left">
              <div className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{t.brand.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wide">{t.brand.by}</div>
            </div>
          </motion.button>

          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <motion.button
                key={item.key}
                whileHover={{ y: -1 }}
                onClick={() => onNavigate(item.key)}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.key ? 'text-accent-teal' : 'text-slate-600 dark:text-slate-300 hover:text-accent-teal'
                }`}
              >
                {t.nav[item.labelKey]}
                {currentPage === item.key && (
                  <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-accent-teal/10 rounded-lg -z-10" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-slate-100/80 dark:bg-slate-800/80 p-0.5 backdrop-blur">
              {(['en', 'vi'] as const).map((l) => (
                <motion.button
                  key={l}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                    lang === l ? 'bg-gradient-to-r from-accent-teal to-teal-600 text-white shadow-md' : 'text-slate-500'
                  }`}
                >
                  {l}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => openPalette()}
              aria-label={t.lookup.openPalette}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-slate-500 hover:text-accent-teal"
            >
              <Search size={16} />
              <kbd className="text-[10px] font-mono hidden md:inline">⌘K</kbd>
            </motion.button>

            <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme} aria-label={theme === 'dark' ? t.common.lightMode : t.common.darkMode} className="p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80">
              {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('dashboard')}
              className="hidden sm:flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{progress.name || t.common.guest}</span>
            </motion.button>

            <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden border-t border-slate-200/50 dark:border-slate-700/50 overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button key={item.key} onClick={() => { onNavigate(item.key); setMobileOpen(false); }} className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${currentPage === item.key ? 'bg-accent-teal/15 text-accent-teal' : 'text-slate-600 dark:text-slate-300'}`}>
                  {t.nav[item.labelKey]}
                </button>
              ))}
              <button onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.nav.dashboard}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}