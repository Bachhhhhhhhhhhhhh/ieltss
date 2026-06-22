import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import type { Page } from '../../types';

interface FooterProps {
  onNavigate?: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();
  const links: { page: Page; label: string }[] = [
    { page: 'home', label: t.nav.home },
    { page: 'practice', label: t.nav.practice },
    { page: 'mock', label: t.nav.mock },
    { page: 'lookup', label: t.nav.lookup },
    { page: 'about', label: t.nav.about },
  ];

  return (
    <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-100/30 dark:bg-slate-900/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center text-white font-bold text-sm">IM</div>
              <span className="font-bold text-slate-900 dark:text-white">{t.brand.name}</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{t.footer.tagline}</p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white">{t.footer.links}</h4>
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <button key={l.page} onClick={() => onNavigate?.(l.page)} className="text-sm text-slate-500 hover:text-accent-teal text-left transition-colors">
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white">{t.brand.by}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{t.footer.creator}</p>
            <p className="text-xs text-accent-teal font-semibold mt-3">{t.brand.tagline}</p>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
          <p className="text-xs text-slate-500">© 2026 {t.brand.fullName}. {t.footer.rights}</p>
        </motion.div>
      </div>
    </footer>
  );
}