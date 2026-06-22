import { useState, useRef, useCallback } from 'react';

export function useMediaRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopRecognition = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const startRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text.trim());
    };
    recognition.onerror = () => stopRecognition();
    recognition.start();
    recognitionRef.current = recognition;
  }, [stopRecognition]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      setTranscript('');
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        stopRecognition();
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      startRecognition();
    } catch {
      /* mic not available */
    }
  }, [startRecognition, stopRecognition]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  const transcribe = useCallback(() => {
    if (transcript.trim()) return;
    startRecognition();
  }, [transcript, startRecognition]);

  const reset = useCallback(() => {
    stopRecognition();
    setAudioUrl(null);
    setTranscript('');
  }, [stopRecognition]);

  return { isRecording, audioUrl, transcript, startRecording, stopRecording, transcribe, reset, setTranscript };
}