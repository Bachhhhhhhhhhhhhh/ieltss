import { motion } from 'framer-motion';

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-primary/80 backdrop-blur-sm pointer-events-none">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-[3px] border-accent-teal/20 border-t-accent-teal"
      />
    </div>
  );
}