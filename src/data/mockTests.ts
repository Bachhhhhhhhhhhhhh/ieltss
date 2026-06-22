import { generateMockTests } from './mockTestGenerator';

export const mockTests = generateMockTests();
export const sampleListeningTests = mockTests.map((t) => t.listening);