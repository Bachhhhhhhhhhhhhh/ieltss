import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../ui/SectionHeader';

export function HowItWorks() {
  const { t } = useLanguage();
  const steps = t.home.steps;

  return (
    <section className="section-padding bg-slate-100/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge={t.home.stepsBadge} title={t.home.stepsTitle} subtitle={t.home.stepsSubtitle} />
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-teal/30 to-transparent -translate-y-1/2" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center text-white text-2xl font-black shadow-glow"
                >
                  {i + 1}
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}