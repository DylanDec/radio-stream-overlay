import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  themeId: 'morning' | 'afternoon' | 'evening' | 'night';
}

const THEME_PALETTES: Record<string, { bg: string; colors: string[]; glowColors: string[] }> = {
  morning: {
    bg: '#1a0e2e',
    colors: ['hsla(30, 90%, 55%, 0.25)', 'hsla(350, 70%, 60%, 0.2)', 'hsla(45, 95%, 60%, 0.18)'],
    glowColors: ['hsla(30, 95%, 50%, 0.35)', 'hsla(350, 80%, 55%, 0.25)'],
  },
  afternoon: {
    bg: '#0a1628',
    colors: ['hsla(200, 60%, 50%, 0.2)', 'hsla(170, 70%, 45%, 0.18)', 'hsla(45, 80%, 55%, 0.12)'],
    glowColors: ['hsla(200, 70%, 50%, 0.3)', 'hsla(170, 80%, 45%, 0.2)'],
  },
  evening: {
    bg: '#1a0a0a',
    colors: ['hsla(15, 85%, 50%, 0.25)', 'hsla(340, 70%, 45%, 0.2)', 'hsla(30, 90%, 45%, 0.15)'],
    glowColors: ['hsla(15, 90%, 50%, 0.35)', 'hsla(340, 80%, 50%, 0.25)'],
  },
  night: {
    bg: '#070d1a',
    colors: ['hsla(170, 80%, 50%, 0.2)', 'hsla(280, 70%, 50%, 0.15)', 'hsla(330, 80%, 55%, 0.12)'],
    glowColors: ['hsla(170, 90%, 50%, 0.3)', 'hsla(330, 85%, 55%, 0.2)'],
  },
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

    const palette = THEME_PALETTES[themeId] || THEME_PALETTES.night;

    // Particles
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.35,
      radius: 60 + Math.random() * 250,
      color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
      alpha: 0.1 + Math.random() * 0.4,
      alphaDir: (Math.random() - 0.5) * 0.004,
    }));

    // Large glow sources (slow-moving spotlights)
    const glows = Array.from({ length: 4 }, (_, i) => ({
      x: 300 + Math.random() * 1320,
      y: 200 + Math.random() * 680,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.12,
      radius: 350 + Math.random() * 250,
      color: palette.glowColors[i % palette.glowColors.length],
    }));

    // Waves
    const waves = [
      { amplitude: 45, frequency: 0.003, speed: 0.008, y: 680, color: palette.colors[0] },
      { amplitude: 35, frequency: 0.0045, speed: -0.006, y: 740, color: palette.colors[1] },
      { amplitude: 55, frequency: 0.002, speed: 0.005, y: 820, color: palette.colors[2] || palette.colors[0] },
      { amplitude: 25, frequency: 0.006, speed: 0.01, y: 900, color: palette.colors[0] },
    ];

    // Stars (tiny sparkles)
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 600,
      size: 0.5 + Math.random() * 1.5,
      twinkleSpeed: 0.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    let animId: number;

    function draw() {
      if (!ctx || !canvas) return;

      // Fill solid dark background (replaces the static image)
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw large glow sources
      for (const g of glows) {
        g.x += g.vx;
        g.y += g.vy;
        if (g.x < 100 || g.x > 1820) g.vx *= -1;
        if (g.y < 100 || g.y > 980) g.vy *= -1;

        const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.radius);
        grad.addColorStop(0, g.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(g.x - g.radius, g.y - g.radius, g.radius * 2, g.radius * 2);
      }

      // Draw bokeh particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir;
        if (p.alpha <= 0.05 || p.alpha >= 0.55) p.alphaDir *= -1;
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

      // Draw twinkling stars
      for (const s of stars) {
        const brightness = 0.3 + 0.7 * Math.abs(Math.sin(time * s.twinkleSpeed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.6})`;
        ctx.fill();
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
    />
  );
}
