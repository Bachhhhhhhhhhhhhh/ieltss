import { Award, Globe2, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const icons = [ShieldCheck, Award, Globe2, Users, Zap, Sparkles];

export function TrustMarquee() {
  const { t } = useLanguage();
  const items = [...t.home.trustItems, ...t.home.trustItems];

  return (
    <section className="py-8 border-y border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={`${item}-${i}`}
              className="inline-flex items-center gap-3 mx-8 text-sm font-semibold text-slate-600 dark:text-slate-300"
            >
              <Icon size={18} className="text-accent-teal shrink-0" />
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo/40" />
            </div>
          );
        })}
      </div>
    </section>
  );
}