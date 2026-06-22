import confetti from 'canvas-confetti';

export function fireConfetti(): void {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#14B8A6', '#6366F1', '#0F172A'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#14B8A6', '#6366F1', '#0F172A'],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export function fireHighScoreConfetti(): void {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#14B8A6', '#6366F1', '#FBBF24', '#0F172A'],
  });
}