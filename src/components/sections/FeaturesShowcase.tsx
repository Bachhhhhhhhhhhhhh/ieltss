import { ClipboardCheck, Brain, BarChart3, Globe, Zap, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../ui/SectionHeader';
import { GlowCard } from '../ui/GlowCard';

const icons = [ClipboardCheck, Brain, BarChart3, Globe, Zap, Shield];
const glows: ('teal' | 'indigo')[] = ['teal', 'indigo', 'teal', 'indigo', 'teal', 'indigo'];

export function FeaturesShowcase() {
  const { t } = useLanguage();
  const features = t.home.features;

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-50" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHeader badge={t.home.featuresBadge} title={t.home.featuresTitle} subtitle={t.home.featuresSubtitle} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = icons[i];
            return (
              <GlowCard key={i} glow={glows[i]} delay={i * 0.08}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-teal/20 to-accent-indigo/20 flex items-center justify-center mb-5">
                  <Icon size={24} className="text-accent-teal" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}