import { useState, useEffect, useCallback } from 'react';
import { Clock, Calendar, Mic } from 'lucide-react';
import { CONFIG } from '@/config';

export interface RadioShow {
  name: string;
  host: string;
  description: string;
  time: string;
  days: string;
  accentHue: number;
}

const SHOWS: RadioShow[] = [
  {
    name: 'De Ochtendshow',
    host: 'DJ Mike',
    description: 'Start je dag met de beste hits en het laatste nieuws. Elke ochtend fris en energiek.',
    time: '06:00 – 10:00',
    days: 'Ma – Vr',
    accentHue: 30,
  },
  {
    name: 'Middagmix',
    host: 'Lisa & Tom',
    description: 'Non-stop muziek om je door de middag te helpen. Van pop tot dance, alles komt voorbij.',
    time: '12:00 – 16:00',
    days: 'Ma – Vr',
    accentHue: 200,
  },
  {
    name: 'De Avondshow',
    host: 'DJ Rosa',
    description: 'Ontspan met de beste avondtunes. Deep cuts, nieuwe releases en luisteraarsverzoeken.',
    time: '18:00 – 22:00',
    days: 'Ma – Vr',
    accentHue: 340,
  },
  {
    name: 'Nachtshift',
    host: 'AutoDJ',
    description: 'De nacht is van jou. Ambient, chillout en relaxte beats tot de zon opkomt.',
    time: '22:00 – 06:00',
    days: 'Elke dag',
    accentHue: 170,
  },
  {
    name: 'Weekend Mix',
    host: 'DJ Sander',
    description: 'Het weekend begint hier! Party classics, remixes en de beste dancetracks.',
    time: '14:00 – 20:00',
    days: 'Za – Zo',
    accentHue: 280,
  },
  {
    name: 'Throwback Hour',
    host: 'Vintage Vic',
    description: 'Reis terug in de tijd met de grootste hits uit de jaren 80, 90 en 00.',
    time: '10:00 – 12:00',
    days: 'Za – Zo',
    accentHue: 45,
  },
];

const SLIDE_DURATION = CONFIG.SLIDE_DURATION;

interface ShowSlideshowProps {
  visible: boolean;
}

export function ShowSlideshow({ visible }: ShowSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWS.length);
      setProgress(0);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 500);
  }, []);

  // Auto-advance only when visible
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(goToNext, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [goToNext, visible]);

  // Progress bar
  useEffect(() => {
    if (!visible) return;
    const startTime = Date.now();
    let animId: number;
    function tick() {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(elapsed / SLIDE_DURATION, 1));
      if (elapsed < SLIDE_DURATION) {
        animId = requestAnimationFrame(tick);
      }
    }
    tick();
    return () => cancelAnimationFrame(animId);
  }, [currentIndex, visible]);

  const show = SHOWS[currentIndex];

  return (
    <div
      className={`absolute inset-0 z-10 flex transition-all duration-700 ease-out ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Decorative accent glow per show */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 25% 50%, hsla(${show.accentHue}, 70%, 50%, 0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 80% 70%, hsla(${show.accentHue}, 60%, 40%, 0.08) 0%, transparent 70%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full h-full">
        {/* Left side — large show initial / visual */}
        <div className="flex items-center justify-center w-[45%]">
          <div
            className={`transition-all duration-600 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div
              className="w-64 h-64 rounded-3xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, hsla(${show.accentHue}, 60%, 45%, 0.2), hsla(${show.accentHue}, 80%, 35%, 0.08))`,
                border: `1px solid hsla(${show.accentHue}, 60%, 50%, 0.2)`,
                boxShadow: `0 0 80px hsla(${show.accentHue}, 70%, 50%, 0.1), inset 0 0 60px hsla(${show.accentHue}, 60%, 50%, 0.05)`,
              }}
            >
              <span
                className="text-8xl font-bold select-none"
                style={{ color: `hsla(${show.accentHue}, 60%, 60%, 0.3)` }}
              >
                {show.name.charAt(0)}
              </span>
              {/* Decorative rings */}
              <div
                className="absolute inset-4 rounded-2xl border animate-pulse-glow"
                style={{ borderColor: `hsla(${show.accentHue}, 50%, 50%, 0.1)` }}
              />
              <div
                className="absolute inset-8 rounded-xl border"
                style={{ borderColor: `hsla(${show.accentHue}, 50%, 50%, 0.06)` }}
              />
            </div>
          </div>
        </div>

        {/* Right side — show info */}
        <div className="flex flex-col justify-center w-[55%] pr-[120px]">
          <div
            key={currentIndex}
            className={`space-y-6 transition-all duration-500 ${
              isTransitioning
                ? 'opacity-0 translate-y-6'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Label */}
            <div className="animate-float-up" style={{ animationDelay: '0s' }}>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
                Programmering
              </span>
            </div>

            {/* Show name */}
            <div className="animate-float-up" style={{ animationDelay: '0.1s' }}>
              <h2
                className="text-5xl font-bold tracking-tight text-foreground leading-[1.1]"
                style={{ textWrap: 'balance' }}
              >
                {show.name}
              </h2>
            </div>

            {/* Host */}
            <div className="animate-float-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `hsla(${show.accentHue}, 60%, 50%, 0.15)`,
                    border: `1px solid hsla(${show.accentHue}, 60%, 50%, 0.25)`,
                  }}
                >
                  <Mic className="w-4 h-4" style={{ color: `hsla(${show.accentHue}, 60%, 60%, 0.9)` }} />
                </div>
                <span className="text-xl font-medium text-primary/90">{show.host}</span>
              </div>
            </div>

            {/* Description */}
            <div className="animate-float-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[520px]">
                {show.description}
              </p>
            </div>

            {/* Time & days */}
            <div className="animate-float-up flex items-center gap-4" style={{ animationDelay: '0.3s' }}>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm"
                style={{
                  background: 'hsla(var(--muted), 0.3)',
                  border: '1px solid hsla(var(--border), 0.3)',
                }}
              >
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground/80">{show.time}</span>
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm"
                style={{
                  background: 'hsla(var(--muted), 0.3)',
                  border: '1px solid hsla(var(--border), 0.3)',
                }}
              >
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground/80">{show.days}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-28 right-[120px] z-20 flex items-center gap-2">
        {SHOWS.map((_, i) => (
          <div key={i} className="relative w-8 h-1 rounded-full overflow-hidden bg-foreground/10">
            {i === currentIndex ? (
              <div
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                style={{ width: `${progress * 100}%`, transition: 'width 0.1s linear' }}
              />
            ) : i < currentIndex ? (
              <div className="absolute inset-0 bg-primary/40 rounded-full" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
