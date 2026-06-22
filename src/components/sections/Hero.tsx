import { motion } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, Users, Star, Headphones, BookOpen, PenTool, Mic, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { resourceCounts } from '../../data/resourceCounts';
import { Button } from '../ui/Button';
import { Particles } from '../ui/Particles';
import { AnimatedCounter } from '../ui/AnimatedCounter';

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
  const { progress } = useProgress();
  const hasProgress = progress.attempts.length > 0;
  const displayBand = hasProgress ? progress.averageBand : 0;
  const band7Count = progress.attempts.filter((a) => a.overallBand >= 7).length;
  const band7Pct = progress.attempts.length > 0 ? Math.round((band7Count / progress.attempts.length) * 100) : 0;

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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50/40 to-indigo-100/30 dark:from-[#0a0f1e] dark:via-primary dark:to-indigo-950/80 animate-gradient-bg" />
      <div className="absolute inset-0 mesh-bg" />
      <Particles count={50} />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-teal/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-accent-indigo/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-sm font-semibold mb-8">
              <Sparkles size={16} className="animate-pulse" />
              {t.brand.tagline} — {t.brand.by}
            </motion.div>

            <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6 text-balance">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className={i === 1 || i === 2 ? 'gradient-text' : ''}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p variants={item} className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-xl">
              {t.hero.subheadline}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" onClick={onStartPractice} className="group">
                {t.hero.ctaStart}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="secondary" onClick={onViewMock}>
                <Play size={20} /> {t.hero.ctaMock}
              </Button>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-3 gap-3">
              {stats.map((stat, i) => (
                <div key={i} className="glass-card rounded-2xl p-4 text-center hover:shadow-glow transition-shadow duration-500">
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
            initial={{ opacity: 0, x: 60, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="perspective-1000 mt-12 lg:mt-0"
          >
            <div className="relative glow-border rounded-3xl">
              <div className="glass-card rounded-3xl p-8 shadow-glow-lg">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{t.hero.previewLabel}</p>
                    <p className="text-xs text-slate-400">{hasProgress ? t.hero.previewSubActive : t.hero.previewSub}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 rounded-full border-2 border-dashed border-accent-teal/30"
                  />
                </div>

                <div className="text-center mb-8">
                  {hasProgress ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.8 }}
                      className="inline-block"
                    >
                      <span className="text-7xl font-black gradient-text">
                        <AnimatedCounter value={displayBand} decimals={1} duration={2} />
                      </span>
                    </motion.div>
                  ) : (
                    <p className="text-2xl font-bold text-slate-400">{t.hero.noScoreYet}</p>
                  )}
                  <p className="text-slate-500 mt-2 font-medium">{t.mock.overallBand}</p>
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
                        className="text-center p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50"
                      >
                        <skill.icon size={20} className={`${skill.color} mx-auto mb-1`} />
                        <div className="text-lg font-bold text-slate-800 dark:text-white">{band > 0 ? band : '—'}</div>
                        <div className="text-[10px] text-slate-500">{skill.label}</div>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: hasProgress ? `${Math.min(100, (displayBand / 9) * 100)}%` : '0%' }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="mt-6 h-1.5 rounded-full bg-gradient-to-r from-accent-teal to-accent-indigo"
                />
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