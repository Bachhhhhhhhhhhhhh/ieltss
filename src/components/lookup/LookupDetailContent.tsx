import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Check, MessageSquare, Link2, Clock, Star, Zap, Bookmark, BookmarkCheck,
  Lightbulb, AlertTriangle, Target, Volume2, Maximize2, X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeech } from '../../hooks/useSpeech';
import { splitHighlight, type LookupResult, type LookupDetail, type LookupDetailSection } from '../../utils/lookupSearch';

function HighlightedText({ text, query, className }: { text: string; query: string; className?: string }) {
  const segments = useMemo(() => splitHighlight(text, query), [text, query]);
  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark key={i} className="bg-accent-teal/25 text-accent-teal dark:text-teal-300 rounded px-0.5 font-semibold">{seg.text}</mark>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </span>
  );
}

function DetailSection({ section, query }: { section: LookupDetailSection; query: string }) {
  const { t } = useLanguage();

  if (section.kind === 'article') {
    return (
      <div className="space-y-6">
        {section.sections.map((s, i) => (
          <div key={i} className={s.title ? 'pl-4 border-l-2 border-accent-teal/30' : ''}>
            {s.title && <h4 className="font-bold text-slate-900 dark:text-white mb-2"><HighlightedText text={s.title} query={query} /></h4>}
            <p className="text-slate-600 dark:text-slate-300 leading-[1.75] whitespace-pre-line text-[15px]"><HighlightedText text={s.body.trim()} query={query} /></p>
          </div>
        ))}
      </div>
    );
  }

  if (section.kind === 'guide') {
    return (
      <div className="space-y-4">
        {[
          { icon: Lightbulb, label: t.lookup.guideTips, text: section.tips, bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50', color: 'text-emerald-700 dark:text-emerald-400' },
          { icon: AlertTriangle, label: t.lookup.guideTraps, text: section.traps, bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/50', color: 'text-amber-700 dark:text-amber-400' },
          { icon: Target, label: t.lookup.guideStrategy, text: section.strategy, bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/50', color: 'text-indigo-700 dark:text-indigo-400' },
        ].map((block) => (
          <div key={block.label} className={`p-4 rounded-xl border ${block.bg}`}>
            <div className={`flex items-center gap-2 mb-2 font-bold text-sm ${block.color}`}>
              <block.icon size={16} /> {block.label}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-[1.75] whitespace-pre-line"><HighlightedText text={block.text} query={query} /></p>
          </div>
        ))}
        {section.example && (
          <div className="p-4 rounded-xl glass-card">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t.lookup.example}</p>
            <p className="text-sm italic text-slate-600 dark:text-slate-300"><HighlightedText text={section.example} query={query} /></p>
          </div>
        )}
      </div>
    );
  }

  if (section.kind === 'vocab') {
    return (
      <div className="space-y-4">
        {section.phonetic && <p className="text-lg font-mono text-accent-teal/80">{section.phonetic}</p>}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">{t.lookup.meaning}</p>
          <p className="leading-relaxed"><HighlightedText text={section.meaning} query={query} /></p>
        </div>
        {section.collocation && (
          <div className="p-4 rounded-xl bg-accent-teal/5 border border-accent-teal/20">
            <p className="text-xs font-bold uppercase text-accent-teal mb-1">{t.lookup.collocationLabel}</p>
            <p className="text-accent-teal font-semibold"><HighlightedText text={section.collocation} query={query} /></p>
          </div>
        )}
        <p className="text-sm italic border-l-2 border-accent-indigo/30 pl-4"><HighlightedText text={section.example} query={query} /></p>
      </div>
    );
  }

  if (section.kind === 'phrase' || section.kind === 'collocation') {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">{t.lookup.meaning}</p>
          <p><HighlightedText text={section.meaning} query={query} /></p>
        </div>
        <p className="text-sm italic border-l-2 pl-4"><HighlightedText text={section.example} query={query} /></p>
      </div>
    );
  }

  if (section.kind === 'qa') {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-br from-accent-teal/5 to-accent-indigo/5 border border-accent-teal/15">
        <p className="leading-[1.8] whitespace-pre-line text-[15px]"><HighlightedText text={section.answer} query={query} /></p>
      </div>
    );
  }

  return <p className="leading-relaxed whitespace-pre-line"><HighlightedText text={section.content} query={query} /></p>;
}

interface LookupDetailContentProps {
  item: LookupResult;
  detail: LookupDetail;
  query: string;
  typeLabel: string;
  categoryLabel: string;
  copied: boolean;
  bookmarked: boolean;
  relatedItems: LookupResult[];
  onCopy: () => void;
  onBookmark: () => void;
  onAskAssistant: () => void;
  onGoResources?: () => void;
  onSelectRelated: (item: LookupResult) => void;
  compact?: boolean;
}

export function LookupDetailContent({
  item, detail, query, typeLabel, categoryLabel, copied, bookmarked,
  relatedItems, onCopy, onBookmark, onAskAssistant, onGoResources, onSelectRelated, compact,
}: LookupDetailContentProps) {
  const { t, lang } = useLanguage();
  const { speak, isSpeaking } = useSpeech();
  const [focusMode, setFocusMode] = useState(false);
  const QualityIcon = item.quality === 'essential' ? Star : item.quality === 'recommended' ? Zap : null;
  const canSpeak = item.type === 'vocab' || item.type === 'collocation' || item.type === 'phrase';
  const canFocus = item.type === 'article' || item.type === 'guide' || item.type === 'assistant';

  return (
    <div className={compact ? 'text-sm' : ''}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-bold uppercase text-accent-teal px-2 py-1 rounded-full bg-accent-teal/10">{typeLabel}</span>
        <span className="text-xs font-bold uppercase text-accent-indigo px-2 py-1 rounded-full bg-accent-indigo/10">{categoryLabel}</span>
        <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {detail.readingMinutes} {t.lookup.minRead}</span>
        {QualityIcon && item.quality !== 'standard' && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 flex items-center gap-1">
            <QualityIcon size={10} /> {item.quality === 'essential' ? t.lookup.essential : t.lookup.recommended}
          </span>
        )}
      </div>

      {detail.sections.map((section, i) => (
        <DetailSection key={i} section={section} query={query} />
      ))}

      {relatedItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <p className="text-xs font-bold text-slate-500 mb-2">{t.lookup.related}</p>
          <div className="flex flex-wrap gap-2">
            {relatedItems.map((r) => (
              <button key={`${r.type}-${r.id}`} type="button" onClick={() => onSelectRelated(r)} className="text-xs px-3 py-1.5 rounded-lg glass-card hover:text-accent-teal truncate max-w-[180px]">
                {r.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-200/50">
        {canFocus && (
          <button type="button" onClick={() => setFocusMode(true)} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl glass-card hover:bg-accent-indigo/10 text-accent-indigo">
            <Maximize2 size={14} /> {t.lookup.readingFocus}
          </button>
        )}
        {canSpeak && (
          <button
            type="button"
            onClick={() => speak(item.title, lang === 'vi' ? 'vi-VN' : 'en-US')}
            className={`inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl ${isSpeaking ? 'bg-accent-teal text-white' : 'glass-card hover:bg-accent-teal/10'}`}
          >
            <Volume2 size={14} /> {t.lookup.listen}
          </button>
        )}
        <button type="button" onClick={onCopy} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl glass-card hover:bg-accent-teal/10">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t.lookup.copied : t.lookup.copy}
        </button>
        <button type="button" onClick={onBookmark} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl glass-card hover:bg-accent-teal/10">
          {bookmarked ? <BookmarkCheck size={14} className="text-accent-teal" /> : <Bookmark size={14} />}
          {bookmarked ? t.lookup.saved : t.lookup.save}
        </button>
        <button type="button" onClick={onAskAssistant} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-accent-teal/10 text-accent-teal font-semibold">
          <MessageSquare size={14} /> {t.lookup.askAssistant}
        </button>
        {onGoResources && (
          <button type="button" onClick={onGoResources} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl glass-card">
            <Link2 size={14} /> {t.lookup.viewInResources}
          </button>
        )}
      </div>

      <AnimatePresence>
        {focusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white/98 dark:bg-slate-950/98 backdrop-blur-sm overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto px-6 py-10">
              <div className="flex items-start justify-between mb-8 sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur py-4 -mx-2 px-2">
                <div>
                  <p className="text-xs font-bold uppercase text-accent-teal mb-1">{typeLabel}</p>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{detail.heading}</h2>
                </div>
                <button type="button" onClick={() => setFocusMode(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0">
                  <X size={20} />
                </button>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none text-[17px] leading-[1.85]">
                {detail.sections.map((section, i) => (
                  <DetailSection key={i} section={section} query={query} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}