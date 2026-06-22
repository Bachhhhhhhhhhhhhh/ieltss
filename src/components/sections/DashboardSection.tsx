import { motion } from 'framer-motion';
import { Flame, ClipboardList, Target, Download, Trophy, TrendingUp } from 'lucide-react';
import { BandGoalRing } from '../ui/BandGoalRing';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { toast } from 'sonner';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { achievementsList } from '../../data/achievements';
import { exportProgressJSON } from '../../utils/storage';
import { SectionHeader } from '../ui/SectionHeader';
import { GlowCard } from '../ui/GlowCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { Button } from '../ui/Button';

export function DashboardSection() {
  const { t, bt } = useLanguage();
  const { progress } = useProgress();

  const stats = [
    { icon: Flame, label: t.dashboard.streak, value: progress.streak, color: 'from-orange-500 to-red-500', glow: 'teal' as const },
    { icon: ClipboardList, label: t.dashboard.totalTests, value: progress.totalTests, color: 'from-teal-500 to-teal-600', glow: 'teal' as const },
    { icon: Target, label: t.dashboard.avgBand, value: progress.averageBand || 0, color: 'from-indigo-500 to-indigo-600', glow: 'indigo' as const, decimals: 1 },
  ];

  const progressData = progress.attempts.slice(0, 10).reverse().map((a, i) => ({ name: `#${i + 1}`, band: a.overallBand }));
  const timeData = [
    { skill: 'L', minutes: progress.timeSpentBySkill.listening },
    { skill: 'R', minutes: progress.timeSpentBySkill.reading },
    { skill: 'W', minutes: progress.timeSpentBySkill.writing },
    { skill: 'S', minutes: progress.timeSpentBySkill.speaking },
  ];
  const hasSkillData = Object.values(progress.skillBands).some((b) => b > 0);
  const radarData = [
    { skill: t.practice.listening, score: progress.skillBands.listening || 0, fullMark: 9 },
    { skill: t.practice.reading, score: progress.skillBands.reading || 0, fullMark: 9 },
    { skill: t.practice.writing, score: progress.skillBands.writing || 0, fullMark: 9 },
    { skill: t.practice.speaking, score: progress.skillBands.speaking || 0, fullMark: 9 },
  ];

  return (
    <section className="section-padding max-w-7xl mx-auto relative">
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
      <div className="relative">
        <SectionHeader title={t.dashboard.title} subtitle={t.dashboard.subtitle} />

        <GlowCard glow="teal" className="mb-10 !p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <BandGoalRing current={progress.averageBand} target={progress.targetBand || 7} size={160} />
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-bold uppercase tracking-widest text-accent-teal mb-2">{t.dashboard.goalProgress}</p>
              <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-4">
                {progress.name || t.common.guest} → Band {(progress.targetBand || 7).toFixed(1)}
              </h3>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80">
                  <Target size={16} className="text-accent-teal" />
                  <span className="text-sm">{t.dashboard.targetBand}: <strong>{(progress.targetBand || 7).toFixed(1)}</strong></span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80">
                  <TrendingUp size={16} className="text-accent-indigo" />
                  <span className="text-sm">{t.dashboard.gapToGoal}: <strong>{Math.max(0, (progress.targetBand || 7) - progress.averageBand).toFixed(1)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </GlowCard>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <GlowCard key={i} glow={stat.glow} delay={i * 0.1} className="text-center !p-8">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                <AnimatedCounter value={stat.value} decimals={stat.decimals ?? 0} />
              </div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </GlowCard>
          ))}
        </div>

        {hasSkillData && (
          <GlowCard glow="teal" className="mb-10">
            <h3 className="font-bold mb-5 text-lg">{t.dashboard.skillRadar}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar dataKey="score" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.35} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </GlowCard>
        )}

        {progress.attempts.length === 0 ? (
          <GlowCard glow="none" className="text-center py-16">
            <Trophy size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">{t.dashboard.noData}</p>
          </GlowCard>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <GlowCard glow="teal">
              <h3 className="font-bold mb-5 text-lg">{t.dashboard.progressOverTime}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis domain={[0, 9]} tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} />
                  <Line type="monotone" dataKey="band" stroke="#14B8A6" strokeWidth={3} dot={{ fill: '#14B8A6', r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </GlowCard>
            <GlowCard glow="indigo" delay={0.1}>
              <h3 className="font-bold mb-5 text-lg">{t.dashboard.timeSpent}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="skill" tick={{ fill: '#94a3b8' }} />
                  <YAxis tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} />
                  <Bar dataKey="minutes" fill="url(#barGrad)" radius={[10, 10, 0, 0]} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#14B8A6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </GlowCard>
          </div>
        )}

        <GlowCard glow="none" className="mb-10">
          <h3 className="font-bold mb-6 text-lg">{t.dashboard.achievements}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementsList.map((a, i) => {
              const unlocked = progress.achievements.includes(a.id);
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={unlocked ? { scale: 1.03 } : undefined}
                  className={`p-5 rounded-2xl border-2 transition-all ${unlocked ? 'border-accent-teal/40 bg-accent-teal/5 shadow-glow' : 'border-slate-200 dark:border-slate-700 opacity-50 grayscale'}`}
                >
                  <span className="text-3xl">{a.icon}</span>
                  <h4 className="font-bold mt-3">{bt(a.title)}</h4>
                  <p className="text-xs text-slate-500 mt-1">{bt(a.description)}</p>
                  <span className={`text-xs mt-2 inline-block font-semibold ${unlocked ? 'text-accent-teal' : 'text-slate-400'}`}>
                    {unlocked ? t.dashboard.unlocked : t.dashboard.locked}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </GlowCard>

        <div className="text-center">
          <Button onClick={() => { exportProgressJSON(progress); toast.success(t.dashboard.exportSuccess); }}>
            <Download size={16} /> {t.dashboard.exportData}
          </Button>
        </div>
      </div>
    </section>
  );
}