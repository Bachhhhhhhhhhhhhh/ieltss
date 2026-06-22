import { motion } from 'framer-motion';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}