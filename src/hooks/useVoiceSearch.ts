import { useState, useCallback, useRef, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecInstance = any;

function getRecognition(): RecInstance | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

export function useVoiceSearch(lang: 'en' | 'vi') {
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => !!getRecognition());
  const recRef = useRef<RecInstance | null>(null);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback((onResult: (text: string) => void) => {
    const rec = getRecognition();
    if (!rec) return;
    recRef.current?.stop();

    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => {
      const text = e.results[0]?.[0]?.transcript ?? '';
      if (text.trim()) onResult(text.trim());
    };

    recRef.current = rec;
    rec.start();
  }, [lang]);

  useEffect(() => () => { recRef.current?.stop(); }, []);

  return { start, stop, listening, supported };
}