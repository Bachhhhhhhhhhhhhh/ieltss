import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: 'teal' | 'indigo' | 'none';
  delay?: number;
}

export function GlowCard({ children, className = '', onClick, glow = 'teal', delay = 0 }: GlowCardProps) {
  const glowClass = glow === 'teal' ? 'hover:shadow-glow' : glow === 'indigo' ? 'hover:shadow-glow-indigo' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 transition-shadow duration-500 ${glowClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}