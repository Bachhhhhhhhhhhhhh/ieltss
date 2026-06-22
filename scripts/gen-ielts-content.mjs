/**
 * Generates IELTS content resources from curated data.
 * Run: node scripts/gen-ielts-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  TOPICS,
  COLLOCATION_PATTERNS,
  TOPIC_WORDS,
  TOPIC_COLLOCATIONS,
  QUESTION_TYPES,
  ESSAY_SAMPLES,
  SPEAKING_SAMPLES,
  bt,
} from './ielts-content-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../src/data');

const writeTs = (filename, typeImport, exportName, data, isConst = false) => {
  const typeSuffix = Array.isArray(data) ? '[]' : '';
  const content = isConst
    ? `/** Auto-generated — run: npm run gen:ielts-content */\nexport const ${exportName} = ${JSON.stringify(data, null, 2)} as const;\n`
    : `import type { ${typeImport} } from '../types';

/** Auto-generated — run: npm run gen:ielts-content */
export const ${exportName}: ${typeImport}${typeSuffix} = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(path.join(OUT, filename), content, 'utf8');
  console.log(`  ✓ ${filename} (${Array.isArray(data) ? data.length : 'object'} items)`);
};

function makeExample(coll, topic) {
  const c = coll.trim();
  const startsWithArticle = /^(a |an |the )/i.test(c);
  const en = startsWithArticle
    ? `Policymakers must address ${c} in ${topic.en.toLowerCase()} reform.`
    : `Many essays discuss how nations should ${c} to improve ${topic.en.toLowerCase()}.`;
  const vi = `Nhiều bài luận bàn cách ${c} để cải thiện ${topic.vi}.`;
  return bt(en, vi);
}

// ─── Collocations (deduped) ───
function genCollocations() {
  const seen = new Map();
  let id = 1;

  const add = (entry, priority) => {
    const key = entry.collocation.toLowerCase().trim();
    const prev = seen.get(key);
    if (!prev || priority > prev.priority) {
      seen.set(key, { entry: { ...entry, id: `col-${id++}` }, priority });
    }
  };

  for (const topic of TOPICS) {
    for (const [phrase, vi, exEn, exVi] of TOPIC_COLLOCATIONS[topic.key] || []) {
      add({
        collocation: phrase,
        meaning: bt(phrase, vi),
        example: bt(exEn, exVi),
        topic: topic.key,
        pattern: 'topic-specific',
      }, 3);
    }
  }

  for (const [phrase, vi, exEn, exVi] of COLLOCATION_PATTERNS) {
    add({
      collocation: phrase,
      meaning: bt(phrase, vi),
      example: bt(exEn, exVi),
      topic: 'general',
      pattern: phrase.includes(' ') ? phrase.split(' ')[0] + '+noun' : 'phrase',
    }, 2);
  }

  for (const topic of TOPICS) {
    const words = TOPIC_WORDS[topic.key] || [];
    for (const [word, pos, defEn, defVi, coll] of words) {
      if (!coll || coll.includes('term')) continue;
      add({
        collocation: coll,
        meaning: bt(defEn, defVi),
        example: makeExample(coll, topic),
        topic: topic.key,
        pattern: `${pos}+collocation`,
      }, 1);
    }
  }

  const entries = Array.from(seen.values())
    .sort((a, b) => b.priority - a.priority)
    .map((x, i) => ({ ...x.entry, id: `col-${i + 1}` }));

  writeTs('collocationsExtra.ts', 'CollocationEntry', 'collocationsExtra', entries);
  return entries.length;
}

// ─── Topic Vocabulary ───
function genTopicVocabulary() {
  const STUDY_TIPS = {
    en: 'Group words by word class (noun/verb/adj). Learn the collocation column together with each word. Write one sentence per word within 48 hours. Review with spaced repetition (1-3-7-14 days).',
    vi: 'Nhóm từ theo loại từ (danh/động/tính). Học cột collocation cùng mỗi từ. Viết một câu mỗi từ trong 48 giờ. Ôn spaced repetition (1-3-7-14 ngày).',
  };
  const TRAPS = {
    en: 'Avoid translating word-by-word from Vietnamese. Check countable/uncountable nouns. Do not confuse similar words (e.g. economic vs economical). Use words in full phrases, not isolation.',
    vi: 'Tránh dịch từng từ từ tiếng Việt. Kiểm tra danh từ đếm được/không đếm. Không nhầm từ gần nghĩa (economic vs economical). Dùng từ trong cụm, không đơn lẻ.',
  };

  const topics = TOPICS.map((topic, idx) => {
    const seen = new Set();
    const words = (TOPIC_WORDS[topic.key] || [])
      .filter(([word]) => {
        const k = word.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .map(([word, pos, defEn, defVi, coll]) => ({
        word,
        pos,
        definition: bt(defEn, defVi),
        collocation: coll,
        example: makeExample(coll, topic),
      }));

    return {
      id: `tv-${idx + 1}`,
      topicKey: topic.key,
      title: bt(`${topic.en} Vocabulary`, `Từ vựng ${topic.vi}`),
      words,
      studyTips: STUDY_TIPS,
      commonTraps: TRAPS,
    };
  });

  writeTs('topicVocabulary.ts', 'TopicVocabulary', 'topicVocabulary', topics);
  return topics.reduce((s, t) => s + t.words.length, 0);
}

// ─── Question Type Guides ───
function genQuestionTypeGuides() {
  const STRATEGIES = {
    listening: {
      en: '1) Read questions before audio. 2) Underline keywords. 3) Predict answer type. 4) Follow speaker order. 5) Check spelling & word limit.',
      vi: '1) Đọc câu hỏi trước audio. 2) Gạch từ khóa. 3) Dự đoán loại đáp án. 4) Theo thứ tự người nói. 5) Kiểm tra chính tả & giới hạn từ.',
    },
    reading: {
      en: '1) Skim passage structure first. 2) Locate proof sentences. 3) Distinguish FALSE vs NOT GIVEN. 4) Manage time (20 min/passage). 5) Transfer answers carefully.',
      vi: '1) Skim cấu trúc bài trước. 2) Tìm câu bằng chứng. 3) Phân biệt FALSE vs NOT GIVEN. 4) Quản lý thời gian (20 phút/bài). 5) Chép đáp án cẩn thận.',
    },
    writing: {
      en: '1) Analyse question type. 2) Plan 5 minutes. 3) Write clear thesis/overview. 4) One main idea per body paragraph. 5) Leave 2 min to check grammar.',
      vi: '1) Phân tích dạng câu hỏi. 2) Lên kế hoạch 5 phút. 3) Viết thesis/overview rõ. 4) Một ý chính mỗi đoạn thân. 5) Dành 2 phút kiểm tra ngữ pháp.',
    },
    speaking: {
      en: '1) Extend answers (reason + example). 2) Use varied tenses. 3) Part 2: cover all bullets. 4) Part 3: abstract thinking. 5) Avoid memorised scripts.',
      vi: '1) Mở rộng câu trả lời (lý do + ví dụ). 2) Dùng đa dạng thì. 3) Part 2: đủ bullet. 4) Part 3: tư duy trừu tượng. 5) Tránh học thuộc.',
    },
  };

  const guides = QUESTION_TYPES.map((q, idx) => ({
    id: `qtg-${idx + 1}`,
    skill: q.skill,
    type: q.type,
    title: bt(q.en, q.vi),
    tips: bt(q.tipsEn, q.tipsVi),
    traps: bt(q.trapEn, q.trapVi),
    strategy: STRATEGIES[q.skill] || STRATEGIES.reading,
    example: bt(
      `When practising ${q.en}, time yourself and review mistakes immediately. Note paraphrasing patterns.`,
      `Khi luyện ${q.vi}, bấm giờ và xem lại lỗi ngay. Ghi nhận mẫu paraphrase.`,
    ),
  }));

  writeTs('questionTypeGuides.ts', 'QuestionTypeGuide', 'questionTypeGuides', guides);
  return guides.length;
}

function genWritingSamples() {
  const samples = ESSAY_SAMPLES.map((s, idx) => ({
    id: `ws-${idx + 1}`,
    type: s.type,
    topic: s.topic,
    prompt: s.prompt,
    band: s.band,
    structure: s.structure,
    tips: s.tips,
    essay: bt(s.essay.trim(), s.essayVi.trim()),
  }));
  writeTs('writingSamplesExtra.ts', 'WritingSampleEssay', 'writingSamplesExtra', samples);
  return samples.length;
}

function genSpeakingSamples() {
  const samples = SPEAKING_SAMPLES.map((s, idx) => ({
    id: `spc-${idx + 1}`,
    part: s.part,
    topic: s.topic,
    question: s.question,
    sampleAnswer: bt(s.answer, s.answerVi),
    band: s.band,
    tips: s.tips,
  }));
  writeTs('speakingSamplesContentExtra.ts', 'SpeakingSample', 'speakingSamplesContentExtra', samples);
  return samples.length;
}

function genKnowledgeVocabArticles() {
  const articles = TOPICS.map((topic, idx) => {
    const seen = new Set();
    const words = (TOPIC_WORDS[topic.key] || []).filter(([word]) => {
      const k = word.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const wordListEn = words.map(([w, pos, def]) => `• ${w} (${pos}) — ${def}`).join('\n');
    const wordListVi = words.map(([w, pos, , defVi]) => `• ${w} (${pos}) — ${defVi}`).join('\n');
    const colls = (TOPIC_COLLOCATIONS[topic.key] || []).slice(0, 8).map(([c]) => c).join(', ');

    return {
      id: `kbv-${idx + 1}`,
      title: bt(`${topic.en}: Complete Word List & Collocations`, `${topic.vi}: Danh sách từ & Collocation đầy đủ`),
      category: 'vocabulary',
      tags: [topic.key, 'vocabulary', 'collocations', 'topic-list'],
      content: bt(
        `## ${topic.en} Vocabulary (${words.length} words)\n\n${wordListEn}\n\n## Key Collocations\n${colls}\n\n## Study Method (IELTS Liz / Simon style)\n1. Learn 5 words daily with collocations.\n2. Write one Task 2 sentence using 2 new words.\n3. Record yourself using 3 words in Speaking Part 3.\n4. Review after 1, 3, 7 days.`,
        `## Từ vựng ${topic.vi} (${words.length} từ)\n\n${wordListVi}\n\n## Collocation chính\n${colls}\n\n## Cách học (phong cách IELTS Liz / Simon)\n1. Học 5 từ/ngày kèm collocation.\n2. Viết 1 câu Task 2 dùng 2 từ mới.\n3. Ghi âm Speaking Part 3 dùng 3 từ.\n4. Ôn sau 1, 3, 7 ngày.`,
      ),
    };
  });
  writeTs('knowledgeVocabExtra.ts', 'KnowledgeArticle', 'knowledgeVocabExtra', articles);
  return articles.length;
}

/** Lightweight counts for Hero/Home — avoids importing heavy data arrays */
function genResourceCounts(stats) {
  const BASE = {
    knowledgeBase: 50,
    knowledgeExtra: 70,
    videos: 40,
    books: 65,
    webTools: 88,
    phrases: 74,
    studyPlans: 12,
    writingTemplates: 8,
    officialLinks: 12,
    vocabulary: 217,
    mockTests: 20,
    baseCollocations: 5,
    baseSpeaking: 12,
    speakingExtra: 30,
    mockWritingSamples: 40,
  };

  const counts = {
    knowledge: BASE.knowledgeBase + BASE.knowledgeExtra + stats.knowledgeArticles,
    collocations: BASE.baseCollocations + stats.collocations,
    topicVocabulary: stats.vocabWords,
    topicVocabularyTopics: TOPICS.length,
    questionTypeGuides: stats.questionGuides,
    videos: BASE.videos,
    books: BASE.books,
    webTools: BASE.webTools,
    phrases: BASE.phrases,
    studyPlans: BASE.studyPlans,
    writingTemplates: BASE.writingTemplates,
    writingSamples: BASE.mockWritingSamples + stats.writingSamples,
    speakingSamples: BASE.baseSpeaking + BASE.speakingExtra + stats.speakingSamples,
    officialLinks: BASE.officialLinks,
    vocabulary: BASE.vocabulary,
    mockTests: BASE.mockTests,
    total: 0,
  };

  counts.total =
    counts.knowledge +
    counts.videos +
    counts.books +
    counts.webTools +
    counts.phrases +
    counts.studyPlans +
    counts.writingTemplates +
    counts.writingSamples +
    counts.speakingSamples +
    counts.officialLinks +
    counts.collocations +
    counts.topicVocabulary +
    counts.questionTypeGuides;

  writeTs('resourceCounts.ts', null, 'resourceCounts', counts, true);
  return counts.total;
}

console.log('Generating IELTS content resources...\n');
const stats = {
  collocations: genCollocations(),
  vocabWords: genTopicVocabulary(),
  questionGuides: genQuestionTypeGuides(),
  writingSamples: genWritingSamples(),
  speakingSamples: genSpeakingSamples(),
  knowledgeArticles: genKnowledgeVocabArticles(),
};
const total = genResourceCounts(stats);

console.log('\n─── Summary ───');
for (const [k, v] of Object.entries(stats)) console.log(`  ${k}: ${v}`);
console.log(`  resource total: ${total}`);
console.log('Done! Run npm run build to verify.');