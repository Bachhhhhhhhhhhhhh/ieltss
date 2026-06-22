import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Target, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { Button } from './Button';

export function OnboardingFlow() {
  const { t } = useLanguage();
  const { progress, setTargetBand, setUserName, completeOnboarding } = useProgress();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(progress.name || '');
  const [band, setBand] = useState(progress.targetBand || 7);

  if (progress.onboardingComplete) return null;

  const steps = [
    { icon: Sparkles, title: t.onboarding.welcome, desc: t.onboarding.welcomeDesc },
    { icon: User, title: t.onboarding.nameTitle, desc: t.onboarding.nameDesc },
    { icon: Target, title: t.onboarding.targetTitle, desc: t.onboarding.targetDesc },
  ];

  const finish = () => {
    if (name.trim()) setUserName(name.trim());
    setTargetBand(band);
    completeOnboarding();
  };

  const StepIcon = steps[step].icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-lg glass-card rounded-3xl p-8 sm:p-10 shadow-glow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent-teal/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex gap-2 mb-8">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-gradient-to-r from-accent-teal to-accent-indigo' : 'bg-slate-200 dark:bg-slate-700'}`}
                />
              ))}
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center mb-6 shadow-glow">
              <StepIcon size={26} className="text-white" />
            </div>

            <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-2">{steps[step].title}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{steps[step].desc}</p>

            {step === 1 && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.onboarding.namePlaceholder}
                className="w-full px-5 py-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-accent-teal/50 mb-6"
                autoFocus
              />
            )}

            {step === 2 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-500">{t.onboarding.targetLabel}</span>
                  <span className="text-3xl font-black gradient-text">{band.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={9}
                  step={0.5}
                  value={band}
                  onChange={(e) => setBand(parseFloat(e.target.value))}
                  className="w-full accent-accent-teal h-2 rounded-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>5.0</span>
                  <span>9.0</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">
                  {t.common.back}
                </Button>
              )}
              <Button
                className="flex-1 shimmer-btn"
                onClick={() => (step < steps.length - 1 ? setStep((s) => s + 1) : finish())}
              >
                {step < steps.length - 1 ? t.common.next : t.onboarding.start}
                <ArrowRight size={18} />
              </Button>
            </div>

            {step === 0 && (
              <button onClick={completeOnboarding} className="w-full mt-4 text-sm text-slate-400 hover:text-accent-teal transition-colors">
                {t.onboarding.skip}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}