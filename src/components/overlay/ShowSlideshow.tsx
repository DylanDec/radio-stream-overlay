import { useState, useEffect, useCallback } from 'react';
import { Clock, Calendar, Mic } from 'lucide-react';

export interface RadioShow {
  name: string;
  host: string;
  description: string;
  time: string;
  days: string;
  image: string;
}

const SHOWS: RadioShow[] = [
  {
    name: 'De Ochtendshow',
    host: 'DJ Mike',
    description: 'Start je dag met de beste hits en het laatste nieuws. Elke ochtend fris en energiek.',
    time: '06:00 – 10:00',
    days: 'Ma – Vr',
    image: '/images/show-ochtendshow.jpg',
  },
  {
    name: 'Middagmix',
    host: 'Lisa & Tom',
    description: 'Non-stop muziek om je door de middag te helpen. Van pop tot dance, alles komt voorbij.',
    time: '12:00 – 16:00',
    days: 'Ma – Vr',
    image: '/images/show-middagmix.jpg',
  },
  {
    name: 'De Avondshow',
    host: 'DJ Rosa',
    description: 'Ontspan met de beste avondtunes. Deep cuts, nieuwe releases en luisteraarsverzoeken.',
    time: '18:00 – 22:00',
    days: 'Ma – Vr',
    image: '/images/show-avondshow.jpg',
  },
  {
    name: 'Nachtshift',
    host: 'AutoDJ',
    description: 'De nacht is van jou. Ambient, chillout en relaxte beats tot de zon opkomt.',
    time: '22:00 – 06:00',
    days: 'Elke dag',
    image: '/images/show-nachtshift.jpg',
  },
  {
    name: 'Weekend Mix',
    host: 'DJ Sander',
    description: 'Het weekend begint hier! Party classics, remixes en de beste dancetracks.',
    time: '14:00 – 20:00',
    days: 'Za – Zo',
    image: '/images/show-weekendmix.jpg',
  },
  {
    name: 'Throwback Hour',
    host: 'Vintage Vic',
    description: 'Reis terug in de tijd met de grootste hits uit de jaren 80, 90 en 00.',
    time: '10:00 – 12:00',
    days: 'Za – Zo',
    image: '/images/show-throwback.jpg',
  },
];

const SLIDE_DURATION = 12_000; // 12 seconds per slide

export function ShowSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWS.length);
      setProgress(0);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 600);
  }, []);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(goToNext, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [goToNext]);

  // Progress bar
  useEffect(() => {
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
  }, [currentIndex]);

  const show = SHOWS[currentIndex];

  return (
    <div className="absolute inset-0 z-10 flex">
      {/* Show image — left/background area */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${
            isTransitioning ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
          }`}
          style={{ backgroundImage: `url(${show.image})` }}
        />
        {/* Heavy overlay to keep text readable */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(
            to right,
            hsla(var(--background), 0.4) 0%,
            hsla(var(--background), 0.65) 35%,
            hsla(var(--background), 0.92) 60%,
            hsla(var(--background), 0.97) 100%
          )`
        }} />
        <div className="absolute inset-0" style={{
          background: `linear-gradient(
            to top,
            hsla(var(--background), 0.9) 0%,
            transparent 40%,
            transparent 70%,
            hsla(var(--background), 0.7) 100%
          )`
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full h-full">
        {/* Right side — show info */}
        <div className="flex flex-col justify-center ml-auto mr-[120px] max-w-[700px]">
          <div
            key={currentIndex}
            className={`space-y-6 transition-all duration-600 ${
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
            <div className="animate-float-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xl font-medium text-primary/90">{show.host}</span>
              </div>
            </div>

            {/* Description */}
            <div className="animate-float-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[550px]">
                {show.description}
              </p>
            </div>

            {/* Time & days */}
            <div className="animate-float-up flex items-center gap-4" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/30">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground/80">{show.time}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/30">
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
