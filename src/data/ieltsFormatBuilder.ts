import type {
  BilingualText, ListeningQuestion, ListeningSection, ListeningTest,
  ReadingPassage, ReadingTest, SpeakingPart, TestType,
} from '../types';

function bt(en: string, vi: string): BilingualText {
  return { en, vi };
}

function mcqOpts(correct: string, distractors: string[]) {
  const items = [correct, ...distractors.filter((d) => d !== correct)].slice(0, 4);
  return items.map((t, i) => ({ id: ['a', 'b', 'c', 'd'][i], text: bt(t, t) }));
}

function fillQ(num: number, prefix: string, section: 1 | 2 | 3 | 4, question: BilingualText, answer: string, explanation: BilingualText, wordLimit = 2): ListeningQuestion {
  return { id: `${prefix}-l${num}`, questionNumber: num, sectionNumber: section, type: 'fill-in', question, wordLimit, correctAnswer: answer.toLowerCase(), explanation };
}

function mcqQ(num: number, prefix: string, section: 1 | 2 | 3 | 4, question: BilingualText, correct: string, distractors: string[], explanation: BilingualText): ListeningQuestion {
  const opts = mcqOpts(correct, distractors);
  const correctId = opts.find((o) => o.text.en === correct)?.id ?? 'a';
  return { id: `${prefix}-l${num}`, questionNumber: num, sectionNumber: section, type: 'mcq', question, options: opts, correctAnswer: correctId, explanation };
}

function tfngQ(num: number, prefix: string, question: BilingualText, answer: 'true' | 'false' | 'not given', explanation: BilingualText): ListeningQuestion {
  return { id: `${prefix}-r${num}`, questionNumber: num, type: 'true-false-ng', question, correctAnswer: answer, explanation };
}

export interface ThemeContent {
  id: string;
  topic: string;
  /** Section 1: booking/enquiry conversation */
  s1: { names: string; venue: string; date: string; time: string; price: string; phone: string; email: string; postcode: string; ref: string };
  /** Section 2: facility tour monologue */
  s2: { facility: string; opened: string; capacity: string; feature: string; parking: string; cafe: string; closed: string };
  /** Section 3: student discussion */
  s3: { assignment: string; deadline: string; method: string; tutor: string; wordCount: string; focus: string };
  /** Section 4: academic lecture */
  s4: { lectureTopic: string; year: string; pct: string; country: string; cause: string; solution: string };
  passages: [{ title: BilingualText; content: BilingualText }, { title: BilingualText; content: BilingualText }, { title: BilingualText; content: BilingualText }];
}

export function buildListeningSections(prefix: string, c: ThemeContent): ListeningSection[] {
  const s1Transcript = bt(
    `Receptionist: Good morning, ${c.s1.venue}. How can I help?\nCustomer: I'd like to book a place for a ${c.topic} workshop.\nReceptionist: Certainly. The event is on ${c.s1.date} at ${c.s1.time}. The fee is ${c.s1.price} per person.\nCustomer: My name is ${c.s1.names}. Phone ${c.s1.phone}, email ${c.s1.email}.\nReceptionist: Postcode ${c.s1.postcode}. Your reference is ${c.s1.ref}.`,
    `Lễ tân: Chào buổi sáng, ${c.s1.venue}. Tôi giúp gì?\nKhách: Tôi muốn đặt chỗ cho workshop ${c.topic}.\nLễ tân: Sự kiện ngày ${c.s1.date} lúc ${c.s1.time}. Phí ${c.s1.price}/người.\nKhách: Tên ${c.s1.names}. Điện thoại ${c.s1.phone}, email ${c.s1.email}.\nLễ tân: Mã bưu ${c.s1.postcode}. Mã tham chiếu ${c.s1.ref}.`,
  );

  const s2Transcript = bt(
    `Welcome to ${c.s2.facility}. We opened in ${c.s2.opened} with capacity for ${c.s2.capacity} visitors. Our main feature is ${c.s2.feature}. Parking is ${c.s2.parking}. The café serves lunch until 3 p.m. We are closed on ${c.s2.closed}. We recommend visitors arrive early during busy periods. Audio guides are available in four languages. Group discounts apply for groups of ten or more people.`,
    `Chào mừng đến ${c.s2.facility}. Mở năm ${c.s2.opened}, sức chứa ${c.s2.capacity} khách. Đặc điểm chính: ${c.s2.feature}. Bãi xe ${c.s2.parking}. Quán cà phê phục vụ đến 3 giờ chiều. Đóng cửa ${c.s2.closed}. Khuyên khách đến sớm khi đông. Audio guide có bốn ngôn ngữ. Giảm giá nhóm từ mười người trở lên.`,
  );

  const s3Transcript = bt(
    `Tutor: Your ${c.topic} assignment is due ${c.s3.deadline}. Use ${c.s3.method} as your primary method.\nStudent A: How many words?\nTutor: Minimum ${c.s3.wordCount}. Focus on ${c.s3.focus}. See ${c.s3.tutor} for feedback.\nStudent B: Data analysis is the hardest part, I agree.\nTutor: Use journal articles as primary sources and APA referencing style. Let's meet again on Thursday.`,
    `Giảng viên: Bài ${c.topic} hạn ${c.s3.deadline}. Dùng ${c.s3.method} làm phương pháp chính.\nSinh viên: Bao nhiêu từ?\nGiảng viên: Tối thiểu ${c.s3.wordCount}. Tập trung ${c.s3.focus}. Gặp ${c.s3.tutor} để phản hồi.\nSinh viên B: Phân tích dữ liệu là phần khó nhất.\nGiảng viên: Dùng bài báo khoa học và trích dẫn APA. Gặp lại thứ Năm.`,
  );

  const s4Transcript = bt(
    `Today's lecture examines ${c.s4.lectureTopic}. Research in ${c.s4.country} in ${c.s4.year} found ${c.s4.pct} of cases linked to ${c.s4.cause}. The primary recommendation is ${c.s4.solution}. Twelve previous studies were reviewed. Funding came from the government. The speaker is cautiously optimistic about the findings. Future research will focus on long-term outcomes.`,
    `Bài giảng hôm nay về ${c.s4.lectureTopic}. Nghiên cứu tại ${c.s4.country} năm ${c.s4.year}: ${c.s4.pct} trường hợp liên quan ${c.s4.cause}. Đề xuất chính: ${c.s4.solution}. Đã xem xét mười hai nghiên cứu trước. Tài trợ từ chính phủ. Diễn giả thận trọng lạc quan. Nghiên cứu tương lai tập trung kết quả dài hạn.`,
  );

  const section1: ListeningSection = {
    sectionNumber: 1,
    title: bt('Section 1 — Conversation (Social)', 'Phần 1 — Hội thoại (Xã hội)'),
    context: bt(`You will hear a conversation about booking a ${c.topic} event. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.`, `Bạn sẽ nghe cuộc hội thoại đặt sự kiện ${c.topic}. Ghi KHÔNG QUÁ HAI TỪ VÀ/HOẶC MỘT SỐ.`),
    transcript: s1Transcript,
    questions: [
      fillQ(1, prefix, 1, bt('Customer name:', 'Tên khách:'), c.s1.names.split(' ')[0].toLowerCase(), bt(`The name given is ${c.s1.names.split(' ')[0]}.`, `Tên là ${c.s1.names.split(' ')[0]}.`)),
      fillQ(2, prefix, 1, bt('Event date:', 'Ngày sự kiện:'), c.s1.date.toLowerCase(), bt(`Date: ${c.s1.date}.`, `Ngày: ${c.s1.date}.`)),
      fillQ(3, prefix, 1, bt('Start time:', 'Giờ bắt đầu:'), c.s1.time.toLowerCase(), bt(`Time: ${c.s1.time}.`, `Giờ: ${c.s1.time}.`)),
      fillQ(4, prefix, 1, bt('Cost per person:', 'Phí mỗi người:'), c.s1.price.toLowerCase(), bt(`Fee: ${c.s1.price}.`, `Phí: ${c.s1.price}.`)),
      fillQ(5, prefix, 1, bt('Contact phone:', 'Số điện thoại:'), c.s1.phone.toLowerCase(), bt(`Phone: ${c.s1.phone}.`, `ĐT: ${c.s1.phone}.`)),
      fillQ(6, prefix, 1, bt('Email address:', 'Email:'), c.s1.email.split('@')[0].toLowerCase(), bt(`Email prefix: ${c.s1.email.split('@')[0]}.`, `Phần email: ${c.s1.email.split('@')[0]}.`)),
      fillQ(7, prefix, 1, bt('Postcode:', 'Mã bưu:'), c.s1.postcode.toLowerCase(), bt(`Postcode: ${c.s1.postcode}.`, `Mã bưu: ${c.s1.postcode}.`)),
      fillQ(8, prefix, 1, bt('Booking reference:', 'Mã đặt chỗ:'), c.s1.ref.toLowerCase(), bt(`Reference: ${c.s1.ref}.`, `Mã: ${c.s1.ref}.`)),
      mcqQ(9, prefix, 1, bt('What is being booked?', 'Đặt gì?'), c.topic, ['A hotel room', 'A flight ticket', 'A language course'], bt(`They book a ${c.topic} workshop.`, `Đặt workshop ${c.topic}.`)),
      mcqQ(10, prefix, 1, bt('Where is the venue?', 'Địa điểm?'), c.s1.venue, ['City Library', 'Sports Centre', 'Town Hall'], bt(`Venue: ${c.s1.venue}.`, `Địa điểm: ${c.s1.venue}.`)),
    ],
  };

  const section2: ListeningSection = {
    sectionNumber: 2,
    title: bt('Section 2 — Monologue (Social)', 'Phần 2 — Độc thoại (Xã hội)'),
    context: bt('You will hear a guide describing a facility. Choose the correct letter A, B, C or D.', 'Nghe hướng dẫn viên mô tả cơ sở. Chọn A, B, C hoặc D.'),
    transcript: s2Transcript,
    questions: [
      mcqQ(11, prefix, 2, bt('When did the facility open?', 'Mở cửa khi nào?'), c.s2.opened, ['1998', '2005', '2012'], bt(`Opened ${c.s2.opened}.`, `Mở ${c.s2.opened}.`)),
      mcqQ(12, prefix, 2, bt('Maximum visitor capacity:', 'Sức chứa:'), c.s2.capacity, ['200', '350', '500'], bt(`Capacity: ${c.s2.capacity}.`, `Sức chứa: ${c.s2.capacity}.`)),
      mcqQ(13, prefix, 2, bt('Main feature of the facility:', 'Đặc điểm chính:'), c.s2.feature, ['Indoor pool', 'Rooftop garden', 'Conference hall'], bt(`Feature: ${c.s2.feature}.`, `Đặc điểm: ${c.s2.feature}.`)),
      mcqQ(14, prefix, 2, bt('Parking arrangement:', 'Bãi đỗ xe:'), c.s2.parking, ['Free on-site', 'Street only', 'Not available'], bt(`Parking: ${c.s2.parking}.`, `Đỗ xe: ${c.s2.parking}.`)),
      mcqQ(15, prefix, 2, bt('Café closing time:', 'Quán cà phê đóng:'), '3 p.m.', ['2 p.m.', '4 p.m.', '5 p.m.'], bt('Café serves until 3 p.m.', 'Quán cà phê đến 3 giờ chiều.')),
      fillQ(16, prefix, 2, bt('Name of facility:', 'Tên cơ sở:'), c.s2.facility.split(' ')[0].toLowerCase(), bt(`Facility: ${c.s2.facility}.`, `Cơ sở: ${c.s2.facility}.`), 3),
      fillQ(17, prefix, 2, bt('Day closed to public:', 'Ngày đóng cửa:'), c.s2.closed.toLowerCase(), bt(`Closed on ${c.s2.closed}.`, `Đóng ${c.s2.closed}.`)),
      mcqQ(18, prefix, 2, bt('The guide recommends visitors:', 'Hướng dẫn viên khuyên:'), 'Arrive early', ['Bring food', 'Book online only'], bt('Arrive early is implied for busy periods.', 'Nên đến sớm khi đông.')),
      mcqQ(19, prefix, 2, bt('Audio guides are available in:', 'Audio guide có:'), 'Four languages', ['Two languages', 'Six languages'], bt('Standard offer: four languages.', 'Thường có bốn ngôn ngữ.')),
      mcqQ(20, prefix, 2, bt('Group discounts apply for:', 'Giảm giá nhóm cho:'), '10+ people', ['5+ people', '20+ people'], bt('Groups of 10 or more.', 'Nhóm từ 10 người.')),
    ],
  };

  const section3: ListeningSection = {
    sectionNumber: 3,
    title: bt('Section 3 — Conversation (Academic)', 'Phần 3 — Hội thoại (Học thuật)'),
    context: bt('You will hear students discussing an assignment. Answer questions 21–30.', 'Nghe sinh viên thảo luận bài tập. Trả lời câu 21–30.'),
    transcript: s3Transcript,
    questions: [
      mcqQ(21, prefix, 3, bt('Assignment topic:', 'Chủ đề bài tập:'), c.topic, ['Urban design', 'Marine biology', 'Ancient history'], bt(`Topic: ${c.topic}.`, `Chủ đề: ${c.topic}.`)),
      fillQ(22, prefix, 3, bt('Submission deadline:', 'Hạn nộp:'), c.s3.deadline.toLowerCase(), bt(`Due ${c.s3.deadline}.`, `Hạn ${c.s3.deadline}.`)),
      fillQ(23, prefix, 3, bt('Research method:', 'Phương pháp:'), c.s3.method.split(' ')[0].toLowerCase(), bt(`Method: ${c.s3.method}.`, `Phương pháp: ${c.s3.method}.`)),
      mcqQ(24, prefix, 3, bt('Minimum word count:', 'Số từ tối thiểu:'), c.s3.wordCount, ['1500', '2000', '3000'], bt(`Words: ${c.s3.wordCount}.`, `Từ: ${c.s3.wordCount}.`)),
      fillQ(25, prefix, 3, bt('Main focus area:', 'Trọng tâm:'), c.s3.focus.split(' ')[0].toLowerCase(), bt(`Focus: ${c.s3.focus}.`, `Trọng tâm: ${c.s3.focus}.`)),
      fillQ(26, prefix, 3, bt('Tutor name:', 'Tên giảng viên:'), c.s3.tutor.split(' ').pop()!.toLowerCase(), bt(`Tutor: ${c.s3.tutor}.`, `GV: ${c.s3.tutor}.`)),
      mcqQ(27, prefix, 3, bt('Students agree the hardest part is:', 'Phần khó nhất:'), 'Data analysis', ['Writing introduction', 'Finding sources'], bt('Data analysis mentioned as challenging.', 'Phân tích dữ liệu là khó.')),
      mcqQ(28, prefix, 3, bt('They will meet again on:', 'Họp lại:'), 'Thursday', ['Tuesday', 'Friday'], bt('Follow-up on Thursday.', 'Gặp lại thứ Năm.')),
      mcqQ(29, prefix, 3, bt('Primary source type:', 'Nguồn chính:'), 'Journal articles', ['Textbooks', 'Websites'], bt('Journal articles preferred.', 'Ưu tiên bài báo khoa học.')),
      mcqQ(30, prefix, 3, bt('Referencing style required:', 'Kiểu trích dẫn:'), 'APA', ['MLA', 'Chicago'], bt('APA style required.', 'Yêu cầu APA.')),
    ],
  };

  const section4: ListeningSection = {
    sectionNumber: 4,
    title: bt('Section 4 — Lecture (Academic)', 'Phần 4 — Bài giảng (Học thuật)'),
    context: bt('You will hear an academic lecture. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.', 'Nghe bài giảng học thuật. Ghi KHÔNG QUÁ HAI TỪ VÀ/HOẶC MỘT SỐ.'),
    transcript: s4Transcript,
    questions: [
      fillQ(31, prefix, 4, bt('Lecture subject:', 'Chủ đề bài giảng:'), c.s4.lectureTopic.split(' ')[0].toLowerCase(), bt(`Subject: ${c.s4.lectureTopic}.`, `Chủ đề: ${c.s4.lectureTopic}.`), 3),
      fillQ(32, prefix, 4, bt('Year of study:', 'Năm nghiên cứu:'), c.s4.year.toLowerCase(), bt(`Year: ${c.s4.year}.`, `Năm: ${c.s4.year}.`)),
      fillQ(33, prefix, 4, bt('Percentage cited:', 'Phần trăm:'), c.s4.pct.replace('%', '').toLowerCase(), bt(`Percentage: ${c.s4.pct}.`, `Phần trăm: ${c.s4.pct}.`)),
      fillQ(34, prefix, 4, bt('Research country:', 'Quốc gia:'), c.s4.country.toLowerCase(), bt(`Country: ${c.s4.country}.`, `Quốc gia: ${c.s4.country}.`)),
      fillQ(35, prefix, 4, bt('Main cause identified:', 'Nguyên nhân:'), c.s4.cause.split(' ')[0].toLowerCase(), bt(`Cause: ${c.s4.cause}.`, `Nguyên nhân: ${c.s4.cause}.`), 3),
      mcqQ(36, prefix, 4, bt('Recommended solution:', 'Giải pháp:'), c.s4.solution, ['Higher taxation', 'Ban imports', 'Reduce funding'], bt(`Solution: ${c.s4.solution}.`, `Giải pháp: ${c.s4.solution}.`)),
      mcqQ(37, prefix, 4, bt('The speaker\'s attitude is:', 'Thái độ diễn giả:'), 'Cautiously optimistic', ['Highly critical', 'Neutral'], bt('Cautiously optimistic tone.', 'Thận trọng lạc quan.')),
      mcqQ(38, prefix, 4, bt('Future research will focus on:', 'Nghiên cứu tương lai:'), 'Long-term outcomes', ['Cost reduction', 'Public opinion'], bt('Long-term outcomes mentioned.', 'Tập trung kết quả dài hạn.')),
      fillQ(39, prefix, 4, bt('Number of previous studies reviewed:', 'Số nghiên cứu trước:'), '12', bt('Twelve prior studies.', 'Mười hai nghiên cứu trước.')),
      fillQ(40, prefix, 4, bt('Funding source:', 'Nguồn tài trợ:'), 'government', bt('Government funding.', 'Tài trợ chính phủ.')),
    ],
  };

  return [section1, section2, section3, section4];
}

export function buildListeningTest(prefix: string, title: BilingualText, testType: TestType, c: ThemeContent): ListeningTest {
  const sections = buildListeningSections(prefix, c);
  const questions = sections.flatMap((s) => s.questions);
  const fullTranscript = bt(
    sections.map((s) => s.transcript.en).join('\n\n'),
    sections.map((s) => s.transcript.vi).join('\n\n'),
  );
  return {
    id: `${prefix}-listen`,
    title,
    testType,
    sections,
    questions,
    transcript: fullTranscript,
    duration: 30,
    transferTime: 10,
  };
}

const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'be', 'been', 'being', 'that', 'this', 'with', 'from', 'by', 'as', 'it', 'its', 'they', 'their', 'them', 'we', 'our', 'however', 'although', 'while', 'when', 'which', 'who', 'what', 'where', 'there', 'here', 'also', 'than', 'into', 'over', 'after', 'before', 'during', 'through', 'between', 'both', 'such', 'more', 'most', 'some', 'any', 'all', 'can', 'may', 'will', 'would', 'could', 'should', 'not', 'no', 'yet', 'still', 'only', 'just', 'even', 'now', 'then', 'so', 'if', 'because', 'since', 'about', 'up', 'out', 'off', 'down']);

interface SentencePair {
  en: string;
  vi: string;
}

function splitSentences(en: string, vi: string): SentencePair[] {
  const enParts = en.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 12);
  const viParts = vi.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 8);
  const len = Math.max(enParts.length, viParts.length, 1);
  return Array.from({ length: len }, (_, i) => ({
    en: enParts[i] ?? enParts[enParts.length - 1] ?? en,
    vi: viParts[i] ?? viParts[viParts.length - 1] ?? vi,
  }));
}

function pickKeyword(sentence: string): string | null {
  const words = sentence.replace(/[^a-zA-Z0-9\s%-]/g, '').split(/\s+/);
  const candidates = words.filter((w) => w.length >= 4 && !STOP_WORDS.has(w.toLowerCase()) && !/^\d+$/.test(w));
  if (candidates.length === 0) return null;
  return candidates[Math.floor(candidates.length / 2)].toLowerCase();
}

function negateSentence(sentence: string): string {
  if (/\bnot\b/i.test(sentence)) return sentence.replace(/\bnot\b/gi, '');
  if (/\bno\b/i.test(sentence)) return sentence.replace(/\bno\b/gi, 'significant');
  if (/\bincreased?\b/i.test(sentence)) return sentence.replace(/\bincreased?\b/gi, 'decreased');
  if (/\bdecreased?\b/i.test(sentence)) return sentence.replace(/\bdecreased?\b/gi, 'increased');
  if (/\brising\b/i.test(sentence)) return sentence.replace(/\brising\b/gi, 'falling');
  if (/\bfell\b/i.test(sentence)) return sentence.replace(/\bfell\b/gi, 'rose sharply');
  return `It is widely agreed that ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
}

function buildNotGivenStatement(title: string): SentencePair {
  const topics = ['international tourism', 'classical music education', 'deep-sea mining', 'ancient pottery techniques'];
  const topic = topics[title.length % topics.length];
  return {
    en: `The passage discusses the economic impact of ${topic}.`,
    vi: `Đoạn văn thảo luận tác động kinh tế của ${topic}.`,
  };
}

function buildPassageQuestions(
  prefix: string,
  passageIndex: number,
  title: BilingualText,
  content: BilingualText,
  startNum: number,
  count: number,
): ListeningQuestion[] {
  const sentences = splitSentences(content.en, content.vi);
  const questions: ListeningQuestion[] = [];
  const titleWords = title.en.split(/\s+/).filter((w) => w.length > 3);
  const mainTopic = titleWords.slice(0, 2).join(' ') || title.en.split(' ')[0];

  for (let i = 0; i < count; i++) {
    const num = startNum + i;
    const sent = sentences[i % sentences.length];
    const qType = i % 3;

    if (qType === 0) {
      const tfngCycle = i % 9;
      if (tfngCycle < 3) {
        questions.push(tfngQ(num, prefix, bt(
          `Q${num}: ${sent.en}`,
          `C${num}: ${sent.vi}`,
        ), 'true', bt(
          `TRUE — stated in passage ${passageIndex + 1}: "${sent.en}"`,
          `ĐÚNG — có trong đoạn ${passageIndex + 1}: "${sent.vi}"`,
        )));
      } else if (tfngCycle < 6) {
        const falseEn = negateSentence(sent.en);
        questions.push(tfngQ(num, prefix, bt(
          `Q${num}: ${falseEn}`,
          `C${num}: ${falseEn}`,
        ), 'false', bt(
          `FALSE — contradicts passage ${passageIndex + 1}: "${sent.en}"`,
          `SAI — mâu thuẫn đoạn ${passageIndex + 1}: "${sent.vi}"`,
        )));
      } else {
        const ng = buildNotGivenStatement(title.en);
        questions.push(tfngQ(num, prefix, bt(
          `Q${num}: ${ng.en}`,
          `C${num}: ${ng.vi}`,
        ), 'not given', bt(
          `NOT GIVEN — this topic is not mentioned in passage ${passageIndex + 1}.`,
          `KHÔNG CÓ — chủ đề này không được đề cập trong đoạn ${passageIndex + 1}.`,
        )));
      }
    } else if (qType === 1) {
      const keyword = pickKeyword(sent.en) ?? pickKeyword(content.en) ?? mainTopic.toLowerCase();
      const blankEn = sent.en.replace(new RegExp(`\\b${keyword}\\b`, 'i'), '______');
      questions.push({
        id: `${prefix}-r${num}`,
        questionNumber: num,
        type: 'fill-in',
        question: bt(
          `Q${num}: Complete the sentence from Passage ${passageIndex + 1}: ${blankEn}`,
          `C${num}: Hoàn thành câu từ Đoạn ${passageIndex + 1}: ${sent.vi.replace(new RegExp(keyword, 'i'), '______')}`,
        ),
        wordLimit: 3,
        correctAnswer: keyword,
        explanation: bt(
          `The missing word is "${keyword}" from: "${sent.en}"`,
          `Từ cần điền là "${keyword}" từ: "${sent.vi}"`,
        ),
      });
    } else {
      const distractors = [
        titleWords[titleWords.length - 1] ?? 'Technology',
        'Urban development',
        'Historical migration',
      ].filter((d) => d.toLowerCase() !== mainTopic.toLowerCase()).slice(0, 3);
      questions.push(mcqQ(num, prefix, 1, bt(
        `Q${num}: What is the main subject of Passage ${passageIndex + 1}?`,
        `C${num}: Chủ đề chính của Đoạn ${passageIndex + 1} là gì?`,
      ), mainTopic, distractors, bt(
        `Passage ${passageIndex + 1} is titled "${title.en}".`,
        `Đoạn ${passageIndex + 1} có tiêu đề "${title.vi}".`,
      )));
    }
  }

  return questions;
}

export function buildReadingPassages(prefix: string, c: ThemeContent): ReadingPassage[] {
  const qCounts = [13, 13, 14];
  const starts = [1, 14, 27];

  return c.passages.map((p, pi) => ({
    id: `${prefix}-p${pi + 1}`,
    title: p.title,
    content: p.content,
    questions: buildPassageQuestions(prefix, pi, p.title, p.content, starts[pi], qCounts[pi]),
  }));
}

export function buildReadingTest(prefix: string, title: BilingualText, testType: TestType, c: ThemeContent): ReadingTest {
  return {
    id: `${prefix}-read`,
    title,
    testType,
    passages: buildReadingPassages(prefix, c),
    duration: 60,
  };
}

export function buildSpeakingParts(prefix: string, topic: string): SpeakingPart[] {
  return [
    {
      id: `${prefix}-sp1`, part: 1,
      title: bt('Part 1 — Introduction & Interview (4–5 minutes)', 'Phần 1 — Giới thiệu & Phỏng vấn (4–5 phút)'),
      questions: [
        bt('Do you work or are you a student?', 'Bạn đi làm hay đang học?'),
        bt('What do you like about your job/studies?', 'Bạn thích gì về công việc/học tập?'),
        bt(`How important is ${topic} in your daily life?`, `${topic} quan trọng thế nào trong đời sống hàng ngày?`),
        bt('Do you prefer studying alone or in a group? Why?', 'Bạn thích học một mình hay nhóm? Vì sao?'),
      ],
      sampleAnswer: bt(
        'I am currently a university student. I enjoy the flexibility of my schedule and the opportunity to learn new things. ' + topic + ' plays a modest but growing role in my routine. I generally prefer group study because discussing ideas helps me remember concepts better.',
        'Tôi là sinh viên đại học. Tôi thích lịch linh hoạt và cơ hội học điều mới. ' + topic + ' ngày càng quan trọng trong thói quen của tôi. Tôi thích học nhóm vì thảo luận giúp nhớ lâu hơn.',
      ),
      duration: 5,
    },
    {
      id: `${prefix}-sp2`, part: 2,
      title: bt('Part 2 — Individual Long Turn (3–4 minutes)', 'Phần 2 — Nói dài cá nhân (3–4 phút)'),
      questions: [bt(`Describe something related to ${topic} that interests you.`, `Mô tả điều liên quan ${topic} khiến bạn quan tâm.`)],
      cueCardPoints: [
        bt('what it is', 'đó là gì'),
        bt('how you became interested in it', 'bạn quan tâm như thế nào'),
        bt('what you do related to it', 'bạn làm gì liên quan đến nó'),
        bt('and explain why it is important to you', 'và giải thích tại sao quan trọng với bạn'),
      ],
      sampleAnswer: bt(
        `I would like to talk about my interest in ${topic}. I first became aware of it during a university lecture last year. Since then, I have read articles and joined online forums to learn more. It matters to me because it connects with my career goals and personal values.`,
        `Tôi muốn nói về sở thích ${topic}. Tôi biết đến nó qua bài giảng đại học năm ngoái. Từ đó tôi đọc bài và tham gia diễn đàn. Nó quan trọng vì liên quan mục tiêu nghề nghiệp và giá trị cá nhân.`,
      ),
      prepTime: 60,
      speakTime: 120,
      duration: 4,
    },
    {
      id: `${prefix}-sp3`, part: 3,
      title: bt('Part 3 — Two-way Discussion (4–5 minutes)', 'Phần 3 — Thảo luận hai chiều (4–5 phút)'),
      questions: [
        bt(`How has ${topic} changed in recent years?`, `${topic} thay đổi thế nào gần đây?`),
        bt('What role should governments play in this area?', 'Chính phủ nên đóng vai trò gì?'),
        bt('Will this trend continue in the future?', 'Xu hướng này tiếp tục trong tương lai?'),
      ],
      sampleAnswer: bt(
        `${topic} has evolved rapidly due to technology and globalisation. Governments should regulate responsibly while encouraging innovation. I believe the trend will continue, though public awareness will shape its direction.`,
        `${topic} phát triển nhanh nhờ công nghệ và toàn cầu hóa. Chính phủ nên quản lý có trách nhiệm đồng thời khuyến khích đổi mới. Xu hướng sẽ tiếp tục, nhưng nhận thức cộng đồng sẽ định hướng.`,
      ),
      duration: 5,
    },
  ];
}

/** Generate theme content from index for variety across 20 tests */
export function themeContentFromIndex(idx: number, topic: string, passages: ThemeContent['passages']): ThemeContent {
  const venues = ['Riverside Hall', 'Community Centre', 'Green Park Pavilion'];
  const months = ['15 March', '22 April', '8 June', '12 September'];
  const refs = ['BK2849', 'BK2851', 'BK2847', 'BK2853'];
  return {
    id: `theme-${idx}`,
    topic,
    s1: {
      names: 'Sarah Mitchell',
      venue: venues[idx % 3],
      date: months[idx % 4],
      time: idx % 2 === 0 ? '10:30 am' : '2:00 pm',
      price: idx % 2 === 0 ? '$25' : '$40',
      phone: `07700${900000 + idx}`,
      email: `sarah.m${idx}@email.com`,
      postcode: `SW${idx + 1} 4AB`,
      ref: refs[idx % 4],
    },
    s2: {
      facility: `${topic} Exhibition Centre`,
      opened: String(2000 + (idx % 20)),
      capacity: String(200 + idx * 30),
      feature: 'interactive displays',
      parking: 'free on-site',
      cafe: 'yes',
      closed: ['Monday', 'Sunday', 'Wednesday'][idx % 3],
    },
    s3: {
      assignment: topic,
      deadline: months[(idx + 1) % 4],
      method: 'case study analysis',
      tutor: 'Dr. Helen Wright',
      wordCount: String(2000 + idx * 100),
      focus: 'policy implications',
    },
    s4: {
      lectureTopic: topic,
      year: String(2020 + (idx % 6)),
      pct: `${20 + (idx % 15)}%`,
      country: ['Norway', 'Canada', 'Australia', 'Japan'][idx % 4],
      cause: 'industrial emissions',
      solution: 'renewable energy investment',
    },
    passages,
  };
}