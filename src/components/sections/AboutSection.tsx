import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, CheckCircle, Users, Star, Award, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { SectionHeader } from '../ui/SectionHeader';
import { GlowCard } from '../ui/GlowCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { Button } from '../ui/Button';
import { resourceCounts } from '../../data/resourceCounts';

export function AboutSection() {
  const { t } = useLanguage();
  const { saveContactMessage } = useProgress();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const features = [t.about.feature1, t.about.feature2, t.about.feature3, t.about.feature4, t.about.feature5, t.about.feature6];
  const stats = [
    { icon: Users, value: resourceCounts.total, suffix: '+', label: t.about.stats.learners },
    { icon: Award, value: resourceCounts.mockTests, suffix: '', label: t.about.stats.tests },
    { icon: Star, value: resourceCounts.vocabulary, suffix: '+', label: t.about.stats.rating, decimals: 0 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    saveContactMessage(form);
    toast.success(t.about.sent);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section className="section-padding max-w-7xl mx-auto relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      <div className="relative">
        <SectionHeader badge={t.about.title} title={t.about.title} />

        {/* Creator hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glow-border rounded-3xl mb-16"
        >
          <div className="glass-card rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-accent-teal/5 via-transparent to-accent-indigo/5">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="w-36 h-36 rounded-3xl bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center text-white text-5xl font-black shadow-glow-lg shrink-0"
              >
                TB
              </motion.div>
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-teal/10 text-accent-teal text-xs font-bold mb-4">
                  <Sparkles size={14} /> {t.about.creator}
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-4">{t.about.creatorName}</h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">{t.about.creatorBio}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {stats.map((s, i) => (
            <GlowCard key={i} glow={i % 2 === 0 ? 'teal' : 'indigo'} delay={i * 0.1} className="text-center !p-8">
              <s.icon size={24} className="text-accent-teal mx-auto mb-3" />
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </GlowCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <GlowCard glow="teal">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Heart className="text-rose-500" size={22} />{t.about.mission}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{t.about.missionText}</p>
          </GlowCard>
          <GlowCard glow="indigo" delay={0.1}>
            <h3 className="text-xl font-bold mb-6">{t.about.timeline}</h3>
            <div className="space-y-6">
              {t.about.timelineItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center text-white font-bold text-sm shrink-0">{item.year}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 pt-3 leading-relaxed">{item.event}</p>
                </motion.div>
              ))}
            </div>
          </GlowCard>
        </div>

        <GlowCard glow="none" className="mb-16">
          <h3 className="text-xl font-bold mb-6">{t.about.features}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i} whileHover={{ x: 4 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent-teal/5 transition-colors">
                <CheckCircle size={20} className="text-accent-teal shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{f}</span>
              </motion.div>
            ))}
          </div>
        </GlowCard>

        <div className="max-w-xl mx-auto glow-border rounded-3xl">
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Mail size={22} className="text-accent-teal" />{t.about.contact}</h3>
            <p className="text-sm text-slate-500 mb-6">{t.about.contactDesc}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.about.name} aria-label={t.about.name} className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-accent-teal focus:shadow-glow transition-all" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.about.email} aria-label={t.about.email} className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-accent-teal focus:shadow-glow transition-all" />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.about.message} aria-label={t.about.message} rows={4} className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-accent-teal focus:shadow-glow resize-none transition-all" />
              <Button type="submit" size="lg" className="w-full">{t.about.send}</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}