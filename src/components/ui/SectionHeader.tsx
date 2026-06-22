import { motion } from 'framer-motion';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

export function SectionHeader({ badge, title, subtitle, align = 'center' }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-14 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 mb-5 text-xs font-bold uppercase tracking-widest rounded-full bg-accent-teal/10 text-accent-teal border border-accent-teal/20"
        >
          {badge}
        </motion.span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 text-balance leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}