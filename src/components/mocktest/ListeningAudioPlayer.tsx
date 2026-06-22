import { useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Gauge, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useListeningAudio, type PlaybackSpeed } from '../../hooks/useListeningAudio';
import { AudioWaveform } from './AudioWaveform';
import { Button } from '../ui/Button';

interface ListeningAudioPlayerProps {
  /** Always pass English transcript for TTS */
  transcript: string;
  sectionKey: string;
  paused?: boolean;
}

export function ListeningAudioPlayer({ transcript, sectionKey, paused = false }: ListeningAudioPlayerProps) {
  const { t } = useLanguage();
  const audio = useListeningAudio();
  const pausedByTestRef = useRef(false);
  const prevSectionKey = useRef(sectionKey);

  useEffect(() => {
    if (prevSectionKey.current !== sectionKey) {
      audio.stop();
      prevSectionKey.current = sectionKey;
    }
  }, [sectionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (paused) {
      if (audio.isPlaying) {
        pausedByTestRef.current = true;
        audio.pause();
      }
    } else if (pausedByTestRef.current) {
      pausedByTestRef.current = false;
      audio.resume();
    }
  }, [paused]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => audio.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!audio.supported) {
    return (
      <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-xl p-3">
        {t.mock.audioUnsupported}
      </p>
    );
  }

  if (!transcript.trim()) {
    return (
      <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-xl p-3">
        {t.mock.audioNoTranscript}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">{t.mock.audioHint}</p>
      <AudioWaveform active={audio.isPlaying} />

      {audio.status === 'error' && (
        <p className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-xl p-3">
          <AlertCircle size={16} />
          {t.mock.audioError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          onClick={() => audio.togglePlayPause(transcript)}
          aria-label={audio.isPlaying ? t.mock.pauseAudio : t.mock.playAudio}
        >
          {audio.isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {audio.isPlaying ? t.mock.pauseAudio : audio.status === 'paused' ? t.mock.resumeAudio : t.mock.playAudio}
        </Button>
        <Button size="sm" variant="ghost" onClick={audio.stop} disabled={audio.status === 'idle'} aria-label={t.mock.stopAudio}>
          <Square size={14} /> {t.mock.stopAudio}
        </Button>
        {audio.status !== 'idle' && audio.status !== 'error' && (
          <span className="text-xs font-semibold text-accent-teal px-2 py-1 rounded-full bg-accent-teal/10">
            {audio.status === 'playing' ? '▶' : '⏸'} {audio.status === 'playing' ? t.mock.audioPlaying : t.mock.audioPausedLabel}
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            {audio.volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {t.mock.volume}: {Math.round(audio.volume * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(audio.volume * 100)}
            onChange={(e) => audio.setVolume(Number(e.target.value) / 100)}
            className="w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-accent-teal cursor-pointer"
            aria-label={t.mock.volume}
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Gauge size={14} />
            {t.mock.playbackSpeed}
          </label>
          <div className="flex flex-wrap gap-1">
            {audio.speedOptions.map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => audio.setRate(speed as PlaybackSpeed)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  audio.rate === speed
                    ? 'bg-accent-teal text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-accent-teal/10'
                }`}
              >
                {speed}×
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">{t.mock.speedNote}</p>
        </div>
      </div>
    </div>
  );
}