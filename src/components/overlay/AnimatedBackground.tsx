import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  themeId: 'morning' | 'afternoon' | 'evening' | 'night';
}

const THEME_COLORS: Record<string, string[]> = {
  morning: ['hsla(30, 90%, 55%, 0.15)', 'hsla(350, 70%, 60%, 0.12)', 'hsla(45, 95%, 60%, 0.1)'],
  afternoon: ['hsla(200, 60%, 50%, 0.12)', 'hsla(170, 70%, 45%, 0.1)', 'hsla(45, 80%, 55%, 0.08)'],
  evening: ['hsla(15, 85%, 50%, 0.15)', 'hsla(340, 70%, 45%, 0.12)', 'hsla(30, 90%, 45%, 0.1)'],
  night: ['hsla(170, 80%, 50%, 0.12)', 'hsla(280, 70%, 50%, 0.1)', 'hsla(330, 80%, 55%, 0.08)'],
};

export function AnimatedBackground({ themeId }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1920;
    canvas.height = 1080;

    // Particle system
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      alphaDir: number;
    }[] = [];

    const colors = THEME_COLORS[themeId] || THEME_COLORS.night;

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 80 + Math.random() * 200,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5,
        alphaDir: (Math.random() - 0.5) * 0.003,
      });
    }

    // Wave parameters
    const waves = [
      { amplitude: 40, frequency: 0.003, speed: 0.008, y: 700, color: colors[0] },
      { amplitude: 30, frequency: 0.004, speed: -0.006, y: 750, color: colors[1] },
      { amplitude: 50, frequency: 0.002, speed: 0.005, y: 800, color: colors[2] || colors[0] },
    ];

    let time = 0;
    let animId: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw soft particles (bokeh-style)
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir;

        if (p.alpha <= 0.05 || p.alpha >= 0.6) p.alphaDir *= -1;
        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        if (p.x > canvas.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = canvas.height + p.radius;
        if (p.y > canvas.height + p.radius) p.y = -p.radius;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${p.alpha})`));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      }

      // Draw flowing waves
      for (const wave of waves) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 4) {
          const y =
            wave.y +
            Math.sin(x * wave.frequency + time * wave.speed * 60) * wave.amplitude +
            Math.sin(x * wave.frequency * 1.5 + time * wave.speed * 40) * (wave.amplitude * 0.4);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, canvas.height);
        grad.addColorStop(0, wave.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      time += 0.016;
      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animId);
  }, [themeId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
