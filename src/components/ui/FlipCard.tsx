import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  flipped: boolean;
  onFlip: () => void;
  className?: string;
}

export function FlipCard({ front, back, flipped, onFlip, className = '' }: FlipCardProps) {
  return (
    <div className={`perspective-1000 w-full ${className}`} onClick={onFlip} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onFlip()}>
      <motion.div
        className={`flip-card-inner relative w-full min-h-[280px] cursor-pointer ${flipped ? 'flipped' : ''}`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flip-card-front absolute inset-0 glass-card rounded-2xl p-8 flex flex-col items-center justify-center glow-border">
          {front}
        </div>
        <div className="flip-card-back absolute inset-0 glass-card rounded-2xl p-8 flex flex-col items-center justify-center bg-gradient-to-br from-accent-teal/5 to-accent-indigo/5">
          {back}
        </div>
      </motion.div>
    </div>
  );
}