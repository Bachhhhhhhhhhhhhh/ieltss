import { useMemo } from 'react';
import { motion } from 'framer-motion';

const BAR_COUNT = 24;

function buildBarConfig() {
  return Array.from({ length: BAR_COUNT }, (_, i) => ({
    peak: 20 + ((i * 7 + 13) % 20),
    duration: 0.5 + ((i * 3) % 5) * 0.1,
  }));
}

const BAR_CONFIG = buildBarConfig();

export function AudioWaveform({ active }: { active: boolean }) {
  const bars = useMemo(() => BAR_CONFIG, []);

  return (
    <div className="flex items-center justify-center gap-1 h-12" aria-hidden="true">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-accent-teal"
          animate={active ? { height: [8, bar.peak, 8] } : { height: 4 }}
          transition={active ? {
            duration: bar.duration,
            repeat: Infinity,
            delay: i * 0.05,
          } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}