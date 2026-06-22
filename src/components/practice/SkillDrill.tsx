import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, BookOpen, PenTool, Mic, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';
import { mockTests } from '../../data/mockTests';
import { countWords, isAnswerCorrect } from '../../utils/scoring';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AudioWaveform } from '../mocktest/AudioWaveform';
import type { Skill, ListeningQuestion } from '../../types';

const meta: Record<Skill, { icon: typeof Headphones; color: string }> = {
  listening: { icon: Headphones, color: 'from-teal-500 to-teal-600' },
  reading: { icon: BookOpen, color: 'from-indigo-500 to-indigo-600' },
  writing: { icon: PenTool, color: 'from-purple-500 to-purple-600' },
  speaking: { icon: Mic, color: 'from-rose-500 to-rose-600' },
};

interface SkillDrillProps {
  skill: Skill | null;
  onClose: () => void;
}

function getDrillQuestions(skill: Skill, testIdx: number): ListeningQuestion[] {
  const test = mockTests[testIdx % mockTests.length];
  if (skill === 'listening') return test.listening.questions.slice(0, 5);
  if (skill === 'reading') return test.reading.passages.flatMap((p) => p.questions).slice(0, 5);
  return [];
}

export function SkillDrill({ skill, onClose }: SkillDrillProps) {
  const { t, bt } = useLanguage();
  const { addTimeSpent } = useProgress();
  const { speak, isSpeaking } = useSpeech();
  const recorder = useMediaRecorder();
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState('');
  const [writing, setWriting] = useState('');
  const [done, setDone] = useState(false);

  const [testIdx] = useState(() => Math.floor(Date.now() / 86400000) % mockTests.length);
  const test = mockTests[testIdx];
  const drillQs = skill ? getDrillQuestions(skill, testIdx) : [];
  const currentQ = drillQs[step];
  const listenSection = currentQ?.sectionNumber
    ? test.listening.sections.find((s) => s.sectionNumber === currentQ.sectionNumber)
    : undefined;
  const readPassage = skill === 'reading' && currentQ
    ? test.reading.passages.find((p) => p.questions.some((q) => q.id === currentQ.id))
    : undefined;

  if (!skill) return null;

  const Icon = meta[skill].icon;

  const finish = () => {
    addTimeSpent(skill, 10);
    setDone(true);
  };

  const checkAnswer = (q: ListeningQuestion, userAns: string) =>
    isAnswerCorrect(userAns, q.correctAnswer, q.type);

  const renderQuestionInput = (q: ListeningQuestion) => {
    if (q.type === 'fill-in') {
      return (
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mb-4 focus:border-accent-teal outline-none"
          placeholder={t.mock.fillAnswer}
        />
      );
    }
    if (q.type === 'true-false-ng' || q.type === 'yes-no-ng') {
      const opts = q.type === 'yes-no-ng'
        ? (['yes', 'no', 'not given'] as const)
        : (['true', 'false', 'not given'] as const);
      return (
        <div className="flex flex-wrap gap-2 mb-4">
          {opts.map((opt) => (
            <button
              key={opt}
              onClick={() => setAnswer(opt)}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-bold ${answer === opt ? 'border-accent-teal bg-accent-teal/10' : 'border-slate-200 dark:border-slate-700'}`}
            >
              {opt === 'true' ? t.mock.true : opt === 'false' ? t.mock.false : opt === 'yes' ? t.mock.yes : opt === 'no' ? t.mock.no : t.mock.notGiven}
            </button>
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-2 mb-4">
        {q.options?.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setAnswer(opt.id)}
            className={`w-full text-left p-3 rounded-xl border-2 ${answer === opt.id ? 'border-accent-teal bg-accent-teal/10' : 'border-slate-200 dark:border-slate-700'}`}
          >
            {opt.id.toUpperCase()}. {bt(opt.text)}
          </button>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (done) {
      return (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold gradient-text mb-2">{t.practice.drillComplete}</h3>
          <p className="text-slate-500">{t.practice.drillCompleteDesc}</p>
          <Button className="mt-6" onClick={onClose}>{t.common.close}</Button>
        </motion.div>
      );
    }

    switch (skill) {
      case 'listening':
        return currentQ ? (
          <>
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6">
              <AudioWaveform active={isSpeaking} />
              <Button size="sm" className="mt-3" onClick={() => speak(bt(listenSection?.transcript ?? test.listening.sections[0].transcript))} disabled={isSpeaking}>
                <Volume2 size={16} /> {t.mock.playAudio}
              </Button>
            </div>
            <p className="font-medium mb-4">{bt(currentQ.question)}</p>
            {renderQuestionInput(currentQ)}
            {answer && (
              <div className={`p-3 rounded-xl mb-4 text-sm ${checkAnswer(currentQ, answer) ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                {checkAnswer(currentQ, answer) ? t.practice.correct : t.practice.incorrect} — {bt(currentQ.explanation)}
              </div>
            )}
            <Button disabled={!answer} onClick={() => step < drillQs.length - 1 ? (setStep(step + 1), setAnswer('')) : finish()}>
              {step < drillQs.length - 1 ? t.mock.next : t.practice.finishDrill}
            </Button>
          </>
        ) : null;

      case 'reading':
        return currentQ && readPassage ? (
          <>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 max-h-36 overflow-y-auto text-sm mb-6 leading-relaxed">
              <p className="text-xs font-bold text-accent-indigo mb-2">{bt(readPassage.title)}</p>
              {bt(readPassage.content)}
            </div>
            <p className="font-medium mb-4">{bt(currentQ.question)}</p>
            {renderQuestionInput(currentQ)}
            {answer && (
              <div className={`p-3 rounded-xl mb-4 text-sm ${checkAnswer(currentQ, answer) ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                {checkAnswer(currentQ, answer) ? t.practice.correct : t.practice.incorrect} — {bt(currentQ.explanation)}
              </div>
            )}
            <Button disabled={!answer} onClick={() => step < drillQs.length - 1 ? (setStep(step + 1), setAnswer('')) : finish()}>
              {step < drillQs.length - 1 ? t.mock.next : t.practice.finishDrill}
            </Button>
          </>
        ) : null;

      case 'writing':
        return (
          <>
            <p className="text-sm mb-4 leading-relaxed">{bt(test.writing[1].prompt)}</p>
            <textarea
              value={writing}
              onChange={(e) => setWriting(e.target.value)}
              className="w-full h-48 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 resize-none focus:border-purple-500 outline-none"
            />
            <p className="text-sm mt-2 mb-4 text-slate-500">{countWords(writing)} {t.mock.wordCount.toLowerCase()}</p>
            <Button disabled={countWords(writing) < 50} onClick={finish}>{t.practice.finishDrill}</Button>
          </>
        );

      case 'speaking':
        return (
          <>
            <p className="mb-6">{bt(test.speaking[1].questions[0])}</p>
            <div className="flex justify-center mb-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={recorder.isRecording ? recorder.stopRecording : recorder.startRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${recorder.isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-br from-rose-500 to-rose-600'}`}
              >
                <Mic size={28} className="text-white" />
              </motion.button>
            </div>
            {recorder.transcript && <p className="text-sm italic text-center mb-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">"{recorder.transcript}"</p>}
            <div className="flex gap-2 justify-center mb-4">
              <Button variant="secondary" size="sm" onClick={recorder.transcribe}>{t.mock.transcribe}</Button>
            </div>
            <Button onClick={finish} disabled={!recorder.audioUrl && !recorder.transcript}>{t.practice.finishDrill}</Button>
          </>
        );
    }
  };

  return (
    <Modal isOpen={!!skill} onClose={onClose} size="lg">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta[skill].color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{t.practice[skill]} — {t.practice.quickDrill}</h3>
          <p className="text-xs text-slate-500">{t.practice.drillDesc} · {bt(test.title)}</p>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={`${skill}-${step}-${done}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}