import type { BilingualText } from '../types';

export interface BandDescriptor {
  band: number;
  listening: BilingualText;
  reading: BilingualText;
  writing: BilingualText;
  speaking: BilingualText;
}

export const bandDescriptors: BandDescriptor[] = [
  {
    band: 9,
    listening: { en: 'Full operational command. Understands everything effortlessly.', vi: 'Thành thạo hoàn toàn. Hiểu mọi thứ dễ dàng.' },
    reading: { en: 'Full understanding with complete comprehension of complex texts.', vi: 'Hiểu đầy đủ các văn bản phức tạp.' },
    writing: { en: 'Fully satisfies all requirements with seamless coherence.', vi: 'Đáp ứng hoàn hảo mọi yêu cầu, mạch lạc tuyệt đối.' },
    speaking: { en: 'Speaks fluently with complete flexibility and precision.', vi: 'Nói trôi chảy, linh hoạt và chính xác hoàn toàn.' },
  },
  {
    band: 7,
    listening: { en: 'Operational command with occasional inaccuracies in unfamiliar situations.', vi: 'Thành thạo, thỉnh thoảng sai trong tình huống lạ.' },
    reading: { en: 'Handles complex texts; some difficulty with highly abstract content.', vi: 'Xử lý văn bản phức tạp; khó với nội dung trừu tượng cao.' },
    writing: { en: 'Addresses all parts; clear overview; sufficient range of vocabulary.', vi: 'Đủ ý; tổng quan rõ; từ vựng đủ phạm vi.' },
    speaking: { en: 'Speaks at length with flexibility; uses complex language effectively.', vi: 'Nói dài linh hoạt; dùng ngôn ngữ phức tạp hiệu quả.' },
  },
  {
    band: 6,
    listening: { en: 'Generally effective despite some difficulty in complex situations.', vi: 'Hiệu quả nhìn chung dù khó trong tình huống phức tạp.' },
    reading: { en: 'Understands main ideas; difficulty with detail and inference.', vi: 'Hiểu ý chính; khó với chi tiết và suy luận.' },
    writing: { en: 'Addresses task but may lack focus; adequate vocabulary.', vi: 'Đáp ứng nhiệm vụ nhưng có thể lạc đề; từ vựng đủ.' },
    speaking: { en: 'Willing to speak at length though may lose coherence.', vi: 'Sẵn sàng nói dài nhưng có thể mất mạch lạc.' },
  },
  {
    band: 5,
    listening: { en: 'Partial command; copes with overall meaning in familiar contexts.', vi: 'Thành thạo một phần; hiểu ý chính trong ngữ cảnh quen.' },
    reading: { en: 'Limited understanding; difficulty with complex argumentation.', vi: 'Hiểu hạn chế; khó với lập luận phức tạp.' },
    writing: { en: 'Addresses task only partially; limited vocabulary range.', vi: 'Chỉ đáp ứng một phần; từ vựng hạn chế.' },
    speaking: { en: 'Maintains flow with repetition and self-correction.', vi: 'Duy trì dòng chảy với lặp lại và tự sửa.' },
  },
];