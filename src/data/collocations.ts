import type { CollocationEntry } from '../types';
import { collocationsExtra } from './collocationsExtra';

const baseCollocations: CollocationEntry[] = [
  { id: 'col-b1', collocation: 'play a vital role', meaning: { en: 'be very important', vi: 'đóng vai trò quan trọng' }, example: { en: 'Education plays a vital role in reducing poverty.', vi: 'Giáo dục đóng vai trò quan trọng trong giảm nghèo.' }, topic: 'general', pattern: 'verb+phrase' },
  { id: 'col-b2', collocation: 'take measures', meaning: { en: 'take action', vi: 'có biện pháp' }, example: { en: 'Governments must take measures to curb inflation.', vi: 'Chính phủ phải có biện pháp kiềm chế lạm phát.' }, topic: 'general', pattern: 'verb+noun' },
  { id: 'col-b3', collocation: 'a wide range of', meaning: { en: 'many different', vi: 'đa dạng' }, example: { en: 'Universities offer a wide range of courses.', vi: 'Đại học cung cấp đa dạng khóa học.' }, topic: 'general', pattern: 'adj+noun' },
  { id: 'col-b4', collocation: 'gain insight', meaning: { en: 'obtain deeper understanding', vi: 'hiểu sâu hơn' }, example: { en: 'Research helps policymakers gain insight into youth unemployment.', vi: 'Nghiên cứu giúp nhà hoạch định hiểu sâu hơn về thất nghiệp thanh niên.' }, topic: 'general', pattern: 'verb+noun' },
  { id: 'col-b5', collocation: 'address the root cause', meaning: { en: 'tackle underlying problem', vi: 'giải quyết nguyên nhân gốc' }, example: { en: 'We must address the root cause of pollution, not only symptoms.', vi: 'Phải giải quyết nguyên nhân gốc ô nhiễm, không chỉ triệu chứng.' }, topic: 'general', pattern: 'verb+phrase' },
];

export const collocations: CollocationEntry[] = [...baseCollocations, ...collocationsExtra];