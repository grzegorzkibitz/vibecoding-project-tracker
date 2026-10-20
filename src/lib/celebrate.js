import confetti from 'canvas-confetti';

/** A short confetti burst for finishing a task. Skipped when the user prefers reduced motion. */
export function celebrate() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.7 },
    disableForReducedMotion: true,
  });
}
