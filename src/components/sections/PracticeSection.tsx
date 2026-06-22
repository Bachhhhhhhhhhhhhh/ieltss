import { useState, useMemo } from 'react';
import { PRACTICE_SKILL_KEY } from '../../utils/lookupSearch';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, BookOpen, PenTool, Mic, ChevronLeft, Volume2, Check, RotateCcw, Sparkles, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useSpeech } from '../../hooks/useSpeech';
import { vocabulary } from '../../data/vocabulary';
import { grammarQuestions } from '../../data/grammar';
import { SectionHeader } from '../ui/SectionHeader';
import { GlowCard } from '../ui/GlowCard';
import { FlipCard } from '../ui/FlipCard';
import { Button } from '../ui/Button';
import { SkillDrill } from '../practice/SkillDrill';
import type { Skill } from '../../types';

const skills: { key: Skill; icon: typeof Headphones; color: string; glow: 'teal' | 'indigo' }[] = [
  { key: 'listening', icon: Headphones, color: 'from-teal-500 to-teal-600', glow: 'teal' },
  { key: 'reading', icon: BookOpen, color: 'from-indigo-500 to-indigo-600', glow: 'indigo' },
  { key: 'writing', icon: PenTool, color: 'from-purple-500 to-purple-600', glow: 'teal' },
  { key: 'speaking', icon: Mic, color: 'from-rose-500 to-rose-600', glow: 'indigo' },
];

export function PracticeSection() {
  const { t, bt } = useLanguage();
  const { progress, updateVocabProgress } = useProgress();
  const { speak, isSpeaking } = useSpeech();
  const [activeTab, setActiveTab] = useState<'skills' | 'vocab' | 'grammar'>(() => {
    const skill = sessionStorage.getItem(PRACTICE_SKILL_KEY);
    return skill ? 'skills' : 'skills';
  });
  const [vocabIndex, setVocabIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [grammarIndex, setGrammarIndex] = useState(0);
  const [grammarAnswer, setGrammarAnswer] = useState<string | null>(null);
  const [grammarScore, setGrammarScore] = useState(0);
  const [drillSkill, setDrillSkill] = useState<Skill | null>(() => {
    const skill = sessionStorage.getItem(PRACTICE_SKILL_KEY) as Skill | null;
    if (skill && ['listening', 'reading', 'writing', 'speaking'].includes(skill)) {
      sessionStorage.removeItem(PRACTICE_SKILL_KEY);
      return skill;
    }
    return null;
  });
  const [vocabSearch, setVocabSearch] = useState('');
  const [vocabCategory, setVocabCategory] = useState('all');

  const vocabCategories = useMemo(() => [...new Set(vocabulary.map((v) => v.category))], []);

  const filteredVocab = useMemo(() => {
    const q = vocabSearch.trim().toLowerCase();
    return vocabulary.filter((v) => {
      const matchCat = vocabCategory === 'all' || v.category === vocabCategory;
      const matchQ = !q || v.word.toLowerCase().includes(q) || v.meaning.en.toLowerCase().includes(q) || v.meaning.vi.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [vocabSearch, vocabCategory]);

  const currentWord = filteredVocab[vocabIndex % Math.max(filteredVocab.length, 1)];
  const currentGrammar = grammarQuestions[grammarIndex];
  const learnedCount = Object.keys(progress.vocabProgress).length;
  const masteryPct = Math.round((learnedCount / vocabulary.length) * 100);

  const skillDesc: Record<Skill, string> = {
    listening: t.practice.listeningDesc,
    reading: t.practice.readingDesc,
    writing: t.practice.writingDesc,
    speaking: t.practice.speakingDesc,
  };

  const nextVocab = (known: boolean) => {
    if (currentWord && known) updateVocabProgress(currentWord.id, 1);
    setFlipped(false);
    setVocabIndex((i) => (i + 1) % Math.max(filteredVocab.length, 1));
  };

  return (
    <section className="section-padding max-w-7xl mx-auto relative">
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
      <div className="relative">
        <SectionHeader badge={t.practice.title} title={t.practice.title} subtitle={t.practice.subtitle} />

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {(['skills', 'vocab', 'grammar'] as const).map((tab) => (
            <Button key={tab} variant={activeTab === tab ? 'primary' : 'outline'} size="sm" onClick={() => setActiveTab(tab)}>
              {tab === 'skills' ? `4 ${t.practice.title}` : tab === 'vocab' ? t.practice.vocabulary : t.practice.grammar}
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'skills' && (
            <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, i) => (
                <GlowCard key={skill.key} glow={skill.glow} delay={i * 0.08} onClick={() => setDrillSkill(skill.key)} className="group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-glow transition-shadow`}>
                    <skill.icon size={26} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.practice[skill.key]}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">{skillDesc[skill.key]}</p>
                  <span className="text-accent-teal text-sm font-bold flex items-center gap-1">{t.practice.startLesson} <Sparkles size={14} /></span>
                </GlowCard>
              ))}
            </motion.div>
          )}

          {activeTab === 'vocab' && (
            <motion.div key="vocab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-teal" size={18} />
                <input
                  type="search"
                  value={vocabSearch}
                  onChange={(e) => { setVocabSearch(e.target.value); setVocabIndex(0); setFlipped(false); }}
                  placeholder={t.practice.searchVocab}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-accent-teal"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <Button variant={vocabCategory === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => { setVocabCategory('all'); setVocabIndex(0); }}>
                  {t.practice.filterAll}
                </Button>
                {vocabCategories.map((cat) => (
                  <Button key={cat} variant={vocabCategory === cat ? 'primary' : 'outline'} size="sm" onClick={() => { setVocabCategory(cat); setVocabIndex(0); }}>
                    {cat}
                  </Button>
                ))}
              </div>

              {!currentWord ? (
                <p className="text-center text-slate-500 py-12">{t.practice.noVocabResults}</p>
              ) : (
              <>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>{t.practice.wordsLearned}: {learnedCount}/{vocabulary.length}</span>
                  <span className="font-bold text-accent-teal">{masteryPct}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-accent-teal to-accent-indigo rounded-full" animate={{ width: `${masteryPct}%` }} />
                </div>
              </div>

              <FlipCard
                flipped={flipped}
                onFlip={() => setFlipped(!flipped)}
                front={
                  <>
                    <p className="text-sm text-slate-500 mb-3">{currentWord.category} • {currentWord.difficulty}</p>
                    <h3 className="text-4xl font-black gradient-text mb-3">{currentWord.word}</h3>
                    <p className="text-slate-500 mb-6">{currentWord.phonetic}</p>
                    <span onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => speak(currentWord.word)} disabled={isSpeaking}>
                        <Volume2 size={16} /> {t.practice.playAudio}
                      </Button>
                    </span>
                    <p className="text-xs text-slate-400 mt-4">{t.practice.tapToFlip}</p>
                  </>
                }
                back={
                  <>
                    <p className="text-lg font-bold text-slate-800 dark:text-white mb-3">{bt(currentWord.meaning)}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic text-center leading-relaxed">"{bt(currentWord.example)}"</p>
                  </>
                }
              />

              <div className="flex flex-wrap gap-2 justify-center mt-6">
                <Button variant="ghost" size="sm" onClick={() => { setFlipped(false); setVocabIndex((vocabIndex - 1 + filteredVocab.length) % filteredVocab.length); }}>
                  <ChevronLeft size={16} /> {t.practice.previousCard}
                </Button>
                <Button variant="outline" size="sm" onClick={() => nextVocab(false)}>
                  <RotateCcw size={16} /> {t.practice.needReview}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => nextVocab(true)}>
                  <Check size={16} /> {t.practice.iKnow}
                </Button>
              </div>
              </>
              )}
            </motion.div>
          )}

          {activeTab === 'grammar' && currentGrammar && (
            <motion.div key="grammar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold text-slate-500">{t.practice.grammar}</span>
                  <span className="px-3 py-1 rounded-full bg-accent-teal/10 text-accent-teal text-sm font-bold">{t.practice.quizScore}: {grammarScore}/{grammarQuestions.length}</span>
                </div>
                <p className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-8 leading-relaxed">{bt(currentGrammar.question)}</p>
                <div className="space-y-3">
                  {currentGrammar.options.map((opt) => {
                    const selected = grammarAnswer === opt.id;
                    const isCorrect = opt.id === currentGrammar.correctAnswer;
                    return (
                      <motion.button
                        key={opt.id}
                        whileHover={{ x: 6 }}
                        disabled={grammarAnswer !== null}
                        onClick={() => {
                          setGrammarAnswer(opt.id);
                          if (opt.id === currentGrammar.correctAnswer) setGrammarScore((s) => s + 1);
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                          grammarAnswer === null ? 'border-slate-200 dark:border-slate-700 hover:border-accent-teal hover:shadow-glow' :
                          selected && isCorrect ? 'border-green-500 bg-green-500/10' :
                          selected ? 'border-red-500 bg-red-500/10' :
                          isCorrect ? 'border-green-500/50' : 'border-slate-200 dark:border-slate-700 opacity-40'
                        }`}
                      >
                        {bt(opt.text)}
                      </motion.button>
                    );
                  })}
                </div>
                {grammarAnswer && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <p className="font-semibold mb-1">{grammarAnswer === currentGrammar.correctAnswer ? t.practice.correct : t.practice.incorrect}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{bt(currentGrammar.explanation)}</p>
                  </motion.div>
                )}
                {grammarAnswer && (
                  <Button className="mt-5" onClick={() => { setGrammarAnswer(null); setGrammarIndex((grammarIndex + 1) % grammarQuestions.length); }}>
                    {t.mock.next}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SkillDrill skill={drillSkill} onClose={() => setDrillSkill(null)} />
      </div>
    </section>
  );
}