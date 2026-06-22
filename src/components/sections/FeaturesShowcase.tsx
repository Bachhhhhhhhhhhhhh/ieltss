import { ClipboardCheck, Brain, BarChart3, Globe, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../ui/SectionHeader';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const icons = [ClipboardCheck, Brain, BarChart3, Globe, Zap, Shield];
const spans = ['lg:col-span-2 lg:row-span-2', '', '', 'lg:col-span-2', '', ''];

export function FeaturesShowcase() {
  const { t } = useLanguage();
  const features = t.home.features;
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-50" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHeader badge={t.home.featuresBadge} title={t.home.featuresTitle} subtitle={t.home.featuresSubtitle} />
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 auto-rows-fr">
          {features.map((feature, i) => {
            const Icon = icons[i];
            const isFeatured = i === 0;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className={`bento-card group ${spans[i]} ${isFeatured ? 'relative overflow-hidden' : ''}`}
              >
                {isFeatured && (
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent-teal/20 to-accent-indigo/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                )}
                <div className={`relative ${isFeatured ? 'flex flex-col justify-between h-full min-h-[280px]' : ''}`}>
                  <div>
                    <div className={`rounded-2xl bg-gradient-to-br from-accent-teal/20 to-accent-indigo/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 ${isFeatured ? 'w-16 h-16' : 'w-12 h-12'}`}>
                      <Icon size={isFeatured ? 32 : 24} className="text-accent-teal" />
                    </div>
                    <h3 className={`font-display font-bold text-slate-900 dark:text-white mb-2 ${isFeatured ? 'text-2xl' : 'text-lg'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-slate-600 dark:text-slate-400 leading-relaxed ${isFeatured ? 'text-base max-w-md' : 'text-sm'}`}>
                      {feature.desc}
                    </p>
                  </div>
                  {isFeatured && (
                    <div className="mt-8 flex gap-6">
                      {['20 Tests', '4 Skills', 'EN/VI'].map((tag) => (
                        <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-bold bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}