import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

const variants = {
  primary: 'bg-accent-teal text-white shadow-lg shadow-accent-teal/25 hover:bg-teal-600',
  secondary: 'bg-accent-indigo text-white shadow-lg shadow-accent-indigo/25 hover:bg-indigo-600',
  ghost: 'bg-transparent hover:bg-white/10 text-current',
  outline: 'border-2 border-accent-teal text-accent-teal hover:bg-accent-teal/10',
};

const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-base', lg: 'px-7 py-3.5 text-lg' };

export function Button({ children, onClick, variant = 'primary', size = 'md', className = '', disabled, type = 'button', ariaLabel }: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
}