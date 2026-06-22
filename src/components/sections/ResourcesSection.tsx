import { useState, useMemo, useCallback } from 'react';
import { RESOURCES_TAB_KEY } from '../../utils/lookupSearch';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, FileText, Award, PenLine, Play, BookOpen, Clock, User, Filter,
  Globe, MessageSquare, Calendar, ChevronDown, ChevronUp, Lightbulb, Link2, Search, LayoutTemplate,
  Layers, Library, HelpCircle, AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { knowledgeBase } from '../../data/knowledgeBase';
import { bandDescriptors } from '../../data/bandDescriptors';
import { mockTests } from '../../data/mockTests';
import { videoLibrary } from '../../data/videos';
import { bookLibrary } from '../../data/books';
import { webResources } from '../../data/webResources';
import { phraseBank } from '../../data/phraseBank';
import { studyPlans } from '../../data/studyPlans';
import { speakingSamples } from '../../data/speakingSamples';
import { writingTemplates } from '../../data/writingTemplates';
import { officialLinks } from '../../data/officialLinks';
import { collocations } from '../../data/collocations';
import { topicVocabulary } from '../../data/topicVocabulary';
import { questionTypeGuides } from '../../data/questionTypeGuides';
import { writingSamplesExtra } from '../../data/writingSamplesExtra';
import { SectionHeader } from '../ui/SectionHeader';
import { GlowCard } from '../ui/GlowCard';
import { VideoModal } from '../ui/VideoModal';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { resourceStats } from '../../data/resourceStats';
import type { Skill, KnowledgeArticle, TopicVocabulary } from '../../types';

const PAGE_SIZE = 24;

type Tab = 'knowledge' | 'collocations' | 'topicVocab' | 'questionGuides' | 'videos' | 'books' | 'tools' | 'phrases' | 'plans' | 'templates' | 'bands' | 'samples';
type SampleSubTab = 'writing' | 'speaking';
type KnowledgeCategory = 'all' | 'format' | 'scoring' | 'tips' | 'preparation' | 'vocabulary';

const skillColors: Record<string, string> = {
  all: 'from-accent-teal to-accent-indigo',
  listening: 'from-teal-500 to-teal-600',
  reading: 'from-indigo-500 to-indigo-600',
  writing: 'from-purple-500 to-purple-600',
  speaking: 'from-rose-500 to-rose-600',
};

const webTypeIcons: Record<string, string> = {
  website: '🌐', app: '📱', podcast: '🎧', tool: '🔧', community: '👥', free: '📚',
};

function TopicVocabCard({ topic, expanded, onToggle, delay, bt, t }: {
  topic: TopicVocabulary;
  expanded: boolean;
  onToggle: () => void;
  delay: number;
  bt: (x: { en: string; vi: string }) => string;
  t: ReturnType<typeof useLanguage>['t'];
}) {
  return (
    <GlowCard glow="teal" delay={delay}>
      <button type="button" onClick={onToggle} className="w-full text-left">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Library size={18} className="text-accent-teal" />
              <span className="text-xs font-bold text-accent-teal">{topic.words.length} {t.resources.words}</span>
            </div>
            <h4 className="font-bold text-lg">{bt(topic.title)}</h4>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{bt(topic.studyTips)}</p>
          </div>
          {expanded ? <ChevronUp className="text-slate-400 shrink-0" /> : <ChevronDown className="text-slate-400 shrink-0" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
              <div className="grid sm:grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs">
                <p className="flex items-start gap-1"><Lightbulb size={12} className="text-amber-500 shrink-0 mt-0.5" /><span><strong>{t.resources.studyTips}:</strong> {bt(topic.studyTips)}</span></p>
                <p className="flex items-start gap-1"><AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" /><span><strong>{t.resources.commonTraps}:</strong> {bt(topic.commonTraps)}</span></p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 pr-3">Word</th>
                      <th className="pb-2 pr-3">{t.resources.wordClass}</th>
                      <th className="pb-2 pr-3">{t.resources.meaning}</th>
                      <th className="pb-2">{t.resources.collocation}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topic.words.map((w, wi) => (
                      <tr key={`${topic.id}-${w.word}-${wi}`} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 pr-3 font-semibold text-accent-indigo">{w.word}</td>
                        <td className="py-2 pr-3 text-xs text-slate-400">{w.pos}</td>
                        <td className="py-2 pr-3 text-slate-600 dark:text-slate-400">{bt(w.definition)}</td>
                        <td className="py-2 text-xs italic text-accent-teal">{w.collocation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlowCard>
  );
}

function SkillFilterBar({ filters, active, onChange, label }: {
  filters: (Skill | 'all')[];
  active: Skill | 'all';
  onChange: (s: Skill | 'all') => void;
  label: (s: Skill | 'all') => string;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      <Filter size={16} className="text-slate-400 self-center" />
      {filters.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${active === s ? 'bg-accent-teal text-white' : 'glass-card text-slate-500'}`}
        >
          {label(s)}
        </button>
      ))}
    </div>
  );
}

export function ResourcesSection() {
  const { t, bt } = useLanguage();
  const [tab, setTab] = useState<Tab>(() => {
    const saved = sessionStorage.getItem(RESOURCES_TAB_KEY) as Tab | null;
    if (saved) {
      sessionStorage.removeItem(RESOURCES_TAB_KEY);
      return saved;
    }
    return 'videos';
  });
  const [videoFilter, setVideoFilter] = useState<Skill | 'all'>('all');
  const [bookFilter, setBookFilter] = useState<Skill | 'all'>('all');
  const [toolFilter, setToolFilter] = useState<Skill | 'all'>('all');
  const [phraseFilter, setPhraseFilter] = useState<Skill | 'all'>('all');
  const [knowledgeFilter, setKnowledgeFilter] = useState<KnowledgeCategory>('all');
  const [sampleSubTab, setSampleSubTab] = useState<SampleSubTab>('writing');
  const [expandedPlan, setExpandedPlan] = useState<string | null>(studyPlans[0]?.id ?? null);
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [knowledgePage, setKnowledgePage] = useState(1);
  const [collocationPage, setCollocationPage] = useState(1);
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [guideFilter, setGuideFilter] = useState<Skill | 'all'>('all');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(topicVocabulary[0]?.id ?? null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const writingSamples = useMemo(() => {
    const mockWritingSamples = mockTests.flatMap((test) =>
      test.writing.map((task) => ({ ...task, testTitle: test.title, source: 'mock' as const }))
    );
    const extraWritingSamples = writingSamplesExtra.map((s) => ({
      id: s.id,
      taskNumber: s.type.startsWith('task1') ? 1 as const : 2 as const,
      testType: 'academic' as const,
      prompt: s.prompt,
      minWords: s.type.startsWith('task1') ? 150 : 250,
      modelAnswer: s.essay,
      bandDescriptors: s.tips,
      testTitle: s.topic,
      essayType: s.type,
      band: s.band,
      structure: s.structure,
      source: 'extra' as const,
    }));
    return [...mockWritingSamples, ...extraWritingSamples];
  }, []);

  const topicKeys = useMemo(() => {
    const keys = new Set(collocations.map((c) => c.topic));
    return ['all', ...Array.from(keys).sort()];
  }, []);

  const filteredVideos = videoFilter === 'all' ? videoLibrary : videoLibrary.filter((v) => v.skill === videoFilter || v.skill === 'all');
  const filteredBooks = bookFilter === 'all' ? bookLibrary : bookLibrary.filter((b) => b.skill === bookFilter || b.skill === 'all');
  const filteredTools = toolFilter === 'all' ? webResources : webResources.filter((w) => w.skill === toolFilter || w.skill === 'all');
  const filteredPhrases = phraseFilter === 'all' ? phraseBank : phraseBank.filter((p) => p.skill === phraseFilter || p.skill === 'all');
  const q = searchQuery.trim().toLowerCase();
  const matchesSearch = useCallback(
    (en: string, vi: string) => !q || en.toLowerCase().includes(q) || vi.toLowerCase().includes(q),
    [q],
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setKnowledgePage(1);
    setCollocationPage(1);
  };

  const filteredKnowledge = useMemo(() => {
    let items = knowledgeFilter === 'all' ? knowledgeBase : knowledgeBase.filter((a) => a.category === knowledgeFilter);
    if (q) items = items.filter((a) => matchesSearch(a.title.en, a.title.vi) || a.tags.some((tag) => tag.includes(q)));
    return items;
  }, [knowledgeFilter, q, matchesSearch]);

  const filteredBooksSearch = useMemo(() => {
    if (!q) return filteredBooks;
    return filteredBooks.filter((b) => matchesSearch(b.title.en, b.title.vi) || matchesSearch(b.description.en, b.description.vi));
  }, [filteredBooks, q, matchesSearch]);

  const filteredToolsSearch = useMemo(() => {
    if (!q) return filteredTools;
    return filteredTools.filter((w) => matchesSearch(w.title.en, w.title.vi) || matchesSearch(w.description.en, w.description.vi));
  }, [filteredTools, q, matchesSearch]);

  const filteredPhrasesSearch = useMemo(() => {
    if (!q) return filteredPhrases;
    return filteredPhrases.filter((p) => p.phrase.toLowerCase().includes(q) || matchesSearch(p.meaning.en, p.meaning.vi));
  }, [filteredPhrases, q, matchesSearch]);

  const filteredVideosSearch = useMemo(() => {
    if (!q) return filteredVideos;
    return filteredVideos.filter((v) => matchesSearch(v.title.en, v.title.vi) || v.channel.toLowerCase().includes(q));
  }, [filteredVideos, q, matchesSearch]);

  const filteredPlansSearch = useMemo(() => {
    if (!q) return studyPlans;
    return studyPlans.filter((p) =>
      matchesSearch(p.title.en, p.title.vi) ||
      matchesSearch(p.description.en, p.description.vi) ||
      p.weeks.some((w) => matchesSearch(w.focus.en, w.focus.vi) || w.tasks.some((t) => matchesSearch(t.en, t.vi))),
    );
  }, [q, matchesSearch]);

  const filteredWritingSamples = useMemo(() => {
    if (!q) return writingSamples;
    return writingSamples.filter((t) =>
      matchesSearch(t.prompt.en, t.prompt.vi) ||
      matchesSearch(t.modelAnswer.en, t.modelAnswer.vi) ||
      matchesSearch(t.testTitle.en, t.testTitle.vi),
    );
  }, [writingSamples, q, matchesSearch]);

  const filteredSpeakingSamples = useMemo(() => {
    if (!q) return speakingSamples;
    return speakingSamples.filter((s) =>
      matchesSearch(s.topic.en, s.topic.vi) ||
      matchesSearch(s.question.en, s.question.vi) ||
      matchesSearch(s.sampleAnswer.en, s.sampleAnswer.vi),
    );
  }, [q, matchesSearch]);

  const filteredCollocations = useMemo(() => {
    let items = topicFilter === 'all' ? collocations : collocations.filter((c) => c.topic === topicFilter);
    if (q) items = items.filter((c) =>
      c.collocation.toLowerCase().includes(q) ||
      matchesSearch(c.meaning.en, c.meaning.vi) ||
      matchesSearch(c.example.en, c.example.vi),
    );
    return items;
  }, [topicFilter, q, matchesSearch]);

  const filteredQuestionGuides = useMemo(() => {
    let items = guideFilter === 'all' ? questionTypeGuides : questionTypeGuides.filter((g) => g.skill === guideFilter);
    if (q) items = items.filter((g) =>
      matchesSearch(g.title.en, g.title.vi) ||
      matchesSearch(g.tips.en, g.tips.vi) ||
      g.type.includes(q),
    );
    return items;
  }, [guideFilter, q, matchesSearch]);

  const filteredTopicVocab = useMemo(() => {
    if (!q) return topicVocabulary;
    return topicVocabulary.filter((t) =>
      matchesSearch(t.title.en, t.title.vi) ||
      t.words.some((w) =>
        w.word.toLowerCase().includes(q) ||
        w.collocation.toLowerCase().includes(q) ||
        matchesSearch(w.definition.en, w.definition.vi),
      ),
    );
  }, [q, matchesSearch]);

  const knowledgePages = Math.max(1, Math.ceil(filteredKnowledge.length / PAGE_SIZE));
  const collocationPages = Math.max(1, Math.ceil(filteredCollocations.length / PAGE_SIZE));
  const paginatedKnowledge = useMemo(() => {
    const page = Math.min(knowledgePage, Math.max(1, Math.ceil(filteredKnowledge.length / PAGE_SIZE)));
    const start = (page - 1) * PAGE_SIZE;
    return filteredKnowledge.slice(start, start + PAGE_SIZE);
  }, [filteredKnowledge, knowledgePage]);

  const paginatedCollocations = useMemo(() => {
    const page = Math.min(collocationPage, Math.max(1, Math.ceil(filteredCollocations.length / PAGE_SIZE)));
    const start = (page - 1) * PAGE_SIZE;
    return filteredCollocations.slice(start, start + PAGE_SIZE);
  }, [filteredCollocations, collocationPage]);

  const topicLabel = (key: string) => {
    if (key === 'all') return t.resources.allTopics;
    const tv = topicVocabulary.find((t) => t.topicKey === key);
    return tv ? bt(tv.title) : key;
  };

  const knowledgeCategories: KnowledgeCategory[] = ['all', 'format', 'scoring', 'tips', 'preparation', 'vocabulary'];
  const skillFilters: (Skill | 'all')[] = ['all', 'listening', 'reading', 'writing', 'speaking'];

  const skillLabel = (s: Skill | 'all') => {
    if (s === 'all') return t.resources.allSkills;
    return t.practice[s];
  };

  const categoryLabels: Record<KnowledgeCategory, string> = {
    all: t.resources.allCategories,
    format: t.lookup.format,
    scoring: t.lookup.scoring,
    tips: t.lookup.tips,
    preparation: t.lookup.preparation,
    vocabulary: t.practice.vocabulary,
  };

  const totalResources = resourceStats.total;

  const tabs: { key: Tab; label: string; icon: typeof FileText; count?: number }[] = [
    { key: 'knowledge', label: t.resources.knowledge, icon: FileText, count: knowledgeBase.length },
    { key: 'topicVocab', label: t.resources.topicVocabulary, icon: Library, count: resourceStats.topicVocabulary },
    { key: 'collocations', label: t.resources.collocations, icon: Layers, count: collocations.length },
    { key: 'questionGuides', label: t.resources.questionGuides, icon: HelpCircle, count: questionTypeGuides.length },
    { key: 'videos', label: t.resources.videos, icon: Play, count: videoLibrary.length },
    { key: 'books', label: t.resources.books, icon: BookOpen, count: bookLibrary.length },
    { key: 'tools', label: t.resources.tools, icon: Globe, count: webResources.length },
    { key: 'phrases', label: t.resources.phrases, icon: MessageSquare, count: phraseBank.length },
    { key: 'plans', label: t.resources.studyPlans, icon: Calendar, count: studyPlans.length },
    { key: 'templates', label: t.resources.templates, icon: LayoutTemplate, count: writingTemplates.length },
    { key: 'bands', label: t.resources.bandDescriptors, icon: Award },
    { key: 'samples', label: t.resources.sampleAnswers, count: writingSamples.length + speakingSamples.length, icon: PenLine },
  ];

  return (
    <section className="section-padding max-w-7xl mx-auto relative">
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
      <div className="relative">
        <SectionHeader title={t.resources.title} subtitle={t.resources.subtitle} />

        <div className="glass-card rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-center gap-6 border border-accent-teal/15">
          {[
            { label: t.resources.topicVocabulary, count: resourceStats.topicVocabulary, color: 'text-accent-teal' },
            { label: t.resources.collocations, count: collocations.length, color: 'text-teal-500' },
            { label: t.resources.questionGuides, count: questionTypeGuides.length, color: 'text-accent-indigo' },
            { label: t.resources.sampleAnswers, count: writingSamples.length + speakingSamples.length, color: 'text-purple-500' },
            { label: t.resources.videos, count: videoLibrary.length, color: 'text-rose-500' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className={`text-2xl font-black ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
          <div className="text-center border-l border-slate-200 dark:border-slate-700 pl-6">
            <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{totalResources}+</p>
            <p className="text-xs text-slate-500 font-medium">{t.resources.total}</p>
          </div>
        </div>

        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-teal" size={18} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t.resources.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-accent-teal"
          />
        </div>

        <div className="flex gap-2 justify-start sm:justify-center mb-10 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
          {tabs.map((tb) => (
            <motion.button
              key={tb.key}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTab(tb.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all shrink-0 ${
                tab === tb.key ? 'bg-gradient-to-r from-accent-teal to-teal-600 text-white shadow-glow' : 'glass-card text-slate-600 dark:text-slate-400'
              }`}
            >
              <tb.icon size={15} /> {tb.label}
              {tb.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === tb.key ? 'bg-white/20' : 'bg-accent-teal/10 text-accent-teal'}`}>{tb.count}</span>
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'knowledge' && (
            <motion.div key="knowledge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12">
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {knowledgeCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setKnowledgeFilter(c); setKnowledgePage(1); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${knowledgeFilter === c ? 'bg-accent-indigo text-white' : 'glass-card text-slate-500'}`}
                  >
                    {categoryLabels[c]}
                    {c !== 'all' && <span className="ml-1 opacity-70">({knowledgeBase.filter((a) => a.category === c).length})</span>}
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredKnowledge.length === 0 && <p className="text-center text-slate-500 py-12 col-span-full">{t.resources.noResults}</p>}
                {paginatedKnowledge.map((article, i) => (
                  <GlowCard key={article.id} glow={i % 2 === 0 ? 'teal' : 'indigo'} delay={i * 0.02} onClick={() => setSelectedArticle(article)} className="cursor-pointer group">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="text-accent-teal" size={18} />
                      <span className="text-xs font-bold uppercase tracking-wider text-accent-teal">{article.category}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2 group-hover:text-accent-teal transition-colors">{bt(article.title)}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">{bt(article.content)}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{tag}</span>
                      ))}
                    </div>
                    <span className="inline-block mt-3 text-xs font-semibold text-accent-teal">{t.resources.readMore} →</span>
                  </GlowCard>
                ))}
              </div>
              {knowledgePages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button size="sm" variant="outline" disabled={knowledgePage <= 1} onClick={() => setKnowledgePage((p) => p - 1)}>{t.mock.previous}</Button>
                  <span className="text-sm text-slate-500">{t.resources.page} {knowledgePage} {t.resources.of} {knowledgePages}</span>
                  <Button size="sm" variant="outline" disabled={knowledgePage >= knowledgePages} onClick={() => setKnowledgePage((p) => p + 1)}>{t.mock.next}</Button>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'topicVocab' && (
            <motion.div key="topicVocab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5 mb-12">
              <div className="glass-card rounded-2xl p-5 mb-6 border border-accent-teal/20 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">{filteredTopicVocab.length} {t.resources.topicVocabulary} · {resourceStats.topicVocabularyTopics} topics · IELTS Liz / British Council style</p>
              </div>
              {filteredTopicVocab.length === 0 && <p className="text-center text-slate-500 py-12">{t.resources.noResults}</p>}
              {filteredTopicVocab.map((topic, i) => (
                <TopicVocabCard
                  key={topic.id}
                  topic={topic}
                  expanded={expandedTopic === topic.id}
                  onToggle={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                  delay={i * 0.03}
                  bt={bt}
                  t={t}
                />
              ))}
            </motion.div>
          )}

          {tab === 'collocations' && (
            <motion.div key="collocations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12">
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                <Filter size={16} className="text-slate-400 self-center" />
                {topicKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => { setTopicFilter(key); setCollocationPage(1); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${topicFilter === key ? 'bg-accent-teal text-white' : 'glass-card text-slate-500'}`}
                  >
                    {topicLabel(key)}
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredCollocations.length === 0 && <p className="text-center text-slate-500 py-12 col-span-full">{t.resources.noResults}</p>}
                {paginatedCollocations.map((col, i) => (
                  <GlowCard key={col.id} glow={i % 2 === 0 ? 'teal' : 'indigo'} delay={i * 0.02}>
                    <div className="flex items-center gap-2 mb-2">
                      <Layers size={14} className="text-accent-teal" />
                      <span className="text-[10px] font-bold uppercase text-accent-teal">{topicLabel(col.topic)}</span>
                      <span className="text-[10px] text-slate-400 ml-auto">{col.pattern}</span>
                    </div>
                    <p className="font-bold text-accent-indigo mb-2">&ldquo;{col.collocation}&rdquo;</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2"><span className="font-semibold">{t.resources.meaning}: </span>{bt(col.meaning)}</p>
                    <p className="text-xs text-slate-500 italic border-l-2 border-accent-teal/30 pl-3">{bt(col.example)}</p>
                  </GlowCard>
                ))}
              </div>
              {collocationPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button size="sm" variant="outline" disabled={collocationPage <= 1} onClick={() => setCollocationPage((p) => p - 1)}>{t.mock.previous}</Button>
                  <span className="text-sm text-slate-500">{t.resources.page} {collocationPage} {t.resources.of} {collocationPages}</span>
                  <Button size="sm" variant="outline" disabled={collocationPage >= collocationPages} onClick={() => setCollocationPage((p) => p + 1)}>{t.mock.next}</Button>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'questionGuides' && (
            <motion.div key="questionGuides" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12">
              <SkillFilterBar filters={skillFilters} active={guideFilter} onChange={setGuideFilter} label={skillLabel} />
              <div className="grid md:grid-cols-2 gap-5">
                {filteredQuestionGuides.length === 0 && <p className="text-center text-slate-500 py-12 col-span-full">{t.resources.noResults}</p>}
                {filteredQuestionGuides.map((guide, i) => (
                  <GlowCard key={guide.id} glow="indigo" delay={i * 0.03}>
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle size={16} className="text-accent-indigo" />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${skillColors[guide.skill]} text-white`}>{skillLabel(guide.skill)}</span>
                      <span className="text-[10px] text-slate-400 ml-auto">{guide.type}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-3">{bt(guide.title)}</h4>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 rounded-xl bg-accent-teal/5 border border-accent-teal/15">
                        <p className="text-xs font-bold text-accent-teal uppercase mb-1">{t.resources.tips}</p>
                        <p className="text-slate-600 dark:text-slate-400">{bt(guide.tips)}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                        <p className="text-xs font-bold text-amber-600 uppercase mb-1 flex items-center gap-1"><AlertTriangle size={12} />{t.resources.traps}</p>
                        <p className="text-slate-600 dark:text-slate-400">{bt(guide.traps)}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/15">
                        <p className="text-xs font-bold text-purple-600 uppercase mb-1">{t.resources.strategy}</p>
                        <p className="text-slate-600 dark:text-slate-400">{bt(guide.strategy)}</p>
                      </div>
                    </div>
                  </GlowCard>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'videos' && (
            <motion.div key="videos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12">
              <div className="glass-card rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4 border border-accent-teal/20">
                <div>
                  <p className="text-sm font-bold text-accent-teal uppercase tracking-wider mb-1">YouTube IELTS</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">TakeIELTS Official · E2 IELTS · IELTS Liz</p>
                </div>
                <span className="text-xs text-slate-500 px-3 py-1.5 rounded-full bg-accent-teal/10">{filteredVideosSearch.length} / {videoLibrary.length}</span>
              </div>
              <SkillFilterBar filters={skillFilters} active={videoFilter} onChange={setVideoFilter} label={skillLabel} />
              {filteredVideosSearch.length === 0 ? (
                <p className="text-center text-slate-500 py-12">{q ? t.resources.noResults : t.resources.noVideos}</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredVideosSearch.map((video, i) => (
                    <GlowCard key={video.id} glow="teal" delay={i * 0.03} onClick={() => setActiveVideo({ id: video.youtubeId, title: bt(video.title) })} className="group cursor-pointer">
                      <div className="relative mb-4 rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <img src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} alt={bt(video.title)} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" onError={(e) => { const img = e.currentTarget; if (!img.dataset.fallback) { img.dataset.fallback = '1'; img.src = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`; } }} />
                        <div className="relative z-10 w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={24} className="text-accent-teal ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${skillColors[video.skill]} text-white mb-2`}>{skillLabel(video.skill)}</span>
                      <h4 className="font-bold mb-1 group-hover:text-accent-teal transition-colors line-clamp-2">{bt(video.title)}</h4>
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1 truncate"><User size={12} /> {video.channel}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank', 'noopener'); }} className="shrink-0 text-accent-teal font-semibold hover:underline"><ExternalLink size={12} /></button>
                      </div>
                    </GlowCard>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'books' && (
            <motion.div key="books" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12">
              <SkillFilterBar filters={skillFilters} active={bookFilter} onChange={setBookFilter} label={skillLabel} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBooksSearch.length === 0 ? <p className="text-center text-slate-500 py-12 col-span-full">{t.resources.noResults}</p> : null}
                {filteredBooksSearch.map((book, i) => (
                  <GlowCard key={book.id} glow="indigo" delay={i * 0.03} onClick={book.link ? () => window.open(book.link, '_blank') : undefined} className={book.link ? 'cursor-pointer group' : ''}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${skillColors[book.skill]} flex items-center justify-center shrink-0 shadow-lg`}>
                        <BookOpen size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase text-accent-indigo">{book.type}</span>
                          <span className="text-[10px] text-slate-400">{book.level}</span>
                        </div>
                        <h4 className="font-bold text-sm leading-snug mb-1 group-hover:text-accent-indigo transition-colors">{bt(book.title)}</h4>
                        <p className="text-xs text-slate-500 mb-2">{book.author}{book.publisher ? ` · ${book.publisher}` : ''}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{bt(book.description)}</p>
                        {book.link && <span className="inline-flex items-center gap-1 text-xs text-accent-teal font-semibold mt-2"><ExternalLink size={12} /> {t.resources.viewBook}</span>}
                      </div>
                    </div>
                  </GlowCard>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'tools' && (
            <motion.div key="tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12">
              <SkillFilterBar filters={skillFilters} active={toolFilter} onChange={setToolFilter} label={skillLabel} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredToolsSearch.length === 0 ? <p className="text-center text-slate-500 py-12 col-span-full">{t.resources.noResults}</p> : null}
                {filteredToolsSearch.map((tool, i) => (
                  <GlowCard key={tool.id} glow="teal" delay={i * 0.03} onClick={() => window.open(tool.url, '_blank', 'noopener')} className="cursor-pointer group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-2xl">{webTypeIcons[tool.type] ?? '🔗'}</span>
                      <div className="flex gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tool.free ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                          {tool.free ? t.resources.free : t.resources.paid}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${skillColors[tool.skill]} text-white`}>{skillLabel(tool.skill)}</span>
                      </div>
                    </div>
                    <h4 className="font-bold mb-1 group-hover:text-accent-teal transition-colors">{bt(tool.title)}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{bt(tool.description)}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-accent-teal font-semibold"><Link2 size={12} /> {t.resources.openLink}</span>
                  </GlowCard>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'phrases' && (
            <motion.div key="phrases" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12">
              <SkillFilterBar filters={skillFilters} active={phraseFilter} onChange={setPhraseFilter} label={skillLabel} />
              <div className="grid md:grid-cols-2 gap-4">
                {filteredPhrasesSearch.length === 0 ? <p className="text-center text-slate-500 py-12 col-span-full">{t.resources.noResults}</p> : null}
                {filteredPhrasesSearch.map((ph, i) => (
                  <GlowCard key={ph.id} glow={i % 2 === 0 ? 'teal' : 'indigo'} delay={i * 0.02}>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={14} className="text-accent-teal" />
                      <span className="text-[10px] font-bold uppercase text-accent-teal">{ph.category}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${skillColors[ph.skill]} text-white ml-auto`}>{skillLabel(ph.skill)}</span>
                    </div>
                    <p className="font-bold text-accent-indigo mb-2">&ldquo;{ph.phrase}&rdquo;</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2"><span className="font-semibold text-slate-700 dark:text-slate-300">{t.resources.meaning}: </span>{bt(ph.meaning)}</p>
                    <p className="text-xs text-slate-500 italic border-l-2 border-accent-teal/30 pl-3">{bt(ph.example)}</p>
                  </GlowCard>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'plans' && (
            <motion.div key="plans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5 mb-12">
              {filteredPlansSearch.length === 0 && <p className="text-center text-slate-500 py-12">{t.resources.noResults}</p>}
              {filteredPlansSearch.map((plan, i) => (
                <GlowCard key={plan.id} glow="indigo" delay={i * 0.05}>
                  <button type="button" onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)} className="w-full text-left">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-lg mb-1">{bt(plan.title)}</h4>
                        <p className="text-sm text-slate-500 mb-3">{bt(plan.description)}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs px-3 py-1 rounded-full bg-accent-teal/10 text-accent-teal font-semibold"><Clock size={12} className="inline mr-1" />{plan.duration}</span>
                          <span className="text-xs px-3 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo font-semibold"><Award size={12} className="inline mr-1" />{t.resources.targetBand}: {plan.targetBand}</span>
                          <span className="text-xs px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold">{t.resources.hoursPerDay}: {plan.hoursPerDay}</span>
                        </div>
                      </div>
                      {expandedPlan === plan.id ? <ChevronUp className="text-slate-400 shrink-0" /> : <ChevronDown className="text-slate-400 shrink-0" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedPlan === plan.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700 space-y-4">
                          {plan.weeks.map((wk) => (
                            <div key={wk.week} className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
                              <p className="font-bold text-sm text-accent-teal mb-1">{t.resources.week} {wk.week}: {bt(wk.focus)}</p>
                              <ul className="space-y-1.5 mt-2">
                                {wk.tasks.map((task, ti) => (
                                  <li key={ti} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                    <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                    {bt(task)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlowCard>
              ))}
            </motion.div>
          )}

          {tab === 'templates' && (
            <motion.div key="templates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-5 mb-12">
              {writingTemplates
                .filter((tpl) => !q || matchesSearch(tpl.title.en, tpl.title.vi) || tpl.type.includes(q))
                .map((tpl, i) => (
                  <GlowCard key={tpl.id} glow="indigo" delay={i * 0.03}>
                    <div className="flex items-center gap-2 mb-2">
                      <LayoutTemplate size={18} className="text-purple-500" />
                      <span className="text-xs font-bold uppercase text-purple-500">{tpl.type}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-3">{bt(tpl.title)}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line mb-3">{bt(tpl.structure)}</p>
                    <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-sm italic mb-3">{bt(tpl.template)}</div>
                    <p className="text-xs text-slate-500 flex items-start gap-1"><Lightbulb size={12} className="text-amber-500 shrink-0 mt-0.5" />{bt(tpl.tips)}</p>
                  </GlowCard>
                ))}
            </motion.div>
          )}

          {tab === 'bands' && (
            <motion.div key="bands" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5 mb-12">
              {bandDescriptors.map((bd, i) => (
                <GlowCard key={bd.band} glow="teal" delay={i * 0.08}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center text-white font-black text-xl shadow-glow">{bd.band}</div>
                    <h4 className="font-bold text-lg">Band {bd.band}</h4>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    {(['listening', 'reading', 'writing', 'speaking'] as const).map((skill) => (
                      <div key={skill} className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50">
                        <span className="text-xs font-bold text-accent-teal uppercase">{skill}</span>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{bt(bd[skill])}</p>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              ))}
            </motion.div>
          )}

          {tab === 'samples' && (
            <motion.div key="samples" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12">
              <div className="flex gap-2 justify-center mb-8">
                {(['writing', 'speaking'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSampleSubTab(st)}
                    className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${sampleSubTab === st ? 'bg-accent-indigo text-white' : 'glass-card text-slate-500'}`}
                  >
                    {st === 'writing' ? t.resources.writingSamples : t.resources.speakingSamples}
                    <span className="ml-2 text-xs opacity-80">({st === 'writing' ? writingSamples.length : speakingSamples.length})</span>
                  </button>
                ))}
              </div>
              {sampleSubTab === 'writing' ? (
                <div className="space-y-5">
                  {filteredWritingSamples.length === 0 && <p className="text-center text-slate-500 py-12">{t.resources.noResults}</p>}
                  {filteredWritingSamples.map((task, i) => (
                    <GlowCard key={`${task.id}-${i}`} glow="indigo" delay={i * 0.03}>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-bold text-lg">Task {task.taskNumber} — {task.testType}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent-indigo/10 text-accent-indigo">{bt(task.testTitle)}</span>
                        {'band' in task && task.band && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{t.resources.bandScore} {task.band}</span>}
                        {'essayType' in task && task.essayType && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">{task.essayType}</span>}
                      </div>
                      <p className="text-sm text-slate-500 mb-4 italic">{bt(task.prompt)}</p>
                      {'structure' in task && task.structure && (
                        <p className="text-xs text-slate-500 mb-3 flex items-start gap-1"><LayoutTemplate size={12} className="text-purple-500 shrink-0 mt-0.5" /><span><strong>{t.resources.essayStructure}:</strong> {bt(task.structure)}</span></p>
                      )}
                      <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-sm leading-relaxed whitespace-pre-line">{bt(task.modelAnswer)}</div>
                    </GlowCard>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-5">
                  {filteredSpeakingSamples.length === 0 && <p className="text-center text-slate-500 py-12">{t.resources.noResults}</p>}
                  {filteredSpeakingSamples.map((sp, i) => (
                    <GlowCard key={sp.id} glow="teal" delay={i * 0.03}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">{t.resources.part} {sp.part}</span>
                        <span className="text-xs text-slate-500">Band {sp.band}</span>
                        <span className="text-xs font-semibold text-accent-teal ml-auto">{bt(sp.topic)}</span>
                      </div>
                      <p className="text-sm font-semibold mb-2 italic text-slate-600 dark:text-slate-400">{bt(sp.question)}</p>
                      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-sm leading-relaxed mb-3">{bt(sp.sampleAnswer)}</div>
                      <p className="text-xs text-slate-500 flex items-start gap-1"><Lightbulb size={12} className="text-amber-500 shrink-0 mt-0.5" />{bt(sp.tips)}</p>
                    </GlowCard>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <h3 className="text-xl font-bold mb-6 text-center">{t.resources.officialLinks}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {officialLinks
            .filter((link) => !q || link.name.toLowerCase().includes(q) || link.desc.toLowerCase().includes(q))
            .map((link, i) => (
            <GlowCard key={link.url} glow="teal" delay={i * 0.04} onClick={() => window.open(link.url, '_blank')}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block text-sm">{link.name}</span>
                  <span className="text-xs text-slate-500">{link.desc}</span>
                </div>
                <ExternalLink size={16} className="text-accent-teal shrink-0" />
              </div>
            </GlowCard>
          ))}
        </div>
      </div>

      {activeVideo && (
        <VideoModal isOpen={!!activeVideo} onClose={() => setActiveVideo(null)} title={activeVideo.title} youtubeId={activeVideo.id} />
      )}

      {selectedArticle && (
        <Modal isOpen={!!selectedArticle} onClose={() => setSelectedArticle(null)} title={bt(selectedArticle.title)} size="lg">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-teal px-2 py-1 rounded-full bg-accent-teal/10">{selectedArticle.category}</span>
            {selectedArticle.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{tag}</span>
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{bt(selectedArticle.content)}</p>
        </Modal>
      )}
    </section>
  );
}