import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, Users, Star, Headphones, BookOpen, PenTool, Mic, Sparkles, Target } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { resourceCounts } from '../../data/resourceCounts';
import { Button } from '../ui/Button';
import { Particles } from '../ui/Particles';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { BandGoalRing } from '../ui/BandGoalRing';

interface HeroProps {
  onStartPractice: () => void;
  onViewMock: () => void;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

const skillMeta = [
  { key: 'listening' as const, icon: Headphones, label: 'L', color: 'text-teal-400' },
  { key: 'reading' as const, icon: BookOpen, label: 'R', color: 'text-indigo-400' },
  { key: 'writing' as const, icon: PenTool, label: 'W', color: 'text-purple-400' },
  { key: 'speaking' as const, icon: Mic, label: 'S', color: 'text-rose-400' },
];

export function Hero({ onStartPractice, onViewMock }: HeroProps) {
  const { t } = useLanguage();
  const { progress, setTargetBand } = useProgress();
  const [target, setTarget] = useState(progress.targetBand || 7);
  const hasProgress = progress.attempts.length > 0;
  const displayBand = hasProgress ? progress.averageBand : 0;
  const band7Count = progress.attempts.filter((a) => a.overallBand >= 7).length;
  const band7Pct = progress.attempts.length > 0 ? Math.round((band7Count / progress.attempts.length) * 100) : 0;
  const gap = Math.max(0, target - displayBand);
  const estWeeks = gap > 0 ? Math.ceil(gap * 4) : 0;

  const stats = [
    {
      icon: TrendingUp,
      value: hasProgress ? band7Pct : resourceCounts.mockTests,
      suffix: hasProgress ? '%' : '',
      label: hasProgress ? t.hero.stat1Personal : t.hero.stat1,
      decimals: 0,
    },
    {
      icon: Users,
      value: hasProgress ? progress.totalTests : resourceCounts.vocabulary,
      suffix: hasProgress ? '' : '+',
      label: hasProgress ? t.hero.stat2Personal : t.hero.stat2,
      decimals: 0,
    },
    {
      icon: Star,
      value: hasProgress ? displayBand : resourceCounts.total,
      suffix: hasProgress ? '' : '+',
      label: hasProgress ? t.hero.stat3Personal : t.hero.stat3,
      decimals: hasProgress ? 1 : 0,
    },
  ];

  const words = t.hero.headline.split(' ');
  const liveCount = 1200 + (new Date().getDate() * 37);

  const handleTargetChange = (v: number) => {
    setTarget(v);
    setTargetBand(v);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden aurora-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50/40 to-indigo-100/30 dark:from-[#0a0f1e] dark:via-primary dark:to-indigo-950/80 animate-gradient-bg" />
      <div className="absolute inset-0 mesh-bg noise-overlay" />
      <Particles count={60} />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-teal/20 rounded-full blur-[100px] animate-aurora" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-accent-indigo/15 rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal" />
              </span>
              {liveCount.toLocaleString()} {t.hero.liveLearners}
            </motion.div>

            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-sm font-semibold mb-6 ml-0 sm:ml-3">
              <Sparkles size={16} className="text-accent-indigo" />
              {t.brand.tagline} — {t.brand.by}
            </motion.div>

            <motion.h1 variants={item} className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold text-slate-900 dark:text-white leading-[1.08] mb-6 text-balance tracking-tight">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className={i >= 1 && i <= 2 ? 'gradient-text-animated' : ''}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p variants={item} className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-xl">
              {t.hero.subheadline}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 mb-10">
              <Button size="lg" onClick={onStartPractice} className="group shimmer-btn bg-gradient-to-r from-accent-teal to-teal-600">
                {t.hero.ctaStart}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="secondary" onClick={onViewMock} className="bg-gradient-to-r from-accent-indigo to-indigo-600">
                <Play size={20} /> {t.hero.ctaMock}
              </Button>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-3 gap-3">
              {stats.map((stat, i) => (
                <div key={i} className="bento-card !p-4 text-center">
                  <stat.icon size={18} className="text-accent-teal mx-auto mb-2" />
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 lg:mt-0"
          >
            <div className="relative glow-border rounded-3xl">
              <div className="glass-card rounded-3xl p-8 shadow-glow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{t.hero.previewLabel}</p>
                    <p className="text-xs text-slate-400">{hasProgress ? t.hero.previewSubActive : t.hero.previewSub}</p>
                  </div>
                  <Target size={20} className="text-accent-teal" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                  <BandGoalRing current={displayBand} target={target} size={180} />
                  <div className="flex-1 w-full space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <span>{t.hero.setTarget}</span>
                        <span className="font-bold text-accent-teal">{target.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={9}
                        step={0.5}
                        value={target}
                        onChange={(e) => handleTargetChange(parseFloat(e.target.value))}
                        className="w-full accent-accent-teal"
                        aria-label={t.hero.setTarget}
                      />
                    </div>
                    {hasProgress && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-100/60 dark:bg-slate-800/60 p-3 text-center">
                          <p className="text-xs text-slate-500">{t.hero.gapToGoal}</p>
                          <p className="text-lg font-bold gradient-text">{gap.toFixed(1)}</p>
                        </div>
                        <div className="rounded-xl bg-slate-100/60 dark:bg-slate-800/60 p-3 text-center">
                          <p className="text-xs text-slate-500">{t.hero.daysToExam}</p>
                          <p className="text-lg font-bold text-accent-indigo">{estWeeks || '✓'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {skillMeta.map((skill, i) => {
                    const band = progress.skillBands[skill.key];
                    return (
                      <motion.div
                        key={skill.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="text-center p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-accent-teal/10 transition-colors"
                      >
                        <skill.icon size={20} className={`${skill.color} mx-auto mb-1`} />
                        <div className="text-lg font-bold text-slate-800 dark:text-white">{band > 0 ? band : '—'}</div>
                        <div className="text-[10px] text-slate-500">{skill.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-4 -right-4 glass-card rounded-xl px-4 py-2 shadow-glow text-sm font-bold text-accent-teal">
              {resourceCounts.mockTests} {t.mock.testCount}
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-2 text-sm font-semibold text-accent-indigo">
              {t.hero.badgeFeedback}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}