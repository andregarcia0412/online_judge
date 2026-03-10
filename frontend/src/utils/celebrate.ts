import confetti from "canvas-confetti";

export const celebrate = () => {
  const duration = 2000;
  const animationEnd = Date.now() + duration;

  const defaults = {
    startVelocity: 45,
    spread: 360,
    ticks: 120,
    gravity: 0.6,
    decay: 0.94,
    scalar: 1.1,
  };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};
