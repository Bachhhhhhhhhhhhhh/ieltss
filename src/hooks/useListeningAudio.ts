import { useState, useCallback, useRef, useEffect } from 'react';

export type AudioStatus = 'idle' | 'playing' | 'paused' | 'error';

const SPEED_OPTIONS = [0.75, 0.9, 1, 1.15, 1.3] as const;
export type PlaybackSpeed = (typeof SPEED_OPTIONS)[number];

let voicesCache: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  voicesCache = window.speechSynthesis.getVoices();
  return voicesCache;
}

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = voicesCache.length ? voicesCache : loadVoices();
  return (
    voices.find((v) => v.lang === 'en-US' && v.localService) ??
    voices.find((v) => v.lang === 'en-US') ??
    voices.find((v) => v.lang.startsWith('en-') && v.localService) ??
    voices.find((v) => v.lang.startsWith('en-')) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    voices[0] ??
    null
  );
}

/** Prime speechSynthesis — call from a user click (e.g. Begin Section). */
export function warmUpSpeechSynthesis(): void {
  if (!('speechSynthesis' in window)) return;
  loadVoices();
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(' ');
  u.volume = 0.01;
  u.rate = 10;
  window.speechSynthesis.speak(u);
  setTimeout(() => window.speechSynthesis.cancel(), 50);
}

function splitIntoChunks(text: string, maxLen = 220): string[] {
  const sentences = text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  const chunks: string[] = [];
  let buf = '';
  for (const s of sentences) {
    if ((buf + ' ' + s).trim().length > maxLen && buf) {
      chunks.push(buf.trim());
      buf = s;
    } else {
      buf = buf ? `${buf} ${s}` : s;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks.length ? chunks : [text.trim()];
}

export function useListeningAudio() {
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState<PlaybackSpeed>(0.9);
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const textRef = useRef('');
  const chunksRef = useRef<string[]>([]);
  const chunkIdxRef = useRef(0);
  const stoppedRef = useRef(false);
  const rateRef = useRef(rate);
  const volumeRef = useRef(volume);
  const playNextChunkRef = useRef<() => void>(() => {});

  useEffect(() => { rateRef.current = rate; }, [rate]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  useEffect(() => {
    if (!supported) return;
    loadVoices();
    const onVoices = () => loadVoices();
    window.speechSynthesis.onvoiceschanged = onVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported]);

  const stop = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    stoppedRef.current = true;
    window.speechSynthesis.cancel();
    chunksRef.current = [];
    chunkIdxRef.current = 0;
    setStatus('idle');
    setErrorMsg(null);
  }, []);

  const speakChunk = useCallback((chunk: string, onDone: () => void) => {
    if (!('speechSynthesis' in window) || stoppedRef.current || !chunk.trim()) {
      onDone();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunk);
    const voice = pickEnglishVoice();
    utterance.lang = voice?.lang ?? 'en-US';
    if (voice) utterance.voice = voice;
    utterance.rate = rateRef.current;
    utterance.volume = Math.max(0.05, Math.min(1, volumeRef.current));
    utterance.pitch = 1;

    utterance.onstart = () => setStatus('playing');
    utterance.onend = () => onDone();
    utterance.onerror = (e) => {
      if (stoppedRef.current) return;
      setStatus('error');
      setErrorMsg(e.error ?? 'playback-failed');
      onDone();
    };

    const doSpeak = () => {
      if (stoppedRef.current) return;
      window.speechSynthesis.speak(utterance);
      /* Chrome/Edge: queue sometimes stuck until resume */
      setTimeout(() => {
        if (!stoppedRef.current && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        if (!stoppedRef.current && !window.speechSynthesis.speaking && chunk) {
          window.speechSynthesis.speak(utterance);
        }
      }, 120);
    };

    loadVoices();
    if (voicesCache.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        loadVoices();
        doSpeak();
      };
    } else {
      window.speechSynthesis.cancel();
      setTimeout(doSpeak, 30);
    }
  }, []);

  const playNextChunk = useCallback(() => {
    if (stoppedRef.current) return;
    const idx = chunkIdxRef.current;
    const chunks = chunksRef.current;
    if (idx >= chunks.length) {
      setStatus('idle');
      return;
    }
    speakChunk(chunks[idx], () => {
      if (stoppedRef.current) return;
      chunkIdxRef.current = idx + 1;
      if (chunkIdxRef.current < chunks.length) {
        playNextChunkRef.current();
      } else {
        setStatus('idle');
      }
    });
  }, [speakChunk]);

  useEffect(() => {
    playNextChunkRef.current = playNextChunk;
  }, [playNextChunk]);

  const play = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window) || !text.trim()) return false;
      stoppedRef.current = false;
      setErrorMsg(null);
      textRef.current = text;
      chunksRef.current = splitIntoChunks(text);
      chunkIdxRef.current = 0;
      window.speechSynthesis.cancel();
      setTimeout(() => playNextChunk(), 50);
      return true;
    },
    [playNextChunk],
  );

  const pause = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setStatus('paused');
    }
  }, []);

  const resume = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    stoppedRef.current = false;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setStatus('playing');
    } else if (chunkIdxRef.current < chunksRef.current.length) {
      playNextChunk();
    }
  }, [playNextChunk]);

  const togglePlayPause = useCallback(
    (text: string) => {
      if (status === 'playing') {
        pause();
        return;
      }
      if (status === 'paused') {
        resume();
        return;
      }
      play(text);
    },
    [status, pause, resume, play],
  );

  const setVolumeLevel = useCallback((v: number) => {
    setVolume(Math.max(0, Math.min(1, v)));
  }, []);

  const setPlaybackRate = useCallback((r: PlaybackSpeed) => {
    setRate(r);
  }, []);

  return {
    status,
    isPlaying: status === 'playing',
    volume,
    rate,
    supported,
    errorMsg,
    speedOptions: SPEED_OPTIONS,
    play,
    pause,
    resume,
    stop,
    togglePlayPause,
    setVolume: setVolumeLevel,
    setRate: setPlaybackRate,
  };
}