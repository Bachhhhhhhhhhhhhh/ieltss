import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface CTABannerProps {
  onStart: () => void;
}

export function CTABanner({ onStart }: CTABannerProps) {
  const { t } = useLanguage();

  const highlights = [
    { icon: Users, value: 50000, suffix: '+', label: 'Learners' },
    { icon: Trophy, value: 20, suffix: '', label: 'Mock Tests' },
    { icon: Zap, value: 100, suffix: '%', label: 'Free' },
  ];

  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl premium-border"
      >
        <div className="rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-teal via-teal-600 to-accent-indigo animate-gradient-bg" />
          <div className="absolute inset-0 mesh-bg opacity-30" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-8 px-8 py-16 sm:px-16 sm:py-20 items-center">
            <div className="text-white">
              <Sparkles className="mb-4 opacity-80" size={32} />
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4 text-balance">{t.cta.title}</h2>
              <p className="text-lg opacity-90 mb-8 max-w-md">{t.cta.subtitle}</p>
              <Button size="lg" onClick={onStart} className="!bg-white !text-accent-teal hover:!bg-slate-100 shadow-xl shimmer-btn">
                {t.cta.button} <ArrowRight size={20} />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20"
                >
                  <h.icon size={22} className="mx-auto mb-2 opacity-80" />
                  <p className="text-2xl font-black">
                    <AnimatedCounter value={h.value} suffix={h.suffix} />
                  </p>
                  <p className="text-xs opacity-70 mt-1">{h.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}