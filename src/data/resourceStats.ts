import { knowledgeBase } from './knowledgeBase';
import { videoLibrary } from './videos';
import { bookLibrary } from './books';
import { webResources } from './webResources';
import { phraseBank } from './phraseBank';
import { studyPlans } from './studyPlans';
import { speakingSamples } from './speakingSamples';
import { writingTemplates } from './writingTemplates';
import { officialLinks } from './officialLinks';
import { vocabulary } from './vocabulary';
import { mockTests } from './mockTests';
import { grammarQuestions } from './grammar';
import { collocations } from './collocations';
import { topicVocabulary } from './topicVocabulary';
import { questionTypeGuides } from './questionTypeGuides';
import { writingSamplesExtra } from './writingSamplesExtra';

const writingSamplesFromMocks = mockTests.flatMap((test) => test.writing);

export const resourceStats = {
  knowledge: knowledgeBase.length,
  videos: videoLibrary.length,
  books: bookLibrary.length,
  webTools: webResources.length,
  phrases: phraseBank.length,
  studyPlans: studyPlans.length,
  writingTemplates: writingTemplates.length,
  writingSamples: writingSamplesFromMocks.length + writingSamplesExtra.length,
  speakingSamples: speakingSamples.length,
  officialLinks: officialLinks.length,
  vocabulary: vocabulary.length,
  mockTests: mockTests.length,
  grammarDrills: grammarQuestions.length,
  collocations: collocations.length,
  topicVocabulary: topicVocabulary.reduce((s, t) => s + t.words.length, 0),
  topicVocabularyTopics: topicVocabulary.length,
  questionTypeGuides: questionTypeGuides.length,
  get total() {
    return (
      this.knowledge +
      this.videos +
      this.books +
      this.webTools +
      this.phrases +
      this.studyPlans +
      this.writingTemplates +
      this.writingSamples +
      this.speakingSamples +
      this.officialLinks +
      this.collocations +
      this.topicVocabulary +
      this.questionTypeGuides
    );
  },
} as const;