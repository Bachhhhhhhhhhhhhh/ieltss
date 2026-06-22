import type { StudyPlan } from '../types';
import { studyPlansExtra } from './studyPlansExtra';

const baseStudyPlans: StudyPlan[] = [
  {
    id: 'plan-30-band6',
    title: { en: '30-Day Sprint to Band 6', vi: '30 ngày đạt Band 6' },
    description: { en: 'Intensive plan for learners currently at Band 5–5.5 who need a quick score boost.', vi: 'Lộ trình cấp tốc cho người Band 5–5.5 cần tăng điểm nhanh.' },
    duration: '30 days',
    targetBand: '6.0',
    hoursPerDay: '2–3 hours',
    weeks: [
      { week: 1, focus: { en: 'Diagnostic + Listening & Reading foundations', vi: 'Chẩn đoán + Nền tảng Nghe & Đọc' }, tasks: [{ en: 'Take 1 full mock test and log all errors', vi: 'Làm 1 mock test đầy đủ và ghi lỗi' }, { en: 'Daily: 1 listening section + review transcript', vi: 'Hàng ngày: 1 phần Listening + ôn transcript' }, { en: 'Learn T/F/NG vs Y/N/NG rules', vi: 'Học quy tắc T/F/NG vs Y/N/NG' }, { en: 'Memorise 50 topic vocabulary words', vi: 'Thuộc 50 từ vựng theo chủ đề' }] },
      { week: 2, focus: { en: 'Writing structure + Speaking fluency', vi: 'Cấu trúc Writing + Trôi chảy Speaking' }, tasks: [{ en: 'Write 3 Task 2 essays with timer (40 min)', vi: 'Viết 3 bài Task 2 có hẹn giờ (40 phút)' }, { en: 'Write 2 Task 1 reports (Academic or GT letter)', vi: 'Viết 2 Task 1 (Academic hoặc thư GT)' }, { en: 'Record 5 Part 2 cue card answers (2 min each)', vi: 'Ghi âm 5 bài Part 2 (mỗi bài 2 phút)' }, { en: 'Study 20 linking phrases from phrase bank', vi: 'Học 20 cụm liên kết từ phrase bank' }] },
      { week: 3, focus: { en: 'Full mock tests + weak-area drills', vi: 'Mock test đầy đủ + Luyện điểm yếu' }, tasks: [{ en: 'Complete 2 full mock tests under exam conditions', vi: 'Làm 2 mock test đầy đủ như thi thật' }, { en: 'Re-practice your weakest question type daily', vi: 'Luyện lại dạng câu yếu nhất mỗi ngày' }, { en: 'Review all wrong answers with explanations', vi: 'Ôn mọi câu sai kèm giải thích' }, { en: 'Speaking: 3 full mock interviews with a partner', vi: 'Speaking: 3 phỏng vấn mock với bạn' }] },
      { week: 4, focus: { en: 'Polish + exam readiness', vi: 'Hoàn thiện + Sẵn sàng thi' }, tasks: [{ en: '1 final mock test 5 days before exam', vi: '1 mock test cuối 5 ngày trước thi' }, { en: 'Light review only — no new material', vi: 'Ôn nhẹ — không học mới' }, { en: 'Confirm test centre, ID, and arrival time', vi: 'Xác nhận địa điểm, giấy tờ và giờ đến' }, { en: 'Sleep 7–8 hours nightly', vi: 'Ngủ 7–8 giờ mỗi đêm' }] },
    ],
  },
  {
    id: 'plan-60-band7',
    title: { en: '60-Day Journey to Band 7', vi: '60 ngày hướng tới Band 7' },
    description: { en: 'Balanced plan for Band 6.0–6.5 learners targeting university or skilled migration scores.', vi: 'Lộ trình cân bằng cho Band 6.0–6.5 hướng tới đại học hoặc di trú.' },
    duration: '60 days',
    targetBand: '7.0',
    hoursPerDay: '2–4 hours',
    weeks: [
      { week: 1, focus: { en: 'Assessment & goal setting', vi: 'Đánh giá & đặt mục tiêu' }, tasks: [{ en: '2 diagnostic mocks (Academic or GT)', vi: '2 mock chẩn đoán (Academic hoặc GT)' }, { en: 'Identify lowest skill and set weekly targets', vi: 'Xác định kỹ năng thấp nhất và mục tiêu tuần' }, { en: 'Build vocabulary notebook (100 words)', vi: 'Sổ từ vựng (100 từ)' }] },
      { week: 2, focus: { en: 'Listening mastery', vi: 'Thành thạo Listening' }, tasks: [{ en: '4 full listening tests with accent variety', vi: '4 đề Listening đủ giọng' }, { en: 'Practise map labelling and matching', vi: 'Luyện ghi nhãn bản đồ và matching' }, { en: 'Shadow-read transcripts for 15 min daily', vi: 'Shadow transcript 15 phút/ngày' }] },
      { week: 3, focus: { en: 'Reading speed & accuracy', vi: 'Tốc độ & chính xác Reading' }, tasks: [{ en: '3 timed reading tests (60 min strict)', vi: '3 đề Reading đúng 60 phút' }, { en: 'Drill matching headings (20 questions)', vi: 'Luyện matching headings (20 câu)' }, { en: 'Study paraphrase patterns', vi: 'Học mẫu paraphrase' }] },
      { week: 4, focus: { en: 'Writing Task 2 depth', vi: 'Chiều sâu Writing Task 2' }, tasks: [{ en: 'Write 4 essays: opinion, discuss, problem-solution, adv/disadv', vi: 'Viết 4 bài: opinion, discuss, problem-solution, lợi/hại' }, { en: 'Self-check against band 7 descriptors', vi: 'Tự chấm theo mô tả band 7' }, { en: 'Memorise 3 introduction templates', vi: 'Thuộc 3 khung mở bài' }] },
      { week: 5, focus: { en: 'Writing Task 1 + GT letters', vi: 'Writing Task 1 + Thư GT' }, tasks: [{ en: '5 Task 1 reports with overview practice', vi: '5 bài Task 1 luyện overview' }, { en: '3 formal/semi-formal/informal letters (GT)', vi: '3 thư formal/bán formal/thân mật (GT)' }, { en: 'Learn data vocabulary (rise, plummet, fluctuate)', vi: 'Học từ mô tả số liệu' }] },
      { week: 6, focus: { en: 'Speaking confidence', vi: 'Tự tin Speaking' }, tasks: [{ en: 'Daily 15-min speaking practice', vi: 'Luyện Speaking 15 phút/ngày' }, { en: '10 Part 2 cue cards with notes + delivery', vi: '10 cue card Part 2 có ghi chú' }, { en: 'Part 3: practise abstract opinion questions', vi: 'Part 3: luyện câu hỏi ý kiến trừu tượng' }] },
      { week: 7, focus: { en: 'Integration week — full tests', vi: 'Tuần tích hợp — thi đầy đủ' }, tasks: [{ en: '3 full mock tests spaced Mon/Wed/Fri', vi: '3 mock đầy đủ thứ 2/4/6' }, { en: 'Analyse band trends across skills', vi: 'Phân tích xu hướng band các kỹ năng' }, { en: 'Fix recurring error patterns', vi: 'Sửa mẫu lỗi lặp lại' }] },
      { week: 8, focus: { en: 'Final polish & test week prep', vi: 'Hoàn thiện cuối & chuẩn bị tuần thi' }, tasks: [{ en: '1 mock test at start of week', vi: '1 mock đầu tuần' }, { en: 'Targeted 30-min drills on weakest skill', vi: 'Luyện 30 phút kỹ năng yếu nhất' }, { en: 'Exam-day routine rehearsal', vi: 'Tập quy trình ngày thi' }, { en: 'Rest and light review final 3 days', vi: 'Nghỉ và ôn nhẹ 3 ngày cuối' }] },
    ],
  },
  {
    id: 'plan-90-beginner',
    title: { en: '90-Day Foundation (Band 4.5 → 6.5)', vi: '90 ngày nền tảng (Band 4.5 → 6.5)' },
    description: { en: 'Gradual build-up for beginners or long-break returners needing solid fundamentals.', vi: 'Xây dần cho người mới hoặc lâu không học cần nền tảng vững.' },
    duration: '90 days',
    targetBand: '6.5',
    hoursPerDay: '1.5–3 hours',
    weeks: [
      { week: 1, focus: { en: 'Understand the test + basic grammar', vi: 'Hiểu bài thi + Ngữ pháp cơ bản' }, tasks: [{ en: 'Watch format overview videos', vi: 'Xem video tổng quan format' }, { en: 'Review present/past tenses and articles', vi: 'Ôn thì hiện tại/quá khứ và mạo từ' }, { en: 'Learn 30 everyday words daily', vi: 'Học 30 từ đời thường/ngày' }] },
      { week: 4, focus: { en: 'Listening & Reading basics', vi: 'Cơ bản Nghe & Đọc' }, tasks: [{ en: 'Section 1–2 listening daily (easy)', vi: 'Listening phần 1–2 hàng ngày' }, { en: 'Read 1 short article + summarise', vi: 'Đọc 1 bài ngắn + tóm tắt' }, { en: 'Practise spelling of common words', vi: 'Luyện chính tả từ thường gặp' }] },
      { week: 8, focus: { en: 'Writing introductions & simple essays', vi: 'Mở bài Writing & Essay đơn giản' }, tasks: [{ en: 'Write 2 paragraphs daily (100 words)', vi: 'Viết 2 đoạn/ngày (100 từ)' }, { en: '1 Task 2 essay per week (untimed)', vi: '1 Task 2/tuần (không hẹn giờ)' }, { en: 'Study cohesive devices', vi: 'Học từ nối mạch lạc' }] },
      { week: 12, focus: { en: 'Speaking practice + first full mock', vi: 'Luyện Speaking + Mock đầu tiên' }, tasks: [{ en: 'Answer 5 Part 1 questions daily aloud', vi: 'Trả lời 5 câu Part 1/toàn bộ mỗi ngày' }, { en: '3 Part 2 recordings per week', vi: '3 bản ghi Part 2/tuần' }, { en: 'Take 1 full mock test', vi: 'Làm 1 mock test đầy đủ' }] },
    ],
  },
  {
    id: 'plan-14-intensive',
    title: { en: '14-Day Intensive (Retake Boost)', vi: '14 ngày cấp tốc (Thi lại)' },
    description: { en: 'For retakers who need a 0.5 band boost with limited time before the next test date.', vi: 'Cho thi lại cần tăng 0.5 band trong thời gian ngắn.' },
    duration: '14 days',
    targetBand: '+0.5 band',
    hoursPerDay: '4–5 hours',
    weeks: [
      { week: 1, focus: { en: 'Error analysis + targeted drills', vi: 'Phân tích lỗi + Luyện mục tiêu' }, tasks: [{ en: 'Review last test score report in detail', vi: 'Xem chi tiết báo cáo điểm lần trước' }, { en: 'Focus 70% of time on lowest skill only', vi: '70% thời gian cho kỹ năng thấp nhất' }, { en: '1 timed section practice per skill daily', vi: '1 phần có giờ/kỹ năng mỗi ngày' }, { en: 'Memorise 15 high-impact phrases', vi: 'Thuộc 15 cụm từ tác động cao' }] },
      { week: 2, focus: { en: 'Mock tests + confidence building', vi: 'Mock test + Xây tự tin' }, tasks: [{ en: '2 full mocks (Day 8 and Day 12)', vi: '2 mock đầy đủ (ngày 8 và 12)' }, { en: 'Day 13: light review of error log', vi: 'Ngày 13: ôn nhẹ sổ lỗi' }, { en: 'Day 14: rest, prepare documents, sleep early', vi: 'Ngày 14: nghỉ, chuẩn bị giấy tờ, ngủ sớm' }] },
    ],
  },
  {
    id: 'plan-weekend',
    title: { en: 'Weekend Warrior (Busy Professionals)', vi: 'Cuối tuần (Người bận rộn)' },
    description: { en: '8-week plan using weekends only — 6 hours Sat + 4 hours Sun for working adults.', vi: '8 tuần chỉ cuối tuần — 6 giờ T7 + 4 giờ CN cho người đi làm.' },
    duration: '8 weeks',
    targetBand: '6.5–7.0',
    hoursPerDay: '4–6 hours (weekends)',
    weeks: [
      { week: 1, focus: { en: 'Sat: Listening + Reading | Sun: Writing', vi: 'T7: Nghe + Đọc | CN: Viết' }, tasks: [{ en: 'Saturday: 2 listening tests + 1 reading passage', vi: 'Thứ 7: 2 đề Listening + 1 bài Reading' }, { en: 'Sunday: 1 Task 2 essay + 1 Task 1', vi: 'Chủ Nhật: 1 Task 2 + 1 Task 1' }, { en: 'Weekdays: 15 min vocab on phone', vi: 'Ngày thường: 15 phút từ vựng trên điện thoại' }] },
      { week: 4, focus: { en: 'Sat: Full Listening+Reading | Sun: Speaking', vi: 'T7: Nghe+Đọc đầy đủ | CN: Speaking' }, tasks: [{ en: 'Saturday: Timed L+R combo (90 min)', vi: 'Thứ 7: L+R có giờ (90 phút)' }, { en: 'Sunday: Record all 3 speaking parts', vi: 'Chủ Nhật: Ghi âm cả 3 phần Speaking' }, { en: 'Review errors Saturday evening', vi: 'Ôn lỗi tối thứ 7' }] },
      { week: 8, focus: { en: 'Sat: Full mock | Sun: Review + rest', vi: 'T7: Mock đầy đủ | CN: Ôn + nghỉ' }, tasks: [{ en: 'Saturday: Complete mock under exam conditions', vi: 'Thứ 7: Mock đầy đủ như thi thật' }, { en: 'Sunday: Analyse results, light speaking practice', vi: 'Chủ Nhật: Phân tích kết quả, luyện Speaking nhẹ' }, { en: 'Book test date if scores are consistent', vi: 'Đặt lịch thi nếu điểm ổn định' }] },
    ],
  },
];

export const studyPlans: StudyPlan[] = [...baseStudyPlans, ...studyPlansExtra];