import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../ui/SectionHeader';

export function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="section-padding max-w-7xl mx-auto">
      <SectionHeader badge={t.home.testimonialsBadge} title={t.home.testimonialsTitle} />
      <div className="grid md:grid-cols-3 gap-6">
        {t.home.testimonials.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-6 relative"
          >
            <Quote size={32} className="text-accent-teal/20 absolute top-4 right-4" />
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6">"{item.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center text-white font-bold text-sm">
                {item.name[0]}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-accent-teal font-medium">Band {item.band} • {item.city}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}