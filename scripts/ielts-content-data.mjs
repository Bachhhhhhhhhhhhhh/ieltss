/** Curated IELTS content — educational material inspired by public IELTS resources (IELTS Liz, Simon, Mentor, British Council). */

export const bt = (en, vi) => ({ en, vi });

export const TOPICS = [
  { key: 'education', en: 'Education', vi: 'Giáo dục' },
  { key: 'environment', en: 'Environment', vi: 'Môi trường' },
  { key: 'technology', en: 'Technology', vi: 'Công nghệ' },
  { key: 'health', en: 'Health', vi: 'Sức khỏe' },
  { key: 'work', en: 'Work & Employment', vi: 'Việc làm' },
  { key: 'crime', en: 'Crime & Law', vi: 'Tội phạm & Pháp luật' },
  { key: 'media', en: 'Media & Advertising', vi: 'Truyền thông' },
  { key: 'travel', en: 'Travel & Tourism', vi: 'Du lịch' },
  { key: 'culture', en: 'Culture & Society', vi: 'Văn hóa & Xã hội' },
  { key: 'urban', en: 'Urban Life', vi: 'Đời sống đô thị' },
  { key: 'food', en: 'Food & Agriculture', vi: 'Thực phẩm' },
  { key: 'government', en: 'Government & Policy', vi: 'Chính phủ' },
  { key: 'science', en: 'Science & Research', vi: 'Khoa học' },
  { key: 'family', en: 'Family & Relationships', vi: 'Gia đình' },
];

/** verb+noun / adj+noun patterns per topic */
export const COLLOCATION_PATTERNS = [
  ['pose a threat', 'đe dọa', 'Climate change poses a threat to coastal cities.', 'Biến đổi khí hậu đe dọa thành phố ven biển.'],
  ['raise awareness', 'nâng cao nhận thức', 'Campaigns raise awareness about mental health.', 'Chiến dịch nâng cao nhận thức sức khỏe tâm thần.'],
  ['implement policy', 'triển khai chính sách', 'Governments must implement policies on emissions.', 'Chính phủ phải triển khai chính sách khí thải.'],
  ['conduct research', 'tiến hành nghiên cứu', 'Universities conduct research into renewable energy.', 'Đại học nghiên cứu năng lượng tái tạo.'],
  ['gain employment', 'có việc làm', 'Graduates struggle to gain employment in saturated fields.', 'Sinh viên tốt nghiệp khó có việc trong ngành bão hòa.'],
  ['commit a crime', 'phạm tội', 'Repeat offenders commit crimes shortly after release.', 'Tái phạm phạm tội ngay sau khi ra tù.'],
  ['meet demand', 'đáp ứng nhu cầu', 'Factories cannot meet demand during peak seasons.', 'Nhà máy không đáp ứng nhu cầu mùa cao điểm.'],
  ['play a role', 'đóng vai trò', 'Technology plays a vital role in modern education.', 'Công nghệ đóng vai trò quan trọng trong giáo dục.'],
  ['take responsibility', 'chịu trách nhiệm', 'Corporations should take responsibility for pollution.', 'Doanh nghiệp nên chịu trách nhiệm ô nhiễm.'],
  ['reach a conclusion', 'đi đến kết luận', 'Researchers reached a conclusion after five years.', 'Nhà nghiên cứu kết luận sau năm năm.'],
  ['face challenges', 'đối mặt thách thức', 'Urban planners face challenges from rapid growth.', 'Quy hoạch đô thị đối mặt thách thức tăng trưởng.'],
  ['provide opportunity', 'mang lại cơ hội', 'Scholarships provide opportunity for disadvantaged youth.', 'Học bổng mang cơ hội cho thanh niên khó khăn.'],
  ['achieve success', 'đạt thành công', 'Consistent practice helps candidates achieve success.', 'Luyện đều giúp thí sinh thành công.'],
  ['make progress', 'tiến bộ', 'Students make progress when feedback is immediate.', 'Học sinh tiến bộ khi phản hồi tức thì.'],
  ['address the issue', 'giải quyết vấn đề', 'Leaders must address the issue of income inequality.', 'Lãnh đạo phải giải quyết bất bình đẳng thu nhập.'],
  ['have an impact', 'có tác động', 'Social media has an impact on teenage self-esteem.', 'Mạng xã hội tác động lòng tự trọng tuổi teen.'],
  ['draw attention', 'thu hút sự chú ý', 'The report drew attention to water scarcity.', 'Báo cáo thu hút chú ý đến thiếu nước.'],
  ['meet requirements', 'đáp ứng yêu cầu', 'Applicants must meet requirements for visa approval.', 'Ứng viên phải đáp ứng yêu cầu visa.'],
  ['offer benefits', 'mang lại lợi ích', 'Remote work offers benefits for work-life balance.', 'Làm từ xa mang lợi ích cân bằng cuộc sống.'],
  ['create opportunity', 'tạo cơ hội', 'Free trade can create opportunity for exporters.', 'Thương mại tự do tạo cơ hội xuất khẩu.'],
];

export const TOPIC_WORDS = {
  education: [
    ['curriculum', 'n', 'subjects taught in a programme', 'chương trình giảng dạy', 'revise the curriculum'],
    ['literacy', 'n', 'ability to read and write', 'biết đọc viết', 'improve literacy rates'],
    ['tuition', 'n', 'money paid for education', 'học phí', 'rising tuition fees'],
    ['pedagogy', 'n', 'method and practice of teaching', 'sư phạm', 'modern pedagogy'],
    ['enrollment', 'n', 'act of registering for a course', 'ghi danh', 'university enrollment'],
    ['scholarship', 'n', 'financial award for study', 'học bổng', 'apply for a scholarship'],
    ['dissertation', 'n', 'long research paper for a degree', 'luận văn', 'submit a dissertation'],
    ['extracurricular', 'adj', 'outside the normal curriculum', 'ngoại khóa', 'extracurricular activities'],
    ['compulsory', 'adj', 'required by law or rules', 'bắt buộc', 'compulsory education'],
    ['vocational', 'adj', 'relating to job skills training', 'dạy nghề', 'vocational training'],
    ['enrollment rate', 'n', 'percentage of students registered', 'tỷ lệ ghi danh', 'boost enrollment rates'],
    ['mentor', 'n', 'experienced adviser', 'người cố vấn', 'mentor students'],
    ['plagiarism', 'n', 'copying others\' work dishonestly', 'đạo văn', 'avoid plagiarism'],
    ['assessment', 'n', 'evaluation of performance', 'đánh giá', 'continuous assessment'],
    ['dropout', 'n', 'person who leaves school early', 'bỏ học', 'reduce dropout rates'],
    ['distance learning', 'n', 'remote study', 'học từ xa', 'distance learning platforms'],
    ['academic', 'adj', 'relating to education/scholarship', 'học thuật', 'academic achievement'],
    ['rote learning', 'n', 'memorisation without understanding', 'học vẹt', 'criticise rote learning'],
  ],
  environment: [
    ['biodiversity', 'n', 'variety of life in an area', 'đa dạng sinh học', 'protect biodiversity'],
    ['emissions', 'n', 'gases released into air', 'khí thải', 'cut carbon emissions'],
    ['renewable', 'adj', 'naturally replenished energy', 'tái tạo', 'renewable energy sources'],
    ['deforestation', 'n', 'clearing forests', 'phá rừng', 'combat deforestation'],
    ['sustainable', 'adj', 'able to continue without harm', 'bền vững', 'sustainable development'],
    ['ecosystem', 'n', 'community of living organisms', 'hệ sinh thái', 'fragile ecosystems'],
    ['pollution', 'n', 'contamination of environment', 'ô nhiễm', 'air pollution levels'],
    ['conservation', 'n', 'protection of natural resources', 'bảo tồn', 'wildlife conservation'],
    ['drought', 'n', 'prolonged lack of rain', 'hạn hán', 'severe drought conditions'],
    ['recycle', 'v', 'process waste for reuse', 'tái chế', 'recycle plastic waste'],
    ['habitat', 'n', 'natural home of species', 'môi trường sống', 'destroy habitats'],
    ['fossil fuels', 'n', 'coal, oil, gas', 'nhiên liệu hóa thạch', 'phase out fossil fuels'],
    ['carbon footprint', 'n', 'total greenhouse gas caused', 'dấu chân carbon', 'reduce carbon footprint'],
    ['extinction', 'n', 'dying out of a species', 'tuyệt chủng', 'face extinction'],
    ['contaminate', 'v', 'make impure or poisonous', 'làm ô nhiễm', 'contaminate water supplies'],
    ['erosion', 'n', 'gradual wearing away', 'xói mòn', 'soil erosion'],
    ['greenhouse gases', 'n', 'gases trapping heat', 'khí nhà kính', 'reduce greenhouse gases'],
    ['endangered', 'adj', 'at risk of extinction', 'nguy cấp', 'endangered species'],
  ],
  technology: [
    ['artificial intelligence', 'n', 'machine simulation of intelligence', 'trí tuệ nhân tạo', 'AI applications'],
    ['automation', 'n', 'use of machines to replace humans', 'tự động hóa', 'workplace automation'],
    ['cybersecurity', 'n', 'protection of computer systems', 'an ninh mạng', 'cybersecurity threats'],
    ['innovation', 'n', 'introduction of new ideas', 'đổi mới', 'drive innovation'],
    ['digital', 'adj', 'relating to computer technology', 'số', 'digital transformation'],
    ['algorithm', 'n', 'set of computer rules', 'thuật toán', 'social media algorithms'],
    ['disruptive', 'adj', 'causing major change', 'đột phá', 'disruptive technology'],
    ['connectivity', 'n', 'ability to connect', 'kết nối', 'global connectivity'],
    ['surveillance', 'n', 'close observation', 'giám sát', 'mass surveillance'],
    ['encryption', 'n', 'coding data for security', 'mã hóa', 'data encryption'],
    ['obsolete', 'adj', 'no longer used', 'lỗi thời', 'become obsolete'],
    ['breakthrough', 'n', 'important discovery', 'đột phá', 'scientific breakthrough'],
    ['user-friendly', 'adj', 'easy to use', 'thân thiện người dùng', 'user-friendly interface'],
    ['bandwidth', 'n', 'data transfer capacity', 'băng thông', 'limited bandwidth'],
    ['prototype', 'n', 'early model of product', 'nguyên mẫu', 'develop a prototype'],
    ['malware', 'n', 'malicious software', 'phần mềm độc hại', 'install malware'],
    ['virtual reality', 'n', 'simulated 3D environment', 'thực tế ảo', 'virtual reality headsets'],
    ['data breach', 'n', 'unauthorised data access', 'rò rỉ dữ liệu', 'major data breach'],
  ],
  health: [
    ['epidemic', 'n', 'widespread disease outbreak', 'dịch bệnh', 'contain an epidemic'],
    ['obesity', 'n', 'excess body fat condition', 'béo phì', 'childhood obesity'],
    ['sedentary', 'adj', 'involving little physical activity', 'ít vận động', 'sedentary lifestyle'],
    ['immunity', 'n', 'resistance to disease', 'miễn dịch', 'boost immunity'],
    ['diagnosis', 'n', 'identification of illness', 'chẩn đoán', 'early diagnosis'],
    ['preventive', 'adj', 'intended to stop something', 'phòng ngừa', 'preventive medicine'],
    ['chronic', 'adj', 'long-lasting condition', 'mãn tính', 'chronic disease'],
    ['nutrition', 'n', 'process of nourishing body', 'dinh dưỡng', 'balanced nutrition'],
    ['wellbeing', 'n', 'state of being healthy and happy', 'sức khỏe tổng thể', 'mental wellbeing'],
    ['vaccination', 'n', 'treatment to produce immunity', 'tiêm chủng', 'vaccination programme'],
    ['rehabilitation', 'n', 'restoring health after illness', 'phục hồi', 'drug rehabilitation'],
    ['hygiene', 'n', 'conditions promoting health', 'vệ sinh', 'personal hygiene'],
    ['symptom', 'n', 'sign of disease', 'triệu chứng', 'recognise symptoms'],
    ['healthcare', 'n', 'organized medical services', 'chăm sóc sức khỏe', 'universal healthcare'],
    ['pandemic', 'n', 'global disease outbreak', 'đại dịch', 'respond to a pandemic'],
    ['addiction', 'n', 'inability to stop harmful habit', 'nghiện', 'overcome addiction'],
    ['antibiotic', 'n', 'medicine killing bacteria', 'kháng sinh', 'antibiotic resistance'],
    ['life expectancy', 'n', 'average lifespan', 'tuổi thọ', 'increase life expectancy'],
  ],
  crime: [
    ['offender', 'n', 'person who commits a crime', 'tội phạm', 'repeat offender'],
    ['deterrent', 'n', 'something that discourages action', 'răn đe', 'effective deterrent'],
    ['incarceration', 'n', 'imprisonment', 'giam giữ', 'lengthy incarceration'],
    ['rehabilitation', 'n', 'restoring to normal life', 'cải tạo', 'prison rehabilitation'],
    ['juvenile', 'adj', 'relating to young people', 'vị thành niên', 'juvenile delinquency'],
    ['surveillance', 'n', 'close monitoring', 'giám sát', 'CCTV surveillance'],
    ['prosecution', 'n', 'legal proceedings against accused', 'truy tố', 'criminal prosecution'],
    ['verdict', 'n', 'decision in a court case', 'phán quyết', 'guilty verdict'],
    ['corruption', 'n', 'dishonest use of power', 'tham nhũng', 'combat corruption'],
    ['petty crime', 'n', 'minor criminal offence', 'tội nhẹ', 'rise in petty crime'],
    ['capital punishment', 'n', 'death penalty', 'án tử hình', 'abolish capital punishment'],
    ['recidivism', 'n', 'tendency to reoffend', 'tái phạm', 'reduce recidivism'],
    ['forensic', 'adj', 'relating to scientific crime investigation', 'pháp y', 'forensic evidence'],
    ['victim', 'n', 'person harmed by crime', 'nạn nhân', 'support victims'],
    ['legislation', 'n', 'laws enacted by authority', 'pháp luật', 'tougher legislation'],
    ['bail', 'n', 'temporary release awaiting trial', 'bảo lãnh', 'deny bail'],
    ['community service', 'n', 'unpaid work as punishment', 'lao động công ích', 'sentence to community service'],
    ['white-collar crime', 'n', 'non-violent financial crime', 'tội cổ trắng', 'white-collar crime rates'],
  ],
  media: [
    ['censorship', 'n', 'suppression of information', 'kiểm duyệt', 'government censorship'],
    ['misinformation', 'n', 'false or inaccurate information', 'thông tin sai', 'spread misinformation'],
    ['viral', 'adj', 'spreading rapidly online', 'lan truyền', 'go viral'],
    ['endorsement', 'n', 'public approval of product', 'bảo trợ', 'celebrity endorsement'],
    ['broadcast', 'v', 'transmit on TV or radio', 'phát sóng', 'live broadcast'],
    ['tabloid', 'n', 'sensational newspaper', 'báo lá cải', 'tabloid journalism'],
    ['subscription', 'n', 'payment for regular access', 'đăng ký', 'streaming subscription'],
    ['algorithm', 'n', 'set of rules for content', 'thuật toán', 'recommendation algorithm'],
    ['clickbait', 'n', 'misleading online headline', 'câu view', 'avoid clickbait'],
    ['impartial', 'adj', 'fair and unbiased', 'khách quan', 'impartial reporting'],
    ['sensationalism', 'n', 'exaggeration for attention', 'giật gân', 'media sensationalism'],
    ['documentary', 'n', 'factual film programme', 'phim tài liệu', 'award-winning documentary'],
    ['influencer', 'n', 'person affecting opinions online', 'người ảnh hưởng', 'social media influencer'],
    ['publicity', 'n', 'attention in media', 'quảng bá', 'generate publicity'],
    ['freedom of speech', 'n', 'right to express opinions', 'tự do ngôn luận', 'protect freedom of speech'],
    ['target audience', 'n', 'intended group of viewers', 'đối tượng mục tiêu', 'reach target audience'],
    ['ratings', 'n', 'measure of popularity', 'tỷ lệ xem', 'boost TV ratings'],
    ['propaganda', 'n', 'biased political information', 'tuyên truyền', 'state propaganda'],
  ],
  travel: [
    ['itinerary', 'n', 'planned route or schedule', 'lịch trình', 'flexible itinerary'],
    ['destination', 'n', 'place being visited', 'điểm đến', 'popular destination'],
    ['sustainable tourism', 'n', 'eco-friendly travel', 'du lịch bền vững', 'promote sustainable tourism'],
    ['backpacker', 'n', 'budget traveller with rucksack', 'phượt thủ', 'backpacker hostel'],
    ['heritage site', 'n', 'place of cultural importance', 'di sản', 'UNESCO heritage site'],
    ['visa', 'n', 'official entry permission', 'thị thực', 'apply for a visa'],
    ['accommodation', 'n', 'place to stay', 'chỗ ở', 'budget accommodation'],
    ['overtourism', 'n', 'excessive visitors harming places', 'du lịch quá tải', 'combat overtourism'],
    ['ecotourism', 'n', 'responsible nature travel', 'du lịch sinh thái', 'ecotourism revenue'],
    ['layover', 'n', 'stop between flights', 'quá cảnh', 'long layover'],
    ['customs', 'n', 'border import regulations', 'hải quan', 'clear customs'],
    ['excursion', 'n', 'short pleasure trip', 'chuyến tham quan', 'day excursion'],
    ['peak season', 'n', 'busiest travel period', 'mùa cao điểm', 'avoid peak season'],
    ['domestic travel', 'n', 'travel within own country', 'du lịch nội địa', 'boost domestic travel'],
    ['cruise', 'n', 'holiday on a large ship', 'du thuyền', 'luxury cruise'],
    ['immigration', 'n', 'movement into a country', 'nhập cư', 'immigration queue'],
    ['souvenir', 'n', 'memento from a trip', 'quà lưu niệm', 'buy souvenirs'],
    ['travel advisory', 'n', 'official safety warning', 'cảnh báo du lịch', 'issue travel advisory'],
  ],
  culture: [
    ['heritage', 'n', 'traditions passed through generations', 'di sản', 'cultural heritage'],
    ['assimilation', 'n', 'absorbing into another culture', 'hòa nhập', 'cultural assimilation'],
    ['multicultural', 'adj', 'including many cultures', 'đa văn hóa', 'multicultural society'],
    ['tradition', 'n', 'long-established custom', 'truyền thống', 'preserve tradition'],
    ['globalisation', 'n', 'worldwide integration', 'toàn cầu hóa', 'impact of globalisation'],
    ['indigenous', 'adj', 'native to a region', 'bản địa', 'indigenous communities'],
    ['stereotype', 'n', 'oversimplified belief about group', 'định kiến', 'challenge stereotypes'],
    ['etiquette', 'n', 'accepted social behaviour', 'phép lịch sự', 'business etiquette'],
    ['festivity', 'n', 'celebration or festival', 'lễ hội', 'annual festivity'],
    ['preservation', 'n', 'keeping something intact', 'bảo tồn', 'heritage preservation'],
    ['diversity', 'n', 'variety of cultures', 'đa dạng', 'celebrate diversity'],
    ['custom', 'n', 'traditional practice', 'phong tục', 'local custom'],
    ['identity', 'n', 'sense of belonging to culture', 'bản sắc', 'national identity'],
    ['artefact', 'n', 'historical object', 'hiện vật', 'museum artefact'],
    ['folklore', 'n', 'traditional stories and beliefs', 'văn học dân gian', 'local folklore'],
    ['xenophobia', 'n', 'fear of foreigners', 'bài ngoại', 'combat xenophobia'],
    ['integration', 'n', 'combining into a whole', 'hội nhập', 'social integration'],
    ['ceremony', 'n', 'formal ritual event', 'nghi lễ', 'wedding ceremony'],
  ],
  urban: [
    ['urbanisation', 'n', 'growth of cities', 'đô thị hóa', 'rapid urbanisation'],
    ['infrastructure', 'n', 'basic physical systems', 'hạ tầng', 'upgrade infrastructure'],
    ['congestion', 'n', 'overcrowded traffic', 'tắc nghẽn', 'traffic congestion'],
    ['skyscraper', 'n', 'very tall building', 'nhà chọc trời', 'modern skyscraper'],
    ['suburb', 'n', 'residential area outside centre', 'ngoại ô', 'leafy suburb'],
    ['gentrification', 'n', 'renovation displacing residents', 'đô thị hóa khu cũ', 'gentrification debate'],
    ['affordable housing', 'n', 'low-cost homes', 'nhà ở giá rẻ', 'shortage of affordable housing'],
    ['metropolitan', 'adj', 'relating to large city', 'đô thị lớn', 'metropolitan area'],
    ['pedestrian', 'n', 'person walking', 'người đi bộ', 'pedestrian zone'],
    ['commuter', 'n', 'daily traveller to work', 'người đi làm', 'daily commuter'],
    ['sprawl', 'n', 'uncontrolled city expansion', 'lan rộng', 'urban sprawl'],
    ['amenities', 'n', 'useful facilities', 'tiện ích', 'local amenities'],
    ['overpopulation', 'n', 'excess number of people', 'quá đông dân', 'overpopulation crisis'],
    ['slum', 'n', 'overcrowded poor housing area', 'khu ổ chuột', 'clear slums'],
    ['zoning', 'n', 'land-use planning rules', 'quy hoạch', 'zoning regulations'],
    ['public transport', 'n', 'buses, trains for public', 'giao thông công cộng', 'reliable public transport'],
    ['green space', 'n', 'parks and open areas', 'không gian xanh', 'lack of green space'],
    ['high-rise', 'n', 'tall apartment building', 'cao tầng', 'high-rise development'],
  ],
  food: [
    ['organic', 'adj', 'grown without chemicals', 'hữu cơ', 'organic produce'],
    ['processed food', 'n', 'factory-made food products', 'thực phẩm chế biến', 'avoid processed food'],
    ['malnutrition', 'n', 'lack of proper nutrition', 'suy dinh dưỡng', 'childhood malnutrition'],
    ['food security', 'n', 'reliable access to food', 'an ninh lương thực', 'ensure food security'],
    ['cuisine', 'n', 'style of cooking', 'ẩm thực', 'local cuisine'],
    ['genetically modified', 'adj', 'altered by genetic engineering', 'biến đổi gen', 'GM crops'],
    ['obesity epidemic', 'n', 'widespread excess weight', 'dịch béo phì', 'tackle obesity epidemic'],
    ['subsidy', 'n', 'government financial support', 'trợ cấp', 'farm subsidy'],
    ['harvest', 'n', 'gathering of crops', 'mùa gặt', 'bumper harvest'],
    ['famine', 'n', 'extreme food shortage', 'nạn đói', 'prevent famine'],
    ['vegetarian', 'adj', 'not eating meat', 'ăn chay', 'vegetarian diet'],
    ['food waste', 'n', 'discarded edible food', 'lãng phí thực phẩm', 'reduce food waste'],
    ['irrigation', 'n', 'artificial water supply for crops', 'tưới tiêu', 'irrigation system'],
    ['pesticide', 'n', 'chemical killing crop pests', 'thuốc trừ sâu', 'reduce pesticide use'],
    ['fair trade', 'n', 'ethical trading with producers', 'thương mại công bằng', 'fair trade coffee'],
    ['dietary', 'adj', 'relating to diet', 'ăn uống', 'dietary requirements'],
    ['livestock', 'n', 'farm animals', 'gia súc', 'livestock farming'],
    ['foodborne illness', 'n', 'sickness from contaminated food', 'bệnh từ thực phẩm', 'prevent foodborne illness'],
  ],
  government: [
    ['democracy', 'n', 'government by the people', 'dân chủ', 'strengthen democracy'],
    ['bureaucracy', 'n', 'complex administrative system', 'quan liêu', 'cut bureaucracy'],
    ['taxation', 'n', 'system of collecting taxes', 'đánh thuế', 'progressive taxation'],
    ['welfare', 'n', 'government support for needy', 'phúc lợi', 'welfare state'],
    ['referendum', 'n', 'public vote on issue', 'trưng cầu dân ý', 'hold a referendum'],
    ['sovereignty', 'n', 'supreme authority of state', 'chủ quyền', 'national sovereignty'],
    ['transparency', 'n', 'openness in government', 'minh bạch', 'government transparency'],
    ['accountability', 'n', 'responsibility for actions', 'trách nhiệm giải trình', 'public accountability'],
    ['fiscal policy', 'n', 'government spending and tax policy', 'chính sách tài khóa', 'expansionary fiscal policy'],
    ['regulation', 'n', 'official rule or directive', 'quy định', 'strict regulation'],
    ['constituency', 'n', 'area represented by politician', 'cử tri', 'serve constituents'],
    ['coalition', 'n', 'alliance of political parties', 'liên minh', 'form a coalition'],
    ['sanction', 'n', 'penalty for breaking law', 'trừng phạt', 'economic sanctions'],
    ['public sector', 'n', 'government-owned services', 'khu vực công', 'public sector reform'],
    ['privatisation', 'n', 'transfer to private ownership', 'tư nhân hóa', 'oppose privatisation'],
    ['legislature', 'n', 'law-making body', 'cơ quan lập pháp', 'elected legislature'],
    ['civil servant', 'n', 'government employee', 'công chức', 'senior civil servant'],
    ['manifesto', 'n', 'political party programme', 'cương lĩnh', 'election manifesto'],
  ],
  science: [
    ['hypothesis', 'n', 'proposed explanation to test', 'giả thuyết', 'test a hypothesis'],
    ['peer review', 'n', 'evaluation by experts', 'phản biện', 'rigorous peer review'],
    ['breakthrough', 'n', 'important discovery', 'đột phá', 'scientific breakthrough'],
    ['clinical trial', 'n', 'medical research test', 'thử nghiệm lâm sàng', 'phase III clinical trial'],
    ['stem cell', 'n', 'cell that can develop into others', 'tế bào gốc', 'stem cell research'],
    ['quantum', 'adj', 'relating to quantum physics', 'lượng tử', 'quantum computing'],
    ['empirical', 'adj', 'based on observation', 'thực nghiệm', 'empirical evidence'],
    ['innovation', 'n', 'new method or idea', 'đổi mới', 'drive innovation'],
    ['funding', 'n', 'money for research', 'kinh phí', 'research funding'],
    ['ethics', 'n', 'moral principles in research', 'đạo đức', 'research ethics'],
    ['laboratory', 'n', 'place for scientific work', 'phòng thí nghiệm', 'state-of-the-art laboratory'],
    ['specimen', 'n', 'sample for study', 'mẫu vật', 'collect specimens'],
    ['theory', 'n', 'well-substantiated explanation', 'lý thuyết', 'evolutionary theory'],
    ['data analysis', 'n', 'examining research data', 'phân tích dữ liệu', 'statistical data analysis'],
    ['replication', 'n', 'repeating study to verify', 'tái lập', 'failed replication'],
    ['interdisciplinary', 'adj', 'combining multiple fields', 'liên ngành', 'interdisciplinary research'],
    ['patent', 'n', 'exclusive invention right', 'bằng sáng chế', 'file a patent'],
    ['space exploration', 'n', 'investigation of outer space', 'khám phá vũ trụ', 'fund space exploration'],
  ],
  family: [
    ['nuclear family', 'n', 'parents and children only', 'gia đình hạt nhân', 'traditional nuclear family'],
    ['extended family', 'n', 'including relatives beyond parents', 'gia đình mở rộng', 'live with extended family'],
    ['single parent', 'n', 'one parent raising children', 'cha/mẹ đơn thân', 'single parent household'],
    ['divorce rate', 'n', 'frequency of marriage dissolution', 'tỷ lệ ly hôn', 'rising divorce rate'],
    ['fertility rate', 'n', 'average children per woman', 'tỷ lệ sinh', 'declining fertility rate'],
    ['childcare', 'n', 'care of children', 'chăm sóc trẻ', 'affordable childcare'],
    ['elderly care', 'n', 'support for old people', 'chăm sóc người già', 'elderly care services'],
    ['domestic violence', 'n', 'abuse within household', 'bạo lực gia đình', 'combat domestic violence'],
    ['upbringing', 'n', 'way child is raised', 'cách nuôi dạy', 'strict upbringing'],
    ['generation gap', 'n', 'differences between age groups', 'khoảng cách thế hệ', 'bridge generation gap'],
    ['household', 'n', 'people living together', 'hộ gia đình', 'average household size'],
    ['maternity leave', 'n', 'paid leave after childbirth', 'nghỉ thai sản', 'extend maternity leave'],
    ['paternity leave', 'n', 'leave for new fathers', 'nghỉ khi vợ sinh', 'paid paternity leave'],
    ['adoption', 'n', 'legally taking another\'s child', 'nhận nuôi', 'international adoption'],
    ['kinship', 'n', 'family relationship', 'huyết thống', 'kinship ties'],
    ['cohabitation', 'n', 'living together unmarried', 'sống thử', 'rise in cohabitation'],
    ['work-life balance', 'n', 'equilibrium of work and home', 'cân bằng công việc', 'improve work-life balance'],
    ['parental responsibility', 'n', 'duties of raising children', 'trách nhiệm làm cha mẹ', 'share parental responsibility'],
  ],
  work: [
    ['unemployment', 'n', 'state of being jobless', 'thất nghiệp', 'youth unemployment'],
    ['productivity', 'n', 'rate of output per worker', 'năng suất', 'boost productivity'],
    ['redundancy', 'n', 'dismissal because job unnecessary', 'sa thải', 'face redundancy'],
    ['freelance', 'adj', 'self-employed per project', 'tự do', 'freelance work'],
    ['remuneration', 'n', 'payment for work', 'thù lao', 'fair remuneration'],
    ['workforce', 'n', 'people engaged in work', 'lực lượng lao động', 'skilled workforce'],
    ['commute', 'v', 'travel to work daily', 'đi làm', 'lengthy commute'],
    ['overtime', 'n', 'extra working hours', 'làm thêm giờ', 'work overtime'],
    ['pension', 'n', 'retirement income', 'lương hưu', 'pension scheme'],
    ['recruitment', 'n', 'process of hiring', 'tuyển dụng', 'online recruitment'],
    ['strike', 'n', 'work stoppage protest', 'đình công', 'go on strike'],
    ['internship', 'n', 'temporary work experience', 'thực tập', 'paid internship'],
    ['resignation', 'n', 'act of leaving a job', 'từ chức', 'submit resignation'],
    ['promotion', 'n', 'advancement to higher position', 'thăng tiến', 'earn a promotion'],
    ['job satisfaction', 'n', 'contentment with work', 'hài lòng công việc', 'job satisfaction levels'],
    ['minimum wage', 'n', 'lowest legal pay', 'lương tối thiểu', 'raise minimum wage'],
    ['glass ceiling', 'n', 'invisible barrier to advancement', 'trần kính', 'break the glass ceiling'],
    ['gig economy', 'n', 'short-term contract work', 'kinh tế gig', 'gig economy workers'],
  ],
};

/** Topic-specific collocations (12+ per topic) */
export const TOPIC_COLLOCATIONS = {
  education: [
    ['acquire knowledge', 'tiếp thu kiến thức', 'Students acquire knowledge through active participation.', 'Học sinh tiếp thu kiến thức qua tham gia tích cực.'],
    ['meet deadlines', 'đúng hạn', 'University assignments require students to meet deadlines.', 'Bài tập đại học yêu cầu đúng hạn.'],
    ['pursue higher education', 'theo học đại học', 'Many graduates pursue higher education abroad.', 'Nhiều sinh viên du học sau tốt nghiệp.'],
    ['drop out of school', 'bỏ học', 'Economic hardship forces some teenagers to drop out of school.', 'Khó khăn kinh tế khiến teen bỏ học.'],
    ['set high standards', 'đặt tiêu chuẩn cao', 'Elite schools set high standards for admission.', 'Trường top đặt tiêu chuẩn cao tuyển sinh.'],
    ['broaden horizons', 'mở rộng tầm nhìn', 'Exchange programmes broaden horizons for young learners.', 'Trao đổi mở rộng tầm nhìn học sinh.'],
    ['rote memorisation', 'học vẹt', 'Critics argue rote memorisation stifles creativity.', 'Phê phán học vẹt kìm hãm sáng tạo.'],
    ['close the gap', 'thu hẹp khoảng cách', 'Scholarships help close the gap between rich and poor students.', 'Học bổng thu hẹp khoảng cách giàu nghèo.'],
    ['academic performance', 'thành tích học tập', 'Parental involvement improves academic performance.', 'Phụ huynh quan tâm cải thiện thành tích.'],
    ['lifelong learning', 'học suốt đời', 'Digital platforms promote lifelong learning.', 'Nền tảng số thúc đẩy học suốt đời.'],
    ['gain admission', 'được nhận', 'She gained admission to a prestigious university.', 'Cô được nhận vào đại học danh tiếng.'],
    ['underperform academically', 'học kém', 'Children who lack sleep tend to underperform academically.', 'Trẻ thiếu ngủ hay học kém.'],
  ],
  environment: [
    ['carbon emissions', 'khí thải carbon', 'Industries must cut carbon emissions by 2030.', 'Ngành công nghiệp phải cắt khí thải carbon 2030.'],
    ['renewable sources', 'nguồn tái tạo', 'Governments invest in renewable sources of energy.', 'Chính phủ đầu tư năng lượng tái tạo.'],
    ['environmental degradation', 'suy thoái môi trường', 'Deforestation accelerates environmental degradation.', 'Phá rừng đẩy nhanh suy thoái môi trường.'],
    ['tackle climate change', 'đối phó biến đổi khí hậu', 'Nations must cooperate to tackle climate change.', 'Quốc gia phải hợp tác đối phó BĐKH.'],
    ['natural habitat', 'môi trường sống tự nhiên', 'Urban expansion destroys natural habitat.', 'Đô thị hóa phá hủy môi trường sống.'],
    ['sustainable practices', 'thực hành bền vững', 'Farmers adopt sustainable practices to protect soil.', 'Nông dân áp dụng thực hành bền vững.'],
    ['ecological balance', 'cân bằng sinh thái', 'Pesticides disrupt ecological balance.', 'Thuốc trừ sâu phá cân bằng sinh thái.'],
    ['carbon neutral', 'trung hòa carbon', 'Several corporations aim to become carbon neutral.', 'Nhiều tập đoàn hướng trung hòa carbon.'],
    ['marine ecosystem', 'hệ sinh thái biển', 'Oil spills devastate marine ecosystems.', 'Tràn dầu tàn phá hệ sinh thái biển.'],
    ['environmental awareness', 'nhận thức môi trường', 'Schools raise environmental awareness among pupils.', 'Trường nâng cao nhận thức môi trường.'],
    ['exhaust fumes', 'khí xả', 'Vehicle exhaust fumes worsen air quality.', 'Khí xả xe làm xấu không khí.'],
    ['conserve water', 'tiết kiệm nước', 'Drought-prone regions must conserve water.', 'Vùng hạn hán phải tiết kiệm nước.'],
  ],
  technology: [
    ['cutting-edge technology', 'công nghệ tiên tiến', 'Hospitals adopt cutting-edge technology for diagnosis.', 'Bệnh viện áp dụng công nghệ tiên tiến chẩn đoán.'],
    ['digital literacy', 'năng lực số', 'Schools teach digital literacy from primary level.', 'Trường dạy năng lực số từ tiểu học.'],
    ['data privacy', 'quyền riêng tư dữ liệu', 'Users demand stronger data privacy protections.', 'Người dùng đòi bảo vệ quyền riêng tư dữ liệu.'],
    ['technological advancement', 'tiến bộ công nghệ', 'Technological advancement transforms manufacturing.', 'Tiến bộ công nghệ biến đổi sản xuất.'],
    ['pose security risks', 'gây rủi ro an ninh', 'Outdated software can pose security risks.', 'Phần mềm cũ gây rủi ro an ninh.'],
    ['embrace innovation', 'đón nhận đổi mới', 'Start-ups embrace innovation to gain market share.', 'Startup đón nhận đổi mới giành thị phần.'],
    ['bridge the digital divide', 'thu hẹp khoảng cách số', 'Subsidised internet helps bridge the digital divide.', 'Internet trợ cấp thu hẹp khoảng cách số.'],
    ['artificial intelligence', 'trí tuệ nhân tạo', 'Artificial intelligence automates routine tasks.', 'AI tự động hóa công việc thường ngày.'],
    ['screen time', 'thời gian màn hình', 'Parents limit children\'s screen time.', 'Phụ huynh hạn chế thời gian màn hình trẻ.'],
    ['tech-savvy', 'am hiểu công nghệ', 'Tech-savvy graduates find jobs more easily.', 'Sinh viên am công nghệ dễ tìm việc hơn.'],
    ['launch an app', 'ra mắt ứng dụng', 'The company will launch an app next quarter.', 'Công ty ra mắt app quý tới.'],
    ['obsolete equipment', 'thiết bị lỗi thời', 'Factories replace obsolete equipment regularly.', 'Nhà máy thay thiết bị lỗi thời định kỳ.'],
  ],
  health: [
    ['public health', 'sức khỏe cộng đồng', 'Vaccination campaigns protect public health.', 'Tiêm chủng bảo vệ sức khỏe cộng đồng.'],
    ['mental health', 'sức khỏe tâm thần', 'Employers increasingly address mental health at work.', 'Nhà tuyển dụng quan tâm sức khỏe tâm thần.'],
    ['lead a sedentary lifestyle', 'lối sống ít vận động', 'Office workers often lead a sedentary lifestyle.', 'Nhân viên văn phòng hay ít vận động.'],
    ['combat obesity', 'chống béo phì', 'Schools combat obesity through sports programmes.', 'Trường chống béo phì qua thể thao.'],
    ['life-threatening condition', 'bệnh nguy hiểm tính mạng', 'Early screening detects life-threatening conditions.', 'Sàng lọc sớm phát hiện bệnh nguy hiểm.'],
    ['healthcare system', 'hệ thống y tế', 'An ageing population strains the healthcare system.', 'Già hóa dân số gây áp lực y tế.'],
    ['undergo surgery', 'phẫu thuật', 'Patients undergo surgery under general anaesthetic.', 'Bệnh nhân phẫu thuật gây mê.'],
    ['side effects', 'tác dụng phụ', 'Medication may cause unpleasant side effects.', 'Thuốc có thể gây tác dụng phụ.'],
    ['boost immunity', 'tăng miễn dịch', 'Balanced diet helps boost immunity.', 'Ăn cân bằng tăng miễn dịch.'],
    ['preventive measures', 'biện pháp phòng ngừa', 'Governments promote preventive measures against disease.', 'Chính phủ khuyến khích phòng bệnh.'],
    ['access to healthcare', 'tiếp cận y tế', 'Rural areas lack access to healthcare.', 'Nông thôn thiếu tiếp cận y tế.'],
    ['chronic illness', 'bệnh mãn tính', 'Chronic illness reduces workforce productivity.', 'Bệnh mãn tính giảm năng suất lao động.'],
  ],
  work: [
    ['job security', 'an toàn việc làm', 'Automation threatens job security in some sectors.', 'Tự động hóa đe dọa an toàn việc làm.'],
    ['career prospects', 'triển vọng nghề', 'Internships improve career prospects for graduates.', 'Thực tập cải thiện triển vọng sinh viên.'],
    ['work remotely', 'làm từ xa', 'Many employees now work remotely two days a week.', 'Nhiều nhân viên làm từ xa 2 ngày/tuần.'],
    ['climb the career ladder', 'thăng tiến', 'Mentorship helps young staff climb the career ladder.', 'Cố vấn giúp nhân viên trẻ thăng tiến.'],
    ['job satisfaction', 'hài lòng công việc', 'Flexible hours increase job satisfaction.', 'Giờ linh hoạt tăng hài lòng công việc.'],
    ['labour market', 'thị trường lao động', 'The labour market favours skilled technicians.', 'Thị trường lao động ưu tiên kỹ thuật viên.'],
    ['take early retirement', 'nghỉ hưu sớm', 'Some workers take early retirement after restructuring.', 'Một số nghỉ hưu sớm sau tái cơ cấu.'],
    ['earn a living', 'kiếm sống', 'Freelancers struggle to earn a living consistently.', 'Freelancer khó kiếm sống ổn định.'],
    ['heavy workload', 'khối lượng công việc lớn', 'Nurses face a heavy workload during flu season.', 'Y tá quá tải mùa cúm.'],
    ['glass ceiling', 'trần kính', 'Women still encounter a glass ceiling in leadership.', 'Phụ nữ vẫn gặp trần kính lãnh đạo.'],
    ['collective bargaining', 'đàm phán tập thể', 'Unions use collective bargaining for better pay.', 'Công đoàn đàm phán tập thể lương.'],
    ['job vacancy', 'vị trí tuyển dụng', 'The company posted a job vacancy online.', 'Công ty đăng tuyển online.'],
  ],
  crime: [
    ['commit an offence', 'phạm tội', 'Minors who commit an offence need rehabilitation.', 'Vị thành niên phạm tội cần cải tạo.'],
    ['serve a sentence', 'chấp hành án', 'He will serve a sentence of five years.', 'Anh ta chấp hành án 5 năm.'],
    ['deter crime', 'răn đe tội phạm', 'Visible policing helps deter crime.', 'Cảnh sát hiện diện răn đe tội phạm.'],
    ['juvenile delinquency', 'phạm pháp vị thành niên', 'Poverty correlates with juvenile delinquency.', 'Nghèo gắn với phạm pháp vị thành niên.'],
    ['life imprisonment', 'tù chung thân', 'The judge imposed life imprisonment.', 'Thẩm phán tuyên tù chung thân.'],
    ['on probation', 'tha tù có điều kiện', 'The offender remains on probation for two years.', 'Tội phạm tha tù có điều kiện 2 năm.'],
    ['white-collar crime', 'tội cổ trắng', 'White-collar crime costs billions annually.', 'Tội cổ trắng gây thiệt hại hàng tỷ.'],
    ['law enforcement', 'thực thi pháp luật', 'Law enforcement agencies share intelligence.', 'Cơ quan thực thi chia sẻ thông tin.'],
    ['surveillance cameras', 'camera giám sát', 'Surveillance cameras reduce street theft.', 'Camera giám sát giảm trộm cắp.'],
    ['corruption scandal', 'vụ tham nhũng', 'The corruption scandal toppled the minister.', 'Vụ tham nhũng làm bộ trưởng mất chức.'],
    ['repeat offender', 'tái phạm', 'Repeat offenders need targeted intervention.', 'Tái phạm cần can thiệp đích danh.'],
    ['capital offence', 'tội ác nghiêm trọng', 'Debate continues over the capital offence definition.', 'Tranh luận định nghĩa tội ác nghiêm trọng.'],
  ],
  media: [
    ['breaking news', 'tin nóng', 'Channels compete to report breaking news first.', 'Kênh tranh đưa tin nóng trước.'],
    ['biased reporting', 'đưa tin thiên vị', 'Readers distrust biased reporting.', 'Độc giả không tin báo chí thiên vị.'],
    ['social media platform', 'nền tảng mạng xã hội', 'Every social media platform has distinct users.', 'Mỗi MXH có người dùng riêng.'],
    ['fake news', 'tin giả', 'Fake news spreads faster than corrections.', 'Tin giả lan nhanh hơn sửa sai.'],
    ['prime-time slot', 'khung giờ vàng', 'Advertisers pay more for prime-time slots.', 'Nhà quảng cáo trả giá cao giờ vàng.'],
    ['media literacy', 'năng lực truyền thông', 'Schools teach media literacy to teenagers.', 'Trường dạy năng lực truyền thông cho teen.'],
    ['celebrity endorsement', 'người nổi tiếng bảo trợ', 'Celebrity endorsement boosts product sales.', 'Sao bảo trợ tăng doanh số.'],
    ['press freedom', 'tự do báo chí', 'Journalists defend press freedom.', 'Nhà báo bảo vệ tự do báo chí.'],
    ['viral content', 'nội dung viral', 'Viral content reaches millions overnight.', 'Nội dung viral chạm hàng triệu người qua đêm.'],
    ['targeted advertising', 'quảng cáo nhắm mục tiêu', 'Targeted advertising uses browsing history.', 'Quảng cáo nhắm mục tiêu dùng lịch sử duyệt web.'],
    ['ratings war', 'cuộc chiến rating', 'Networks fight a ratings war at 8 p.m.', 'Đài chiến rating lúc 8 giờ tối.'],
    ['public broadcaster', 'đài truyền hình công', 'The public broadcaster airs educational programmes.', 'Đài công phát sóng giáo dục.'],
  ],
  travel: [
    ['tourist attraction', 'điểm thu hút du lịch', 'The temple is the main tourist attraction.', 'Đền là điểm thu hút chính.'],
    ['package holiday', 'tour trọn gói', 'Families prefer a package holiday for convenience.', 'Gia đình thích tour trọn gói tiện lợi.'],
    ['off the beaten track', 'nơi ít người biết', 'Backpackers seek destinations off the beaten track.', 'Phượt thủ tìm nơi ít người biết.'],
    ['travel restrictions', 'hạn chế du lịch', 'Pandemics impose sudden travel restrictions.', 'Đại dịch áp hạn chế du lịch đột ngột.'],
    ['boost tourism', 'thúc đẩy du lịch', 'Festivals boost tourism in rural regions.', 'Lễ hội thúc đẩy du lịch nông thôn.'],
    ['cultural exchange', 'giao lưu văn hóa', 'Homestays promote cultural exchange.', 'Homestay thúc đẩy giao lưu văn hóa.'],
    ['budget airline', 'hãng giá rẻ', 'Budget airlines have democratised air travel.', 'Hãng giá rẻ phổ cập bay.'],
    ['travel insurance', 'bảo hiểm du lịch', 'Always purchase travel insurance before departure.', 'Luôn mua bảo hiểm trước khi đi.'],
    ['peak tourist season', 'mùa du lịch cao điểm', 'Prices soar during peak tourist season.', 'Giá tăng mùa cao điểm.'],
    ['eco-friendly resort', 'khu nghỉ dưỡng xanh', 'Travellers choose an eco-friendly resort.', 'Du khách chọn resort thân thiện môi trường.'],
    ['visa requirements', 'yêu cầu visa', 'Check visa requirements before booking.', 'Kiểm tra visa trước khi đặt.'],
    ['mass tourism', 'du lịch đại chúng', 'Mass tourism damages fragile coastlines.', 'Du lịch đại chúng hại bờ biển mong manh.'],
  ],
  culture: [
    ['cultural diversity', 'đa dạng văn hóa', 'Cities celebrate cultural diversity through festivals.', 'Thành phố tôn vinh đa dạng qua lễ hội.'],
    ['preserve heritage', 'bảo tồn di sản', 'Museums help preserve heritage for future generations.', 'Bảo tàng bảo tồn di sản cho thế hệ sau.'],
    ['break down barriers', 'phá rào cản', 'Art can break down barriers between communities.', 'Nghệ thuật phá rào cản cộng đồng.'],
    ['traditional values', 'giá trị truyền thống', 'Elders pass traditional values to youth.', 'Người già truyền giá trị cho trẻ.'],
    ['cultural shock', 'sốc văn hóa', 'Expats often experience cultural shock initially.', 'Người nước ngoài hay sốc văn hóa ban đầu.'],
    ['lose identity', 'mất bản sắc', 'Global brands may cause communities to lose identity.', 'Thương hiệu toàn cầu khiến mất bản sắc.'],
    ['folk tradition', 'truyền thống dân gian', 'Folk traditions survive in remote villages.', 'Truyền thống dân gian còn ở làng xa.'],
    ['cross-cultural communication', 'giao tiếp đa văn hóa', 'Business requires cross-cultural communication skills.', 'Kinh doanh cần kỹ năng giao tiếp đa văn hóa.'],
    ['cultural assimilation', 'hòa nhập văn hóa', 'Immigrants face pressure toward cultural assimilation.', 'Người nhập cư chịu áp lực hòa nhập.'],
    ['sense of belonging', 'cảm giác thuộc về', 'Festivals create a sense of belonging.', 'Lễ hội tạo cảm giác thuộc về.'],
    ['indigenous culture', 'văn hóa bản địa', 'Tourism must respect indigenous culture.', 'Du lịch phải tôn trọng văn hóa bản địa.'],
    ['cultural norms', 'chuẩn mực văn hóa', 'Cultural norms vary widely between countries.', 'Chuẩn mực văn hóa khác nhau giữa các nước.'],
  ],
  urban: [
    ['traffic congestion', 'tắc đường', 'Traffic congestion costs commuters hours daily.', 'Tắc đường tốn giờ mỗi ngày.'],
    ['housing shortage', 'thiếu nhà ở', 'Rapid growth creates a housing shortage.', 'Tăng trưởng nhanh gây thiếu nhà.'],
    ['inner city', 'nội thành', 'Young professionals prefer the inner city.', 'Dân văn phòng thích nội thành.'],
    ['urban sprawl', 'đô thị tràn lan', 'Urban sprawl consumes farmland.', 'Đô thị tràn lan nuốt đất nông.'],
    ['public amenities', 'tiện ích công cộng', 'New districts lack public amenities.', 'Khu mới thiếu tiện ích công cộng.'],
    ['cost of living', 'chi phí sinh hoạt', 'The cost of living rises faster than wages.', 'Sinh hoạt phí tăng nhanh hơn lương.'],
    ['pedestrian-friendly', 'thân thiện người đi bộ', 'Planners design pedestrian-friendly streets.', 'Quy hoạch thiết kế đường thân thiện người đi bộ.'],
    ['high population density', 'mật độ dân số cao', 'High population density strains public transport.', 'Mật độ cao gây áp lực giao thông.'],
    ['regenerate an area', 'tái sinh khu vực', 'Investment helped regenerate the waterfront area.', 'Đầu tư tái sinh khu ven sông.'],
    ['commuter belt', 'vùng ven đô', 'Families move to the commuter belt for space.', 'Gia đình chuyển vùng ven đô vì rộng rãi.'],
    ['smart city', 'thành phố thông minh', 'Singapore is often cited as a smart city model.', 'Singapore hay được nhắc mô hình thành phố thông minh.'],
    ['noise pollution', 'ô nhiễm tiếng ồn', 'Nightclubs contribute to noise pollution.', 'Club đêm góp phần ô nhiễm tiếng ồn.'],
  ],
  food: [
    ['balanced diet', 'chế độ ăn cân bằng', 'Doctors recommend a balanced diet rich in vegetables.', 'Bác sĩ khuyên ăn cân bằng nhiều rau.'],
    ['food shortage', 'thiếu lương thực', 'Drought can cause a severe food shortage.', 'Hạn hán gây thiếu lương thực nặng.'],
    ['organic farming', 'nông nghiệp hữu cơ', 'Consumers pay more for organic farming products.', 'Người tiêu dùng trả giá cao hơn cho hữu cơ.'],
    ['genetically modified crops', 'cây trồng biến đổi gen', 'Debates continue over genetically modified crops.', 'Tranh luận về cây trồng biến đổi gen tiếp diễn.'],
    ['food processing', 'chế biến thực phẩm', 'Food processing extends shelf life but adds preservatives.', 'Chế biến kéo dài hạn dùng nhưng thêm chất bảo quản.'],
    ['malnourished children', 'trẻ suy dinh dưỡng', 'Aid agencies feed malnourished children.', 'Tổ chức cứu trợ nuôi trẻ suy dinh dưỡng.'],
    ['local produce', 'nông sản địa phương', 'Markets promote local produce to cut transport emissions.', 'Chợ khuyến khích nông sản địa phương giảm khí thải.'],
    ['fast food consumption', 'ăn đồ ăn nhanh', 'Fast food consumption correlates with obesity.', 'Ăn đồ ăn nhanh gắn với béo phì.'],
    ['sustainable agriculture', 'nông nghiệp bền vững', 'Farmers shift toward sustainable agriculture.', 'Nông dân chuyển sang nông nghiệp bền vững.'],
    ['food labelling', 'nhãn thực phẩm', 'Clear food labelling helps consumers choose wisely.', 'Nhãn rõ giúp người tiêu dùng chọn đúng.'],
    ['crop yield', 'năng suất cây trồng', 'Irrigation increases crop yield in arid regions.', 'Tưới tiêu tăng năng suất vùng khô.'],
    ['food hygiene standards', 'tiêu chuẩn vệ sinh thực phẩm', 'Restaurants must meet food hygiene standards.', 'Nhà hàng phải đạt tiêu chuẩn vệ sinh.'],
  ],
  government: [
    ['welfare state', 'nhà nước phúc lợi', 'Scandinavian countries operate a generous welfare state.', 'Bắc Âu có nhà nước phúc lợi hào phóng.'],
    ['tax revenue', 'thu ngân sách', 'Governments rely on tax revenue for public services.', 'Chính phủ dựa thuế cho dịch vụ công.'],
    ['policy maker', 'nhà hoạch định chính sách', 'Policy makers consult experts before legislation.', 'Nhà hoạch định hỏi chuyên gia trước khi ban hành.'],
    ['electoral system', 'hệ thống bầu cử', 'Reform of the electoral system remains controversial.', 'Cải cách bầu cử vẫn gây tranh cãi.'],
    ['public spending', 'chi tiêu công', 'Debates focus on public spending priorities.', 'Tranh luận tập trung ưu tiên chi tiêu công.'],
    ['enforce the law', 'thực thi pháp luật', 'Police enforce the law impartially.', 'Cảnh sát thực thi pháp luật khách quan.'],
    ['political accountability', 'trách nhiệm chính trị', 'Voters demand greater political accountability.', 'Cử tri đòi trách nhiệm chính trị cao hơn.'],
    ['national budget', 'ngân sách quốc gia', 'Parliament approves the national budget annually.', 'Quốc hội duyệt ngân sách hàng năm.'],
    ['lobby group', 'nhóm vận động hành lang', 'Lobby groups influence environmental policy.', 'Nhóm vận động ảnh hưởng chính sách môi trường.'],
    ['civil liberties', 'tự do dân sự', 'Surveillance laws may restrict civil liberties.', 'Luật giám sát có thể hạn chế tự do dân sự.'],
    ['foreign policy', 'chính sách đối ngoại', 'Elections reshape foreign policy priorities.', 'Bầu cử định hình lại đối ngoại.'],
    ['implement reforms', 'triển khai cải cách', 'The new administration will implement reforms gradually.', 'Chính quyền mới triển khai cải cách từ từ.'],
  ],
  science: [
    ['conduct experiments', 'tiến hành thí nghiệm', 'Researchers conduct experiments under strict controls.', 'Nhà khoa học thí nghiệm trong kiểm soát chặt.'],
    ['scientific consensus', 'đồng thuận khoa học', 'There is scientific consensus on climate change.', 'Có đồng thuận khoa học về biến đổi khí hậu.'],
    ['groundbreaking research', 'nghiên cứu đột phá', 'Groundbreaking research led to a new vaccine.', 'Nghiên cứu đột phá tạo vaccine mới.'],
    ['peer-reviewed journal', 'tạp chí phản biện', 'Findings appear in a peer-reviewed journal.', 'Kết quả đăng trên tạp chí phản biện.'],
    ['allocate funding', 'phân bổ kinh phí', 'Universities allocate funding to promising projects.', 'Đại học phân bổ kinh phí dự án triển vọng.'],
    ['ethical guidelines', 'hướng dẫn đạo đức', 'Scientists follow ethical guidelines for human trials.', 'Nhà khoa học tuân hướng dẫn đạo đức thử nghiệm người.'],
    ['space agency', 'cơ quan vũ trụ', 'The space agency plans a Mars mission.', 'Cơ quan vũ trụ lên kế hoạch hỏa tinh.'],
    ['technological breakthrough', 'đột phá công nghệ', 'A technological breakthrough reduced battery costs.', 'Đột phá công nghệ giảm giá pin.'],
    ['empirical data', 'dữ liệu thực nghiệm', 'Policy should be based on empirical data.', 'Chính sách nên dựa dữ liệu thực nghiệm.'],
    ['research findings', 'phát hiện nghiên cứu', 'Research findings challenge previous assumptions.', 'Phát hiện thách thức giả định cũ.'],
    ['laboratory conditions', 'điều kiện phòng thí nghiệm', 'Results may differ outside laboratory conditions.', 'Kết quả có thể khác ngoài phòng thí nghiệm.'],
    ['innovative solution', 'giải pháp đổi mới', 'Engineers proposed an innovative solution.', 'Kỹ sư đề xuất giải pháp đổi mới.'],
  ],
  family: [
    ['nuclear family', 'gia đình hạt nhân', 'The nuclear family remains common in suburbs.', 'Gia đình hạt nhân vẫn phổ biến ngoại ô.'],
    ['single-parent household', 'hộ cha/mẹ đơn thân', 'Single-parent households often face financial strain.', 'Hộ đơn thân thường áp lực tài chính.'],
    ['work-life balance', 'cân bằng công việc', 'Parents struggle to maintain work-life balance.', 'Cha mẹ khó cân bằng công việc – gia đình.'],
    ['elderly relatives', 'người già trong gia đình', 'Many cultures care for elderly relatives at home.', 'Nhiều văn hóa chăm người già ở nhà.'],
    ['domestic chores', 'việc nhà', 'Couples should share domestic chores equally.', 'Vợ chồng nên chia việc nhà bình đẳng.'],
    ['child-rearing', 'nuôi dạy con', 'Child-rearing styles differ across cultures.', 'Cách nuôi con khác nhau giữa văn hóa.'],
    ['family bond', 'mối gắn kết gia đình', 'Regular meals strengthen the family bond.', 'Ăn cùng tăng gắn kết gia đình.'],
    ['generation gap', 'khoảng cách thế hệ', 'Technology widens the generation gap.', 'Công nghệ làm rộng khoảng cách thế hệ.'],
    ['maternity benefits', 'phúc lợi thai sản', 'Employers offer maternity benefits by law.', 'Luật yêu cầu phúc lợi thai sản.'],
    ['family breakdown', 'tan vỡ gia đình', 'Divorce contributes to family breakdown.', 'Ly hôn góp phần tan vỡ gia đình.'],
    ['extended family support', 'hỗ trợ gia đình mở rộng', 'Extended family support reduces childcare costs.', 'Gia đình mở rộng giảm chi phí chăm trẻ.'],
    ['parental leave', 'nghỉ chăm con', 'Nordic countries offer generous parental leave.', 'Bắc Âu có nghỉ chăm con hào phóng.'],
  ],
};

export const QUESTION_TYPES = [
  { skill: 'listening', type: 'form-completion', en: 'Form / Note Completion', vi: 'Điền form / ghi chú', tipsEn: 'Predict answer type (noun/number/adjective) from grammar. Follow word limit exactly. Spelling must match audio.', tipsVi: 'Dự đoán loại từ từ ngữ pháp. Tuân giới hạn từ. Chính tả khớp audio.', trapEn: 'Distractors: speaker mentions wrong info first then corrects.', trapVi: 'Bẫy: nói sai rồi sửa — nghe đến câu cuối.' },
  { skill: 'listening', type: 'mcq', en: 'Multiple Choice', vi: 'Trắc nghiệm', tipsEn: 'Read all options before audio. Eliminate as you hear. Note paraphrasing — correct answer rarely uses exact words.', tipsVi: 'Đọc hết đáp án trước. Loại dần khi nghe. Đáp án đúng hay paraphrase.', trapEn: 'All three options may be mentioned; only one is correct.', trapVi: 'Cả ba đều được nhắc; chỉ một đúng.' },
  { skill: 'listening', type: 'matching', en: 'Matching', vi: 'Ghép đáp án', tipsEn: 'Check if options used once or more than once. Follow speaker order. Underline keywords in questions.', tipsVi: 'Kiểm tra dùng một hay nhiều lần. Theo thứ tự người nói. Gạch chân từ khóa.', trapEn: 'Similar-sounding names or numbers.', trapVi: 'Tên hoặc số nghe giống nhau.' },
  { skill: 'listening', type: 'map-labelling', en: 'Map / Plan Labelling', vi: 'Ghi nhãn bản đồ', tipsEn: 'Orient: north/entrance. Track "past", "opposite", "next to". Pre-read all labels.', tipsVi: 'Xác định hướng/lối vào. Theo "đối diện", "cạnh". Đọc trước nhãn.', trapEn: 'Route changes direction — follow chronologically.', trapVi: 'Đổi hướng — theo trình tự.' },
  { skill: 'listening', type: 'sentence-completion', en: 'Sentence Completion', vi: 'Hoàn thành câu', tipsEn: 'Word limit strict. Grammar must fit blank. Answers in order.', tipsVi: 'Giới hạn từ nghiêm. Ngữ pháp khớp chỗ trống. Theo thứ tự.', trapEn: 'Writing too many words loses the mark.', trapVi: 'Viết quá số từ mất điểm.' },
  { skill: 'reading', type: 'true-false-ng', en: 'True / False / Not Given', vi: 'T/F/NG', tipsEn: 'TRUE = passage agrees. FALSE = contradicts. NOT GIVEN = neither. Never use outside knowledge.', tipsVi: 'TRUE = đồng ý. FALSE = mâu thuẫn. NG = không đủ thông tin.', trapEn: 'FALSE vs NOT GIVEN: look for direct contradiction for FALSE.', trapVi: 'FALSE cần mâu thuẫn trực tiếp; NG là thiếu thông tin.' },
  { skill: 'reading', type: 'yes-no-ng', en: 'Yes / No / Not Given', vi: 'Y/N/NG', tipsEn: 'Tests writer\'s views, not facts. YES = writer agrees. NO = writer disagrees.', tipsVi: 'Kiểm tra quan điểm tác giả. YES = đồng ý. NO = không đồng ý.', trapEn: 'Factually true statement may be NOT GIVEN if writer doesn\'t express that view.', trapVi: 'Câu đúng sự thật có thể NG nếu tác giả không bày tỏ.' },
  { skill: 'reading', type: 'matching-headings', en: 'Matching Headings', vi: 'Ghép tiêu đề', tipsEn: 'Find topic sentence per paragraph. Ignore examples. Headings paraphrase — never copy words.', tipsVi: 'Tìm câu chủ đề mỗi đoạn. Bỏ ví dụ. Tiêu đề paraphrase.', trapEn: 'Similar headings — distinguish main idea vs detail.', trapVi: 'Tiêu đề giống — phân biệt ý chính vs chi tiết.' },
  { skill: 'reading', type: 'matching-info', en: 'Matching Information', vi: 'Ghép thông tin', tipsEn: 'Statements NOT in order. Scan for names/numbers/dates. May use same paragraph twice.', tipsVi: 'Câu không theo thứ tự. Scan tên/số/ngày. Một đoạn dùng hai lần.', trapEn: 'Spending too long on one statement.', trapVi: 'Mất quá nhiều thời gian một câu.' },
  { skill: 'reading', type: 'summary-completion', en: 'Summary / Note Completion', vi: 'Điền tóm tắt', tipsEn: 'Word limit from instructions. Copy exact spelling from passage. Predict word class.', tipsVi: 'Giới hạn từ theo đề. Chép đúng chính tả. Đoán loại từ.', trapEn: 'Using synonym when word bank requires exact word.', trapVi: 'Dùng từ đồng nghĩa khi cần từ trong bài.' },
  { skill: 'reading', type: 'mcq-reading', en: 'Multiple Choice (Reading)', vi: 'Trắc nghiệm Đọc', tipsEn: 'Eliminate obviously wrong. Locate proof sentence. Watch for "all/none/always" absolutes.', tipsVi: 'Loại đáp án sai rõ. Tìm câu bằng chứng. Cẩn thận "luôn luôn".', trapEn: 'Partially correct option — must be fully supported.', trapVi: 'Đáp án đúng một phần — phải được hỗ trợ đầy đủ.' },
  { skill: 'writing', type: 'task1-bar', en: 'Task 1 Bar Chart', vi: 'Task 1 Biểu cột', tipsEn: '4 paragraphs: intro, overview, 2 bodies. Group bars logically. No opinion.', tipsVi: '4 đoạn: mở, overview, 2 thân. Nhóm cột hợp lý. Không ý kiến.', trapEn: 'Listing every bar without overview loses Task Achievement.', trapVi: 'Liệt kê từng cột không overview mất điểm TA.' },
  { skill: 'writing', type: 'task1-line', en: 'Task 1 Line Graph', vi: 'Task 1 Đường', tipsEn: 'Describe trends: rise, fall, fluctuate, plateau. Compare lines at key points.', tipsVi: 'Mô tả xu hướng: tăng, giảm, dao động, ổn định. So sánh tại điểm chính.', trapEn: 'Missing start/end comparisons.', trapVi: 'Thiếu so sánh đầu-cuối.' },
  { skill: 'writing', type: 'task1-pie', en: 'Task 1 Pie Chart', vi: 'Task 1 Tròn', tipsEn: 'Use percentages and proportions. Compare largest vs smallest sectors.', tipsVi: 'Dùng phần trăm. So sánh phần lớn nhất vs nhỏ nhất.', trapEn: 'Describing slices without comparing.', trapVi: 'Mô tả từng phần không so sánh.' },
  { skill: 'writing', type: 'task2-opinion', en: 'Task 2 Opinion', vi: 'Task 2 Opinion', tipsEn: 'Clear thesis in intro. 2 body paragraphs with reasons + examples. Conclusion restates opinion.', tipsVi: 'Thesis rõ mở bài. 2 thân có lý do + ví dụ. Kết luận nhắc ý kiến.', trapEn: 'Sitting on the fence without clear position.', trapVi: 'Không nêu rõ quan điểm.' },
  { skill: 'writing', type: 'task2-discuss', en: 'Task 2 Discuss Both Views', vi: 'Task 2 Discuss', tipsEn: 'Paragraph 1 view A, paragraph 2 view B, conclusion your opinion.', tipsVi: 'Đoạn 1 quan điểm A, đoạn 2 quan điểm B, kết ý bạn.', trapEn: 'Only discussing one side.', trapVi: 'Chỉ thảo luận một phía.' },
  { skill: 'writing', type: 'task2-problem', en: 'Task 2 Problem-Solution', vi: 'Task 2 Vấn đề-Giải pháp', tipsEn: 'Body 1 problems with examples. Body 2 practical solutions. Be specific.', tipsVi: 'Thân 1 vấn đề + ví dụ. Thân 2 giải pháp cụ thể.', trapEn: 'Vague solutions like "government should do something".', trapVi: 'Giải pháp mơ hồ.' },
  { skill: 'speaking', type: 'part1', en: 'Speaking Part 1', vi: 'Speaking Part 1', tipsEn: '2-4 sentence answers. Reason + example. Don\'t memorise scripts.', tipsVi: 'Trả lời 2-4 câu. Lý do + ví dụ. Không học thuộc.', trapEn: 'One-word answers.', trapVi: 'Trả lời một từ.' },
  { skill: 'speaking', type: 'part2', en: 'Speaking Part 2', vi: 'Speaking Part 2', tipsEn: 'Notes: 4-5 keywords. Cover all bullets. Speak 2 minutes with past tenses for stories.', tipsVi: 'Ghi 4-5 từ khóa. Đủ bullet. Nói 2 phút, quá khứ kể chuyện.', trapEn: 'Stopping after 45 seconds.', trapVi: 'Dừng sau 45 giây.' },
  { skill: 'speaking', type: 'part3', en: 'Speaking Part 3', vi: 'Speaking Part 3', tipsEn: 'Abstract answers: trend → example → opinion → future. Use hedging language.', tipsVi: 'Trả lời trừu tượng: xu hướng → ví dụ → ý kiến → tương lai.', trapEn: 'Repeating Part 2 stories without developing ideas.', trapVi: 'Lặp lại Part 2 không phát triển ý.' },
];

export const ESSAY_SAMPLES = [
  {
    type: 'opinion',
    topic: bt('Technology in Education', 'Công nghệ trong giáo dục'),
    prompt: bt('Some people believe technology in classrooms does more harm than good. To what extent do you agree or disagree?', 'Một số người cho rằng công nghệ trong lớp học lợi hại hơn lợi ích. Bạn đồng ý đến mức nào?'),
    band: '7.5',
    structure: bt('Intro (paraphrase + thesis) → Body 1 (benefits) → Body 2 (drawbacks + rebuttal) → Conclusion', 'Mở bài → Thân 1 (lợi ích) → Thân 2 (hại + phản bác) → Kết'),
    tips: bt('Take a clear position. Use specific examples (Khan Academy, tablets). Avoid listing without development.', 'Quan điểm rõ. Ví dụ cụ thể. Tránh liệt kê không phát triển.'),
    essay: `It is argued that digital devices in schools are detrimental rather than beneficial. While I accept that unregulated screen use can distract learners, I largely disagree because, when implemented thoughtfully, technology substantially enriches teaching and learning.

On the positive side, educational software personalises instruction by adapting exercises to each student's level. Platforms such as interactive language apps allow pupils in remote areas to access qualified materials that would otherwise be unavailable. Teachers also benefit from automated marking, which frees time for individual feedback. Consequently, classrooms become more inclusive and efficient.

Admittedly, excessive reliance on screens may reduce face-to-face interaction and encourage passive consumption of content. Nevertheless, these risks can be mitigated through clear policies that limit recreational browsing and blend online tasks with collaborative projects. Schools that train educators in digital pedagogy report higher engagement rather than isolation.

In conclusion, although technology poses challenges, its advantages in accessibility, personalisation and teacher support outweigh the drawbacks provided schools govern its use responsibly.`,
    essayVi: `Người ta cho rằng thiết bị số ở trường có hại hơn có lợi. Tôi thừa nhận màn hình không kiểm soát gây mất tập trung, nhưng phần lớn không đồng ý vì khi triển khai đúng, công nghệ làm phong phú dạy và học.

Phần mềm giáo dục cá nhân hóa bài tập theo trình độ. Ứng dụng ngôn ngữ giúp học sinh vùng xa tiếp cận tài liệu chất lượng. Giáo viên được chấm tự động, có thời gian phản hồi cá nhân. Lớp học trở nên hòa nhập và hiệu quả hơn.

Thừa nhận phụ thuộc màn hình có thể giảm tương tác trực tiếp. Tuy nhiên rủi ro giảm nhờ chính sách hạn chế duyệt web giải trí và kết hợp dự án nhóm. Trường đào tạo sư phạm số báo cáo học sinh hứng thú hơn.

Tóm lại, dù có thách thức, lợi ích về tiếp cận, cá nhân hóa và hỗ trợ giáo viên vượt trội nếu trường quản lý có trách nhiệm.`,
  },
  {
    type: 'discuss',
    topic: bt('University Funding', 'Kinh phí đại học'),
    prompt: bt('Some say university education should be free for all. Others believe students should pay. Discuss both views and give your opinion.', 'Có ý kiến đại học nên miễn phí. Số khác cho học sinh phải trả. Thảo luận cả hai và nêu ý kiến.'),
    band: '8.0',
    structure: bt('Intro → Body A (free tuition) → Body B (fees) → Conclusion (balanced opinion)', 'Mở → Thân A → Thân B → Kết'),
    tips: bt('Present both sides fairly before your view. Use contrast linkers: however, conversely.', 'Trình bày công bằng cả hai. Dùng however, conversely.'),
    essay: `Higher education financing is widely debated. Some advocate abolishing tuition to widen access, whereas others insist that students should contribute to the cost of their degrees. This essay will examine both perspectives before arguing for a subsidised but not entirely free model.

Proponents of free university claim that fees deter talented adolescents from low-income households, thereby perpetuating inequality. When countries such as Germany eliminate tuition, enrollment among disadvantaged groups often rises, supplying the economy with a broader talent pool. From this standpoint, education is a public good that merits taxpayer investment.

Conversely, critics maintain that free entry overcrowds campuses and lowers academic standards. They argue that moderate fees encourage students to value their studies and allow institutions to maintain facilities. Moreover, income-contingent loan schemes can protect graduates who struggle to find well-paid employment.

On balance, I believe governments should heavily subsidise tertiary education while requiring a modest graduate contribution. This approach preserves accessibility without removing financial accountability entirely.`,
    essayVi: `Tài trợ đại học được tranh luận nhiều. Người ủng hộ bãi học phí để mở rộng tiếp cận; người khác cho sinh viên phải đóng góp. Bài xem xét cả hai và ủng hộ mô hình trợ cấp mạnh nhưng không hoàn toàn miễn phí.

Miễn phí giúp thanh niên nghèo không bị rào cản, giảm bất bình đẳng. Đức bãi học phí thì tỷ lệ ghi danh nhóm yếu thế tăng. Giáo dục là hàng công cộng đáng đầu tư thuế.

Phía đối lập cho rằng miễn phí làm đông campus, hạ chuẩn. Học phí vừa phải khiến sinh viên trân trọng việc học. Vay trả theo thu nhập bảo vệ người tốt nghiệp khó tìm việc lương cao.

Nhìn chung, chính phủ nên trợ cấp mạnh nhưng yêu cầu đóng góp vừa phải sau tốt nghiệp — vừa tiếp cận vừa có trách nhiệm tài chính.`,
  },
  {
    type: 'problem-solution',
    topic: bt('Plastic Pollution', 'Ô nhiễm nhựa'),
    prompt: bt('Plastic waste is increasing globally. What problems does this cause? What solutions can be adopted?', 'Rác nhựa tăng toàn cầu. Gây vấn đề gì? Giải pháp nào?'),
    band: '7.5',
    structure: bt('Intro → Body 1 problems → Body 2 solutions → Brief conclusion', 'Mở → Vấn đề → Giải pháp → Kết ngắn'),
    tips: bt('Pair each problem with a solution where possible. Be specific: deposit schemes, biodegradable packaging.', 'Ghép vấn đề với giải pháp. Cụ thể: cọc chai, bao bì phân hủy.'),
    essay: `The proliferation of single-use plastic has become one of the most pressing environmental challenges worldwide. This essay outlines the principal problems associated with plastic waste and proposes practical measures to address them.

The most visible consequence is marine pollution. Millions of tonnes of packaging enter oceans annually, harming wildlife that ingest or become entangled in debris. Microplastics have also entered the food chain, raising legitimate health concerns. Furthermore, landfills overflowing with non-biodegradable material emit greenhouse gases and consume scarce urban land.

To tackle these issues, governments should implement extended producer responsibility, requiring manufacturers to fund recycling infrastructure. Deposit-return schemes have proven effective in boosting collection rates in several European nations. At the individual level, replacing disposable items with reusable alternatives and supporting retailers that offer package-free aisles can collectively reduce demand.

In summary, plastic pollution threatens ecosystems and public health, but a combination of regulation, industry accountability and consumer behaviour change can substantially curb the crisis.`,
    essayVi: `Nhựa dùng một lần là thách thức môi trường cấp bách. Bài nêu vấn đề và giải pháp thực tế.

Hậu quả rõ nhất là ô nhiễm biển. Hàng triệu tấn bao bì vào đại dương, hại động vật nuốt hoặc vướng rác. Vi nhựa vào chuỗi thức ăn, lo ngại sức khỏe. Bãi rác đầy vật liệu không phân hủy phát khí nhà kính.

Chính phủ nên trách nhiệm mở rộng của nhà sản xuất, tài trợ tái chế. Cọc chai hiệu quả ở châu Âu. Cá nhân dùng đồ tái sử dụng và ủng hộ cửa hàng không bao bì.

Tóm lại, ô nhiễm nhựa đe dọa hệ sinh thái và sức khỏe, nhưng quy định, trách nhiệm doanh nghiệp và thay đổi tiêu dùng có thể giảm đáng kể.`,
  },
  {
    type: 'advdisadv',
    topic: bt('Living in Big Cities', 'Sống ở thành phố lớn'),
    prompt: bt('What are the advantages and disadvantages of living in a large city?', 'Lợi và hại của sống ở thành phố lớn?'),
    band: '7.0',
    structure: bt('Intro → Advantages paragraph → Disadvantages paragraph → Conclusion', 'Mở → Lợi → Hại → Kết'),
    tips: bt('Balance both sides equally. Use comparative structures: whereas, while, on the downside.', 'Cân bằng hai mặt. Dùng whereas, while.'),
    essay: `Urbanisation continues to draw millions to metropolitan areas. While megacities offer undeniable opportunities, they also present significant drawbacks that residents must weigh carefully.

Chief among the benefits is access to employment in diverse sectors, from finance to creative industries. Superior public transport, cultural venues and specialist healthcare attract ambitious graduates. Networking density also accelerates career progression, which explains why young professionals flock to hubs such as London or Singapore.

However, the downside includes exorbitant housing costs, chronic congestion and elevated stress levels. Air quality frequently exceeds safe limits, and competition for school places can be fierce. Those who prioritise green space and a slower pace may find suburban or rural life more fulfilling despite fewer amenities.

Overall, city living suits individuals seeking rapid professional growth, yet families longing for affordability and tranquillity may be better served elsewhere.`,
    essayVi: `Đô thị hóa thu hút hàng triệu người. Thành phố lớn mang cơ hội nhưng cũng có nhược điểm cần cân nhắc.

Lợi ích chính là việc làm đa ngành, giao thông công cộng, văn hóa, y tế chuyên sâu. Mạng lưới quan hệ thúc đẩy sự nghiệp — lý do sinh viên đổ về London, Singapore.

Mặt trái: nhà đắt, tắc đường, căng thẳng. Không khí ô nhiễm, tranh suất học. Ai ưu tiên không gian xanh có thể thích ngoại ô hoặc nông thôn.

Nhìn chung, thành phố phù hợp người muốn phát triển nhanh; gia đình cần giá rẻ và yên bình có thể chọn nơi khác.`,
  },
  {
    type: 'task1-bar',
    topic: bt('Energy Consumption by Sector', 'Tiêu thụ năng lượng theo ngành'),
    prompt: bt('The bar chart shows energy consumption in five sectors in 2010 and 2020. Summarise the information.', 'Biểu cột thể hiện tiêu thụ năng lượng năm ngành năm 2010 và 2020. Tóm tắt.'),
    band: '7.5',
    structure: bt('Intro paraphrase → Overview → Body 1 (highest growth) → Body 2 (decline/stable)', 'Paraphrase → Overview → Thân 1 → Thân 2'),
    tips: bt('Overview mandatory. Group data — do not list every bar. Use approximations.', 'Overview bắt buộc. Nhóm dữ liệu. Dùng ước lượng.'),
    essay: `The bar chart compares energy usage across manufacturing, transport, residential, agriculture and services in two selected years.

Overall, manufacturing remained the largest consumer despite a modest decline, whereas the services sector experienced the most notable growth. Agricultural consumption was comparatively negligible throughout the period.

In 2010, manufacturing accounted for roughly 45% of total demand, but this figure fell to approximately 38% by 2020. Transport showed a slight upward trend, increasing from about 22% to 26%, reflecting rising vehicle ownership.

Conversely, residential usage stayed relatively stable at around 18%, and agriculture continued to represent under 5%. The services sector, however, climbed from 12% to nearly 20%, suggesting that economic shifts towards office-based employment have intensified electricity requirements.`,
    essayVi: `Biểu cột so sánh tiêu thụ năng lượng của sản xuất, giao thông, dân cư, nông nghiệp và dịch vụ.

Nhìn chung, sản xuất vẫn lớn nhất dù giảm nhẹ; dịch vụ tăng mạnh nhất. Nông nghiệp thấp suốt kỳ.

2010 sản xuất ~45%, 2020 ~38%. Giao thông từ ~22% lên ~26%. Dân cư ổn định ~18%. Dịch vụ từ 12% lên gần 20% — kinh tế dịch vụ tăng nhu cầu điện.`,
  },
  {
    type: 'task1-line',
    topic: bt('International Tourist Arrivals', 'Lượt khách du lịch quốc tế'),
    prompt: bt('The line graph shows international tourist arrivals in three countries from 2000 to 2020. Summarise the information.', 'Đồ thị đường thể hiện khách du lịch quốc tế ở ba nước 2000–2020. Tóm tắt.'),
    band: '7.5',
    structure: bt('Intro → Overview (highest/lowest trends) → Body 1 → Body 2', 'Mở → Overview → Thân 1 → Thân 2'),
    tips: bt('Use trend verbs: soar, plateau, dip. Compare countries at start and end.', 'Dùng soar, plateau, dip. So sánh đầu-cuối.'),
    essay: `The line graph illustrates how international tourist arrivals changed in France, Thailand and Vietnam over a twenty-year period.

Overall, all three destinations experienced growth, but Vietnam witnessed the most dramatic rise, while France remained the most visited country throughout.

In 2000, France attracted approximately 70 million visitors, compared with 10 million in Thailand and under 3 million in Vietnam. Over the following decade, Thailand's figures climbed steadily to around 25 million, whereas France rose more modestly to roughly 80 million. Vietnam, starting from a low base, began accelerating after 2010.

By 2020, Vietnam had reached nearly 18 million arrivals, more than six times its initial level. Thailand plateaued at about 35 million after 2015, while France peaked at 90 million before dipping slightly in the final year, possibly due to global travel restrictions.`,
    essayVi: `Đồ thị cho thấy khách quốc tế đến Pháp, Thái Lan và Việt Nam trong 20 năm.

Nhìn chung cả ba đều tăng, nhưng Việt Nam tăng mạnh nhất; Pháp vẫn đông khách nhất.

2000 Pháp ~70 triệu, Thái ~10 triệu, Việt <3 triệu. Thập kỷ sau Thái lên ~25 triệu, Pháp ~80 triệu. Việt tăng nhanh sau 2010.

2020 Việt gần 18 triệu — gấp hơn 6 lần ban đầu. Thái ổn ~35 triệu sau 2015. Pháp đỉnh 90 triệu rồi giảm nhẹ năm cuối.`,
  },
  {
    type: 'task1-pie',
    topic: bt('Household Energy Use', 'Tiêu thụ năng lượng hộ gia đình'),
    prompt: bt('The pie charts compare household energy use in 1990 and 2020. Summarise the information.', 'Biểu tròn so sánh năng lượng hộ gia đình 1990 và 2020. Tóm tắt.'),
    band: '7.0',
    structure: bt('Intro → Overview (biggest changes) → Detail paragraphs', 'Mở → Overview → Chi tiết'),
    tips: bt('Focus on proportion changes, not absolute numbers. Use "accounted for X%".', 'Tập trung tỷ lệ thay đổi. Dùng "accounted for X%".'),
    essay: `The two pie charts present the distribution of household energy consumption across five categories in 1990 and 2020.

Overall, heating dominated both years but declined proportionally, while electricity for appliances became the second-largest share by 2020.

In 1990, heating accounted for 52% of domestic energy use, with water heating contributing a further 18%. Cooking and lighting together represented 22%, and appliances made up only 8%.

Three decades later, heating had fallen to 38%, although it remained the largest single category. Appliances surged to 24%, reflecting the proliferation of devices such as air conditioners and computers. Water heating stayed relatively stable at 17%, while cooking dropped marginally to 11% and lighting to 10%.`,
    essayVi: `Hai biểu tròn cho phân bổ năng lượng hộ gia đình 1990 và 2020.

Nhìn chung sưởi ấm vẫn lớn nhất nhưng giảm tỷ lệ; điện thiết bị thành hạng hai năm 2020.

1990 sưởi 52%, nước nóng 18%, nấu+chiếu sáng 22%, thiết bị 8%.

2020 sưởi 38%, thiết bị 24% (máy lạnh, máy tính). Nước nóng 17%, nấu 11%, chiếu sáng 10%.`,
  },
  {
    type: 'task1-table',
    topic: bt('University Applications', 'Hồ sơ xét tuyển đại học'),
    prompt: bt('The table shows university applications by subject in 2015 and 2025. Summarise the information.', 'Bảng thể hiện hồ sơ theo ngành 2015 và 2025. Tóm tắt.'),
    band: '7.5',
    structure: bt('Intro → Overview → Group rises vs falls', 'Mở → Overview → Nhóm tăng vs giảm'),
    tips: bt('Group subjects with similar trends. Calculate approximate percentage change.', 'Nhóm ngành cùng xu hướng. Ước tính % thay đổi.'),
    essay: `The table compares the number of university applications across six subject areas in two years ten years apart.

Overall, applications to technology-related fields grew substantially, whereas traditional humanities subjects attracted fewer candidates by 2025.

In 2015, business studies received the highest number of applications at 42,000, closely followed by engineering at 38,000. Arts and law recorded 28,000 and 25,000 respectively, with medicine at 22,000 and education at 18,000.

By 2025, engineering had overtaken business, rising to 61,000 applications — an increase of roughly 60%. Medicine also climbed to 35,000. Conversely, arts fell to 19,000 and education to 12,000, representing declines of about one-third. Law remained relatively stable at 26,000.`,
    essayVi: `Bảng so sánh hồ sơ sáu ngành cách nhau 10 năm.

Nhìn chung ngành công nghệ tăng mạnh; nhân văn giảm ứng viên 2025.

2015 kinh doanh 42.000, kỹ thuật 38.000, nghệ thuật 28.000, luật 25.000, y 22.000, sư phạm 18.000.

2025 kỹ thuật vượt kinh doanh, lên 61.000 (+60%). Y lên 35.000. Nghệ thuật còn 19.000, sư phạm 12.000 (giảm ~1/3). Luật ổn định 26.000.`,
  },
  {
    type: 'causes-effects',
    topic: bt('Childhood Obesity', 'Béo phì trẻ em'),
    prompt: bt('Why is childhood obesity increasing in many countries? What effects does it have on children and society?', 'Vì sao béo phì trẻ em tăng? Tác động lên trẻ và xã hội?'),
    band: '7.5',
    structure: bt('Intro → Body 1 causes → Body 2 effects → Conclusion', 'Mở → Nguyên nhân → Hậu quả → Kết'),
    tips: bt('Link causes to effects where logical. Use specific examples: fast food, screen time, healthcare costs.', 'Liên kết nguyên nhân-hậu quả. Ví dụ: đồ ăn nhanh, màn hình, chi phí y tế.'),
    essay: `Childhood obesity has emerged as a major public health concern in both developed and developing nations. This essay examines the principal causes of this trend and its wider consequences.

One significant factor is dietary change. Affordable processed food high in sugar and fat has replaced home-cooked meals in many households. Coupled with aggressive marketing aimed at children, unhealthy eating habits become normalised early. Additionally, sedentary lifestyles — long school days followed by screen-based entertainment — reduce physical activity.

The effects are far-reaching. Obese children face higher risks of diabetes and cardiovascular disease, which burdens healthcare systems. Academically, they may suffer low self-esteem and bullying, affecting mental wellbeing. Societies also bear economic costs through lost productivity when health problems persist into adulthood.

In conclusion, poor diet and inactivity drive rising childhood obesity, creating health, psychological and economic challenges that demand coordinated policy responses.`,
    essayVi: `Béo phì trẻ em là lo ngại sức khỏe công cộng. Bài xem nguyên nhân và hậu quả.

Một yếu tố là thay đổi ăn uống. Thực phẩm chế biến giá rẻ thay bữa nấu ở nhà. Quảng cáo nhắm trẻ khiến ăn không lành mạnh trở nên bình thường. Lối sống ít vận động — học dài rồi giải trí màn hình — giảm hoạt động thể chất.

Hậu quả lan rộng. Trẻ béo phì dễ tiểu đường, bệnh tim, gây áp lực y tế. Học tập có thể tự ti, bị bắt nạt, ảnh hưởng tâm lý. Xã hội chịu chi phí kinh tế khi bệnh kéo dài đến trưởng thành.

Tóm lại, ăn uống kém và ít vận động thúc đẩy béo phì trẻ em — cần chính sách phối hợp.`,
  },
  {
    type: 'two-part',
    topic: bt('Public Transport Investment', 'Đầu tư giao thông công cộng'),
    prompt: bt('Why do some governments invest heavily in public transport? Do you think this is the best way to reduce traffic congestion?', 'Vì sao một số chính phủ đầu tư mạnh GTCC? Đây có phải cách tốt nhất giảm tắc đường?'),
    band: '8.0',
    structure: bt('Intro → Body 1 (reasons for investment) → Body 2 (evaluate as best solution) → Conclusion', 'Mở → Lý do đầu tư → Đánh giá giải pháp → Kết'),
    tips: bt('Answer BOTH questions explicitly. Partial agreement is fine.', 'Trả lời RÕ cả hai câu. Đồng ý một phần được.'),
    essay: `Many governments allocate substantial budgets to buses, metros and trams. This essay explains the motivations behind such investment and evaluates whether it represents the optimal strategy for easing congestion.

Authorities prioritise public transport for several reasons. First, it reduces per-capita emissions compared with private cars, supporting climate targets. Second, efficient networks improve mobility for low-income residents who cannot afford vehicles. Third, well-connected cities attract business investment and tourism, generating economic returns that justify upfront capital spending.

Whether this is the best congestion remedy depends on context. In dense metropolitan areas, expanding metro lines often delivers measurable relief because a single train replaces hundreds of cars. However, transport investment alone may fail where urban planning encourages sprawl or where flexible working has not reduced peak-hour demand. Complementary measures — congestion charges, park-and-ride schemes and remote-work incentives — may be equally vital.

Overall, public transport investment is a highly effective congestion tool in compact cities, but it works best as part of an integrated transport policy rather than a standalone solution.`,
    essayVi: `Nhiều chính phủ chi lớn cho xe buýt, metro, tàu điện. Bài giải thích động lực và đánh giá có phải cách tốt nhất giảm tắc đường.

Ưu tiên GTCC vì: giảm khí thải bình quân đầu người; giúp người thu nhập thấp di chuyển; thành phố kết nối tốt thu hút đầu tư và du lịch.

Có phải giải pháp tốt nhất tùy bối cảnh. Ở đô thị đông, metro giảm tắc rõ vì một tàu thay hàng trăm xe. Nhưng chỉ đầu tư GTCC có thể thất bại nếu quy hoạch khuyến khích lan rộng hoặc giờ cao điểm vẫn cao. Cần thêm phí tắc đường, bãi đỗ ngoại ô, khuyến khích làm từ xa.

Nhìn chung đầu tư GTCC rất hiệu quả ở thành phố compact, nhưng tốt nhất trong chính sách giao thông tổng thể.`,
  },
];

export const SPEAKING_SAMPLES = [
  { part: 1, topic: bt('Education', 'Giáo dục'), question: bt('Did you enjoy your time at school?', 'Bạn có thích thời học sinh không?'), band: '7+', tips: bt('Answer + reason + brief example. Use past tense.', 'Trả lời + lý do + ví dụ ngắn. Dùng quá khứ.'), answer: 'Yes, overall I enjoyed school, especially secondary level when I discovered literature and debate club. Teachers encouraged critical thinking rather than rote memorisation, which made classes engaging. Of course, exam pressure was stressful, but the friendships I formed still matter to me.', answerVi: 'Có, tôi thích đi học, nhất là cấp hai khi khám phá văn học và CLB tranh biện. Giáo viên khuyến khích tư duy phản biện thay vì học vẹt, lớp học hấp dẫn. Áp lực thi căng nhưng tình bạn vẫn quan trọng với tôi.' },
  { part: 1, topic: bt('Environment', 'Môi trường'), question: bt('Do you think pollution is a serious problem in your area?', 'Ô nhiễm có nghiêm trọng ở khu bạn không?'), band: '7+', tips: bt('Yes/No + specific local example (air, water, noise).', 'Có/Không + ví dụ địa phương cụ thể.'), answer: 'Unfortunately yes, air pollution is quite noticeable, particularly during dry season when farmers burn crop residue nearby. I often check the air quality app before exercising outdoors. Local authorities have introduced fines, but enforcement still seems inconsistent.', answerVi: 'Tiếc là có, ô nhiễm không khí rõ, nhất mùa khô khi nông dân đốt rơm gần đó. Tôi hay xem app chất lượng không khí trước khi tập ngoài trời. Chính quyền có phạt nhưng thực thi chưa đều.' },
  { part: 1, topic: bt('Technology', 'Công nghệ'), question: bt('How often do you use the internet?', 'Bạn dùng internet bao lâu một lần?'), band: '7+', tips: bt('Frequency + purposes (study, social, shopping).', 'Tần suất + mục đích (học, MXH, mua sắm).'), answer: 'I use the internet daily, several hours on average. Mornings I check news and email; afternoons I research assignments; evenings I stream documentaries or video-call family abroad. I try to limit social media scrolling because it easily becomes a distraction.', answerVi: 'Tôi dùng internet hàng ngày, trung bình vài giờ. Sáng xem tin và email; chiều tra cứu bài tập; tối xem phim tài liệu hoặc gọi video gia đình nước ngoài. Tôi hạn chế lướt MXH vì dễ sao nhãng.' },
  { part: 1, topic: bt('Work', 'Việc làm'), question: bt('What would be your dream job?', 'Công việc mơ ước của bạn là gì?'), band: '7–8', tips: bt('Name job + why + skills you would use.', 'Nêu nghề + lý do + kỹ năng sử dụng.'), answer: 'My dream job would be a sustainability consultant helping companies reduce their carbon footprint. I am passionate about environmental policy and enjoy analysing data to propose practical solutions. It would combine my business background with my concern for climate change.', answerVi: 'Công việc mơ ước là tư vấn bền vững giúp doanh nghiệp giảm dấu chân carbon. Tôi đam mê chính sách môi trường và thích phân tích dữ liệu đề xuất giải pháp thực tế. Kết hợp nền kinh doanh với quan tâm biến đổi khí hậu.' },
  { part: 1, topic: bt('Media', 'Truyền thông'), question: bt('Do you prefer reading news online or in newspapers?', 'Bạn thích đọc tin online hay báo giấy?'), band: '7+', tips: bt('State preference + 2 reasons (speed, environment, depth).', 'Nêu ưu tiên + 2 lý do.'), answer: 'I definitely prefer online news because updates appear instantly and I can follow multiple sources. That said, I occasionally buy weekend papers for in-depth analysis that short online articles lack. I also appreciate that digital news reduces paper waste.', answerVi: 'Tôi thích tin online vì cập nhật tức thì và theo nhiều nguồn. Thỉnh thoảng mua báo cuối tuần để đọc phân tích sâu mà bài ngắn online thiếu. Tin số cũng giảm lãng phí giấy.' },
  { part: 3, topic: bt('Education', 'Giáo dục'), question: bt('Should university education be free for everyone?', 'Đại học có nên miễn phí cho mọi người?'), band: '7.5', tips: bt('Balanced view: access vs quality/funding. Use hedging.', 'Quan điểm cân bằng: tiếp cận vs chất lượng/kinh phí. Dùng hedging.'), answer: 'It is tempting to argue for completely free tuition because education reduces inequality. However, totally free university may overcrowd campuses and strain government budgets, potentially lowering quality. A more sustainable model might involve income-contingent loans or heavy subsidies for disadvantaged students while expecting modest contributions from those who can afford them.', answerVi: 'Miễn phí hoàn toàn hấp dẫn vì giáo dục giảm bất bình đẳng. Nhưng đại học hoàn toàn miễn phí có thể đông người và áp lực ngân sách, hạ chất lượng. Mô hình bền vững hơn: vay trả theo thu nhập hoặc trợ cấp mạnh cho học sinh khó khăn, yêu cầu đóng góp vừa phải từ người có khả năng.' },
  { part: 3, topic: bt('Crime', 'Tội phạm'), question: bt('What are the best ways to reduce crime in society?', 'Cách tốt nhất giảm tội phạm trong xã hội?'), band: '7.5', tips: bt('Multi-layer: prevention, policing, rehabilitation. Avoid single solution.', 'Nhiều tầng: phòng ngừa, cảnh sát, cải tạo. Tránh một giải pháp.'), answer: 'Crime reduction requires a combination of approaches. Preventive measures such as youth programmes and poverty alleviation address root causes. Effective policing and community surveillance deter opportunistic offences. Equally important is rehabilitation — offenders who receive education and job training are less likely to reoffend. No single policy suffices on its own.', answerVi: 'Giảm tội phạm cần kết hợp nhiều cách. Phòng ngừa như chương trình thanh niên và giảm nghèo xử lý gốc rễ. Cảnh sát hiệu quả và giám sát cộng đồng răn đe tội cơ hội. Cải tạo quan trọng — phạm nhân được giáo dục và dạy nghề ít tái phạm. Không chính sách đơn lẻ nào đủ.' },
  { part: 3, topic: bt('Urban Life', 'Đời sống đô thị'), question: bt('Why do so many people move to cities?', 'Vì sao nhiều người chuyển vào thành phố?'), band: '7+', tips: bt('Economic + social reasons. Mention developing countries.', 'Lý do kinh tế + xã hội. Nhắc nước đang phát triển.'), answer: 'Urban migration is driven primarily by economic opportunity — cities concentrate jobs, universities and infrastructure. Young people also seek cultural amenities and independence away from traditional rural communities. In developing nations, drought or land scarcity additionally push farmers toward metropolitan areas, accelerating urbanisation.', answerVi: 'Di cư vào thành phố chủ yếu vì cơ hội kinh tế — thành phố tập trung việc làm, đại học, hạ tầng. Thanh niên cũng tìm tiện ích văn hóa và độc lập khỏi nông thôn truyền thống. Ở nước đang phát triển, hạn hán hoặc thiếu đất đẩy nông dân vào đô thị, tăng tốc đô thị hóa.' },
  { part: 3, topic: bt('Family', 'Gia đình'), question: bt('How have family structures changed in recent decades?', 'Cấu trúc gia đình thay đổi thế nào vài thập kỷ qua?'), band: '8.0', tips: bt('Compare past vs present: nuclear, divorce, dual income, ageing.', 'So sánh quá khứ-hiện tại: hạt nhân, ly hôn, hai vợ chồng đi làm, già hóa.'), answer: 'Family structures have become more diverse. Traditional extended households are less common in urban areas, replaced by nuclear families or single-parent homes. Rising divorce rates and cohabitation reflect changing social attitudes. Dual-income households are now the norm, which affects child-rearing patterns. Meanwhile, ageing populations mean more middle-aged adults care for elderly parents while raising children — the so-called sandwich generation.', answerVi: 'Cấu trúc gia đình đa dạng hơn. Hộ gia đình mở rộng truyền thống ít phổ biến ở thành phố, thay bằng hạt nhân hoặc cha/mẹ đơn thân. Ly hôn và sống thử phản ánh thái độ xã hội thay đổi. Hai vợ chồng đi làm là chuẩn, ảnh hưởng nuôi dạy con. Già hóa khiến người trung niên vừa chăm cha mẹ già vừa nuôi con — thế hệ sandwich.' },
  { part: 3, topic: bt('Science', 'Khoa học'), question: bt('Should governments fund space exploration?', 'Chính phủ có nên tài trợ khám phá vũ trụ?'), band: '7.5', tips: bt('Weigh scientific benefits vs social spending priorities.', 'Cân lợi ích khoa học vs ưu tiên chi tiêu xã hội.'), answer: 'Space exploration is expensive, and critics argue funds should target poverty or healthcare instead. Nevertheless, satellite technology derived from space programmes underpins weather forecasting, GPS and telecommunications. Furthermore, ambitious scientific projects inspire young people to pursue STEM careers. I would argue for moderate, targeted funding rather than unlimited budgets.', answerVi: 'Khám phá vũ trụ tốn kém; phê phán cho nên chi vào giảm nghèo hoặc y tế. Tuy nhiên công nghệ vệ tinh từ chương trình vũ trụ nền tảng dự báo thời tiết, GPS và viễn thông. Dự án khoa học tham vọng truyền cảm hứng trẻ theo STEM. Tôi ủng hộ tài trợ vừa phải, có mục tiêu thay vì ngân sách không giới hạn.' },
];