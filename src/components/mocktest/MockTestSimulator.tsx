import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, ChevronLeft, ChevronRight, CheckCircle, Mic, PenTool, ClipboardList, Zap, BookOpen, Headphones } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';
import { mockTests } from '../../data/mockTests';
import { calculateBand, calculateOverallBand, evaluateWriting, evaluateSpeaking, countWords, isAnswerCorrect } from '../../utils/scoring';
import { fireHighScoreConfetti } from '../../utils/confetti';
import { GlowCard } from '../ui/GlowCard';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { QuestionNavigator } from './QuestionNavigator';
import { SectionIntro } from './SectionIntro';
import { TestTimer } from './TestTimer';
import { ListeningAudioPlayer } from './ListeningAudioPlayer';
import { Task1Chart } from './Task1Chart';
import type { MockTest, Skill, TestType, ListeningQuestion, ListeningSection } from '../../types';

type TestPhase = 'select' | 'testing' | 'results' | 'review';
type ActiveSection = Skill;

const SECTION_DURATIONS: Record<Skill, number> = {
  listening: 30 * 60,
  reading: 60 * 60,
  writing: 60 * 60,
  speaking: 14 * 60,
};

interface MockTestSimulatorProps {
  initialSkill?: Skill | null;
}

function getListeningSection(sections: ListeningSection[], q: ListeningQuestion): ListeningSection | undefined {
  return sections.find((s) => s.sectionNumber === q.sectionNumber);
}

function getReadingPassageForQuestion(test: MockTest, qId: string) {
  return test.reading.passages.find((p) => p.questions.some((q) => q.id === qId));
}

export function MockTestSimulator({ initialSkill }: MockTestSimulatorProps) {
  const { t, bt } = useLanguage();
  const { progress, recordTestAttempt } = useProgress();
  const recorder = useMediaRecorder();
  const launchSkill = initialSkill ?? null;

  const [phase, setPhase] = useState<TestPhase>(launchSkill ? 'testing' : 'select');
  const [testType, setTestType] = useState<TestType>('academic');
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(launchSkill ? mockTests[0] : null);
  const [section, setSection] = useState<ActiveSection>(launchSkill ?? 'listening');
  const [sectionReady, setSectionReady] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(launchSkill ? SECTION_DURATIONS[launchSkill] : 0);
  const [totalTime, setTotalTime] = useState(launchSkill ? SECTION_DURATIONS[launchSkill] : 0);
  const [paused, setPaused] = useState(false);
  const [writingTaskIdx, setWritingTaskIdx] = useState(0);
  const [writingTexts, setWritingTexts] = useState<Record<string, string>>({});
  const [writingFeedback, setWritingFeedback] = useState<ReturnType<typeof evaluateWriting> | null>(null);
  const [speakingPartIdx, setSpeakingPartIdx] = useState(0);
  const [prepTimeLeft, setPrepTimeLeft] = useState(60);
  const [prepStarted, setPrepStarted] = useState(false);
  const [scores, setScores] = useState<Record<Skill, number>>({ listening: 0, reading: 0, writing: 0, speaking: 0 });
  const [highlights, setHighlights] = useState('');
  const [fullTestMode, setFullTestMode] = useState(true);
  const [completedSections, setCompletedSections] = useState<Set<Skill>>(new Set());
  const [showSkillPicker, setShowSkillPicker] = useState(false);
  const [speakingFeedback, setSpeakingFeedback] = useState<ReturnType<typeof evaluateSpeaking> | null>(null);
  const [writingResults, setWritingResults] = useState<{ task1: ReturnType<typeof evaluateWriting>; task2: ReturnType<typeof evaluateWriting> } | null>(null);
  const [sectionTimeUsed, setSectionTimeUsed] = useState<Record<Skill, number>>({ listening: 0, reading: 0, writing: 0, speaking: 0 });

  const test = selectedTest ?? mockTests.find((m) => m.testType === testType)!;
  const listeningQs = test.listening.questions;
  const readingQs = test.reading.passages.flatMap((p) => p.questions);
  const allObjectiveQs = [...listeningQs, ...readingQs];
  const currentQs = section === 'listening' ? listeningQs : section === 'reading' ? readingQs : [];
  const currentQ = currentQs[qIndex];
  const currentListenSection = currentQ && section === 'listening' ? getListeningSection(test.listening.sections, currentQ) : undefined;
  const currentPassage = currentQ && section === 'reading' ? getReadingPassageForQuestion(test, currentQ.id) : undefined;
  const currentWritingTask = test.writing[writingTaskIdx];
  const currentSpeakingPart = test.speaking[speakingPartIdx];

  useEffect(() => {
    if (phase !== 'testing' || paused || !sectionReady) return;
    const timer = setInterval(() => setTimeLeft((tl) => Math.max(0, tl - 1)), 1000);
    return () => clearInterval(timer);
  }, [phase, paused, sectionReady]);

  useEffect(() => {
    if (!prepStarted || speakingPartIdx !== 1 || prepTimeLeft <= 0) return;
    const timer = setInterval(() => setPrepTimeLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(timer);
  }, [prepStarted, speakingPartIdx, prepTimeLeft]);

  const availableTests = mockTests.filter((m) => m.testType === testType);

  const startTest = (full: boolean, chosen?: MockTest, skill?: Skill) => {
    const m = chosen ?? availableTests[0];
    const sk = full ? 'listening' : (skill ?? initialSkill ?? 'listening');
    setSelectedTest(m);
    setFullTestMode(full);
    setCompletedSections(new Set());
    setShowSkillPicker(false);
    setSection(sk);
    setSectionReady(false);
    setPhase('testing');
    setQIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setWritingTexts({});
    setWritingTaskIdx(0);
    setWritingFeedback(null);
    setWritingResults(null);
    setSpeakingFeedback(null);
    setSectionTimeUsed({ listening: 0, reading: 0, writing: 0, speaking: 0 });
    setSpeakingPartIdx(0);
    setPrepStarted(false);
    setPrepTimeLeft(60);
    const dur = SECTION_DURATIONS[sk];
    setTotalTime(dur);
    setTimeLeft(dur);
    setPaused(false);
  };

  const toggleFlag = () => {
    const qid = currentQs[qIndex]?.id;
    if (!qid) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== 'testing' || !sectionReady || !currentQ) return;
      if (e.key === 'n' || e.key === 'N') setQIndex((i) => Math.min(i + 1, currentQs.length - 1));
      if (e.key === 'p' || e.key === 'P') setQIndex((i) => Math.max(i - 1, 0));
      if (e.key === 'f' || e.key === 'F') {
        const qid = currentQ?.id;
        if (!qid) return;
        setFlagged((prev) => {
          const next = new Set(prev);
          if (next.has(qid)) next.delete(qid);
          else next.add(qid);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, sectionReady, currentQ, currentQs.length, qIndex]);

  const scoreObjective = (qs: ListeningQuestion[]) => {
    let correct = 0;
    qs.forEach((q) => {
      if (isAnswerCorrect(answers[q.id], q.correctAnswer, q.type)) correct++;
    });
    return calculateBand(correct, qs.length);
  };

  const finishTest = () => {
    const finalSectionTime = { ...sectionTimeUsed };
    const currentUsed = Math.max(0, totalTime - timeLeft);
    if (currentUsed > 0) finalSectionTime[section] += currentUsed;

    const listenScore = scoreObjective(listeningQs);
    const readScore = scoreObjective(readingQs);
    const w1 = evaluateWriting(writingTexts[test.writing[0].id] ?? '', test.writing[0].minWords);
    const w2 = evaluateWriting(writingTexts[test.writing[1].id] ?? '', test.writing[1].minWords);
    const writeScore = Math.round(((w1.band + w2.band) / 2) * 2) / 2;
    const speakDuration = finalSectionTime.speaking || currentUsed;
    const speakEval = evaluateSpeaking(recorder.transcript, speakDuration);
    const speakScore = speakEval.band;
    setSpeakingFeedback(speakEval);
    setWritingResults({ task1: w1, task2: w2 });
    const finalScores = { listening: listenScore, reading: readScore, writing: writeScore, speaking: speakScore };
    setScores(finalScores);
    const overall = calculateOverallBand(finalScores);
    const totalTimeSpent = Object.values(finalSectionTime).reduce((s, v) => s + v, 0);
    recordTestAttempt({
      id: crypto.randomUUID(),
      testId: test.id,
      testTitle: bt(test.title),
      testType: test.testType,
      date: new Date().toISOString(),
      scores: finalScores,
      overallBand: overall,
      timeSpent: totalTimeSpent,
      timeBySkill: finalSectionTime,
      answers,
    });
    setPhase('results');
    if (overall >= 7) { fireHighScoreConfetti(); toast.success(t.common.highScore); }
  };

  const canAccessSection = (s: Skill) => {
    if (!fullTestMode) return true;
    const order: Skill[] = ['listening', 'reading', 'writing', 'speaking'];
    const idx = order.indexOf(s);
    if (idx === 0) return true;
    return completedSections.has(order[idx - 1]);
  };

  const goToSection = (s: ActiveSection) => {
    if (!canAccessSection(s)) {
      toast.info(t.mock.sectionLocked);
      return;
    }
    const elapsed = Math.max(0, totalTime - timeLeft);
    if (elapsed > 0) {
      setSectionTimeUsed((prev) => ({ ...prev, [section]: prev[section] + elapsed }));
    }
    const dur = SECTION_DURATIONS[s];
    setSection(s);
    setSectionReady(s === 'writing' || s === 'speaking');
    setQIndex(0);
    setWritingTaskIdx(0);
    setSpeakingPartIdx(0);
    setTotalTime(dur);
    setTimeLeft(dur);
  };

  const nextSection = () => {
    setCompletedSections((prev) => new Set([...prev, section]));
    const order: ActiveSection[] = ['listening', 'reading', 'writing', 'speaking'];
    const idx = order.indexOf(section);
    if (idx < order.length - 1) goToSection(order[idx + 1]);
    else finishTest();
  };

  const renderQuestionInput = (q: ListeningQuestion) => {
    if (q.type === 'fill-in') {
      return (
        <div className="mb-6">
          {q.wordLimit && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-2 uppercase">
              {t.mock.writeNoMoreThan}
            </p>
          )}
          <input
            type="text"
            value={answers[q.id] ?? ''}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-lg font-medium focus:border-accent-teal outline-none"
            placeholder={t.mock.fillAnswer}
          />
        </div>
      );
    }
    if (q.type === 'true-false-ng' || q.type === 'yes-no-ng') {
      const opts = q.type === 'yes-no-ng'
        ? [
            { id: 'yes', label: t.mock.yes },
            { id: 'no', label: t.mock.no },
            { id: 'not given', label: t.mock.notGiven },
          ]
        : [
            { id: 'true', label: t.mock.true },
            { id: 'false', label: t.mock.false },
            { id: 'not given', label: t.mock.notGiven },
          ];
      return (
        <div className="flex flex-wrap gap-3 mb-6">
          {opts.map((opt) => (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAnswers({ ...answers, [q.id]: opt.id })}
              className={`px-6 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                answers[q.id] === opt.id
                  ? 'border-accent-teal bg-accent-teal/10 text-accent-teal'
                  : 'border-slate-200 dark:border-slate-700 hover:border-accent-teal/40'
              }`}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-3 mb-6">
        {q.options?.map((opt) => (
          <motion.button
            key={opt.id}
            whileHover={{ x: 6, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setAnswers({ ...answers, [q.id]: opt.id })}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
              answers[q.id] === opt.id
                ? 'border-accent-teal bg-accent-teal/10 shadow-glow'
                : 'border-slate-200 dark:border-slate-700 hover:border-accent-teal/40'
            }`}
          >
            <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 font-bold mr-3 text-sm">{opt.id.toUpperCase()}</span>
            {bt(opt.text)}
          </motion.button>
        ))}
      </div>
    );
  };

  if (phase === 'select') {
    return (
      <section className="section-padding max-w-7xl mx-auto relative">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="relative">
          <SectionHeader title={t.mock.title} subtitle={`${mockTests.length} ${t.mock.testCount} — ${t.mock.subtitle}`} />
          <div className="flex justify-center gap-3 mb-10">
            {(['academic', 'general'] as TestType[]).map((type) => (
              <Button key={type} variant={testType === type ? 'primary' : 'outline'} onClick={() => setTestType(type)}>
                {type === 'academic' ? t.mock.academic : t.mock.general}
              </Button>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-4 mb-8 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1"><Headphones size={14} className="text-accent-teal" /> {t.mock.listeningSections}</span>
            <span className="flex items-center gap-1"><BookOpen size={14} className="text-accent-indigo" /> {t.mock.readingPassages} · {t.mock.questions40}</span>
            <span className="flex items-center gap-1"><PenTool size={14} className="text-purple-500" /> {t.mock.writingTasks}</span>
            <span className="flex items-center gap-1"><Mic size={14} className="text-rose-500" /> {t.mock.speakingParts}</span>
          </div>

          <h3 className="font-bold text-center mb-5 text-lg">{t.mock.availableTests}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10">
            {availableTests.map((m, i) => (
              <GlowCard key={m.id} glow={i % 2 === 0 ? 'teal' : 'indigo'} delay={i * 0.05} onClick={() => startTest(true, m)} className="!p-6 group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-teal">{m.testType}</span>
                  <span className="text-xs text-slate-400">{m.totalDuration} {t.common.minutes}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-accent-teal transition-colors">{bt(m.title)}</h4>
                <p className="text-xs text-slate-500">{t.mock.ieltsFormat} · L/R 40+40 · W1+W2 · S1–3</p>
                <span className="inline-block mt-4 text-sm font-semibold text-accent-teal">{t.mock.selectTest} →</span>
              </GlowCard>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <GlowCard glow="teal" onClick={() => startTest(true)} className="!p-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-teal to-teal-600 flex items-center justify-center mb-5 shadow-glow">
                <ClipboardList size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.mock.startTest}</h3>
              <p className="text-slate-500 mb-4">{test.totalDuration} {t.common.minutes} · {t.mock.questions40} Listening & Reading</p>
              <span className="text-accent-teal font-semibold text-sm">{t.hero.ctaMock} →</span>
            </GlowCard>
            <GlowCard glow="indigo" onClick={() => setShowSkillPicker(true)} className="!p-8" delay={0.1}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-indigo to-indigo-600 flex items-center justify-center mb-5 shadow-glow-indigo">
                <Zap size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.mock.quickPractice}</h3>
              <p className="text-slate-500 mb-4">{t.mock.selectSkill}</p>
              <span className="text-accent-indigo font-semibold text-sm">{t.practice.startLesson} →</span>
            </GlowCard>
          </div>

          {showSkillPicker && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mt-6 p-6 glass-card rounded-2xl">
              <h4 className="font-bold text-center mb-4">{t.mock.selectSkill}</h4>
              <div className="grid grid-cols-2 gap-3">
                {(['listening', 'reading', 'writing', 'speaking'] as Skill[]).map((sk) => (
                  <Button key={sk} variant="outline" onClick={() => startTest(false, availableTests[0], sk)}>
                    {t.mock[sk]}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => setShowSkillPicker(false)}>{t.common.cancel}</Button>
            </motion.div>
          )}

          {progress.attempts.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 max-w-4xl mx-auto">
              <h3 className="font-bold mb-4 text-center">{t.mock.history}</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {progress.attempts.slice(0, 3).map((a) => (
                  <div key={a.id} className="glass-card rounded-xl p-4 text-center">
                    <div className="text-3xl font-black gradient-text">{a.overallBand}</div>
                    <p className="text-xs text-slate-500 mt-1">{a.testTitle}</p>
                    <p className="text-[10px] text-slate-400">{new Date(a.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    );
  }

  if (phase === 'results') {
    const radarData = [
      { skill: t.practice.listening, score: scores.listening, fullMark: 9 },
      { skill: t.practice.reading, score: scores.reading, fullMark: 9 },
      { skill: t.practice.writing, score: scores.writing, fullMark: 9 },
      { skill: t.practice.speaking, score: scores.speaking, fullMark: 9 },
    ];
    const overall = calculateOverallBand(scores);
    return (
      <section className="section-padding max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="glow-border rounded-3xl mb-8">
            <div className="glass-card rounded-3xl p-10 text-center">
              <h2 className="text-2xl font-bold mb-2">{t.mock.results}</h2>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 150, delay: 0.2 }} className="text-8xl font-black gradient-text my-6">{overall}</motion.div>
              <p className="text-slate-500 text-lg">{t.mock.overallBand}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <GlowCard glow="teal">
              <h3 className="font-bold mb-4">{t.mock.skillBreakdown}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Radar dataKey="score" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.35} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </GlowCard>
            <GlowCard glow="indigo" delay={0.1}>
              <h3 className="font-bold mb-4">{t.mock.suggestions}</h3>
              <ul className="space-y-3">
                {(speakingFeedback?.suggestions ?? [t.feedback.suggestion1, t.feedback.suggestion2, t.feedback.suggestion3]).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle size={18} className="text-accent-teal shrink-0 mt-0.5" />
                    {speakingFeedback ? t.feedback[s as keyof typeof t.feedback] : s}
                  </li>
                ))}
              </ul>
              {speakingFeedback && (
                <p className="text-xs text-slate-500 mt-4">{t.mock.speaking}: Band {speakingFeedback.band}</p>
              )}
            </GlowCard>
          </div>
          {writingResults && (
            <GlowCard glow="indigo" className="mb-8">
              <h3 className="font-bold mb-4">{t.mock.writingRubric}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {([{ label: t.mock.task1, data: writingResults.task1 }, { label: t.mock.task2, data: writingResults.task2 }] as const).map(({ label, data }) => (
                  <div key={label} className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
                    <p className="font-semibold mb-2">{label} — <span className="text-accent-teal">Band {data.band}</span></p>
                    <div className="grid grid-cols-2 gap-2">
                      {data.feedback.map((f) => (
                        <div key={f.category} className="text-xs">
                          <span className="font-semibold">{t.feedback[f.category as keyof typeof t.feedback] ?? f.category}</span>
                          <span className="ml-1 text-accent-teal font-bold">{f.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlowCard>
          )}
          {speakingFeedback && (
            <GlowCard glow="teal" className="mb-8">
              <h3 className="font-bold mb-4">{t.mock.speakingRubric} — Band {speakingFeedback.band}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {speakingFeedback.feedback.map((f) => (
                  <div key={f.category} className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-sm">
                    <span className="font-semibold">{t.feedback[f.category as keyof typeof t.feedback] ?? f.category}</span>
                    <span className="ml-2 text-accent-teal font-bold">{f.score}</span>
                    <p className="text-xs text-slate-500 mt-1">{t.feedback[f.comment as keyof typeof t.feedback]}</p>
                  </div>
                ))}
              </div>
            </GlowCard>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setPhase('review')}>{t.mock.review}</Button>
            <Button variant="secondary" onClick={() => setPhase('select')}>{t.common.back}</Button>
          </div>
        </motion.div>
      </section>
    );
  }

  if (phase === 'review') {
    return (
      <section className="section-padding max-w-3xl mx-auto space-y-4">
        <SectionHeader title={t.mock.review} align="left" />
        {allObjectiveQs.map((q, i) => {
          const correct = isAnswerCorrect(answers[q.id], q.correctAnswer, q.type);
          const displayCorrect = q.type === 'mcq'
            ? q.options?.find((o) => o.id === q.correctAnswer)?.text
            : { en: q.correctAnswer, vi: q.correctAnswer };
          const displayUser = q.type === 'mcq'
            ? q.options?.find((o) => o.id === answers[q.id])?.text
            : { en: answers[q.id] || '—', vi: answers[q.id] || '—' };
          return (
            <motion.div key={q.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
              <GlowCard glow="none" className={`!p-5 ${correct ? '!border-green-500/30' : '!border-red-500/30'}`}>
                <p className="text-xs text-slate-400 mb-1">Q{q.questionNumber}</p>
                <p className="font-medium mb-2">{bt(q.question)}</p>
                <p className="text-sm">{t.mock.yourAnswer}: <span className="font-semibold">{displayUser ? bt(displayUser) : '—'}</span></p>
                <p className="text-sm text-green-600 dark:text-green-400">{t.mock.correctAnswer}: {displayCorrect ? bt(displayCorrect) : q.correctAnswer}</p>
                <p className="text-sm text-slate-500 mt-2">{bt(q.explanation)}</p>
              </GlowCard>
            </motion.div>
          );
        })}
        <Button onClick={() => setPhase('select')}>{t.common.back}</Button>
      </section>
    );
  }

  if (!sectionReady && (section === 'listening' || section === 'reading')) {
    return (
      <section className="section-padding">
        <SectionIntro section={section} onStart={() => setSectionReady(true)} />
      </section>
    );
  }

  return (
    <section className="section-padding max-w-6xl mx-auto">
      <TestTimer timeLeft={timeLeft} totalTime={totalTime} paused={paused} onTogglePause={() => setPaused(!paused)} />

      <div className="flex gap-2 my-6 overflow-x-auto pb-2">
        {(['listening', 'reading', 'writing', 'speaking'] as Skill[]).map((s) => {
          const locked = fullTestMode && !canAccessSection(s);
          return (
            <Button
              key={s}
              size="sm"
              variant={section === s ? 'primary' : 'ghost'}
              onClick={() => goToSection(s)}
              disabled={locked}
              className={locked ? 'opacity-40' : ''}
            >
              {t.mock[s]}{completedSections.has(s) ? ' ✓' : ''}
            </Button>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 mb-4">{t.mock.keyboardShortcuts}</p>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {section === 'listening' && currentListenSection && (
          <div
            key={`listen-audio-${test.id}-s${currentListenSection.sectionNumber}`}
            className="lg:col-span-2 mb-2 p-5 rounded-2xl glass-card border border-accent-teal/20 bg-gradient-to-r from-teal-500/10 to-indigo-500/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Headphones size={16} className="text-accent-teal" />
              <span className="text-sm font-bold text-accent-teal">
                {t.mock.sectionLabel} {currentListenSection.sectionNumber}: {bt(currentListenSection.title)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">{bt(currentListenSection.context)}</p>
            <ListeningAudioPlayer
              transcript={currentListenSection.transcript.en}
              sectionKey={`${test.id}-s${currentListenSection.sectionNumber}`}
              paused={paused}
            />
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-accent-teal font-medium">{t.mock.readTranscript}</summary>
              <p className="text-sm mt-2 text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{bt(currentListenSection.transcript)}</p>
            </details>
          </div>
        )}

        <AnimatePresence mode="wait">
          {(section === 'listening' || section === 'reading') && currentQ && (
            <motion.div key={`${section}-${qIndex}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6">
                {section === 'reading' && currentPassage && (
                  <div className="mb-6 p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 max-h-64 overflow-y-auto text-sm leading-relaxed border border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-xs font-bold text-accent-indigo mb-2">
                      {t.mock.passageLabel} {test.reading.passages.indexOf(currentPassage) + 1}: {bt(currentPassage.title)}
                    </p>
                    <p className="select-text" onMouseUp={() => { const sel = window.getSelection()?.toString(); if (sel) setHighlights(sel); }}>{bt(currentPassage.content)}</p>
                    {highlights && <p className="highlight-text mt-2 text-xs">{t.mock.highlight}: {highlights}</p>}
                  </div>
                )}

                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-semibold text-slate-500">
                    {t.mock.question} {currentQ.questionNumber} {t.mock.of} {currentQs.length}
                  </span>
                  <div className="w-40 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-accent-teal to-accent-indigo rounded-full" animate={{ width: `${((qIndex + 1) / currentQs.length) * 100}%` }} />
                  </div>
                </div>

                <p className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">{bt(currentQ.question)}</p>
                {renderQuestionInput(currentQ)}

                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setQIndex(Math.max(0, qIndex - 1))}><ChevronLeft size={16} />{t.mock.previous}</Button>
                  <Button variant="ghost" size="sm" onClick={toggleFlag}>
                    <Flag size={16} className={flagged.has(currentQ.id) ? 'fill-yellow-400 text-yellow-400' : ''} />
                    {flagged.has(currentQ.id) ? t.mock.unflag : t.mock.flag}
                  </Button>
                  {qIndex < currentQs.length - 1 ? (
                    <Button size="sm" onClick={() => setQIndex(qIndex + 1)}>{t.mock.next}<ChevronRight size={16} /></Button>
                  ) : (
                    <Button size="sm" onClick={nextSection}>{t.mock.sectionComplete} →</Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {section === 'writing' && currentWritingTask && (
            <motion.div key={`writing-${writingTaskIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex gap-2 mb-6">
                  {test.writing.map((wt, i) => (
                    <button
                      key={wt.id}
                      onClick={() => { setWritingTaskIdx(i); setWritingFeedback(null); }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${writingTaskIdx === i ? 'bg-purple-500 text-white' : 'glass-card text-slate-500'}`}
                    >
                      {wt.taskNumber === 1 ? t.mock.task1 : t.mock.task2}
                      <span className="ml-1 opacity-70">({wt.minWords}+)</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <PenTool size={20} className="text-purple-500" />
                  <h3 className="font-bold text-lg">
                    {currentWritingTask.taskNumber === 1 ? t.mock.task1 : t.mock.task2} — {currentWritingTask.testType}
                  </h3>
                </div>
                <p className="mb-5 text-slate-700 dark:text-slate-300 leading-relaxed">{bt(currentWritingTask.prompt)}</p>
                {currentWritingTask.chart && <Task1Chart chart={currentWritingTask.chart} />}
                <textarea
                  value={writingTexts[currentWritingTask.id] ?? ''}
                  onChange={(e) => setWritingTexts({ ...writingTexts, [currentWritingTask.id]: e.target.value })}
                  className="w-full h-72 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 resize-none focus:border-accent-teal focus:shadow-glow outline-none transition-all text-base leading-relaxed"
                />
                <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${countWords(writingTexts[currentWritingTask.id] ?? '') >= currentWritingTask.minWords ? 'bg-green-500/20 text-green-600' : 'bg-orange-500/20 text-orange-600'}`}>
                    {countWords(writingTexts[currentWritingTask.id] ?? '')} / {currentWritingTask.minWords} {t.mock.wordCount.toLowerCase()}
                  </div>
                  <Button size="sm" onClick={() => setWritingFeedback(evaluateWriting(writingTexts[currentWritingTask.id] ?? '', currentWritingTask.minWords))}>{t.mock.submitFeedback}</Button>
                </div>
                {writingFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-purple-500/5 to-teal-500/5 border border-purple-500/20">
                    <h4 className="font-bold mb-3">{t.mock.feedbackTitle} — <span className="gradient-text">Band {writingFeedback.band}</span></h4>
                    <div className="grid sm:grid-cols-2 gap-2 mb-4">
                      {writingFeedback.feedback.map((f) => (
                        <div key={f.category} className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm">
                          <span className="font-semibold">{t.feedback[f.category as keyof typeof t.feedback] ?? f.category}</span>
                          <span className="ml-2 text-accent-teal font-bold">{f.score}</span>
                          <p className="text-xs text-slate-500 mt-1">{t.feedback[f.comment as keyof typeof t.feedback]}</p>
                        </div>
                      ))}
                    </div>
                    {writingFeedback.suggestions.map((s, i) => (
                      <p key={i} className="text-sm text-slate-600 dark:text-slate-400 mb-1">• {t.feedback[s as keyof typeof t.feedback]}</p>
                    ))}
                    <details className="mt-3"><summary className="cursor-pointer text-accent-teal text-sm font-medium">{t.mock.modelAnswer}</summary><p className="text-sm mt-2 leading-relaxed">{bt(currentWritingTask.modelAnswer)}</p></details>
                  </motion.div>
                )}
                {writingTaskIdx < test.writing.length - 1 ? (
                  <Button className="mt-5" onClick={() => { setWritingTaskIdx(1); setWritingFeedback(null); }}>{t.mock.continueTo} {t.mock.task2}</Button>
                ) : (
                  <Button className="mt-5" onClick={nextSection}>{t.mock.continueTo} {t.mock.speaking}</Button>
                )}
              </div>
            </motion.div>
          )}

          {section === 'speaking' && currentSpeakingPart && (
            <motion.div key={`speaking-${speakingPartIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Mic size={20} className="text-rose-500" />
                  <h3 className="font-bold text-lg">{bt(currentSpeakingPart.title)}</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">{t.mock.part} {currentSpeakingPart.part}</p>

                {currentSpeakingPart.part === 1 && (
                  <div className="space-y-3 mb-6">
                    {currentSpeakingPart.questions.map((q, i) => (
                      <p key={i} className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-sm"><span className="font-bold text-accent-teal mr-2">Q{i + 1}.</span>{bt(q)}</p>
                    ))}
                  </div>
                )}

                {currentSpeakingPart.part === 2 && (
                  <div className="mb-6 p-5 rounded-2xl border-2 border-dashed border-rose-300 dark:border-rose-700">
                    <p className="font-bold text-lg mb-3">{bt(currentSpeakingPart.questions[0])}</p>
                    {currentSpeakingPart.cueCardPoints && (
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 mb-4">
                        {currentSpeakingPart.cueCardPoints.map((pt, i) => <li key={i}>{bt(pt)}</li>)}
                      </ul>
                    )}
                    {!prepStarted ? (
                      <Button onClick={() => setPrepStarted(true)}>{t.mock.prepTime} (1 min)</Button>
                    ) : prepTimeLeft > 0 ? (
                      <p className="text-2xl font-black text-rose-500">{t.mock.prepTime}: {prepTimeLeft}s</p>
                    ) : (
                      <p className="font-bold text-accent-teal">{t.mock.speakNow}</p>
                    )}
                  </div>
                )}

                {currentSpeakingPart.part === 3 && (
                  <div className="space-y-3 mb-6">
                    {currentSpeakingPart.questions.map((q, i) => (
                      <p key={i} className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-sm italic">{bt(q)}</p>
                    ))}
                  </div>
                )}

                <div className="flex justify-center mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={recorder.isRecording ? recorder.stopRecording : recorder.startRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${recorder.isRecording ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/40' : 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-glow'}`}
                  >
                    <Mic size={32} className="text-white" />
                  </motion.button>
                </div>
                <p className="text-center text-sm text-slate-500 mb-4">{recorder.isRecording ? t.mock.stopRecord : t.mock.record}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {recorder.audioUrl && <Button variant="ghost" size="sm" onClick={() => new Audio(recorder.audioUrl!).play()}>{t.mock.playback}</Button>}
                  <Button variant="secondary" size="sm" onClick={recorder.transcribe}>{t.mock.transcribe}</Button>
                </div>
                {recorder.transcript && <p className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm mb-4 italic">&ldquo;{recorder.transcript}&rdquo;</p>}
                <details><summary className="cursor-pointer text-accent-teal text-sm font-medium">{t.mock.modelAnswer}</summary><p className="text-sm mt-2 leading-relaxed">{bt(currentSpeakingPart.sampleAnswer)}</p></details>

                {speakingPartIdx < test.speaking.length - 1 ? (
                  <Button className="mt-5 w-full" onClick={() => { setSpeakingPartIdx(speakingPartIdx + 1); setPrepStarted(false); setPrepTimeLeft(60); recorder.stopRecording?.(); }}>
                    {t.mock.continueTo} {t.mock.part} {test.speaking[speakingPartIdx + 1].part}
                  </Button>
                ) : (
                  <Button className="mt-5 w-full" size="lg" onClick={finishTest}>{t.mock.submit}</Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(section === 'listening' || section === 'reading') && currentQs.length > 0 && (
          <>
            <div className="lg:hidden mt-4">
              <QuestionNavigator
                total={currentQs.length}
                current={qIndex}
                answers={answers}
                flagged={flagged}
                questionIds={currentQs.map((q) => q.id)}
                onSelect={setQIndex}
                compact
              />
            </div>
            <div className="hidden lg:block">
              <QuestionNavigator
                total={currentQs.length}
                current={qIndex}
                answers={answers}
                flagged={flagged}
                questionIds={currentQs.map((q) => q.id)}
                onSelect={setQIndex}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}