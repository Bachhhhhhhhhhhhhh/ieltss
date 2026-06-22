import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';

interface CTABannerProps {
  onStart: () => void;
}

export function CTABanner({ onStart }: CTABannerProps) {
  const { t } = useLanguage();

  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent-teal via-teal-600 to-accent-indigo animate-gradient-bg" />
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center text-white">
          <Sparkles className="mx-auto mb-4 opacity-80" size={32} />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-balance">{t.cta.title}</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">{t.cta.subtitle}</p>
          <Button size="lg" onClick={onStart} className="!bg-white !text-accent-teal hover:!bg-slate-100 shadow-xl">
            {t.cta.button} <ArrowRight size={20} />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}