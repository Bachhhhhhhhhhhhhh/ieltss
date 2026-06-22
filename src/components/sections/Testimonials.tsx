import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../ui/SectionHeader';

export function Testimonials() {
  const { t } = useLanguage();
  const items = t.home.testimonials;
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  return (
    <section className="section-padding max-w-7xl mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-teal/5 via-transparent to-accent-indigo/5" />
      <div className="relative">
        <SectionHeader badge={t.home.testimonialsBadge} title={t.home.testimonialsTitle} />

        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bento-card relative"
            >
              <Quote size={32} className="text-accent-teal/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6">"{item.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center text-white font-bold">
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

        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="bento-card relative"
            >
              <Quote size={28} className="text-accent-teal/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">"{items[index].text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center text-white font-bold">
                  {items[index].name[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{items[index].name}</p>
                  <p className="text-xs text-accent-teal font-medium">Band {items[index].band} • {items[index].city}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="p-2 rounded-xl glass-card" aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === index ? 'w-6 bg-accent-teal' : 'bg-slate-300 dark:bg-slate-600'}`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next} className="p-2 rounded-xl glass-card" aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}