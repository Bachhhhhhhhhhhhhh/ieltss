import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAssistant } from '../../context/AssistantContext';
import { assistantQA, findAssistantAnswer } from '../../data/assistant';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

function replyDelayMs() {
  return 600 + Math.random() * 400;
}

export function IELTSAssistant() {
  const { t, bt, lang } = useLanguage();
  const { isOpen, pendingQuestion, clearPendingQuestion, closeAssistant, toggleAssistant } = useAssistant();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = useCallback((text: string) => {
    if (!text.trim()) return;
    const answer = findAssistantAnswer(text, lang);
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', text: bt(answer.answer) }]);
      setTyping(false);
    }, replyDelayMs());
  }, [lang, bt]);

  useEffect(() => {
    if (!isOpen || !pendingQuestion) return;
    const q = pendingQuestion;
    clearPendingQuestion();
    const timer = setTimeout(() => send(q), 0);
    return () => clearTimeout(timer);
  }, [isOpen, pendingQuestion, clearPendingQuestion, send]);

  const suggested = assistantQA.slice(0, 5);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleAssistant}
        aria-label={t.lookup.assistant}
        className="fixed bottom-24 lg:bottom-8 right-6 z-50 group"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-accent-teal/30 blur-md"
        />
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-accent-teal to-accent-indigo text-white shadow-glow-lg flex items-center justify-center">
          <MessageCircle size={26} />
        </div>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">?</span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none" onClick={closeAssistant} />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-40 lg:bottom-24 right-4 left-4 sm:left-auto z-50 sm:w-[420px] glow-border rounded-3xl"
            >
              <div className="glass-card rounded-3xl flex flex-col max-h-[70vh] overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-accent-teal/10 to-accent-indigo/10 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        {t.lookup.assistant} <Sparkles size={14} className="text-accent-teal" />
                      </h3>
                      <p className="text-[10px] text-slate-500">{t.lookup.assistantDesc}</p>
                    </div>
                  </div>
                  <button onClick={closeAssistant} aria-label={t.common.close} className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50">
                    <X size={18} />
                  </button>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[240px] max-h-[50vh]">
                  {messages.length === 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">{t.lookup.suggestedQuestions}</p>
                      <div className="space-y-2">
                        {suggested.map((q) => (
                          <motion.button
                            key={q.id}
                            whileHover={{ x: 4 }}
                            onClick={() => send(bt(q.question))}
                            className="block w-full text-left text-sm p-3 rounded-xl glass-card hover:shadow-glow transition-shadow"
                          >
                            {bt(q.question)}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-accent-teal to-teal-600 text-white rounded-br-sm shadow-glow'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {typing && (
                    <div className="flex gap-1 p-3">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-2 h-2 rounded-full bg-accent-teal" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send(input)}
                    placeholder={t.lookup.typeMessage}
                    aria-label={t.lookup.typeMessage}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-accent-teal focus:shadow-glow transition-all"
                  />
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => send(input)} aria-label={t.lookup.send} className="p-3 rounded-xl bg-gradient-to-r from-accent-teal to-teal-600 text-white shadow-glow">
                    <Send size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

