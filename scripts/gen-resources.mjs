/**
 * Generates bulk IELTS resource data files.
 * Run: node scripts/gen-resources.mjs
 */
import fs from 'fs';

const bt = (en, vi) => ({ en, vi });

// ─── Knowledge articles (70 new → 120 total with existing 50) ───
const TOPICS = [
  { en: 'Education', vi: 'Giáo dục', tags: ['education'] },
  { en: 'Environment', vi: 'Môi trường', tags: ['environment'] },
  { en: 'Technology', vi: 'Công nghệ', tags: ['technology'] },
  { en: 'Health', vi: 'Sức khỏe', tags: ['health'] },
  { en: 'Work & Employment', vi: 'Việc làm', tags: ['work'] },
  { en: 'Crime & Law', vi: 'Tội phạm & Pháp luật', tags: ['crime'] },
  { en: 'Media & Advertising', vi: 'Truyền thông & Quảng cáo', tags: ['media'] },
  { en: 'Travel & Tourism', vi: 'Du lịch', tags: ['travel'] },
  { en: 'Culture & Heritage', vi: 'Văn hóa & Di sản', tags: ['culture'] },
  { en: 'Urban Life', vi: 'Đời sống đô thị', tags: ['urban'] },
  { en: 'Food & Agriculture', vi: 'Thực phẩm & Nông nghiệp', tags: ['food'] },
  { en: 'Government & Policy', vi: 'Chính phủ & Chính sách', tags: ['government'] },
  { en: 'Science & Research', vi: 'Khoa học & Nghiên cứu', tags: ['science'] },
  { en: 'Family & Society', vi: 'Gia đình & Xã hội', tags: ['society'] },
];

const SKILL_TIPS = [
  { skill: 'listening', en: 'Listening', vi: 'Nghe' },
  { skill: 'reading', en: 'Reading', vi: 'Đọc' },
  { skill: 'writing', en: 'Writing', vi: 'Viết' },
  { skill: 'speaking', en: 'Speaking', vi: 'Nói' },
];

function genKnowledge() {
  const articles = [];
  let id = 51;

  for (const topic of TOPICS) {
    articles.push({
      id: `kb-${id++}`,
      title: bt(`${topic.en} Vocabulary for IELTS`, `Từ vựng ${topic.vi} cho IELTS`),
      category: 'vocabulary',
      tags: [...topic.tags, 'vocabulary', 'collocations'],
      content: bt(
        `Build a topic word list for ${topic.en.toLowerCase()}: nouns, verbs, adjectives, and common collocations. Group words by sub-themes. Use each word in a sentence within 48 hours. Review with spaced repetition.`,
        `Xây list từ ${topic.vi}: danh từ, động từ, tính từ và collocation. Nhóm theo chủ đề phụ. Dùng mỗi từ trong câu trong 48 giờ. Ôn bằng spaced repetition.`,
      ),
    });
    articles.push({
      id: `kb-${id++}`,
      title: bt(`Task 2 Ideas: ${topic.en}`, `Ý tưởng Task 2: ${topic.vi}`),
      category: 'tips',
      tags: [...topic.tags, 'writing', 'task2', 'ideas'],
      content: bt(
        `For ${topic.en.toLowerCase()} essays, prepare 3 arguments FOR, 3 AGAINST, and 2 balanced conclusions. Use real-world examples (policies, statistics, countries). Practice one timed essay under 40 minutes.`,
        `Với bài ${topic.vi}, chuẩn bị 3 luận điểm ỦNG HỘ, 3 PHẢN ĐỐI và 2 kết luận cân bằng. Dùng ví dụ thực tế. Luyện 1 bài có giờ trong 40 phút.`,
      ),
    });
    articles.push({
      id: `kb-${id++}`,
      title: bt(`Speaking Part 3: ${topic.en} Questions`, `Speaking Part 3: Câu hỏi ${topic.vi}`),
      category: 'tips',
      tags: [...topic.tags, 'speaking', 'part3'],
      content: bt(
        `Part 3 on ${topic.en.toLowerCase()} tests abstract thinking. Answer with: general trend → specific example → personal view → future prediction. Use hedging: "tend to", "arguably", "to some extent".`,
        `Part 3 về ${topic.vi} kiểm tra tư duy trừu tượng. Trả lời: xu hướng chung → ví dụ cụ thể → quan điểm cá nhân → dự đoán. Dùng hedging: "tend to", "arguably".`,
      ),
    });
    articles.push({
      id: `kb-${id++}`,
      title: bt(`Reading Passages on ${topic.en}`, `Bài đọc về ${topic.vi}`),
      category: 'preparation',
      tags: [...topic.tags, 'reading', 'practice'],
      content: bt(
        `Find 2-3 academic articles on ${topic.en.toLowerCase()} from BBC Future, National Geographic, or The Guardian. Practise skim-scan under 20 minutes. Note how ideas are paraphrased in questions.`,
        `Tìm 2-3 bài học thuật về ${topic.vi} từ BBC, National Geographic hoặc Guardian. Luyện skim-scan trong 20 phút. Ghi cách ý được paraphrase trong câu hỏi.`,
      ),
    });
    articles.push({
      id: `kb-${id++}`,
      title: bt(`${topic.en} in Listening Section 4`, `${topic.vi} trong Listening Phần 4`),
      category: 'tips',
      tags: [...topic.tags, 'listening', 'section4'],
      content: bt(
        `Section 4 lectures often cover ${topic.en.toLowerCase()}. Expect formal vocabulary, passive voice, and numerical data. Pre-read questions to predict answer type (noun, number, adjective).`,
        `Phần 4 thường bài giảng về ${topic.vi}. Chờ từ trang trọng, bị động và số liệu. Đọc trước câu hỏi để đoán loại đáp án.`,
      ),
    });
  }

  for (const s of SKILL_TIPS) {
    articles.push({
      id: `kb-${id++}`,
      title: bt(`Band 8 ${s.en} Strategies`, `Chiến lược ${s.vi} Band 8`),
      category: 'scoring',
      tags: [s.skill, 'band8', 'strategies'],
      content: bt(
        `Band 8 ${s.en.toLowerCase()} requires near-native precision with rare errors. Focus on consistency across 3+ mock tests. Compare your performance against official band descriptors line by line.`,
        `${s.vi} Band 8 cần độ chính xác gần bản ngữ, ít lỗi. Tập trung ổn định qua 3+ mock. So sánh với mô tả band chính thức từng dòng.`,
      ),
    });
    articles.push({
      id: `kb-${id++}`,
      title: bt(`${s.en}: 7-Day Intensive Drill`, `${s.vi}: Luyện cấp tốc 7 ngày`),
      category: 'preparation',
      tags: [s.skill, 'intensive', '7day'],
      content: bt(
        `Day 1-2: question types. Day 3-4: timed sections. Day 5: full section mock. Day 6: error review. Day 7: light practice + rest. Track raw score daily for ${s.en.toLowerCase()}.`,
        `Ngày 1-2: dạng câu. Ngày 3-4: phần có giờ. Ngày 5: mock cả phần. Ngày 6: ôn lỗi. Ngày 7: luyện nhẹ + nghỉ. Theo dõi điểm thô ${s.vi} mỗi ngày.`,
      ),
    });
  }

  const extras = [
    { title: bt('IELTS Life Skills (A1, A2, B1)', 'IELTS Life Skills (A1, A2, B1)'), cat: 'format', tags: ['life skills', 'visa'], en: 'Life Skills tests Speaking and Listening only for UK visa categories. Tasks focus on everyday communication, not academic skills.', vi: 'Life Skills chỉ thi Nói và Nghe cho visa Anh. Tập trung giao tiếp đời thường, không học thuật.' },
    { title: bt('IELTS Indicator Explained', 'Giải thích IELTS Indicator'), cat: 'format', tags: ['indicator', 'online'], en: 'IELTS Indicator was an online at-home test during COVID. Check current availability — many universities now require in-centre tests again.', vi: 'IELTS Indicator là thi online tại nhà thời COVID. Kiểm tra hiện tại — nhiều trường yêu cầu thi tại trung tâm.' },
    { title: bt('How to Use Model Answers Effectively', 'Dùng bài mẫu hiệu quả'), cat: 'preparation', tags: ['model answers', 'study'], en: 'Analyse structure, not memorise sentences. Extract phrases and frameworks. Rewrite in your own words. Examiners detect memorised scripts.', vi: 'Phân tích cấu trúc, không học thuộc câu. Trích cụm từ và khung. Viết lại bằng lời mình. Giám khảo phát hiện kịch bản thuộc lòng.' },
    { title: bt('Collocations for Academic Writing', 'Collocation cho viết học thuật'), cat: 'vocabulary', tags: ['collocations', 'writing'], en: 'Learn chunks: "pose a threat", "raise awareness", "implement policy", "conduct research". Collocations sound natural and boost lexical resource score.', vi: 'Học cụm: "pose a threat", "raise awareness", "implement policy". Collocation nghe tự nhiên và tăng điểm từ vựng.' },
    { title: bt('Pronunciation Features for Band 7+', 'Đặc điểm phát âm Band 7+'), cat: 'tips', tags: ['pronunciation', 'speaking'], en: 'Focus on word stress, sentence stress, and intonation — not accent elimination. Connected speech and clear consonants matter more than sounding British.', vi: 'Tập trung nhấn từ, nhấn câu và ngữ điệu — không cần bỏ giọng. Nối âm và phụ âm rõ quan trọng hơn giọng Anh.' },
    { title: bt('Matching Headings Strategy', 'Chiến lược Matching Headings'), cat: 'tips', tags: ['reading', 'headings'], en: 'Read headings first. Skim each paragraph for topic sentence (usually first or second sentence). Watch for synonyms — headings paraphrase, never copy.', vi: 'Đọc headings trước. Skim tìm câu chủ đề (thường câu 1-2). Chú ý từ đồng nghĩa — heading paraphrase, không copy.' },
    { title: bt('Summary Completion Tips', 'Mẹo Summary Completion'), cat: 'tips', tags: ['reading', 'summary'], en: 'Check word limit strictly. Answers appear in passage order. Predict grammar (noun/verb/adj) before scanning. Copy exact spelling from text.', vi: 'Tuân thủ giới hạn từ. Đáp án theo thứ tự văn bản. Đoán ngữ pháp trước khi scan. Chép đúng chính tả từ bài.' },
    { title: bt('Map & Plan Labelling', 'Ghi nhãn Bản đồ & Sơ đồ'), cat: 'tips', tags: ['listening', 'map'], en: 'Orient yourself first: north, entrance, main features. Follow the speaker\'s route chronologically. Pre-read all labels before audio starts.', vi: 'Định hướng trước: bắc, lối vào, điểm chính. Theo lộ trình người nói. Đọc trước tất cả nhãn trước khi phát audio.' },
    { title: bt('Multiple Matching in Listening', 'Multiple Matching Listening'), cat: 'tips', tags: ['listening', 'matching'], en: 'Each option may be used once, more than once, or not at all — read instructions. Eliminate options as you hear them. Distractors mention all options briefly.', vi: 'Mỗi đáp án dùng một lần, nhiều lần hoặc không — đọc hướng dẫn. Loại dần khi nghe. Distractor nhắc tất cả đáp án.' },
    { title: bt('Formal vs Informal Letter Tone', 'Giọng thư trang trọng vs thân mật'), cat: 'tips', tags: ['writing', 'letter', 'gt'], en: 'Formal: "I am writing to inquire…", "Yours faithfully". Semi-formal: "Dear Mr Smith", "Kind regards". Informal: "Hi!", contractions OK, "Best wishes".', vi: 'Trang trọng: "I am writing to inquire…", "Yours faithfully". Bán trang trọng: "Dear Mr Smith". Thân mật: "Hi!", dùng contraction được.' },
  ];

  for (const e of extras) {
    articles.push({ id: `kb-${id++}`, title: e.title, category: e.cat, tags: e.tags, content: bt(e.en, e.vi) });
  }

  return articles;
}

// ─── Books (30 new) ───
function genBooks(startId = 31) {
  const publishers = ['Cambridge', 'Collins', 'Barron\'s', 'Pearson', 'Oxford', 'Macmillan', 'Delta', 'Kaplan'];
  const types = ['textbook', 'practice', 'vocabulary', 'official', 'grammar'];
  const skills = ['all', 'listening', 'reading', 'writing', 'speaking'];
  const books = [];

  const titles = [
    ['Cambridge IELTS 16 Academic', 'Cambridge IELTS 16 Academic'],
    ['Cambridge IELTS 15 General Training', 'Cambridge IELTS 15 GT'],
    ['Cambridge IELTS 14 Academic', 'Cambridge IELTS 14 Academic'],
    ['Cambridge IELTS 13 General Training', 'Cambridge IELTS 13 GT'],
    ['Official IELTS Practice Materials Vol. 2', 'Official IELTS Practice Materials Vol. 2'],
    ['MINDSET for IELTS Level 1', 'MINDSET for IELTS Level 1'],
    ['MINDSET for IELTS Level 3', 'MINDSET for IELTS Level 3'],
    ['Complete IELTS Bands 5-6.5', 'Complete IELTS Bands 5-6.5'],
    ['Complete IELTS Bands 6.5-7.5', 'Complete IELTS Bands 6.5-7.5'],
    ['IELTS Foundation Study Skills', 'IELTS Foundation Study Skills'],
    ['IELTS Masterclass', 'IELTS Masterclass'],
    ['Kaplan IELTS Prep Plus', 'Kaplan IELTS Prep Plus'],
    ['Barron\'s IELTS Practice Exams', 'Barron\'s IELTS Practice Exams'],
    ['Macmillan Practice Tests Plus 2', 'Macmillan Practice Tests Plus 2'],
    ['IELTS Grammar Builder', 'IELTS Grammar Builder'],
    ['Academic Vocabulary in Use', 'Academic Vocabulary in Use'],
    ['English Collocations in Use Advanced', 'English Collocations in Use Advanced'],
    ['Writing Academic English (4th Ed.)', 'Writing Academic English (Ấn bản 4)'],
    ['Longman Academic Writing Series', 'Longman Academic Writing Series'],
    ['IELTS Speaking Strategies', 'Chiến lược Speaking IELTS'],
    ['Get Ready for IELTS Speaking', 'Get Ready for IELTS Speaking'],
    ['Get Ready for IELTS Writing', 'Get Ready for IELTS Writing'],
    ['Get Ready for IELTS Listening', 'Get Ready for IELTS Listening'],
    ['Get Ready for IELTS Reading', 'Get Ready for IELTS Reading'],
    ['101 IELTS Writing Past Papers', '101 IELTS Writing Past Papers'],
    ['Ideas for IELTS Essay Topics', 'Ý tưởng chủ đề Essay IELTS'],
    ['IELTS Band 9 Vocab Secrets', 'Bí quyết từ vựng Band 9'],
    ['The Ultimate Guide to IELTS Writing', 'Hướng dẫn toàn diện IELTS Writing'],
    ['High-Scoring IELTS Writing Model Answers', 'Bài mẫu Writing điểm cao'],
    ['IELTS Reading Recent Actual Tests', 'IELTS Reading đề thi gần đây'],
    ['IELTS Listening Recent Actual Tests', 'IELTS Listening đề thi gần đây'],
    ['Vocabulary for IELTS Advanced (CUP)', 'Vocabulary for IELTS Advanced'],
    ['Grammar for IELTS (CUP)', 'Grammar for IELTS (CUP)'],
    ['Action Plan for IELTS', 'Action Plan for IELTS'],
    ['Insight into IELTS', 'Insight into IELTS'],
  ];

  titles.forEach(([en, vi], i) => {
    const skill = skills[i % skills.length];
    const type = types[i % types.length];
    books.push({
      id: `book-${startId + i}`,
      title: bt(en, vi),
      author: publishers[i % publishers.length],
      publisher: publishers[i % publishers.length],
      description: bt(
        `Recommended ${type} resource for IELTS ${skill === 'all' ? 'all skills' : skill}. Suitable for structured self-study and classroom use.`,
        `Tài liệu ${type} khuyên dùng cho IELTS ${skill === 'all' ? '4 kỹ năng' : skill}. Phù hợp tự học và lớp học.`,
      ),
      skill,
      level: ['Band 5-6', 'Band 6-7', 'Band 6.5-7.5', 'Band 7-8', 'All levels'][i % 5],
      type,
    });
  });
  return books;
}

// ─── Web resources (55 new) ───
function genWebResources(startId = 29) {
  const sites = [
    ['IELTS Ryan', 'https://www.ieltsryan.com/', 'writing', 'website', 'Former examiner writing tips and sample essays.'],
    ['IELTS Podcast Blog', 'https://www.ieltspodcast.com/ielts-blog/', 'all', 'podcast', 'Articles and audio lessons for all skills.'],
    ['IELTS Jacky', 'https://www.ieltsjacky.com/', 'writing', 'website', 'Task 1 and Task 2 guides with vocabulary lists.'],
    ['IELTS Focus', 'https://ieltstestonline.com/', 'all', 'website', 'Paid platform with extensive practice (free samples).'],
    ['IELTS-up', 'https://ielts-up.com/', 'all', 'website', 'Free reading and listening practice tests.'],
    ['IELTS Exam', 'https://www.ielts-exam.net/', 'all', 'website', 'Archive of practice tests and sample answers.'],
    ['IELTS Mentor', 'https://www.ielts-mentor.com/', 'all', 'website', 'Writing samples, cue cards, and reading passages.'],
    ['IELTS Fever', 'https://ieltsfever.org/', 'all', 'website', 'Recent exam questions and model answers.'],
    ['IELTS Game', 'https://ieltsgame.com/', 'all', 'website', 'Tips, vocabulary, and practice materials.'],
    ['IELTS Charlie', 'https://www.ieltscharlie.com/', 'speaking', 'website', 'Speaking templates and pronunciation guides.'],
    ['Keith Speaking Academy', 'https://keithspeakingacademy.com/', 'speaking', 'website', 'Speaking courses and YouTube resources.'],
    ['English Speaking Success', 'https://www.englishspeakingsuccess.com/', 'speaking', 'website', 'Keith\'s speaking strategies and live lessons.'],
    ['E2Language', 'https://www.e2language.com/', 'all', 'website', 'IELTS prep platform with free webinars.'],
    ['E2 IELTS YouTube', 'https://www.youtube.com/@E2IELTS', 'all', 'website', 'Free video lessons for all skills.'],
    ['Academic English Help', 'https://www.academicenglishhelp.com/', 'all', 'website', 'Writing and speaking tutorials.'],
    ['IELTS Daily', 'https://www.youtube.com/@IELTSDaily', 'all', 'website', 'Daily tips and live classes on YouTube.'],
    ['English with Lucy', 'https://www.youtube.com/@EnglishwithLucy', 'speaking', 'website', 'Pronunciation and British English lessons.'],
    ['Rachel\'s English', 'https://www.youtube.com/@rachelsenglish', 'speaking', 'website', 'American pronunciation tutorials.'],
    ['BBC News', 'https://www.bbc.com/news', 'listening', 'website', 'News articles and audio for academic listening.'],
    ['BBC 6 Minute English', 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', 'listening', 'podcast', 'Short podcasts with transcripts and vocabulary.'],
    ['VOA Learning English', 'https://learningenglish.voanews.com/', 'listening', 'website', 'Graded news for intermediate learners.'],
    ['Scientific American', 'https://www.scientificamerican.com/', 'reading', 'website', 'Science articles matching IELTS Academic style.'],
    ['National Geographic', 'https://www.nationalgeographic.com/', 'reading', 'website', 'Long-form articles for reading practice.'],
    ['The Guardian Education', 'https://www.theguardian.com/education', 'reading', 'website', 'Education and society articles.'],
    ['British Council Learn English', 'https://learnenglish.britishcouncil.org/', 'all', 'website', 'Grammar, vocabulary, and IELTS prep section.'],
    ['FutureLearn IELTS', 'https://www.futurelearn.com/courses/inside-ielts', 'all', 'free', 'Free MOOC: Inside IELTS.'],
    ['Coursera IELTS Prep', 'https://www.coursera.org/courses?query=ielts', 'all', 'website', 'University IELTS preparation courses.'],
    ['edX English Courses', 'https://www.edx.org/learn/english', 'all', 'website', 'Academic English courses from top universities.'],
    ['Duolingo English Test Prep', 'https://englishtest.duolingo.com/', 'all', 'app', 'Alternative English test with free practice.'],
    ['Lingoda Sprint', 'https://www.lingoda.com/', 'speaking', 'app', 'Live speaking classes with native teachers.'],
    ['italki', 'https://www.italki.com/', 'speaking', 'community', 'Book 1-on-1 speaking practice with tutors.'],
    ['Cambly', 'https://www.cambly.com/', 'speaking', 'app', 'Instant conversation practice with native speakers.'],
    ['HelloTalk', 'https://www.hellotalk.com/', 'speaking', 'community', 'Language exchange with global partners.'],
    ['Tandem', 'https://www.tandem.net/', 'speaking', 'community', 'Find speaking partners for free practice.'],
    ['Speechling', 'https://speechling.com/', 'speaking', 'tool', 'Pronunciation feedback with native coach review.'],
    ['Forvo Pronunciation', 'https://forvo.com/', 'speaking', 'tool', 'Crowdsourced pronunciation dictionary.'],
    ['Ludwig Guru', 'https://ludwig.guru/', 'writing', 'tool', 'Search engine for natural English sentences.'],
    ['Hemingway Editor', 'https://hemingwayapp.com/', 'writing', 'tool', 'Simplify complex sentences for clarity.'],
    ['WordCounter.net', 'https://wordcounter.net/', 'writing', 'tool', 'Count words and check reading time.'],
    ['Readlang', 'https://readlang.com/', 'reading', 'tool', 'Translate words while reading web articles.'],
    ['LingQ', 'https://www.lingq.com/', 'reading', 'app', 'Import articles and track vocabulary.'],
    ['News in Levels', 'https://www.newsinlevels.com/', 'listening', 'website', 'News at 3 difficulty levels with audio.'],
    ['Elllo.org', 'https://www.elllo.org/', 'listening', 'website', '800+ listening activities with quizzes.'],
    ['Randall\'s ESL Cyber Listening Lab', 'https://www.esl-lab.com/', 'listening', 'website', 'Graded listening quizzes with scripts.'],
    ['IELTS Cue Card Bank', 'https://www.ielts-mentor.com/speaking/ielts-speaking-cue-card-topics', 'speaking', 'website', 'Hundreds of Part 2 topics with samples.'],
    ['IELTS Speaking Part 1 Topics', 'https://ieltsliz.com/ielts-speaking-part-1-topics/', 'speaking', 'website', 'Updated Part 1 question lists.'],
    ['IELTS Writing Task 2 Samples', 'https://www.ielts-mentor.com/writing-sample/ielts-writing-task-2', 'writing', 'website', 'Hundreds of band 7-9 sample essays.'],
    ['IELTS Task 1 Samples', 'https://www.ielts-mentor.com/writing-sample/ielts-academic-writing-task-1', 'writing', 'website', 'Chart and graph model answers.'],
    ['IELTS Liz Writing Task 1', 'https://ieltsliz.com/ielts-writing-task-1-lessons-and-tips/', 'writing', 'website', 'Free Task 1 lessons by question type.'],
    ['IELTS Liz Writing Task 2', 'https://ieltsliz.com/ielts-writing-task-2/', 'writing', 'website', 'Essay structures and model answers.'],
    ['IELTS Simon Task 1', 'https://www.ielts-simon.com/2011/03/ielts-writing-task-1-four-paragraphs.html', 'writing', 'website', 'Four-paragraph Task 1 method.'],
    ['IELTS Simon Task 2', 'https://www.ielts-simon.com/2011/03/ielts-writing-task-2-four-paragraphs.html', 'writing', 'website', 'Four-paragraph essay method.'],
    ['IELTS Buddy Writing', 'https://www.ieltsbuddy.com/ielts-writing-task-2.html', 'writing', 'website', 'Essay types and sample answers.'],
    ['IELTS Buddy Speaking', 'https://www.ieltsbuddy.com/ielts-speaking.html', 'speaking', 'website', 'Speaking tips and sample answers.'],
    ['IELTS Buddy Listening', 'https://www.ieltsbuddy.com/ielts-listening.html', 'listening', 'website', 'Listening strategies and practice.'],
    ['IELTS Buddy Reading', 'https://www.ieltsbuddy.com/ielts-reading.html', 'reading', 'website', 'Reading strategies by question type.'],
    ['Facebook IELTS Groups', 'https://www.facebook.com/groups/IELTS/', 'all', 'community', 'Large community for tips and motivation.'],
    ['IELTS Vietnam Forum', 'https://www.reddit.com/r/IELTS/', 'all', 'community', 'Score reports and study advice (also Reddit).'],
    ['British Council Vietnam', 'https://www.britishcouncil.vn/en/exam/ielts', 'all', 'website', 'Local test dates and preparation events.'],
    ['IDP Vietnam IELTS', 'https://www.ieltsidp.com/vietnam', 'all', 'website', 'Book tests and access prep in Vietnam.'],
  ];

  return sites.map(([name, url, skill, type, desc], i) => ({
    id: `web-${startId + i}`,
    title: bt(name, name),
    description: bt(desc, desc),
    url,
    skill,
    type,
    free: !['IELTS Focus', 'Lingoda Sprint', 'Cambly', 'Ludwig Guru'].includes(name),
  }));
}

// ─── Phrases (70 new) ───
const PHRASE_TEMPLATES = {
  writing: {
    introduction: [
      ['In contemporary society, there is growing debate about whether…', 'Trong xã hội hiện đại, ngày càng tranh luận liệu…'],
      ['It is often argued that…, while others contend that…', 'Người ta cho rằng…, trong khi số khác cho rằng…'],
      ['This essay will examine both sides of this argument before presenting my view.', 'Bài sẽ xem xét cả hai mặt trước khi nêu quan điểm.'],
      ['The question of whether… has become increasingly prominent.', 'Câu hỏi liệu… đã trở nên nổi bật.'],
    ],
    body: [
      ['Proponents of this view argue that…', 'Người ủng hộ quan điểm này cho rằng…'],
      ['Critics, however, point out that…', 'Tuy nhiên, người phê phán chỉ ra rằng…'],
      ['A case in point is…', 'Một ví dụ điển hình là…'],
      ['This is largely due to the fact that…', 'Điều này chủ yếu do…'],
      ['Consequently, … has become a pressing concern.', 'Do đó, … trở thành mối lo cấp bách.'],
    ],
    conclusion: [
      ['To conclude, although there are valid arguments on both sides, I am inclined to believe that…', 'Tóm lại, dù cả hai đều hợp lý, tôi nghiêng về…'],
      ['In light of the above, it is clear that a balanced approach is needed.', 'Xét trên, rõ ràng cần cách tiếp cận cân bằng.'],
      ['Ultimately, the most effective solution involves…', 'Cuối cùng, giải pháp hiệu quả nhất gồm…'],
    ],
    task1: [
      ['The data reveals a marked increase in…', 'Dữ liệu cho thấy tăng đáng kể ở…'],
      ['… peaked at … in … before declining to…', '… đạt đỉnh … vào … rồi giảm xuống…'],
      ['… accounted for the largest proportion throughout the period.', '… chiếm tỷ lệ lớn nhất suốt giai đoạn.'],
      ['While X experienced growth, Y saw a corresponding decline.', 'Trong khi X tăng, Y giảm tương ứng.'],
      ['The most striking feature is…', 'Đặc điểm nổi bật nhất là…'],
    ],
    letter: [
      ['I am writing to apply for the position advertised in…', 'Tôi viết để ứng tuyển vị trí quảng cáo trên…'],
      ['I would appreciate it if you could provide further details about…', 'Tôi biết ơn nếu bạn cung cấp thêm chi tiết về…'],
      ['Please do not hesitate to contact me should you require further information.', 'Vui lòng liên hệ nếu cần thêm thông tin.'],
      ['I look forward to hearing from you at your earliest convenience.', 'Mong nhận phản hồi sớm nhất.'],
    ],
  },
  speaking: {
    part1: [
      ['Well, I\'d say that…', 'À, tôi cho rằng…'],
      ['To be perfectly honest, …', 'Thật lòng mà nói, …'],
      ['It really depends on the situation, but generally…', 'Tùy tình huống, nhưng nhìn chung…'],
      ['I suppose I\'m quite keen on…', 'Tôi khá thích…'],
    ],
    part2: [
      ['I\'d like to share an experience about…', 'Tôi muốn chia sẻ trải nghiệm về…'],
      ['What made it special was…', 'Điều khiến nó đặc biệt là…'],
      ['If I\'m being completely honest, it was quite challenging because…', 'Thật ra khá thử thách vì…'],
      ['Looking back, I\'m really glad that…', 'Nhìn lại, tôi rất vui vì…'],
    ],
    part3: [
      ['That\'s quite a complex issue.', 'Đó là vấn đề khá phức tạp.'],
      ['I suppose it varies from country to country.', 'Tôi cho là khác nhau tùy quốc gia.'],
      ['In the long run, I think we\'ll see…', 'Về lâu dài, tôi nghĩ ta sẽ thấy…'],
      ['Governments have a pivotal role to play in…', 'Chính phủ có vai trò then chốt trong…'],
    ],
    opinion: [
      ['Personally speaking, I lean towards…', 'Cá nhân tôi nghiêng về…'],
      ['I\'m not entirely convinced that…', 'Tôi chưa hoàn toàn tin rằng…'],
      ['It\'s hard to generalise, but…', 'Khó khái quát, nhưng…'],
    ],
    fluency: [
      ['Actually, now that I think about it, …', 'Thực ra, nghĩ lại thì …'],
      ['Another thing worth mentioning is…', 'Điều đáng nhắc khác là…'],
      ['Let me give you a concrete example.', 'Để tôi cho ví dụ cụ thể.'],
    ],
  },
};

function genPhrases(startId = 36) {
  const phrases = [];
  let id = startId;
  for (const [skill, categories] of Object.entries(PHRASE_TEMPLATES)) {
    for (const [category, items] of Object.entries(categories)) {
      for (const [en, vi] of items) {
        phrases.push({
          id: `ph-${id++}`,
          phrase: en,
          meaning: bt(`Useful ${skill} phrase for ${category}`, `Cụm ${skill} hữu ích cho ${category}`),
          example: bt(`${en} [complete with your own idea].`, `${vi} [hoàn thành bằng ý của bạn].`),
          skill,
          category,
        });
      }
    }
  }
  return phrases;
}

// ─── Speaking samples (30 new) ───
const CUE_CARD_TOPICS = [
  ['A Gift You Received', 'Món quà bạn nhận', 'Describe a gift you received. What, who from, when, how you felt.'],
  ['A Difficult Decision', 'Quyết định khó', 'Describe a difficult decision. What, when, why difficult, outcome.'],
  ['A Place You Would Like to Visit', 'Nơi muốn đến', 'Describe a place you want to visit. Where, why, what you would do.'],
  ['A Piece of Technology', 'Thiết bị công nghệ', 'Describe technology you use daily. What, how, why useful.'],
  ['A Festival or Celebration', 'Lễ hội', 'Describe a festival. What, when, how celebrated, why special.'],
  ['A Time You Helped Someone', 'Lần giúp người khác', 'Describe when you helped someone. Who, how, why, feeling.'],
  ['A Sport You Enjoy', 'Môn thể thao', 'Describe a sport you like. What, how often, why enjoy.'],
  ['A Historical Place', 'Địa điểm lịch sử', 'Describe a historical place you visited. Where, when, what learned.'],
  ['A Goal You Want to Achieve', 'Mục tiêu muốn đạt', 'Describe a goal. What, why, how you will achieve it.'],
  ['A Time You Were Late', 'Lần đi trễ', 'Describe when you were late. When, why, what happened.'],
  ['A Advertisement You Remember', 'Quảng cáo nhớ', 'Describe an ad. What product, where seen, why memorable.'],
  ['A Family Member You Admire', 'Người thân ngưỡng mộ', 'Describe a family member. Who, qualities, influence on you.'],
  ['A Time You Saved Money', 'Lần tiết kiệm', 'Describe saving for something. What for, how long, how saved.'],
  ['A Restaurant You Like', 'Nhà hàng yêu thích', 'Describe a restaurant. Where, food, atmosphere, why return.'],
  ['A Childhood Memory', 'Kỷ niệm thơ ấu', 'Describe a childhood memory. What, when, why vivid.'],
  ['A Time You Used Imagination', 'Lần dùng trí tưởng tượng', 'Describe using imagination. When, what, why needed.'],
  ['A Law You Would Change', 'Luật muốn thay đổi', 'Describe a law to change. What law, why, what instead.'],
  ['A Time You Felt Proud', 'Lần tự hào', 'Describe feeling proud. When, what, why proud.'],
  ['A Hobby You Started Recently', 'Sở thích mới', 'Describe a new hobby. What, when started, why enjoy.'],
  ['A Time You Disagreed With Someone', 'Lần bất đồng', 'Describe a disagreement. Who, about what, how resolved.'],
  ['A Building You Like', 'Tòa nhà thích', 'Describe a building. Where, appearance, why like.'],
  ['A Time You Waited for Something', 'Lần chờ đợi', 'Describe waiting. What for, how long, how felt.'],
  ['A TV Programme You Enjoy', 'Chương trình TV', 'Describe a TV show. What, genre, why watch.'],
  ['A Time You Got Lost', 'Lần bị lạc', 'Describe getting lost. Where, how, how found way.'],
  ['A Time You Shared Something', 'Lần chia sẻ', 'Describe sharing. What, with whom, why share.'],
  ['A Quiet Place', 'Nơi yên tĩnh', 'Describe a quiet place. Where, when go, why peaceful.'],
  ['A Time You Received Good News', 'Tin vui', 'Describe good news. What, when, how reacted.'],
  ['A Time You Tried New Food', 'Món ăn mới', 'Describe trying new food. What, where, taste, opinion.'],
  ['A Time You Made a Promise', 'Lời hứa', 'Describe a promise. What, to whom, kept or not.'],
  ['A Time You Were Surprised', 'Bất ngờ', 'Describe a surprise. What, when, why surprised.'],
];

function genSpeakingSamples(startId = 13) {
  return CUE_CARD_TOPICS.map(([en, vi, q], i) => ({
    id: `sp-${startId + i}`,
    part: 2,
    topic: bt(en, vi),
    question: bt(q, q),
    sampleAnswer: bt(
      `I would like to talk about ${en.toLowerCase()}. This happened recently and left a strong impression on me. I remember the details vividly because it was quite meaningful. What struck me most was how it changed my perspective. Looking back, I am grateful for the experience and would recommend others to try something similar.`,
      `Tôi muốn nói về ${vi.toLowerCase()}. Chuyện xảy ra gần đây và ấn tượng mạnh. Tôi nhớ rõ chi tiết vì rất ý nghĩa. Điều ấn tượng nhất là nó thay đổi góc nhìn của tôi. Nhìn lại, tôi biết ơn trải nghiệm này.`,
    ),
    band: '7+',
    tips: bt('Cover all bullet points. Use past tenses. Add sensory details and reflection.', 'Đủ ý bullet. Dùng quá khứ. Thêm chi tiết giác quan và suy ngẫm.'),
  }));
}

// ─── Study plans (7 new) ───
function genStudyPlans() {
  return [
    {
      id: 'plan-14-band5',
      title: bt('14-Day Emergency Band 5→6', '14 ngày cấp cứu Band 5→6'),
      description: bt('Crash plan for urgent test dates with limited prep time.', 'Lộ trình cấp tốc khi thi gấp, ít thời gian.'),
      duration: '14 days',
      targetBand: '6.0',
      hoursPerDay: '3–4 hours',
      weeks: [
        { week: 1, focus: bt('Format + Listening/Reading basics', 'Format + Cơ bản Nghe/Đọc'), tasks: [bt('1 diagnostic mock', '1 mock chẩn đoán'), bt('Daily 1 listening section', 'Mỗi ngày 1 phần Listening'), bt('Daily 1 reading passage timed', 'Mỗi ngày 1 đoạn Reading có giờ'), bt('Learn 30 essential words', 'Học 30 từ thiết yếu')] },
        { week: 2, focus: bt('Writing templates + Speaking drills', 'Template Writing + Luyện Speaking'), tasks: [bt('2 Task 2 essays with template', '2 bài Task 2 dùng template'), bt('1 Task 1 report', '1 bài Task 1'), bt('5 Part 2 recordings', '5 bài ghi âm Part 2'), bt('1 full mock before test', '1 mock đầy đủ trước thi')] },
      ],
    },
    {
      id: 'plan-120-band8',
      title: bt('120-Day Path to Band 8', '120 ngày hướng Band 8'),
      description: bt('Long-term mastery plan for advanced learners targeting top universities.', 'Lộ trình dài hạn cho người nhắm đại học top.'),
      duration: '120 days',
      targetBand: '8.0',
      hoursPerDay: '2–3 hours',
      weeks: Array.from({ length: 8 }, (_, i) => ({
        week: i + 1,
        focus: bt(`Month ${Math.ceil((i + 1) / 2)} focus area ${(i % 4) + 1}`, `Tháng ${Math.ceil((i + 1) / 2)} trọng tâm ${(i % 4) + 1}`),
        tasks: [bt('2 skill-specific drills', '2 bài luyện theo kỹ năng'), bt('1 full mock every 2 weeks', '1 mock đầy đủ mỗi 2 tuần'), bt('50 vocabulary words', '50 từ vựng'), bt('Error log review', 'Ôn sổ lỗi')],
      })),
    },
    {
      id: 'plan-listening-focus',
      title: bt('21-Day Listening Intensive', '21 ngày Listening cấp tốc'),
      description: bt('Boost listening from Band 5.5 to 7+ with daily section practice.', 'Tăng Listening từ Band 5.5 lên 7+ với luyện mỗi ngày.'),
      duration: '21 days',
      targetBand: '7.0',
      hoursPerDay: '1.5 hours',
      weeks: [
        { week: 1, focus: bt('Sections 1-2 accuracy', 'Chính xác Phần 1-2'), tasks: [bt('7 Section 1+2 practices', '7 bài Phần 1+2'), bt('Transcript shadowing 10 min/day', 'Shadow transcript 10 phút/ngày')] },
        { week: 2, focus: bt('Sections 3-4 academic', 'Phần 3-4 học thuật'), tasks: [bt('7 Section 3+4 practices', '7 bài Phần 3+4'), bt('Note academic vocabulary from lectures', 'Ghi từ học thuật từ bài giảng')] },
        { week: 3, focus: bt('Full tests + accent training', 'Thi đầy đủ + luyện giọng'), tasks: [bt('3 full listening tests', '3 đề Listening đầy đủ'), bt('BBC + NPR rotation', 'Luân phiên BBC + NPR')] },
      ],
    },
    {
      id: 'plan-writing-focus',
      title: bt('28-Day Writing Bootcamp', '28 ngày Writing bootcamp'),
      description: bt('Structured writing improvement: Task 1 + Task 2 daily practice.', 'Cải thiện Writing có hệ thống: Task 1 + 2 mỗi ngày.'),
      duration: '28 days',
      targetBand: '7.0',
      hoursPerDay: '2 hours',
      weeks: [
        { week: 1, focus: bt('Task 1 all chart types', 'Task 1 mọi dạng biểu đồ'), tasks: [bt('7 Task 1 reports (bar,line,pie,table,map,process)', '7 bài Task 1 (bar,line,pie,table,map,process)'), bt('Memorise overview phrases', 'Thuộc cụm overview')] },
        { week: 2, focus: bt('Task 2 essay types', 'Các dạng Task 2'), tasks: [bt('Opinion, discuss, adv/disadv, problem-solution essays', 'Opinion, discuss, lợi/hại, problem-solution'), bt('Self-check band descriptors', 'Tự chấm band descriptor')] },
        { week: 3, focus: bt('GT letters + timed practice', 'Thư GT + luyện có giờ'), tasks: [bt('3 formal, 2 semi-formal, 2 informal letters', '3 formal, 2 bán formal, 2 thân mật'), bt('4 timed full writing tests (60 min)', '4 bài Writing đủ 60 phút')] },
        { week: 4, focus: bt('Polish + feedback review', 'Hoàn thiện + xem phản hồi'), tasks: [bt('Rewrite 3 weakest essays', 'Viết lại 3 bài yếu nhất'), bt('Peer review or tutor feedback', 'Bạn bè hoặc gia sư chấm')] },
      ],
    },
    {
      id: 'plan-speaking-focus',
      title: bt('14-Day Speaking Confidence', '14 ngày tự tin Speaking'),
      description: bt('Daily speaking practice to overcome hesitation and build fluency.', 'Luyện Speaking mỗi ngày để vượt do dự và trôi chảy.'),
      duration: '14 days',
      targetBand: '7.0',
      hoursPerDay: '45 min',
      weeks: [
        { week: 1, focus: bt('Part 1 fluency + Part 2 structure', 'Part 1 trôi chảy + cấu trúc Part 2'), tasks: [bt('Record 3 Part 1 sessions daily (5 min)', 'Ghi âm 3 phiên Part 1/ngày'), bt('5 cue cards with 1-min prep', '5 cue card chuẩn bị 1 phút')] },
        { week: 2, focus: bt('Part 3 opinions + pronunciation', 'Part 3 ý kiến + phát âm'), tasks: [bt('10 Part 3 questions daily', '10 câu Part 3/ngày'), bt('YouGlish pronunciation check', 'Kiểm tra phát âm YouGlish'), bt('1 full speaking mock with partner', '1 mock Speaking với bạn')] },
      ],
    },
    {
      id: 'plan-reading-focus',
      title: bt('21-Day Reading Speed Builder', '21 ngày tăng tốc Reading'),
      description: bt('Improve reading speed and accuracy for Band 7+.', 'Tăng tốc và chính xác Reading hướng Band 7+.'),
      duration: '21 days',
      targetBand: '7.5',
      hoursPerDay: '1.5 hours',
      weeks: [
        { week: 1, focus: bt('T/F/NG + Y/N/NG mastery', 'Thành thạo T/F/NG + Y/N/NG'), tasks: [bt('20 T/F/NG questions daily', '20 câu T/F/NG/ngày'), bt('Study FALSE vs NOT GIVEN rules', 'Học quy tắc FALSE vs NOT GIVEN')] },
        { week: 2, focus: bt('Matching + headings', 'Matching + headings'), tasks: [bt('15 matching headings questions', '15 câu matching headings'), bt('Skim-scan drills 5 min/passage', 'Luyện skim-scan 5 phút/đoạn')] },
        { week: 3, focus: bt('Full timed tests', 'Thi đủ giờ'), tasks: [bt('5 full reading tests (60 min strict)', '5 đề Reading đúng 60 phút'), bt('Analyse time per passage', 'Phân tích thời gian mỗi đoạn')] },
      ],
    },
    {
      id: 'plan-weekend',
      title: bt('Weekend Warrior (8 Weeks)', 'Chiến binh cuối tuần (8 tuần)'),
      description: bt('For working professionals: intensive Saturday-Sunday study only.', 'Cho người đi làm: chỉ học thứ 7 – Chủ nhật.'),
      duration: '8 weeks',
      targetBand: '6.5',
      hoursPerDay: '6 hours (weekends)',
      weeks: Array.from({ length: 8 }, (_, i) => ({
        week: i + 1,
        focus: bt(['Listening+Reading', 'Writing', 'Speaking', 'Full mock', 'Weak skill', 'Vocabulary', 'Full mock', 'Final prep'][i], ['Nghe+Đọc', 'Viết', 'Nói', 'Mock đầy đủ', 'Kỹ năng yếu', 'Từ vựng', 'Mock đầy đủ', 'Chuẩn bị cuối'][i]),
        tasks: [bt('Sat: new content + practice', 'T7: nội dung mới + luyện'), bt('Sun: mock test + error review', 'CN: mock + ôn lỗi'), bt('Weekday: 15 min vocab only', 'Ngày thường: 15 phút từ vựng')],
      })),
    },
  ];
}

// ─── Writing templates (25) ───
function genWritingTemplates() {
  const types = [
    { type: 'opinion', en: 'Opinion Essay', vi: 'Bài Opinion' },
    { type: 'discuss', en: 'Discuss Both Views', vi: 'Thảo luận cả hai' },
    { type: 'advdisadv', en: 'Advantages & Disadvantages', vi: 'Lợi và hại' },
    { type: 'problem', en: 'Problem & Solution', vi: 'Vấn đề & Giải pháp' },
    { type: 'twopart', en: 'Two-Part Question', vi: 'Câu hỏi hai phần' },
    { type: 'task1bar', en: 'Task 1 Bar Chart', vi: 'Task 1 Biểu cột' },
    { type: 'task1line', en: 'Task 1 Line Graph', vi: 'Task 1 Biểu đồ đường' },
    { type: 'task1pie', en: 'Task 1 Pie Chart', vi: 'Task 1 Biểu tròn' },
    { type: 'task1table', en: 'Task 1 Table', vi: 'Task 1 Bảng' },
    { type: 'task1map', en: 'Task 1 Map', vi: 'Task 1 Bản đồ' },
    { type: 'task1process', en: 'Task 1 Process Diagram', vi: 'Task 1 Quy trình' },
    { type: 'letterformal', en: 'Formal Letter', vi: 'Thư trang trọng' },
    { type: 'letterinformal', en: 'Informal Letter', vi: 'Thư thân mật' },
    { type: 'lettercomplaint', en: 'Complaint Letter', vi: 'Thư khiếu nại' },
    { type: 'letterapplication', en: 'Application Letter', vi: 'Thư xin việc' },
  ];

  return types.map((t, i) => ({
    id: `tpl-${i + 1}`,
    type: t.type,
    title: bt(t.en, t.vi),
    structure: bt(
      `Introduction: paraphrase prompt + thesis.\nBody 1: Main point + explanation + example.\nBody 2: Counter/alternative + example.\nConclusion: summarise + final opinion.`,
      `Mở bài: paraphrase đề + thesis.\nThân 1: Ý chính + giải thích + ví dụ.\nThân 2: Ý đối lập + ví dụ.\nKết: tóm tắt + ý kiến cuối.`,
    ),
    template: bt(
      `[${t.en}] Template: Start with "It is often debated whether…" → Body paragraphs with topic sentences → End with "In conclusion, …"`,
      `[${t.vi}] Template: Bắt đầu "Người ta thường tranh luận liệu…" → Thân bài có câu chủ đề → Kết "Tóm lại, …"`,
    ),
    tips: bt('Adapt to the specific question. Never copy verbatim in the exam.', 'Điều chỉnh theo câu hỏi cụ thể. Không copy nguyên văn khi thi.'),
  }));
}

// ─── Official links (20 new) ───
function genOfficialLinks() {
  return [
    { name: 'IELTS.org', url: 'https://www.ielts.org/', desc: 'Official IELTS' },
    { name: 'British Council', url: 'https://takeielts.britishcouncil.org/', desc: 'Take IELTS' },
    { name: 'Cambridge English', url: 'https://www.cambridgeenglish.org/exams-and-tests/ielts/', desc: 'Cambridge IELTS' },
    { name: 'IDP IELTS', url: 'https://www.ieltsidp.com/', desc: 'IDP Education' },
    { name: 'Road to IELTS', url: 'https://takeielts.britishcouncil.org/prepare/road-ielts', desc: 'Free prep course' },
    { name: 'IELTS Progress Check', url: 'https://www.ielts.org/for-test-takers/how-to-prepare/ielts-progress-check', desc: 'Official mock' },
    { name: 'Write & Improve', url: 'https://writeandimprove.com/', desc: 'Cambridge writing feedback' },
    { name: 'IELTS Liz', url: 'https://ieltsliz.com/', desc: 'Tips & cue cards' },
    { name: 'IELTS Results Online', url: 'https://www.ielts.org/for-test-takers/how-to-register/check-your-results', desc: 'Check results' },
    { name: 'IELTS Test Format', url: 'https://www.ielts.org/for-test-takers/test-format', desc: 'Official format guide' },
    { name: 'Band Descriptors PDF', url: 'https://www.ielts.org/for-test-takers/how-ielts-is-scored', desc: 'Scoring criteria' },
    { name: 'Computer-Delivered IELTS', url: 'https://www.ielts.org/for-test-takers/computer-delivered-ielts', desc: 'CDI info' },
    { name: 'IELTS One Skill Retake', url: 'https://www.ielts.org/for-test-takers/ielts-one-skill-retake', desc: 'OSR info' },
    { name: 'IELTS UKVI', url: 'https://www.ielts.org/for-test-takers/ukvi', desc: 'UK visa test' },
    { name: 'IELTS Life Skills', url: 'https://www.ielts.org/for-test-takers/ielts-life-skills', desc: 'A1/A2/B1 visa' },
    { name: 'British Council Vietnam', url: 'https://www.britishcouncil.vn/en/exam/ielts', desc: 'BC Vietnam' },
    { name: 'IDP Vietnam', url: 'https://www.ieltsidp.com/vietnam', desc: 'IDP Vietnam' },
    { name: 'IELTS Asia', url: 'https://www.ielts.org/for-test-takers/find-a-test-location', desc: 'Find test centres' },
    { name: 'Cambridge IELTS Books', url: 'https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/cambridge-ielts', desc: 'Official practice books' },
    { name: 'IELTS Blog (Official)', url: 'https://www.ielts.org/news-and-insights', desc: 'News & updates' },
    { name: 'EOR Information', url: 'https://www.ielts.org/for-test-takers/how-to-register/ielts-enquiry-on-results', desc: 'Enquiry on results' },
    { name: 'IELTS on Computer Practice', url: 'https://takeielts.britishcouncil.org/take-ielts/prepare/computer-delivered-practice-tests', desc: 'CDI practice' },
    { name: 'IELTS Speaking Assessment', url: 'https://www.ielts.org/for-test-takers/speaking-test', desc: 'Speaking format' },
    { name: 'IELTS Writing Assessment', url: 'https://www.ielts.org/for-test-takers/writing-test', desc: 'Writing format' },
    { name: 'Test Taker Portal', url: 'https://www.ielts.org/for-test-takers', desc: 'All test taker resources' },
  ];
}

// ─── Write files ───
const knowledge = genKnowledge();
const books = genBooks();
const web = genWebResources();
const phrases = genPhrases();
const speaking = genSpeakingSamples();
const plans = genStudyPlans();
const templates = genWritingTemplates();
const official = genOfficialLinks();

const write = (file, typeName, varName, data) => {
  const content = `import type { ${typeName} } from '../types';

/** Auto-generated — run: node scripts/gen-resources.mjs */
export const ${varName}: ${typeName}[] = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(`src/data/${file}`, content);
  console.log(`✓ ${file}: ${data.length} items`);
};

write('knowledgeBaseExtra.ts', 'KnowledgeArticle', 'knowledgeBaseExtra', knowledge);
write('booksExtra.ts', 'BookResource', 'booksExtra', books);
write('webResourcesExtra.ts', 'WebResource', 'webResourcesExtra', web);
write('phraseBankExtra.ts', 'PhraseEntry', 'phraseBankExtra', phrases);
write('speakingSamplesExtra.ts', 'SpeakingSample', 'speakingSamplesExtra', speaking);
write('studyPlansExtra.ts', 'StudyPlan', 'studyPlansExtra', plans);
write('writingTemplates.ts', 'WritingTemplate', 'writingTemplates', templates);
write('officialLinks.ts', 'OfficialLink', 'officialLinks', official);

console.log(`\nTotal generated: ${knowledge.length + books.length + web.length + phrases.length + speaking.length + plans.length + templates.length + official.length} items`);