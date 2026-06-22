export type Language = 'en' | 'vi';
export type Theme = 'light' | 'dark';
export type Skill = 'listening' | 'reading' | 'writing' | 'speaking';
export type TestType = 'academic' | 'general';
export type SectionId = Skill | 'overview';

export interface BilingualText {
  en: string;
  vi: string;
}

export interface MCQOption {
  id: string;
  text: BilingualText;
}

export type QuestionType = 'mcq' | 'fill-in' | 'true-false-ng' | 'yes-no-ng';

export interface ListeningQuestion {
  id: string;
  questionNumber: number;
  sectionNumber?: 1 | 2 | 3 | 4;
  type: QuestionType;
  question: BilingualText;
  options?: MCQOption[];
  wordLimit?: number;
  correctAnswer: string;
  explanation: BilingualText;
}

export interface ListeningSection {
  sectionNumber: 1 | 2 | 3 | 4;
  title: BilingualText;
  context: BilingualText;
  transcript: BilingualText;
  questions: ListeningQuestion[];
}

export interface ListeningTest {
  id: string;
  title: BilingualText;
  testType: TestType;
  sections: ListeningSection[];
  /** Flat list of all 40 questions (IELTS standard) */
  questions: ListeningQuestion[];
  transcript: BilingualText;
  duration: number;
  transferTime: number;
}

export interface ReadingPassage {
  id: string;
  title: BilingualText;
  content: BilingualText;
  questions: ListeningQuestion[];
}

export interface ReadingTest {
  id: string;
  title: BilingualText;
  testType: TestType;
  passages: ReadingPassage[];
  duration: number;
}

export type Task1ChartType = 'bar' | 'line' | 'pie' | 'table';

export interface Task1ChartSeries {
  label: string;
  values: number[];
  color?: string;
}

export interface Task1ChartData {
  type: Task1ChartType;
  title: BilingualText;
  labels: string[];
  series: Task1ChartSeries[];
  unit?: string;
}

export interface WritingTask {
  id: string;
  taskNumber: 1 | 2;
  testType: TestType;
  prompt: BilingualText;
  minWords: number;
  modelAnswer: BilingualText;
  bandDescriptors: BilingualText;
  chart?: Task1ChartData;
}

export interface SpeakingPart {
  id: string;
  part: 1 | 2 | 3;
  title: BilingualText;
  questions: BilingualText[];
  cueCardPoints?: BilingualText[];
  sampleAnswer: BilingualText;
  prepTime?: number;
  speakTime?: number;
  duration: number;
}

export interface MockTest {
  id: string;
  title: BilingualText;
  testType: TestType;
  listening: ListeningTest;
  reading: ReadingTest;
  writing: WritingTask[];
  speaking: SpeakingPart[];
  totalDuration: number;
}

export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  meaning: BilingualText;
  example: BilingualText;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GrammarQuestion {
  id: string;
  question: BilingualText;
  options: MCQOption[];
  correctAnswer: string;
  explanation: BilingualText;
}

export interface KnowledgeArticle {
  id: string;
  title: BilingualText;
  category: string;
  content: BilingualText;
  tags: string[];
}

export interface VideoResource {
  id: string;
  title: BilingualText;
  description: BilingualText;
  skill: Skill | 'all';
  youtubeId: string;
  duration: string;
  channel: string;
  level: string;
}

export interface BookResource {
  id: string;
  title: BilingualText;
  author: string;
  description: BilingualText;
  skill: Skill | 'all';
  level: string;
  type: 'textbook' | 'practice' | 'vocabulary' | 'official' | 'grammar';
  publisher?: string;
  link?: string;
  softCopyId?: string;
}

export type DigitalSectionType = 'text' | 'exercise' | 'vocabulary' | 'sample' | 'tip' | 'checklist';

export interface DigitalVocabItem {
  word: string;
  pos: string;
  definition: BilingualText;
  example: BilingualText;
}

export interface DigitalExercise {
  question: BilingualText;
  answer: BilingualText;
}

export interface DigitalSection {
  id: string;
  title: BilingualText;
  type: DigitalSectionType;
  content: BilingualText;
  vocabulary?: DigitalVocabItem[];
  exercises?: DigitalExercise[];
}

export interface DigitalChapter {
  id: string;
  number: number;
  title: BilingualText;
  sections: DigitalSection[];
}

export interface DigitalBook {
  id: string;
  bookId: string;
  coverGradient: string;
  pageEstimate: number;
  chapters: DigitalChapter[];
}

export interface WebResource {
  id: string;
  title: BilingualText;
  description: BilingualText;
  url: string;
  skill: Skill | 'all';
  type: 'website' | 'app' | 'podcast' | 'tool' | 'community' | 'free';
  free: boolean;
}

export interface PhraseEntry {
  id: string;
  phrase: string;
  meaning: BilingualText;
  example: BilingualText;
  skill: Skill | 'all';
  category: string;
}

export interface CollocationEntry {
  id: string;
  collocation: string;
  meaning: BilingualText;
  example: BilingualText;
  topic: string;
  pattern: string;
}

export interface TopicVocabItem {
  word: string;
  pos: string;
  definition: BilingualText;
  collocation: string;
  example: BilingualText;
}

export interface TopicVocabulary {
  id: string;
  topicKey: string;
  title: BilingualText;
  words: TopicVocabItem[];
  studyTips: BilingualText;
  commonTraps: BilingualText;
}

export interface WritingSampleEssay {
  id: string;
  type: string;
  topic: BilingualText;
  prompt: BilingualText;
  band: string;
  structure: BilingualText;
  tips: BilingualText;
  essay: BilingualText;
}

export interface QuestionTypeGuide {
  id: string;
  skill: Skill;
  type: string;
  title: BilingualText;
  tips: BilingualText;
  traps: BilingualText;
  strategy: BilingualText;
  example: BilingualText;
}

export interface StudyPlanWeek {
  week: number;
  focus: BilingualText;
  tasks: BilingualText[];
}

export interface StudyPlan {
  id: string;
  title: BilingualText;
  description: BilingualText;
  duration: string;
  targetBand: string;
  hoursPerDay: string;
  weeks: StudyPlanWeek[];
}

export interface SpeakingSample {
  id: string;
  part: 1 | 2 | 3;
  topic: BilingualText;
  question: BilingualText;
  sampleAnswer: BilingualText;
  band: string;
  tips: BilingualText;
}

export interface WritingTemplate {
  id: string;
  type: string;
  title: BilingualText;
  structure: BilingualText;
  template: BilingualText;
  tips: BilingualText;
}

export interface OfficialLink {
  name: string;
  url: string;
  desc: string;
}

export interface AssistantQA {
  id: string;
  keywords: string[];
  question: BilingualText;
  answer: BilingualText;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  testType: TestType;
  date: string;
  scores: Record<Skill, number>;
  overallBand: number;
  timeSpent: number;
  timeBySkill?: Record<Skill, number>;
  answers: Record<string, string>;
}

export interface UserProgress {
  name: string;
  targetBand: number;
  onboardingComplete: boolean;
  streak: number;
  lastActiveDate: string;
  totalTests: number;
  averageBand: number;
  skillBands: Record<Skill, number>;
  timeSpentBySkill: Record<Skill, number>;
  attempts: TestAttempt[];
  vocabProgress: Record<string, { level: number; lastReviewed: string }>;
  achievements: string[];
  dailyChallengeCompleted: string[];
  contactMessages: ContactMessage[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  skill: Skill;
  question: BilingualText;
  options?: MCQOption[];
  correctAnswer: string;
  explanation: BilingualText;
}

export type Page = 'home' | 'practice' | 'mock' | 'lookup' | 'resources' | 'about' | 'dashboard';

export interface Achievement {
  id: string;
  title: BilingualText;
  description: BilingualText;
  icon: string;
  condition: (progress: UserProgress) => boolean;
}