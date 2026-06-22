import type { MockTest, TestType, BilingualText, Task1ChartData } from '../types';
import {
  buildListeningTest,
  buildReadingTest,
  buildSpeakingParts,
  themeContentFromIndex,
  type ThemeContent,
} from './ieltsFormatBuilder';

function bt(en: string, vi: string): BilingualText {
  return { en, vi };
}

const bandDesc: BilingualText = {
  en: 'Band 7: Addresses all parts of the task with a clear position, logical organisation, and sufficient range of vocabulary and grammar.',
  vi: 'Band 7: Đáp ứng đủ yêu cầu, lập trường rõ, tổ chức logic, từ vựng và ngữ pháp đủ phạm vi.',
};

interface TestTheme {
  id: string;
  title: BilingualText;
  testType: TestType;
  topic: string;
  passages: ThemeContent['passages'];
  writingT1: BilingualText;
  writingT2: BilingualText;
  writingT1Model: BilingualText;
  writingT2Model: BilingualText;
  gtLetter?: BilingualText;
  gtLetterModel?: BilingualText;
}

const passageBank: ThemeContent['passages'][] = [
  [
    { title: bt('The Rise of Renewable Energy', 'Sự trỗi dậy năng lượng tái tạo'), content: bt('Renewable energy has shifted from niche to mainstream over the past two decades. Solar and wind costs dropped dramatically, enabling widespread adoption. The EU targets 42.5% renewable electricity by 2030. Challenges remain in grid integration and storage technology. Off-grid solar systems have brought electricity to millions in developing regions.', 'Năng lượng tái tạo đã chuyển từ ngách sang chính thống. Chi phí mặt trời và gió giảm mạnh. EU nhắm 42,5% điện tái tạo vào 2030. Thách thức: lưới điện và lưu trữ. Điện mặt trời off-grid đến với hàng triệu người.') },
    { title: bt('Urbanisation and Public Health', 'Đô thị hóa và sức khỏe công cộng'), content: bt('Urbanisation offers improved healthcare access but concentrates air pollution and stress. The WHO estimates 55% of humanity lives in cities, rising to 68% by 2050. Green spaces measurably reduce anxiety and cardiovascular disease. Urban planners increasingly adopt "healthy city" frameworks integrating transport, housing, and recreation.', 'Đô thị hóa cải thiện tiếp cận y tế nhưng tập trung ô nhiễm. WHO: 55% dân số ở thành phố, 68% vào 2050. Không gian xanh giảm lo âu. Quy hoạch đô thị tích hợp giao thông, nhà ở và giải trí.') },
    { title: bt('Climate Policy and Economics', 'Chính sách khí hậu và kinh tế'), content: bt('Carbon pricing mechanisms aim to internalise environmental costs. Critics argue they burden low-income households; proponents cite long-term savings from disaster prevention. International agreements require nations to report emissions transparently. Investment in clean technology now exceeds fossil fuel subsidies in several major economies.', 'Định giá carbon nhằm phản ánh chi phí môi trường. Phê phán cho rằng gánh nặng hộ nghèo; ủng hộ nhấn mạnh tiết kiệm dài hạn. Hiệp định quốc tế yêu cầu báo cáo minh bạch. Đầu tư công nghệ sạch vượt trợ cấp nhiên liệu hóa thạch.') },
  ],
  [
    { title: bt('Artificial Intelligence in Education', 'AI trong giáo dục'), content: bt('AI tutoring systems personalise learning pathways at scale. Universities report improved formative assessment but raise concerns about data privacy and academic integrity. Teachers remain essential for motivation, emotional support, and critical thinking development. Hybrid models combining AI feedback with human mentorship show the most balanced outcomes.', 'Hệ thống gia sư AI cá nhân hóa lộ trình học. Đại học báo cáo đánh giá tốt hơn nhưng lo ngại quyền riêng tư. Giáo viên vẫn cần cho động lực và tư duy phản biện. Mô hình kết hợp AI và con người cho kết quả cân bằng nhất.') },
    { title: bt('The Future of Remote Work', 'Tương lai làm việc từ xa'), content: bt('Remote work accelerated globally after 2020. Companies balance employee flexibility with collaboration needs through hybrid schedules. Digital literacy became a baseline employability skill. Cities are repurposing commercial real estate as remote workers decentralise economic activity.', 'Làm từ xa tăng tốc sau 2020. Công ty cân bằng linh hoạt và hợp tác qua lịch kết hợp. Kỹ năng số trở thành yêu cầu cơ bản. Thành phố tái sử dụng bất động sản thương mại.') },
    { title: bt('Digital Divide in Learning', 'Khoảng cách số trong học tập'), content: bt('Unequal internet access creates educational disparities across regions and income groups. Governments have subsidised devices and connectivity, yet rural areas lag behind. Research suggests blended approaches mitigate some inequality when supported by community learning hubs.', 'Tiếp cận internet không đều tạo bất bình đẳng giáo dục. Chính phủ trợ cấp thiết bị nhưng nông thôn vẫn chậm. Học kết hợp với trung tâm cộng đồng giảm bất bình đẳng.') },
  ],
  [
    { title: bt('Global Pandemic Preparedness', 'Chuẩn bị đại dịch toàn cầu'), content: bt('COVID-19 exposed structural weaknesses in health systems worldwide. Nations invest in genomic surveillance, vaccine manufacturing capacity, and cross-border data sharing. Equity in vaccine distribution remains politically contested despite WHO coordination efforts.', 'COVID-19 phơi bày điểm yếu hệ thống y tế. Quốc gia đầu tư giám sát gen, sản xuất vaccine và chia sẻ dữ liệu. Công bằng phân phối vaccine vẫn tranh cãi.') },
    { title: bt('Mental Health in Modern Society', 'Sức khỏe tâm thần xã hội hiện đại'), content: bt('Anxiety and depression prevalence rose among adolescents in high-income nations. Contributing factors include social media use, academic pressure, and economic uncertainty. Therapy access varies significantly by geography, insurance coverage, and cultural stigma.', 'Lo âu và trầm cảm tăng ở thanh thiếu niên. Mạng xã hội, áp lực học tập và kinh tế góp phần. Tiếp cận trị liệu khác nhau theo địa lý và văn hóa.') },
    { title: bt('Preventive Healthcare Models', 'Mô hình y tế phòng ngừa'), content: bt('Preventive care reduces long-term treatment costs by addressing risk factors early. Nordic countries achieve strong outcomes through screening programmes and lifestyle interventions. Critics question scalability in nations with fragmented insurance systems.', 'Chăm sóc phòng ngừa giảm chi phí dài hạn. Bắc Âu đạt kết quả tốt qua sàng lọc và can thiệp lối sống. Câu hỏi về khả năng mở rộng ở hệ thống phân mảnh.') },
  ],
  [
    { title: bt('Mars Exploration Milestones', 'Cột mốc thám hiểm sao Hỏa'), content: bt('Robotic rovers have mapped Martian geology and detected subsurface water ice. Private companies now compete with national agencies to reduce launch costs. Radiation exposure and life-support logistics make crewed missions extraordinarily complex and expensive.', 'Rover lập bản đồ địa chất và phát hiện băng nước dưới lòng đất. Công ty tư nhân cạnh tranh giảm chi phí phóng. Bức xạ và hậu cần làm sứ mệnh có người phức tạp.') },
    { title: bt('Satellite Technology and Climate', 'Vệ tinh và khí hậu'), content: bt('Earth observation satellites monitor deforestation, ice-sheet melt, and methane emissions with increasing precision. Open-access data portals enable researchers and policymakers to track environmental change. Launch cost reductions via reusable rockets expanded constellation deployments.', 'Vệ tinh theo dõi phá rừng, băng tan và khí metan. Dữ liệu mở giúp nhà nghiên cứu theo dõi biến đổi. Chi phí phóng giảm nhờ tên lửa tái sử dụng.') },
    { title: bt('Ethics of Space Commercialisation', 'Đạo đức thương mại hóa vũ trụ'), content: bt('Commercial spaceflight raises questions about orbital debris, planetary protection, and equitable access to extraterrestrial resources. International treaties written decades ago struggle to regulate modern private actors.', 'Du hành vũ trụ thương mại đặt ra câu hỏi về rác quỹ đạo và tài nguyên ngoài Trái Đất. Hiệp ước cũ khó điều chỉnh tư nhân hiện đại.') },
  ],
  [
    { title: bt('Digital Museums and Heritage', 'Bảo tàng số và di sản'), content: bt('Museums digitise collections to reach global audiences beyond physical visitation limits. Virtual reality exhibitions increase accessibility for disabled visitors and remote learners. Scholars debate authenticity when reproductions replace fragile originals on display.', 'Bảo tàng số hóa bộ sưu tập cho khán giả toàn cầu. VR tăng tiếp cận. Tranh luận về xác thực khi bản sao thay hiện vật.') },
    { title: bt('Creative Industries Economy', 'Kinh tế ngành sáng tạo'), content: bt('Film, music, design, and gaming contribute significantly to national GDP and employment. Streaming platforms transformed revenue models while raising copyright enforcement challenges. Governments support arts through grants, tax incentives, and education partnerships.', 'Phim, nhạc, thiết kế đóng góp GDP và việc làm. Streaming thay đổi doanh thu. Chính phủ hỗ trợ qua trợ cấp và giáo dục.') },
    { title: bt('Cultural Preservation in a Digital Age', 'Bảo tồn văn hóa thời số'), content: bt('Indigenous communities use digital archives to preserve languages and traditions. However, commercial appropriation of cultural symbols remains a sensitive issue requiring community-led governance frameworks.', 'Cộng đồng bản địa dùng kho số bảo tồn ngôn ngữ. Việc thương mại hóa biểu tượng văn hóa cần quản trị cộng đồng.') },
  ],
  [
    { title: bt('Global Supply Chains', 'Chuỗi cung ứng toàn cầu'), content: bt('Just-in-time logistics reduced inventory costs but increased vulnerability to disruptions. Firms diversify suppliers and nearshore production after pandemic shocks. Automation and AI forecasting reshape procurement strategies.', 'Logistics just-in-time giảm chi phí nhưng tăng rủi ro gián đoạn. Doanh nghiệp đa dạng hóa nhà cung cấp. AI dự báo thay đổi mua sắm.') },
    { title: bt('Cryptocurrency and Regulation', 'Tiền mã hóa và quy định'), content: bt('Digital assets grew rapidly before facing stricter financial oversight. Central banks pilot digital currencies to modernise payment infrastructure. Consumer protection and anti-money-laundering compliance dominate legislative agendas.', 'Tài sản số tăng nhanh rồi đối mặt giám sát. Ngân hàng trung ương thử tiền số. Bảo vệ người tiêu dùng là trọng tâm.') },
    { title: bt('Trade Agreements and Labour Standards', 'Hiệp định thương mại và lao động'), content: bt('Modern trade deals increasingly include labour and environmental clauses. Developing nations argue such conditions can restrict market access unfairly. Empirical studies show mixed effects on wage growth and working conditions.', 'Hiệp định thương mại gồm điều khoản lao động và môi trường. Nước đang phát triển cho rằng hạn chế tiếp cận thị trường. Tác động đến lương còn tranh luận.') },
  ],
];

const chartTypes: Task1ChartData['type'][] = ['bar', 'line', 'table', 'pie', 'bar', 'line', 'table', 'bar', 'line', 'pie'];

function buildTask1Chart(idx: number, theme: TestTheme): Task1ChartData {
  const type = chartTypes[idx % chartTypes.length];
  const years = ['2010', '2015', '2018', '2020', '2022'];
  const countries = ['Germany', 'UK', 'France', 'Spain', 'Italy'];
  const base = 10 + (idx % 5) * 5;

  if (type === 'table') {
    return {
      type: 'table',
      title: bt(`${theme.topic} — key figures`, `${theme.topic} — số liệu chính`),
      labels: countries.slice(0, 4),
      series: [
        { label: '2015', values: [base, base + 5, base + 3, base + 8] },
        { label: '2020', values: [base + 15, base + 12, base + 18, base + 10] },
        { label: '2025', values: [base + 30, base + 22, base + 25, base + 20] },
      ],
      unit: '%',
    };
  }

  if (type === 'pie') {
    return {
      type: 'pie',
      title: bt(`Distribution of ${theme.topic} by sector`, `Phân bổ ${theme.topic} theo lĩnh vực`),
      labels: ['Public', 'Private', 'NGO', 'Academic'],
      series: [{ label: 'Share', values: [35, 28, 17, 20] }],
      unit: '%',
    };
  }

  return {
    type,
    title: bt(`${theme.topic} trends (${years[0]}–${years[years.length - 1]})`, `Xu hướng ${theme.topic} (${years[0]}–${years[years.length - 1]})`),
    labels: years,
    series: countries.slice(0, 3).map((c, ci) => ({
      label: c,
      values: years.map((_, yi) => base + ci * 4 + yi * (6 + idx % 3)),
    })),
    unit: type === 'line' ? '' : '%',
  };
}

const themes: TestTheme[] = [
  { id: 'academic-1', title: bt('Academic Mock 1 — Climate & Environment', 'Academic 1 — Khí hậu & Môi trường'), testType: 'academic', topic: 'environmental sustainability', passages: passageBank[0], writingT1: bt('The chart below shows renewable energy consumption in five countries between 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.', 'Biểu đồ tiêu thụ năng lượng tái tạo 5 quốc gia 2010–2020. Tóm tắt và so sánh. Viết ít nhất 150 từ.'), writingT2: bt('Some people believe technology has made life more complicated. Others think it has made life easier. Discuss both views and give your own opinion. Write at least 250 words.', 'Công nghệ làm phức tạp hay đơn giản cuộc sống? Thảo luận cả hai và nêu ý kiến. Viết ít nhất 250 từ.'), writingT1Model: bt('Overall, Germany led renewable growth, rising from 10% to 45%, while all nations showed upward trends.', 'Nhìn chung Đức dẫn đầu từ 10% lên 45%, tất cả đều tăng.'), writingT2Model: bt('Technology streamlines daily tasks yet creates information overload; mindful use maximises benefits.', 'Công nghệ tối ưu công việc nhưng gây quá tải thông tin; dùng có ý thức tối đa lợi ích.') },
  { id: 'academic-2', title: bt('Academic Mock 2 — Technology & Society', 'Academic 2 — Công nghệ & Xã hội'), testType: 'academic', topic: 'online education', passages: passageBank[1], writingT1: bt('The graph shows online learning platform usage by age group from 2018 to 2025. Summarise the information. Write at least 150 words.', 'Biểu đồ sử dụng nền tảng học online theo nhóm tuổi 2018–2025. Tóm tắt. Viết ít nhất 150 từ.'), writingT2: bt('Online education will replace traditional classrooms. To what extent do you agree or disagree? Write at least 250 words.', 'Giáo dục online thay thế lớp học truyền thống. Mức độ đồng ý? Viết ít nhất 250 từ.'), writingT1Model: bt('Young adults showed the steepest growth; older groups increased gradually after 2020.', 'Thanh niên tăng mạnh nhất; nhóm lớn tuổi tăng dần sau 2020.'), writingT2Model: bt('Online tools expand access but cannot fully replace in-person mentorship; blended learning is optimal.', 'Online mở rộng tiếp cận nhưng không thay thế hoàn toàn; học kết hợp là tối ưu.') },
  { id: 'academic-3', title: bt('Academic Mock 3 — Global Health', 'Academic 3 — Sức khỏe toàn cầu'), testType: 'academic', topic: 'public health', passages: passageBank[2], writingT1: bt('The table compares healthcare spending per capita in four countries. Summarise the information. Write at least 150 words.', 'Bảng chi tiêu y tế đầu người 4 quốc gia. Tóm tắt. Viết ít nhất 150 từ.'), writingT2: bt('Governments should provide free healthcare for all citizens. Discuss both views. Write at least 250 words.', 'Chính phủ nên cung cấp y tế miễn phí? Thảo luận. Viết ít nhất 250 từ.'), writingT1Model: bt('The US spent most per capita; Nordic nations achieved strong outcomes with moderate spending.', 'Mỹ chi nhiều nhất; Bắc Âu đạt kết quả tốt với chi tiêu vừa phải.'), writingT2Model: bt('Universal healthcare reduces inequality but requires sustainable funding and efficient administration.', 'Y tế toàn dân giảm bất bình đẳng nhưng cần nguồn lực bền vững.') },
  { id: 'academic-4', title: bt('Academic Mock 4 — Space Science', 'Academic 4 — Khoa học vũ trụ'), testType: 'academic', topic: 'space exploration', passages: passageBank[3], writingT1: bt('The diagram illustrates stages of a Mars exploration mission. Summarise the information. Write at least 150 words.', 'Sơ đồ các giai đoạn sứ mệnh sao Hỏa. Tóm tắt. Viết ít nhất 150 từ.'), writingT2: bt('Should governments prioritise space exploration over domestic social issues? Discuss both views. Write at least 250 words.', 'Ưu tiên vũ trụ hay vấn đề xã hội trong nước? Thảo luận. Viết ít nhất 250 từ.'), writingT1Model: bt('The mission proceeds from launch through transit, orbital insertion, landing, and surface operations.', 'Sứ mệnh từ phóng, hành trình, quỹ đạo, hạ cánh đến hoạt động bề mặt.'), writingT2Model: bt('Space research drives innovation; social spending must not be neglected — balanced investment is essential.', 'Nghiên cứu vũ trụ thúc đẩy đổi mới; không được bỏ bê xã hội.') },
  { id: 'academic-5', title: bt('Academic Mock 5 — Arts & Culture', 'Academic 5 — Nghệ thuật & Văn hóa'), testType: 'academic', topic: 'cultural heritage', passages: passageBank[4], writingT1: bt('The bar chart shows museum visitor numbers 2015–2025 (physical vs virtual). Summarise. Write at least 150 words.', 'Biểu đồ khách bảo tàng 2015–2025 (trực tiếp vs ảo). Tóm tắt. Viết ít nhất 150 từ.'), writingT2: bt('Government funding should prioritise arts over science. To what extent do you agree? Write at least 250 words.', 'Tài trợ nghệ thuật hơn khoa học? Mức độ đồng ý? Viết ít nhất 250 từ.'), writingT1Model: bt('Physical visits dipped in 2020 then recovered; virtual attendance surged and remained high.', 'Khách trực tiếp giảm 2020 rồi phục hồi; khách ảo tăng mạnh.'), writingT2Model: bt('Arts and science are complementary pillars; both deserve public investment.', 'Nghệ thuật và khoa học bổ sung nhau; cả hai xứng đáng đầu tư.') },
  { id: 'academic-6', title: bt('Academic Mock 6 — Economics & Trade', 'Academic 6 — Kinh tế & Thương mại'), testType: 'academic', topic: 'international trade', passages: passageBank[5], writingT1: bt('The line graph shows export values 2018–2025. Summarise. Write at least 150 words.', 'Biểu đồ xuất khẩu 2018–2025. Tóm tắt. Viết ít nhất 150 từ.'), writingT2: bt('Globalisation does more harm than good to local economies. Discuss both views. Write at least 250 words.', 'Toàn cầu hóa lợi hay hại kinh tế địa phương? Thảo luận. Viết ít nhất 250 từ.'), writingT1Model: bt('Exports fell in 2020 then rebounded; technology goods led recovery.', 'Xuất khẩu giảm 2020 rồi phục hồi; hàng công nghệ dẫn đầu.'), writingT2Model: bt('Globalisation expands markets but can hollow out local industries; smart regulation protects workers.', 'Toàn cầu hóa mở rộng thị trường nhưng có thể suy ngành địa phương.') },
  { id: 'general-1', title: bt('General Mock 1 — Community Life', 'General 1 — Đời sống cộng đồng'), testType: 'general', topic: 'community events', passages: passageBank[0], writingT1: bt('You recently attended a community environmental workshop. Write a letter to the organiser. In your letter: thank them; describe what you enjoyed; suggest one improvement. Write at least 150 words.', 'Bạn tham dự workshop môi trường cộng đồng. Viết thư cho ban tổ chức: cảm ơn; nói điều thích; đề xuất cải thiện. Viết ít nhất 150 từ.'), writingT2: bt('Some people prefer public transport; others prefer private cars. Discuss both views and give your opinion. Write at least 250 words.', 'Giao thông công cộng hay xe riêng? Thảo luận và nêu ý kiến. Viết ít nhất 250 từ.'), writingT1Model: bt('Dear Mr. Thompson, Thank you for the excellent workshop. I especially enjoyed the tree-planting activity. Please consider more seating for elderly participants.', 'Kính gửi ông Thompson, cảm ơn workshop tuyệt vời. Tôi thích trồng cây. Hãy thêm ghế cho người cao tuổi.'), writingT2Model: bt('Public transport reduces emissions; private cars offer flexibility — governments should invest in both.', 'Giao thông công cộng giảm khí thải; xe riêng linh hoạt — chính phủ nên đầu tư cả hai.'), gtLetter: bt('Write a letter thanking a community event organiser and suggesting improvements. Write at least 150 words.', 'Viết thư cảm ơn ban tổ chức và đề xuất cải thiện. Viết ít nhất 150 từ.'), gtLetterModel: bt('Dear organiser, thank you for the wonderful event. I suggest clearer signage and more water stations.', 'Kính gửi ban tổ chức, cảm ơn sự kiện. Đề xuất biển báo rõ hơn và thêm trạm nước.') },
  { id: 'general-2', title: bt('General Mock 2 — Travel & Tourism', 'General 2 — Du lịch'), testType: 'general', topic: 'travel planning', passages: passageBank[1], writingT1: bt('You stayed at a hotel where the heating failed. Write to the manager explaining the problem and what you want them to do. Write at least 150 words.', 'Sưởi hỏng khi ở khách sạn. Viết cho quản lý mô tả vấn đề và yêu cầu. Viết ít nhất 150 từ.'), writingT2: bt('Tourism benefits local communities more than it harms them. Do you agree or disagree? Write at least 250 words.', 'Du lịch lợi nhiều hơn hại cộng đồng? Đồng ý không? Viết ít nhất 250 từ.'), writingT1Model: bt('Dear Manager, the heating in room 204 failed for two nights. I request a partial refund or complimentary night.', 'Kính gửi Quản lý, sưởi phòng 204 hỏng hai đêm. Xin hoàn tiền một phần.'), writingT2Model: bt('Tourism creates jobs but can inflate prices; sustainable tourism with local involvement is key.', 'Du lịch tạo việc làm nhưng đẩy giá; du lịch bền vững là then chốt.') },
  { id: 'general-3', title: bt('General Mock 3 — Work & Career', 'General 3 — Công việc'), testType: 'general', topic: 'career development', passages: passageBank[2], writingT1: bt('Write a letter applying for a part-time position at a local bookshop. Include your experience and availability. Write at least 150 words.', 'Viết thư xin việc bán thời gian tại hiệu sách. Nêu kinh nghiệm và lịch rảnh. Viết ít nhất 150 từ.'), writingT2: bt('Is job satisfaction more important than a high salary? Discuss both views. Write at least 250 words.', 'Hài lòng công việc quan trọng hơn lương cao? Thảo luận. Viết ít nhất 250 từ.'), writingT1Model: bt('Dear Sir, I wish to apply for the weekend assistant role. I have retail experience and love literature.', 'Kính gửi, tôi xin ứng tuyển ca cuối tuần. Có kinh nghiệm bán lẻ và yêu sách.'), writingT2Model: bt('Salary ensures stability; meaningful work improves wellbeing — ideally both should be balanced.', 'Lương đảm bảo ổn định; công việc ý nghĩa cải thiện sức khỏe tinh thần.') },
  { id: 'general-4', title: bt('General Mock 4 — Housing & Living', 'General 4 — Nhà ở'), testType: 'general', topic: 'housing', passages: passageBank[3], writingT1: bt('Write to your landlord about repairs needed (leaking tap and broken heating). Request action. Write at least 150 words.', 'Viết cho chủ nhà về sửa chữa (vòi rò, sưởi hỏng). Yêu cầu xử lý. Viết ít nhất 150 từ.'), writingT2: bt('Renting a home is better than buying. Discuss both views. Write at least 250 words.', 'Thuê nhà tốt hơn mua? Thảo luận. Viết ít nhất 250 từ.'), writingT1Model: bt('Dear Landlord, the kitchen tap has leaked for two weeks and heating is unreliable. Please arrange repairs urgently.', 'Kính gửi chủ nhà, vòi bếp rò rỉ hai tuần và sưởi không ổn. Xin sửa gấp.'), writingT2Model: bt('Renting offers flexibility; buying builds equity — choice depends on stability and long-term plans.', 'Thuê linh hoạt; mua tích lũy tài sản.') },
  { id: 'general-5', title: bt('General Mock 5 — Health & Fitness', 'General 5 — Sức khỏe'), testType: 'general', topic: 'fitness', passages: passageBank[4], writingT1: bt('Write to a gym manager requesting membership information (fees, hours, classes). Write at least 150 words.', 'Viết hỏi thông tin thẻ gym (phí, giờ, lớp). Viết ít nhất 150 từ.'), writingT2: bt('Employers should provide free gym memberships. Do you agree? Write at least 250 words.', 'Nhà tuyển dụng nên cung cấp thẻ gym miễn phí? Đồng ý không? Viết ít nhất 250 từ.'), writingT1Model: bt('Dear Manager, please send membership plans, opening hours, and class schedules.', 'Kính gửi, gửi giúp gói thành viên, giờ mở cửa và lịch lớp.'), writingT2Model: bt('Workplace wellness reduces sick days; costs must be weighed against productivity gains.', 'Sức khỏe nơi làm giảm nghỉ ốm; phải cân nhắc chi phí.') },
  { id: 'general-6', title: bt('General Mock 6 — Education & Training', 'General 6 — Giáo dục'), testType: 'general', topic: 'adult education', passages: passageBank[5], writingT1: bt('Write to a college requesting information about an evening IELTS course. Write at least 150 words.', 'Viết hỏi thông tin khóa IELTS buổi tối. Viết ít nhất 150 từ.'), writingT2: bt('University education should be free for everyone. Discuss both views. Write at least 250 words.', 'Đại học nên miễn phí cho tất cả? Thảo luận. Viết ít nhất 250 từ.'), writingT1Model: bt('Dear Admissions, I am interested in your evening IELTS course. Please advise on fees and schedule.', 'Kính gửi Phòng tuyển sinh, tôi quan tâm khóa IELTS buổi tối. Xin cho biết học phí và lịch.'), writingT2Model: bt('Free tuition widens access but requires quality funding and fair admissions.', 'Miễn phí mở rộng tiếp cận nhưng cần đảm bảo chất lượng.') },
  { id: 'academic-7', title: bt('Academic Mock 7 — Psychology', 'Academic 7 — Tâm lý'), testType: 'academic', topic: 'child development', passages: passageBank[1], writingT1: bt('Pie charts show leisure time by age group. Summarise. Write at least 150 words.', 'Biểu đồ tròn thời gian giải trí theo tuổi. Tóm tắt. Viết ít nhất 150 từ.'), writingT2: bt('Children learn best through play rather than formal lessons. Discuss both views. Write at least 250 words.', 'Trẻ học qua chơi hay bài học chính thức? Thảo luận. Viết ít nhất 250 từ.'), writingT1Model: bt('Younger groups favoured digital entertainment; older adults preferred reading.', 'Nhóm trẻ thích giải trí số; người lớn thích đọc sách.'), writingT2Model: bt('Play builds creativity; structure builds discipline — integration serves children best.', 'Chơi nuôi sáng tạo; cấu trúc rèn kỷ luật.') },
  { id: 'academic-8', title: bt('Academic Mock 8 — Agriculture', 'Academic 8 — Nông nghiệp'), testType: 'academic', topic: 'food security', passages: passageBank[2], writingT1: bt('Table: food waste by sector in three countries. Summarise. Write at least 150 words.', 'Bảng lãng phí thực phẩm theo ngành. Tóm tắt. Viết ít nhất 150 từ.'), writingT2: bt('Governments should tax unhealthy food. Do you agree? Write at least 250 words.', 'Thuế thực phẩm không lành mạnh? Đồng ý không? Viết ít nhất 250 từ.'), writingT1Model: bt('Households generated the most waste in all three countries.', 'Hộ gia đình lãng phí nhiều nhất cả ba nước.'), writingT2Model: bt('Sin taxes may reduce consumption but burden low-income families; education is a fairer complement.', 'Thuế có thể giảm tiêu thụ nhưng gánh nặng hộ nghèo.') },
  { id: 'academic-9', title: bt('Academic Mock 9 — Urban Planning', 'Academic 9 — Đô thị'), testType: 'academic', topic: 'urban development', passages: passageBank[3], writingT1: bt('Maps show town centre changes 1990–2020. Summarise. Write at least 150 words.', 'Bản đồ thay đổi trung tâm 1990–2020. Tóm tắt. Viết ít nhất 150 từ.'), writingT2: bt('Advantages and disadvantages of living in large cities. Write at least 250 words.', 'Lợi và hại sống ở thành phố lớn. Viết ít nhất 250 từ.'), writingT1Model: bt('The square was pedestrianised; a metro station replaced the bus depot.', 'Quảng trường thành khu đi bộ; ga metro thay bến xe buýt.'), writingT2Model: bt('Cities offer opportunity but suffer congestion; affordable housing policy mitigates downsides.', 'Thành phố có cơ hội nhưng tắc đường; nhà ở giá rẻ giảm bất lợi.') },
  { id: 'academic-10', title: bt('Academic Mock 10 — Media', 'Academic 10 — Truyền thông'), testType: 'academic', topic: 'digital media', passages: passageBank[4], writingT1: bt('Bar chart: newspaper circulation 2000–2025. Summarise. Write at least 150 words.', 'Biểu đồ lưu hành báo 2000–2025. Tóm tắt. Viết ít nhất 150 từ.'), writingT2: bt('News on social media is damaging society. To what extent do you agree? Write at least 250 words.', 'Tin trên mạng xã hội có hại xã hội? Mức độ đồng ý? Viết ít nhất 250 từ.'), writingT1Model: bt('Print declined steadily; digital subscriptions overtook print around 2018.', 'Báo in giảm; đăng ký số vượt báo in khoảng 2018.'), writingT2Model: bt('Social media spreads misinformation but also democratises information — literacy education is essential.', 'Mạng xã hội lan tin giả nhưng cũng dân chủ hóa thông tin.') },
  { id: 'general-7', title: bt('General Mock 7 — Shopping', 'General 7 — Mua sắm'), testType: 'general', topic: 'consumer rights', passages: passageBank[1], writingT1: bt('Write about a faulty product and request replacement or refund. Write at least 150 words.', 'Viết về sản phẩm lỗi và yêu cầu đổi/hoàn tiền. Viết ít nhất 150 từ.'), writingT2: bt('Online shopping will completely replace physical stores. Do you agree? Write at least 250 words.', 'Mua online thay thế hoàn toàn cửa hàng? Đồng ý không? Viết ít nhất 250 từ.'), writingT1Model: bt('Dear Manager, my blender stopped working after two days. I request a replacement.', 'Kính gửi, máy xay hỏng sau hai ngày. Xin đổi mới.'), writingT2Model: bt('E-commerce is convenient but stores offer tactile experience — hybrid retail will dominate.', 'Thương mại điện tử tiện nhưng cửa hàng cho trải nghiệm trực tiếp.') },
  { id: 'general-8', title: bt('General Mock 8 — Transport', 'General 8 — Giao thông'), testType: 'general', topic: 'public transport', passages: passageBank[2], writingT1: bt('Write to a bus company about a lost item. Write at least 150 words.', 'Viết cho công ty xe buýt về đồ thất lạc. Viết ít nhất 150 từ.'), writingT2: bt('Cycling to work: advantages and disadvantages. Write at least 250 words.', 'Đạp xe đi làm: lợi và hại. Viết ít nhất 250 từ.'), writingT1Model: bt('Dear Lost Property, I left a blue backpack on bus 42 on Monday. Please contact me if found.', 'Kính gửi Phòng thất lạc, tôi để quên ba lô xanh trên xe 42 thứ Hai.'), writingT2Model: bt('Cycling improves health but safety remains a barrier; protected lanes are needed.', 'Đạp xe tốt sức khỏe nhưng an toàn là rào cản.') },
  { id: 'general-9', title: bt('General Mock 9 — Neighbours', 'General 9 — Hàng xóm'), testType: 'general', topic: 'neighbour relations', passages: passageBank[3], writingT1: bt('Write to a neighbour about noise from a late party. Write at least 150 words.', 'Viết cho hàng xóm về tiếng ồn tiệc khuya. Viết ít nhất 150 từ.'), writingT2: bt('Community spirit is disappearing in modern life. Why? How to improve? Write at least 250 words.', 'Tinh thần cộng đồng đang biến mất. Vì sao? Cải thiện thế nào? Viết ít nhất 250 từ.'), writingT1Model: bt('Dear neighbour, last night\'s music continued until 2 a.m. Could we agree on quieter hours?', 'Kính gửi hàng xóm, nhạc đến 2 giờ sáng. Ta thống nhất giờ yên tĩnh nhé?'), writingT2Model: bt('Urban mobility reduces interaction; community events rebuild connections.', 'Di chuyển đô thị giảm tương tác; sự kiện cộng đồng tái kết nối.') },
  { id: 'general-10', title: bt('General Mock 10 — Volunteering', 'General 10 — Tình nguyện'), testType: 'general', topic: 'volunteering', passages: passageBank[4], writingT1: bt('Write offering to volunteer at a charity event. Write at least 150 words.', 'Viết đăng ký tình nguyện sự kiện từ thiện. Viết ít nhất 150 từ.'), writingT2: bt('Wealthy nations should give more aid to poorer countries. Discuss. Write at least 250 words.', 'Nước giàu nên viện trợ nhiều hơn? Thảo luận. Viết ít nhất 250 từ.'), writingT1Model: bt('Dear Coordinator, I would like to volunteer on 15 July. I have first-aid training.', 'Kính gửi, tôi muốn tình nguyện ngày 15/7. Có sơ cứu.'), writingT2Model: bt('Aid reduces poverty but must avoid dependency; fair trade and education create sustainability.', 'Viện trợ giảm nghèo nhưng tránh phụ thuộc.') },
];

export function generateMockTests(): MockTest[] {
  return themes.map((theme, idx) => {
    const prefix = theme.id;
    const isGT = theme.testType === 'general';
    const content = themeContentFromIndex(idx, theme.topic, theme.passages);

    const listening = buildListeningTest(
      prefix,
      bt(`Listening — ${theme.title.en}`, `Nghe — ${theme.title.vi}`),
      theme.testType,
      content,
    );

    const reading = buildReadingTest(
      prefix,
      bt(`Reading — ${theme.title.en}`, `Đọc — ${theme.title.vi}`),
      theme.testType,
      content,
    );

    const writing = [
      {
        id: `${prefix}-w1`,
        taskNumber: 1 as const,
        testType: theme.testType,
        prompt: isGT ? (theme.gtLetter ?? theme.writingT1) : theme.writingT1,
        minWords: 150,
        modelAnswer: isGT ? (theme.gtLetterModel ?? theme.writingT1Model) : theme.writingT1Model,
        bandDescriptors: bandDesc,
        chart: !isGT ? buildTask1Chart(idx, theme) : undefined,
      },
      {
        id: `${prefix}-w2`,
        taskNumber: 2 as const,
        testType: theme.testType,
        prompt: theme.writingT2,
        minWords: 250,
        modelAnswer: theme.writingT2Model,
        bandDescriptors: bandDesc,
      },
    ];

    return {
      id: theme.id,
      title: theme.title,
      testType: theme.testType,
      listening,
      reading,
      writing,
      speaking: buildSpeakingParts(prefix, theme.topic),
      totalDuration: 167, // Listening 30 + transfer 10 + Reading 60 + Writing 60 + Speaking ~11-14
    };
  });
}