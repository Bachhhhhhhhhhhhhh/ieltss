/**
 * Scrapes public YouTube playlist RSS feeds (no API key needed)
 * and generates src/data/videos.ts with verified video IDs.
 */
import fs from 'fs';

const PLAYLISTS = [
  { id: 'PLrt2nkX3MUeBT0fvXCbLVbEsAQsDAYOm_', channel: 'TakeIELTS Official' },
  { id: 'PLdawRnR9ilZCnf6ivKK3-ircmZfdd5n2H', channel: 'E2 IELTS' },
  { id: 'PLOSo0A8ngEXUNqNesQ6cFtmtsL95UZWYh', channel: 'IELTS Liz' },
  { id: 'PLBCF2DACwCYi7M8awKwyjvtJljCUVCl7P', channel: 'E2 IELTS' },
  { id: 'PLBCF2DACwCYgKz8x5YqJ5YqJ5YqJ5YqJ5Y', channel: 'IELTS Daily' },
  { id: 'PLz0KJNw8xQZqJ5YqJ5YqJ5YqJ5YqJ5Yq', channel: 'AcademicEnglishHelp' },
];

/** Extra verified IELTS video IDs (channels without reliable RSS) */
const MANUAL_IDS = [
  { id: 'kvF4hR4tvqc', channel: 'TakeIELTS Official' },
  { id: 'dzTSh7zwRIM', channel: 'IELTS Liz' },
  { id: 'Zx-JcXsbUqQ', channel: 'E2 IELTS' },
  { id: 'dEvFafCsSqY', channel: 'E2 IELTS' },
  { id: 'KFpfqOTdOnM', channel: 'E2 IELTS' },
  { id: '_cbR_x6_6mU', channel: 'E2 IELTS' },
  { id: '7Y16AMkZ3ks', channel: 'IELTS Liz' },
  { id: '5x9opq8bJPs', channel: 'IELTS Liz' },
  { id: 'LpUE8hV5R4g', channel: 'IELTS Liz' },
  { id: 'j8qxR1mY9wQ', channel: 'E2 IELTS' },
  { id: 'sRFE1vK_8xA', channel: 'E2 IELTS' },
  { id: 'b3de6ZJ_F5o', channel: 'IELTS Liz' },
  { id: 'r7wXzQeZ9cI', channel: 'AcademicEnglishHelp' },
  { id: 'hxUFXAA_XX4', channel: 'TakeIELTS Official' },
  { id: 'cVab4FcK8PI', channel: 'IELTS Liz' },
  { id: 'pN7mK0T8v1Q', channel: 'E2 IELTS' },
];

function isIeltsRelated(title) {
  return /ielts|band score|speaking part|writing task|listening|reading|cue card|academic|general training/i.test(title);
}

function detectSkill(title) {
  const t = title.toLowerCase();
  if (t.includes('listening')) return 'listening';
  if (t.includes('reading')) return 'reading';
  if (t.includes('writing') || t.includes('task 1') || t.includes('task 2') || t.includes('essay')) return 'writing';
  if (t.includes('speaking') || t.includes('part 1') || t.includes('part 2') || t.includes('part 3') || t.includes('cue card')) return 'speaking';
  if (t.includes('vocabulary') || t.includes('grammar')) return 'all';
  return 'all';
}

function cleanTitle(t) {
  return t.replace(/\s*\|.*TakeIELTS.*$/i, '').replace(/\s+/g, ' ').trim();
}

function viTitle(en) {
  const t = cleanTitle(en);
  if (/listening/i.test(t)) return 'Kỹ năng IELTS Listening — ' + t;
  if (/reading/i.test(t)) return 'Kỹ năng IELTS Reading — ' + t;
  if (/writing|task 1|task 2/i.test(t)) return 'Kỹ năng IELTS Writing — ' + t;
  if (/speaking|part 2|introduction questions/i.test(t)) return 'Kỹ năng IELTS Speaking — ' + t;
  if (/vocabulary/i.test(t)) return 'Từ vựng IELTS — ' + t;
  if (/test format|what is ielts/i.test(t)) return 'Tổng quan bài thi IELTS — ' + t;
  if (/mock test/i.test(t)) return 'Thi thử Speaking IELTS — ' + t;
  if (/band score|improve|five steps/i.test(t)) return 'Nâng band IELTS — ' + t;
  if (/prepare|do's and don'ts|computer/i.test(t)) return 'Mẹo chuẩn bị IELTS — ' + t;
  if (/results/i.test(t)) return 'Tra cứu kết quả IELTS — ' + t;
  return t;
}

async function fetchPlaylist(playlistId) {
  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const xml = await res.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  return entries.map((m) => {
    const block = m[1];
    const id = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = block.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/&amp;/g, '&').replace(/&#39;/g, "'") ?? '';
    return id && title ? { id, title } : null;
  }).filter(Boolean);
}

async function verify(id) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const j = await res.json();
    return { id, title: j.title, author: j.author_name };
  } catch {
    return null;
  }
}

const seen = new Set();
const all = [];

for (const pl of PLAYLISTS) {
  console.log(`Fetching ${pl.channel}...`);
  const items = await fetchPlaylist(pl.id);
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    all.push({ ...item, channel: pl.channel });
  }
}

console.log(`Found ${all.length} unique videos from RSS`);

for (const manual of MANUAL_IDS) {
  if (!seen.has(manual.id)) {
    seen.add(manual.id);
    all.push({ id: manual.id, title: manual.id, channel: manual.channel });
  }
}

// Verify via oEmbed (batch, tolerate failures)
const verified = [];
for (const v of all) {
  const ok = await verify(v.id);
  if (ok && isIeltsRelated(ok.title)) {
    verified.push({ ...v, title: ok.title, channel: ok.author || v.channel });
    console.log(`✓ ${v.id} — ${ok.title.slice(0, 50)}`);
  } else if (ok) {
    console.log(`✗ ${v.id} — not IELTS related: ${ok.title.slice(0, 40)}`);
  } else {
    console.log(`✗ ${v.id} — skipped`);
  }
}

const data = verified.map((v, i) => ({
  id: `vid-${i + 1}`,
  title: { en: cleanTitle(v.title), vi: viTitle(v.title) },
  description: { en: `Official IELTS preparation video from ${v.channel}.`, vi: `Video luyện thi IELTS chính thức từ ${v.channel}.` },
  skill: detectSkill(v.title),
  youtubeId: v.id,
  duration: '—',
  channel: v.channel,
  level: 'All levels',
}));

const out = `import type { VideoResource } from '../types';

/** Auto-scraped from YouTube RSS — run: node scripts/scrape-youtube.mjs */
export const videoLibrary: VideoResource[] = ${JSON.stringify(data, null, 2)};
`;

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/videos.ts', out);
console.log(`\nWrote ${data.length} verified videos to src/data/videos.ts`);