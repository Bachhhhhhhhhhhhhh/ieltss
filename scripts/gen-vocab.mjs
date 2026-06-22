import fs from 'fs';
import meanings from './vocab-dict.mjs';

const words = [
  'alleviate','ambiguous','analogy','anticipate','arbitrary','assess','attribute','biodiversity',
  'coherent','comprehensive','conceive','consequently','constitute','contemporary','controversial',
  'correlate','criteria','crucial','cumulative','deteriorate','diminish','discriminate','diverse',
  'elaborate','eliminate','empirical','enhance','equivalent','erode','exacerbate','facilitate',
  'fluctuate','fundamental','hypothesis','implement','implication','incentive','inevitable',
  'infrastructure','inherent','innovative','integrate','intervene','legislation','mitigate',
  'notion','obsolete','paradigm','phenomenon','sustainability','proliferation','detrimental',
  'subsequently','predominantly','unprecedented','paramount','quintessential','ramification',
  'repercussion','scrutinize','substantiate','surpass','tangible','tenacious','transient',
  'undermine','validate','versatile','viable','volatile','widespread','advocate','allocate',
  'anomaly','autonomous','benchmark','bolster','burgeoning','catalyst','circumvent','coalesce',
  'commensurate','compelling','conducive','conjecture','consolidate','converge','corroborate',
  'culminate','cumbersome','debilitate','decipher','deplete','depreciate','deterrent',
  'discrepancy','disseminate','diverge','elicit','emulate','endeavor','engender','envisage',
  'epitomize','escalate','exemplify','expedite','extrapolate','feasible','flourish','formidable',
  'fortify','foster','galvanize','gauge','hamper','hinder','homogeneous','impede','imperative',
  'inadvertent','incumbent','indigenous','indispensable','infer','infringe','innate','insightful',
  'instigate','integral','intermittent','intricate','intrinsic','juxtapose','lucrative','magnitude',
  'manifest','marginal','meticulous','monolithic','multifaceted','nascent','negligible','nuance',
  'oblivious','omnipresent','onerous','optimal','ornate','ostensible','paradox','pervasive',
  'plausible','pragmatic','precarious','preclude','predilection','preliminary','presume',
  'profound','prolific','prominent','prone','proponent','prosperous','prudent','rampant',
  'reciprocal','reconcile','redundant','refute','reiterate','relinquish','reminiscent','replicate',
  'resilient','restrain','retrospect','rhetoric','rudimentary','salient','scrutiny','secular',
  'sedentary','serendipity','skeptical','sovereign','sporadic','stagnant','stipulate','subordinate',
  'substantial','succinct','supersede','susceptible','synthesis','tacit','tedious','tenet',
  'trajectory','transcend','trivial','ubiquitous','unequivocal','unilateral','utilitarian',
  'vacillate','vehement','venerable','verbose','vestige','vicarious','vindicate','virtuous',
  'voracious','whimsical','zealous',
];

const cats = ['Education', 'Environment', 'Technology', 'Health', 'Society', 'Business', 'Science', 'Culture'];

const data = words.map((w, i) => {
  const m = meanings[w];
  return {
    id: `vocab-${i + 1}`,
    word: w,
    phonetic: `/${w}/`,
    meaning: m ? { en: m.en, vi: m.vi } : { en: `Academic term: ${w}`, vi: `Thuật ngữ học thuật: ${w}` },
    example: m
      ? { en: m.exEn, vi: m.exVi }
      : { en: `Using "${w}" in your essay demonstrates lexical resource.`, vi: `Sử dụng "${w}" trong bài luận thể hiện vốn từ vựng.` },
    category: cats[i % cats.length],
    difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
  };
});

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync(
  'src/data/vocabulary.ts',
  `import type { VocabWord } from '../types';\n\nexport const vocabulary: VocabWord[] = ${JSON.stringify(data, null, 2)};\n`
);
console.log(`Generated ${data.length} vocabulary words`);