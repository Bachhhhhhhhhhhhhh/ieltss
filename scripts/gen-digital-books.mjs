/**
 * Generates digital soft-copy content for all IELTS books.
 * Run: node scripts/gen-digital-books.mjs
 */
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bt = (en, vi) => ({ en, vi });

const BOOKS = [
  { id: 'book-1', skill: 'all', type: 'official', titleEn: 'Cambridge IELTS 19 Academic' },
  { id: 'book-2', skill: 'all', type: 'official', titleEn: 'Cambridge IELTS 19 General Training' },
  { id: 'book-3', skill: 'all', type: 'official', titleEn: 'The Official Cambridge Guide to IELTS' },
  { id: 'book-4', skill: 'all', type: 'vocabulary', titleEn: 'Cambridge Vocabulary for IELTS Advanced' },
  { id: 'book-5', skill: 'writing', type: 'grammar', titleEn: 'Cambridge Grammar for IELTS' },
  { id: 'book-6', skill: 'writing', type: 'textbook', titleEn: 'Collins Writing for IELTS' },
  { id: 'book-7', skill: 'reading', type: 'textbook', titleEn: 'Collins Reading for IELTS' },
  { id: 'book-8', skill: 'listening', type: 'textbook', titleEn: 'Collins Listening for IELTS' },
  { id: 'book-9', skill: 'speaking', type: 'textbook', titleEn: 'Collins Speaking for IELTS' },
  { id: 'book-10', skill: 'all', type: 'practice', titleEn: "Barron's IELTS Superpack" },
  { id: 'book-11', skill: 'all', type: 'practice', titleEn: 'IELTS Trainer 2 Academic' },
  { id: 'book-12', skill: 'writing', type: 'grammar', titleEn: 'English Grammar in Use' },
  { id: 'book-13', skill: 'all', type: 'vocabulary', titleEn: 'Oxford Word Skills: Advanced' },
  { id: 'book-14', skill: 'writing', type: 'textbook', titleEn: 'Target Band 7 — IELTS Writing' },
  { id: 'book-15', skill: 'all', type: 'vocabulary', titleEn: 'Check Your English Vocabulary for IELTS' },
  { id: 'book-16', skill: 'all', type: 'official', titleEn: 'Cambridge IELTS 18 Academic' },
  { id: 'book-17', skill: 'all', type: 'official', titleEn: 'Cambridge IELTS 17 General Training' },
  { id: 'book-18', skill: 'all', type: 'textbook', titleEn: 'MINDSET for IELTS Level 2' },
  { id: 'book-19', skill: 'all', type: 'textbook', titleEn: 'Objective IELTS Advanced' },
  { id: 'book-20', skill: 'all', type: 'textbook', titleEn: 'Focus on IELTS Foundation' },
  { id: 'book-21', skill: 'writing', type: 'textbook', titleEn: 'IELTS Advantage: Writing Skills' },
  { id: 'book-22', skill: 'reading', type: 'textbook', titleEn: 'IELTS Advantage: Reading Skills' },
  { id: 'book-23', skill: 'all', type: 'practice', titleEn: 'Succeed in IELTS — 9 Practice Tests' },
  { id: 'book-24', skill: 'writing', type: 'practice', titleEn: "15 Days' Practice for IELTS Writing" },
  { id: 'book-25', skill: 'all', type: 'practice', titleEn: 'Macmillan Practice Tests Plus IELTS 3' },
  { id: 'book-26', skill: 'all', type: 'vocabulary', titleEn: 'Vocabulary for IELTS (Collins)' },
  { id: 'book-27', skill: 'writing', type: 'grammar', titleEn: 'Grammar for IELTS (Collins)' },
  { id: 'book-28', skill: 'writing', type: 'textbook', titleEn: 'The Key to IELTS Writing Task 2' },
  { id: 'book-29', skill: 'all', type: 'official', titleEn: 'Official IELTS Practice Materials Vol. 2' },
  { id: 'book-30', skill: 'all', type: 'textbook', titleEn: 'Get Ready for IELTS (Pre-Intermediate)' },
];

// Add books 31-60 from extra pattern
for (let i = 31; i <= 60; i++) {
  const skills = ['all', 'listening', 'reading', 'writing', 'speaking'];
  const types = ['textbook', 'practice', 'vocabulary', 'official', 'grammar'];
  BOOKS.push({
    id: `book-${i}`,
    skill: skills[(i - 31) % skills.length],
    type: types[(i - 31) % types.length],
    titleEn: `IELTS Resource Book ${i}`,
  });
}

const SKILL_CHAPTERS = {
  listening: [
    { en: 'Understanding the Test Format', vi: 'Hiểu format bài thi' },
    { en: 'Section 1: Social Conversations', vi: 'Phần 1: Hội thoại xã hội' },
    { en: 'Section 2: Monologues in Social Context', vi: 'Phần 2: Độc thoại ngữ cảnh xã hội' },
    { en: 'Section 3: Academic Discussions', vi: 'Phần 3: Thảo luận học thuật' },
    { en: 'Section 4: Academic Lectures', vi: 'Phần 4: Bài giảng học thuật' },
    { en: 'Prediction & Note-taking', vi: 'Dự đoán & Ghi chú' },
  ],
  reading: [
    { en: 'Skimming, Scanning & Timing', vi: 'Skim, Scan & Quản lý thời gian' },
    { en: 'True / False / Not Given', vi: 'True / False / Not Given' },
    { en: 'Matching Headings & Information', vi: 'Matching tiêu đề & thông tin' },
    { en: 'Summary & Gap Fill', vi: 'Tóm tắt & Điền từ' },
    { en: 'Multiple Choice & List Selection', vi: 'Trắc nghiệm & Chọn danh sách' },
    { en: 'Academic Vocabulary in Context', vi: 'Từ vựng học thuật trong ngữ cảnh' },
  ],
  writing: [
    { en: 'Task Achievement & Response', vi: 'Hoàn thành nhiệm vụ' },
    { en: 'Coherence & Cohesion', vi: 'Mạch lạc & Liên kết' },
    { en: 'Lexical Resource', vi: 'Từ vựng (Lexical Resource)' },
    { en: 'Grammatical Range & Accuracy', vi: 'Ngữ pháp đa dạng & chính xác' },
    { en: 'Task 1: Charts, Maps & Processes', vi: 'Task 1: Biểu đồ, Bản đồ & Quy trình' },
    { en: 'Task 2: Essay Types & Structures', vi: 'Task 2: Dạng bài & Cấu trúc' },
  ],
  speaking: [
    { en: 'Fluency & Pronunciation Basics', vi: 'Trôi chảy & Phát âm cơ bản' },
    { en: 'Part 1: Personal Questions', vi: 'Part 1: Câu hỏi cá nhân' },
    { en: 'Part 2: Cue Card Strategy', vi: 'Part 2: Chiến lược Cue Card' },
    { en: 'Part 3: Abstract Discussion', vi: 'Part 3: Thảo luận trừu tượng' },
    { en: 'Useful Phrases & Idioms', vi: 'Cụm từ & Thành ngữ hữu ích' },
    { en: 'Self-assessment Checklist', vi: 'Checklist tự đánh giá' },
  ],
  all: [
    { en: 'IELTS Overview & Band Descriptors', vi: 'Tổng quan IELTS & Band Descriptors' },
    { en: 'Listening: Core Strategies', vi: 'Listening: Chiến lược cốt lõi' },
    { en: 'Reading: Core Strategies', vi: 'Reading: Chiến lược cốt lõi' },
    { en: 'Writing: Task 1 & 2 Essentials', vi: 'Writing: Task 1 & 2 cơ bản' },
    { en: 'Speaking: 3-Part Framework', vi: 'Speaking: Khung 3 phần' },
    { en: 'Exam Day & Time Management', vi: 'Ngày thi & Quản lý thời gian' },
  ],
};

const VOCAB_SETS = [
  { word: 'significant', pos: 'adj', def: ['important or noticeable', 'quan trọng hoặc đáng chú ý'], ex: ['a significant increase in enrolment', 'sự gia tăng đáng kể trong ghi danh'] },
  { word: 'allocate', pos: 'v', def: ['to distribute for a purpose', 'phân bổ cho mục đích'], ex: ['governments allocate funds to education', 'chính phủ phân bổ ngân sách cho giáo dục'] },
  { word: 'prevalent', pos: 'adj', def: ['widespread in a particular area', 'phổ biến ở một khu vực'], ex: ['remote work is prevalent among graduates', 'làm việc từ xa phổ biến trong sinh viên tốt nghiệp'] },
  { word: 'mitigate', pos: 'v', def: ['to make less severe', 'làm giảm mức độ nghiêm trọng'], ex: ['policies mitigate climate damage', 'chính sách giảm thiểu thiệt hại khí hậu'] },
  { word: 'coherent', pos: 'adj', def: ['logical and consistent', 'logic và nhất quán'], ex: ['a coherent argument in Task 2', 'luận điểm mạch lạc trong Task 2'] },
  { word: 'fluctuate', pos: 'v', def: ['to rise and fall irregularly', 'dao động lên xuống'], ex: ['prices fluctuate seasonally', 'giá dao động theo mùa'] },
];

const GRADIENTS = [
  'from-teal-600 to-cyan-700',
  'from-indigo-600 to-purple-700',
  'from-rose-600 to-orange-600',
  'from-emerald-600 to-teal-700',
  'from-blue-600 to-indigo-700',
  'from-violet-600 to-fuchsia-700',
];

function section(id, titleEn, titleVi, type, contentEn, contentVi, extra = {}) {
  return {
    id,
    title: bt(titleEn, titleVi),
    type,
    content: bt(contentEn, contentVi),
    ...extra,
  };
}

function genChapter(book, chapterNum, chapterTitle, bookIdx) {
  const chId = `${book.id}-ch${chapterNum}`;
  const skill = book.skill === 'all' ? ['listening', 'reading', 'writing', 'speaking'][chapterNum % 4] : book.skill;
  const vocabOffset = (bookIdx + chapterNum) % VOCAB_SETS.length;

  const sections = [
    section(
      `${chId}-intro`,
      'Chapter Introduction',
      'Giới thiệu chương',
      'text',
      `This chapter from "${book.titleEn}" focuses on ${chapterTitle.en.toLowerCase()}. You will learn exam-ready strategies, key vocabulary, and practice exercises aligned with official IELTS band descriptors. Study time: 45–60 minutes.`,
      `Chương này từ "${book.titleEn}" tập trung vào ${chapterTitle.vi.toLowerCase()}. Bạn sẽ học chiến lược sát đề, từ vựng trọng tâm và bài tập luyện theo band descriptors IELTS. Thời gian học: 45–60 phút.`,
    ),
    section(
      `${chId}-strategy`,
      'Core Strategy',
      'Chiến lược cốt lõi',
      'tip',
      `For ${skill}, the highest-impact habit is deliberate practice with feedback. Preview questions before audio/passage when allowed. Underline keywords and watch for paraphrase. In ${book.type} materials, always review model answers and note how ideas are organised.`,
      `Với ${skill}, thói quen hiệu quả nhất là luyện tập có chủ đích kèm phản hồi. Xem trước câu hỏi khi được phép. Gạch chân từ khóa và chú ý paraphrase. Với tài liệu ${book.type}, luôn đối chiếu bài mẫu và cách sắp xếp ý.`,
    ),
    section(
      `${chId}-vocab`,
      'Key Vocabulary',
      'Từ vựng trọng tâm',
      'vocabulary',
      'Master these academic words with collocations. Use each in a spoken and written sentence today.',
      'Nắm các từ học thuật và collocation. Dùng mỗi từ trong 1 câu nói và 1 câu viết hôm nay.',
      {
        vocabulary: VOCAB_SETS.slice(vocabOffset, vocabOffset + 4).map((v, i) => ({
          word: v.word,
          pos: v.pos,
          definition: bt(v.def[0], v.def[1]),
          example: bt(v.ex[0], v.ex[1]),
        })),
      },
    ),
    section(
      `${chId}-sample`,
      'Model Response',
      'Bài mẫu',
      'sample',
      skill === 'writing'
        ? 'Task 2 sample (Band 7+):\n\nSome argue that technology isolates people, while others believe it connects communities globally. I partially agree with both views.\n\nOn one hand, excessive screen time can reduce face-to-face interaction. On the other hand, social platforms enable migrants to maintain family ties across continents.\n\nIn conclusion, technology itself is neutral; outcomes depend on how individuals balance online and offline relationships.'
        : skill === 'speaking'
          ? 'Part 2 sample (Band 7+):\n\n"I\'d like to talk about a book that influenced my study habits. It was a vocabulary guide I discovered during my IELTS preparation. What made it special was its topic-based organisation and collocations. I read it daily for a month, and it helped me express ideas more precisely in Writing Task 2."'
          : `Sample analysis (${skill}):\n\nWhen tackling ${chapterTitle.en.toLowerCase()}, identify the question type first. Map keywords in the question to synonyms in the text/audio. Eliminate distractors that use exact words from the stem — IELTS often paraphrases correct answers.`,
      skill === 'writing'
        ? 'Mẫu Task 2 (Band 7+):\n\nMột số người cho rằng công nghệ khiến con người cô lập, trong khi người khác tin nó kết nối cộng đồng toàn cầu. Tôi đồng ý một phần với cả hai quan điểm.\n\nMột mặt, dùng màn hình quá nhiều có thể giảm giao tiếp trực tiếp. Mặt khác, mạng xã hội giúp người di cư giữ liên lạc với gia đình.\n\nKết luận, công nghệ trung tính; kết quả phụ thuộc cách cân bằng online và offline.'
        : skill === 'speaking'
          ? 'Mẫu Part 2 (Band 7+):\n\n"Tôi muốn nói về một cuốn sách ảnh hưởng thói quen học của tôi. Đó là sách từ vựng tôi tìm thấy khi luyện IELTS. Điểm đặc biệt là tổ chức theo chủ đề và collocation. Tôi đọc mỗi ngày trong một tháng, giúp diễn đạt chính xác hơn trong Task 2."'
          : `Phân tích mẫu (${skill}):\n\nKhi làm ${chapterTitle.vi.toLowerCase()}, xác định dạng câu trước. Ghép từ khóa trong câu hỏi với từ đồng nghĩa trong bài/audio. Loại đáp án bẫy dùng đúng từ trong đề — IELTS thường paraphrase đáp án đúng.`,
    ),
    section(
      `${chId}-exercise`,
      'Practice Exercise',
      'Bài tập luyện',
      'exercise',
      'Complete these exercises without looking at answers first. Time yourself for exam realism.',
      'Hoàn thành bài tập không xem đáp án. Bấm giờ như thi thật.',
      {
        exercises: [
          {
            question: bt(
              `Q1: What is the main purpose of ${chapterTitle.en.toLowerCase()} in IELTS ${skill}?`,
              `Câu 1: Mục đích chính của ${chapterTitle.vi.toLowerCase()} trong IELTS ${skill} là gì?`,
            ),
            answer: bt(
              'To demonstrate comprehension, organisation, and accurate language under timed conditions.',
              'Thể hiện khả năng hiểu, tổ chức và ngôn ngữ chính xác trong điều kiện có giờ.',
            ),
          },
          {
            question: bt(
              'Q2: Name two common mistakes candidates make in this area.',
              'Câu 2: Nêu hai lỗi phổ biến thí sinh mắc phải.',
            ),
            answer: bt(
              '1) Focusing on exact word match instead of paraphrase. 2) Poor time allocation in the second half.',
              '1) Chỉ tìm từ giống hệt thay vì paraphrase. 2) Phân bổ thời gian kém ở nửa sau.',
            ),
          },
          {
            question: bt(
              'Q3: Write one sentence using "significant" and one using "allocate".',
              'Câu 3: Viết một câu dùng "significant" và một câu dùng "allocate".',
            ),
            answer: bt(
              'There was a significant rise in online learning. / Universities allocate scholarships to high achievers.',
              'Có sự gia tăng đáng kể trong học trực tuyến. / Trường đại học phân bổ học bổng cho học sinh xuất sắc.',
            ),
          },
        ],
      },
    ),
    section(
      `${chId}-checklist`,
      'Chapter Checklist',
      'Checklist chương',
      'checklist',
      '☐ Read strategy notes twice\n☐ Memorise 4 vocabulary items with examples\n☐ Complete all exercises\n☐ Record one speaking answer (if applicable)\n☐ Review mistakes in error log',
      '☐ Đọc chiến lược 2 lần\n☐ Thuộc 4 từ vựng kèm ví dụ\n☐ Làm hết bài tập\n☐ Ghi âm 1 câu trả lời Speaking (nếu có)\n☐ Ghi lỗi vào sổ sai sót',
    ),
  ];

  return {
    id: chId,
    number: chapterNum,
    title: chapterTitle,
    sections,
  };
}

function genDigitalBook(book, bookIdx) {
  const chapters = SKILL_CHAPTERS[book.skill] || SKILL_CHAPTERS.all;
  const chapterCount = book.type === 'official' || book.type === 'practice' ? 5 : 6;

  return {
    id: `digital-${book.id}`,
    bookId: book.id,
    coverGradient: GRADIENTS[bookIdx % GRADIENTS.length],
    pageEstimate: chapterCount * 18 + 12,
    chapters: chapters.slice(0, chapterCount).map((title, i) => genChapter(book, i + 1, title, bookIdx)),
  };
}

const digitalBooks = BOOKS.map((book, i) => genDigitalBook(book, i));

const output = `import type { DigitalBook } from '../types';

/** Auto-generated soft-copy library — run: node scripts/gen-digital-books.mjs */
export const digitalBookLibrary: DigitalBook[] = ${JSON.stringify(digitalBooks, null, 2)};

export const digitalBookById = new Map(digitalBookLibrary.map((b) => [b.id, b]));
export const digitalBookByBookId = new Map(digitalBookLibrary.map((b) => [b.bookId, b]));
`;

const outPath = join(__dirname, '..', 'src', 'data', 'digitalBooks.ts');
fs.writeFileSync(outPath, output, 'utf-8');
console.log(`Generated ${digitalBooks.length} digital books → ${outPath}`);