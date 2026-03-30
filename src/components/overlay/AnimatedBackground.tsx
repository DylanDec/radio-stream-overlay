import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  themeId: 'morning' | 'afternoon' | 'evening' | 'night';
  calm?: boolean;
  festive?: boolean;
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
  calm: {
    bg: '#050508',
    colors: ['hsla(220, 30%, 25%, 0.08)', 'hsla(240, 20%, 20%, 0.06)', 'hsla(200, 25%, 22%, 0.05)'],
    glowColors: ['hsla(220, 25%, 30%, 0.1)', 'hsla(240, 20%, 25%, 0.08)'],
  },
  festive: {
    bg: '#0d0518',
    colors: ['hsla(330, 100%, 60%, 0.35)', 'hsla(50, 100%, 55%, 0.3)', 'hsla(170, 100%, 50%, 0.28)', 'hsla(270, 95%, 60%, 0.3)', 'hsla(20, 100%, 55%, 0.28)'],
    glowColors: ['hsla(330, 100%, 55%, 0.45)', 'hsla(50, 100%, 55%, 0.4)', 'hsla(170, 100%, 50%, 0.35)', 'hsla(270, 100%, 60%, 0.4)'],
  },
};

export function AnimatedBackground({ themeId, calm = false, festive = false }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.width;
    const h = () => canvas.height;

    const palette = festive ? THEME_PALETTES.festive : calm ? THEME_PALETTES.calm : (THEME_PALETTES[themeId] || THEME_PALETTES.night);
    const particleCount = festive ? 120 : calm ? 20 : 80;
    const glowCount = festive ? 6 : calm ? 2 : 4;
    const starCount = festive ? 180 : calm ? 40 : 120;
    const waveAmplitudeMult = festive ? 1.4 : calm ? 0.3 : 1;

    // Particles — positions as fractions
    const particles = Array.from({ length: particleCount }, () => ({
      xFrac: Math.random(),
      yFrac: Math.random(),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.35,
      radiusFrac: (60 + Math.random() * 250) / 1920,
      color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
      alpha: 0.1 + Math.random() * 0.4,
      alphaDir: (Math.random() - 0.5) * 0.004,
    }));

    const glows = Array.from({ length: glowCount }, (_, i) => ({
      xFrac: 0.15 + Math.random() * 0.7,
      yFrac: 0.18 + Math.random() * 0.64,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.12,
      radiusFrac: (350 + Math.random() * 250) / 1920,
      color: palette.glowColors[i % palette.glowColors.length],
    }));

    const waves = [
      { amplitude: 45, frequency: 0.003, speed: 0.008, yFrac: 680 / 1080, color: palette.colors[0] },
      { amplitude: 35, frequency: 0.0045, speed: -0.006, yFrac: 740 / 1080, color: palette.colors[1] },
      { amplitude: 55, frequency: 0.002, speed: 0.005, yFrac: 820 / 1080, color: palette.colors[2] || palette.colors[0] },
      { amplitude: 25, frequency: 0.006, speed: 0.01, yFrac: 900 / 1080, color: palette.colors[0] },
    ];

    const stars = Array.from({ length: starCount }, () => ({
      xFrac: Math.random(),
      yFrac: Math.random() * 0.55,
      size: 0.5 + Math.random() * 1.5,
      twinkleSpeed: 0.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    let animId: number;

    function draw() {
      if (!ctx || !canvas) return;
      const cw = w();
      const ch = h();

      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, cw, ch);

      for (const g of glows) {
        const gx = g.xFrac * cw;
        const gy = g.yFrac * ch;
        const gr = g.radiusFrac * cw;
        g.xFrac += g.vx / cw;
        g.yFrac += g.vy / ch;
        if (g.xFrac < 0.05 || g.xFrac > 0.95) g.vx *= -1;
        if (g.yFrac < 0.05 || g.yFrac > 0.95) g.vy *= -1;

        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        grad.addColorStop(0, g.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
      }

      for (const p of particles) {
        const px = p.xFrac * cw;
        const py = p.yFrac * ch;
        const pr = p.radiusFrac * cw;
        p.xFrac += p.vx / cw;
        p.yFrac += p.vy / ch;
        p.alpha += p.alphaDir;
        if (p.alpha <= 0.05 || p.alpha >= 0.55) p.alphaDir *= -1;
        if (p.xFrac < -0.1) p.xFrac = 1.1;
        if (p.xFrac > 1.1) p.xFrac = -0.1;
        if (p.yFrac < -0.1) p.yFrac = 1.1;
        if (p.yFrac > 1.1) p.yFrac = -0.1;

        const gradient = ctx.createRadialGradient(px, py, 0, px, py, pr);
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${p.alpha})`));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
      }

      for (const s of stars) {
        const brightness = 0.3 + 0.7 * Math.abs(Math.sin(time * s.twinkleSpeed + s.phase));
        ctx.beginPath();
        ctx.arc(s.xFrac * cw, s.yFrac * ch, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.6})`;
        ctx.fill();
      }

      for (const wave of waves) {
        const baseY = wave.yFrac * ch;
        const amp = wave.amplitude * (ch / 1080) * waveAmplitudeMult;
        ctx.beginPath();
        ctx.moveTo(0, ch);
        for (let x = 0; x <= cw; x += 4) {
          const y =
            baseY +
            Math.sin(x * wave.frequency + time * wave.speed * 60) * amp +
            Math.sin(x * wave.frequency * 1.5 + time * wave.speed * 40) * (amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(cw, ch);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - amp, 0, ch);
        grad.addColorStop(0, wave.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      time += 0.016;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [themeId, calm]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
